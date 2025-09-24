import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LocalStorageService } from '../../services/LocalStorageService';
import { Camera, Play, CheckCircle, RotateCcw } from 'lucide-react';

interface ExperimentStep {
  id: string;
  title: string;
  instruction: string;
  expectedResult: string;
  safetyNote?: string;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  duration: string;
  steps: ExperimentStep[];
  equipment: string[];
  objectives: string[];
}

interface ExperimentEngineProps {
  experiment: Experiment;
  onComplete: (experimentId: string, results: any) => void;
  onExit: () => void;
}

export const ExperimentEngine: React.FC<ExperimentEngineProps> = ({
  experiment,
  onComplete,
  onExit
}) => {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [experimentResults, setExperimentResults] = useState<any>({});
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [startTime] = useState(Date.now());

  const studentId = user?.id || 'student-001';
  const currentStep = experiment.steps[currentStepIndex];

  useEffect(() => {
    // Load existing experiment progress
    const progress = LocalStorageService.getStudentProgress(studentId);
    const arLabs = progress?.arLabsCompleted || [];
    
    if (arLabs.includes(experiment.id)) {
      // Experiment already completed
      setCompletedSteps(experiment.steps.map(step => step.id));
    }
  }, [experiment.id, studentId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      setCameraActive(true);
      // In a real implementation, this would set up the video stream
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraActive(false);
    }
  };

  const completeCurrentStep = () => {
    if (!currentStep) return;

    const newCompletedSteps = [...completedSteps, currentStep.id];
    setCompletedSteps(newCompletedSteps);

    // Record step completion
    setExperimentResults(prev => ({
      ...prev,
      [currentStep.id]: {
        completedAt: new Date().toISOString(),
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        result: currentStep.expectedResult
      }
    }));

    // Move to next step or complete experiment
    if (currentStepIndex < experiment.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeExperiment();
    }
  };

  const completeExperiment = () => {
    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress && !progress.arLabsCompleted.includes(experiment.id)) {
      progress.arLabsCompleted.push(experiment.id);
      progress.totalXP += 100; // XP for completing experiment
      LocalStorageService.saveStudentProgress(progress);

      // Award experiment achievement
      if (progress.arLabsCompleted.length === 1) {
        LocalStorageService.awardAchievement(studentId, {
          id: 'first_experiment',
          title: 'Lab Pioneer',
          description: 'Completed your first virtual experiment!',
          icon: 'beaker'
        });
      }
    }

    onComplete(experiment.id, experimentResults);
  };

  const resetExperiment = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setExperimentResults({});
    setIsRecording(false);
    setCameraActive(false);
  };

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId);
  };

  const canCompleteStep = () => {
    return currentStep && !isStepCompleted(currentStep.id);
  };

  return (
    <div className="space-y-6">
      {/* Experiment Header */}
      <div className="student-card p-6 bg-gradient-to-r from-student-accent/10 to-student-secondary/10 border border-student-accent/20">
        <h2 className="text-2xl font-bold text-student-text mb-2">{experiment.title}</h2>
        <p className="text-student-text-secondary mb-4">{experiment.description}</p>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-student-text-secondary">Subject:</span>
            <p className="font-medium text-student-text">{experiment.subject}</p>
          </div>
          <div>
            <span className="text-student-text-secondary">Duration:</span>
            <p className="font-medium text-student-text">{experiment.duration}</p>
          </div>
          <div>
            <span className="text-student-text-secondary">Difficulty:</span>
            <p className="font-medium text-student-text">{experiment.difficulty}</p>
          </div>
        </div>
      </div>

      {/* AR Camera View */}
      <div className="student-card p-6">
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-lg overflow-hidden mb-4">
          {cameraActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AR Camera Active</h3>
                <p className="text-blue-200">Point camera at experiment setup</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-student-accent to-student-secondary flex items-center justify-center animate-pulse">
                  <Play className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold mb-2">Virtual Experiment Ready</h3>
                <p className="text-blue-200">Click to start AR simulation</p>
              </div>
            </div>
          )}
          
          {/* AR Overlay Elements */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            🎯 Step {currentStepIndex + 1} of {experiment.steps.length}
          </div>
          
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            {isRecording ? '🔴 Recording' : '📱 AR Mode'}
          </div>
        </div>

        {/* Camera Controls */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={startCamera}
            disabled={cameraActive}
            className="flex items-center justify-center py-2 px-4 rounded-lg border border-student-primary text-student-primary hover:bg-student-primary hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            <Camera className="w-4 h-4 mr-2" />
            {cameraActive ? 'Camera On' : 'Start Camera'}
          </button>
          
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={!cameraActive}
            className={`flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'btn-student-secondary'
            } disabled:opacity-50`}
          >
            {isRecording ? '⏹️ Stop' : '🔴 Record'}
          </button>
          
          <button
            onClick={resetExperiment}
            className="flex items-center justify-center py-2 px-4 rounded-lg border border-student-accent text-student-accent hover:bg-student-accent hover:text-white transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Current Step */}
      {currentStep && (
        <div className="student-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-student-text">{currentStep.title}</h3>
            {isStepCompleted(currentStep.id) && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
          
          <p className="text-student-text-secondary mb-4">{currentStep.instruction}</p>
          
          {currentStep.safetyNote && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Safety Note:</strong> {currentStep.safetyNote}
              </p>
            </div>
          )}

          <div className="bg-student-primary/10 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-student-primary mb-2">Expected Result:</h4>
            <p className="text-student-primary">{currentStep.expectedResult}</p>
          </div>

          {canCompleteStep() && (
            <button
              onClick={completeCurrentStep}
              className="w-full py-3 px-6 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200"
            >
              ✓ Complete Step
            </button>
          )}
        </div>
      )}

      {/* Equipment List */}
      <div className="student-card p-6">
        <h4 className="font-semibold text-student-text mb-3">🔬 Virtual Equipment</h4>
        <div className="grid grid-cols-1 gap-2">
          {experiment.equipment.map((item, index) => (
            <div key={index} className="flex items-center p-3 bg-student-background-secondary rounded-lg">
              <div className="w-2 h-2 bg-student-accent rounded-full mr-3"></div>
              <span className="text-student-text">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="student-card p-6">
        <h4 className="font-semibold text-student-text mb-3">🎯 Learning Objectives</h4>
        <div className="space-y-2">
          {experiment.objectives.map((objective, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-student-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-student-text-secondary">{objective}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="student-card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-student-text-secondary">Experiment Progress</span>
          <span className="text-student-text">
            {completedSteps.length}/{experiment.steps.length} steps completed
          </span>
        </div>
        <div className="student-progress-bar-enhanced h-3">
          <div 
            className="student-progress-fill-enhanced h-3 transition-all duration-500"
            style={{ width: `${(completedSteps.length / experiment.steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center">
        <button
          onClick={onExit}
          className="text-student-text-secondary hover:text-student-text transition-colors duration-200"
        >
          Exit Experiment
        </button>
      </div>
    </div>
  );
};