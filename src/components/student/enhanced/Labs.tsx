import React, { useState, useEffect } from 'react';
import { ResponsiveButton } from '../ResponsiveButton';
import { ExperimentEngine } from '../ExperimentEngine';
import { Modal } from '../../ui/Modal';
import { useAuth } from '../../../hooks/useAuth';
import { useCurrentClass } from '../../../hooks/useCurrentClass';
import { ContentService } from '../../../services/ContentService';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { useToast } from '../../ToastContainer';
import { FlaskConical, Play, Eye, Atom, Zap, Microscope, Beaker, CheckCircle } from 'lucide-react';

export const EnhancedLabs: React.FC = () => {
  const { user } = useAuth();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [experiments, setExperiments] = useState<any[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);
  const [showExperimentModal, setShowExperimentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const studentId = user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  useEffect(() => {
    const loadLabContent = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load science content which includes lab experiments
        const scienceContent = await ContentService.getContentForCurrentUser(user.id, 'science');
        
        // Transform quests into lab experiments with enhanced data
        const labExperiments = scienceContent.quests.map((quest: any, index: number) => ({
          id: quest.id,
          title: quest.title,
          subject: 'Science',
          difficulty: quest.difficulty || 'Medium',
          duration: quest.estimatedTime || '30 min',
          description: quest.description,
          icon: getExperimentIcon(index),
          color: getExperimentColor(index),
          equipment: ['Virtual Lab Setup', 'Digital Sensors', 'Data Logger', 'Safety Equipment'],
          objectives: [
            'Understand scientific concepts through hands-on experience',
            'Practice experimental methods and procedures',
            'Analyze data and draw meaningful conclusions',
            'Apply safety protocols in laboratory settings'
          ],
          steps: [
            {
              id: `${quest.id}_step_1`,
              title: 'Setup Equipment',
              instruction: 'Prepare your virtual laboratory equipment and safety gear.',
              expectedResult: 'All equipment is properly calibrated and ready for use.',
              safetyNote: 'Always wear safety goggles and follow proper procedures.'
            },
            {
              id: `${quest.id}_step_2`,
              title: 'Conduct Experiment',
              instruction: 'Follow the experimental procedure step by step.',
              expectedResult: 'Observe and record the expected changes or reactions.',
              safetyNote: 'Monitor the experiment closely and record all observations.'
            },
            {
              id: `${quest.id}_step_3`,
              title: 'Analyze Results',
              instruction: 'Analyze your data and draw conclusions.',
              expectedResult: 'Clear understanding of the scientific principles demonstrated.',
              safetyNote: 'Properly dispose of any virtual materials according to protocols.'
            }
          ]
        }));
        
        setExperiments(labExperiments);
      } catch (error) {
        console.error('Error loading lab content:', error);
        setExperiments([]);
      } finally {
        setLoading(false);
      }
    };

    loadLabContent();
    
    // Listen for class changes
    const handleClassChange = () => {
      ContentService.clearCache();
      loadLabContent();
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, [user?.id]);

  const getExperimentIcon = (index: number) => {
    const icons = [Beaker, Microscope, Atom, FlaskConical, Zap];
    return icons[index % icons.length];
  };

  const getExperimentColor = (index: number) => {
    const colors = [
      'from-green-500 to-teal-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-yellow-500 to-orange-600'
    ];
    return colors[index % colors.length];
  };

  const handleBeginExperiment = (experiment: any) => {
    // Validate experiment before starting
    if (!experiment || !experiment.id) {
      showToast({
        type: 'error',
        title: 'Invalid Experiment',
        message: 'The selected experiment is not available.',
        duration: 3000
      });
      return;
    }
    
    console.log('Beginning experiment:', experiment.id);
    setSelectedExperiment(experiment);
    setShowExperimentModal(true);
  };

  const handleViewDetails = (experiment: any) => {
    // Validate experiment details
    if (!experiment || !experiment.id) {
      showToast({
        type: 'error',
        title: 'Invalid Experiment',
        message: 'Experiment details are not available.',
        duration: 3000
      });
      return;
    }
    
    console.log('Viewing experiment details:', experiment.id);
    setSelectedExperiment(experiment);
    setShowDetailsModal(true);
  };

  const handleExperimentComplete = (experimentId: string, results: any) => {
    setShowExperimentModal(false);
    setSelectedExperiment(null);
    
    showToast({
      type: 'success',
      title: 'Experiment Completed!',
      message: 'Great work! You earned 100 XP for completing the experiment.',
      duration: 3000
    });
  };

  const handleExperimentExit = () => {
    setShowExperimentModal(false);
    setSelectedExperiment(null);
  };

  const isExperimentCompleted = (experimentId: string) => {
    return studentProgress?.arLabsCompleted.includes(experimentId) || false;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading lab experiments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 student-text-gradient">
          🧪 Virtual Labs
        </h1>
        <p className="text-lg md:text-xl text-student-text-secondary">
          Hands-on experiments in a safe, virtual environment for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="student-card text-center p-4 md:p-6 animate-student-slide-up">
          <FlaskConical className="w-6 h-6 md:w-8 md:h-8 mx-auto text-student-primary mb-2" />
          <div className="text-xl md:text-2xl font-bold text-student-text">{experiments.length}</div>
          <div className="text-sm md:text-base text-student-text-secondary">Available Labs</div>
        </div>
        
        <div className="student-card text-center p-4 md:p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto text-student-accent mb-2" />
          <div className="text-xl md:text-2xl font-bold text-student-text">
            {studentProgress?.arLabsCompleted.length || 0}
          </div>
          <div className="text-sm md:text-base text-student-text-secondary">Completed</div>
        </div>
        
        <div className="student-card text-center p-4 md:p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Atom className="w-6 h-6 md:w-8 md:h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-xl md:text-2xl font-bold text-student-text">AR/VR</div>
          <div className="text-sm md:text-base text-student-text-secondary">Technology</div>
        </div>
        
        <div className="student-card text-center p-4 md:p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Eye className="w-6 h-6 md:w-8 md:h-8 mx-auto text-student-primary mb-2" />
          <div className="text-xl md:text-2xl font-bold text-student-text">Safe</div>
          <div className="text-sm md:text-base text-student-text-secondary">Environment</div>
        </div>
      </div>

      {/* Experiment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {experiments.map((experiment, index) => {
          const IconComponent = experiment.icon;
          const completed = isExperimentCompleted(experiment.id);
          
          return (
            <div 
              key={experiment.id} 
              className={`student-card p-4 md:p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift ${
                completed ? 'border-2 border-student-accent bg-gradient-to-br from-student-accent/5 to-student-secondary/5' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(experiment.difficulty)}`}>
                  {experiment.difficulty}
                </span>
                {completed && (
                  <div className="flex items-center space-x-1 text-student-accent">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-bold">Completed</span>
                  </div>
                )}
              </div>

              <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${experiment.color} flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 hover:scale-110`}>
                <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-student-text mb-3 text-center">
                {experiment.title}
              </h3>
              <p className="text-sm md:text-base text-student-text-secondary text-center mb-4">
                {experiment.description}
              </p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-student-text-secondary">Subject:</span>
                  <span className="text-student-text font-medium">{experiment.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-student-text-secondary">Duration:</span>
                  <span className="text-student-text">{experiment.duration}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <ResponsiveButton
                  onClick={() => handleBeginExperiment(experiment)}
                  variant={completed ? 'accent' : 'primary'}
                  size="md"
                  fullWidth
                  icon={completed ? CheckCircle : Play}
                >
                  {completed ? 'View Again' : 'Begin Experiment'}
                </ResponsiveButton>
                
                <ResponsiveButton
                  onClick={() => handleViewDetails(experiment)}
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={Eye}
                >
                  View Details
                </ResponsiveButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* Experiment Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        title={selectedExperiment?.title}
        size="lg"
      >
        {selectedExperiment && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedExperiment.color} flex items-center justify-center shadow-student-card`}>
                <selectedExperiment.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <p className="text-lg text-student-text-secondary">{selectedExperiment.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-student-text mb-2">Subject</h4>
                <p className="text-student-text-secondary">{selectedExperiment.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold text-student-text mb-2">Duration</h4>
                <p className="text-student-text-secondary">{selectedExperiment.duration}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">🔬 Virtual Equipment</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedExperiment.equipment.map((item: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-student-background-secondary rounded-lg shadow-student-card">
                    <FlaskConical className="w-4 h-4 text-student-primary mr-2" />
                    <span className="text-student-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">🎯 Learning Objectives</h4>
              <div className="space-y-2">
                {selectedExperiment.objectives.map((objective: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-student-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-student-text-secondary">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <ResponsiveButton
                onClick={() => {
                  setShowDetailsModal(false);
                  handleBeginExperiment(selectedExperiment);
                }}
                size="lg"
                icon={Play}
              >
                Start Experiment
              </ResponsiveButton>
              <ResponsiveButton
                onClick={() => setShowDetailsModal(false)}
                variant="outline"
                size="lg"
              >
                Close
              </ResponsiveButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Experiment Engine Modal */}
      <Modal 
        isOpen={showExperimentModal} 
        onClose={() => setShowExperimentModal(false)} 
        title={`Virtual Lab: ${selectedExperiment?.title}`}
        size="xl"
      >
        {selectedExperiment && (
          <ExperimentEngine
            experiment={selectedExperiment}
            onComplete={handleExperimentComplete}
            onExit={handleExperimentExit}
          />
        )}
      </Modal>
    </div>
  );
};