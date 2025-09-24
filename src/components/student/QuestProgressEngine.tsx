import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { AdaptiveLearningService } from '../../services/AdaptiveLearningService';

export interface QuestStep {
  id: string;
  type: string;
  title: string;
  narrative: string;
  problem?: {
    question: string;
    type: 'multiple_choice' | 'text_input' | 'essay' | 'numerical';
    options?: string[];
    correct_answer: string;
    explanation: string;
  };
  adaptivity?: {
    on_correct: string;
    on_incorrect: string;
    on_mastery?: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  xpReward: number;
  steps: QuestStep[];
  story?: {
    introduction: string;
    setting: string;
    character: string;
  };
}

interface QuestProgressEngineProps {
  questId: string;
  onComplete: (questId: string, xpEarned: number) => void;
  onExit: () => void;
}

export const QuestProgressEngine: React.FC<QuestProgressEngineProps> = ({
  questId,
  onComplete,
  onExit
}) => {
  const { user } = useAuth();
  const { currentClass } = useCurrentClass();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  const studentId = user?.id || 'student-001';

  useEffect(() => {
    const loadQuest = async () => {
      try {
        const questData = await ContentService.getQuestById(questId, currentClass);
        if (questData) {
          setQuest(questData);
          
          // Load existing progress
          const progress = LocalStorageService.getStudentProgress(studentId);
          const questProgress = progress?.questProgress[questId];
          
          if (questProgress) {
            const stepIndex = questData.steps.findIndex(
              (step: QuestStep) => step.id === questProgress.currentStep
            );
            setCurrentStepIndex(Math.max(0, stepIndex));
            setHintsUsed(questProgress.attempts || 0);
          }
        }
      } catch (error) {
        console.error('Error loading quest:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, [questId, currentClass, studentId]);

  const currentStep = quest?.steps[currentStepIndex];

  const submitAnswer = async () => {
    if (!currentStep || !quest || !userAnswer.trim()) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correct = userAnswer.trim() === currentStep.problem?.correct_answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    // Log performance for adaptive learning
    AdaptiveLearningService.logStepCompletion(
      studentId,
      quest.id,
      currentStep.id,
      correct,
      timeSpent,
      hintsUsed
    );

    // Award XP for correct answers
    if (correct) {
      const progress = LocalStorageService.getStudentProgress(studentId);
      if (progress) {
        progress.totalXP += 25;
        LocalStorageService.saveStudentProgress(progress);
      }
    }
  };

  const proceedToNextStep = async () => {
    if (!quest || !currentStep) return;

    // Get adaptive recommendation for next step
    const recommendation = await AdaptiveLearningService.getNextStep(
      studentId,
      quest.id,
      currentStep.id,
      currentClass
    );

    const nextStepIndex = quest.steps.findIndex(
      (step: QuestStep) => step.id === recommendation.nextStepId
    );

    if (nextStepIndex > currentStepIndex) {
      setCurrentStepIndex(nextStepIndex);
      resetStepState();
    } else if (currentStepIndex < quest.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      resetStepState();
    } else {
      // Quest completed
      completeQuest();
    }
  };

  const resetStepState = () => {
    setShowFeedback(false);
    setUserAnswer('');
    setStartTime(Date.now());
    setHintsUsed(0);
  };

  const completeQuest = () => {
    if (!quest) return;

    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress && !progress.completedQuests.includes(quest.id)) {
      progress.completedQuests.push(quest.id);
      progress.totalXP += quest.xpReward;
      
      // Level up logic
      const newLevel = Math.floor(progress.totalXP / 1000) + 1;
      if (newLevel > progress.level) {
        progress.level = newLevel;
        LocalStorageService.awardAchievement(studentId, {
          id: `level_${newLevel}`,
          title: `Level ${newLevel} Hero`,
          description: `Reached level ${newLevel}!`,
          icon: 'star'
        });
      }
      
      LocalStorageService.saveStudentProgress(progress);
    }

    onComplete(quest.id, quest.xpReward);
  };

  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      // In a real implementation, this would show contextual hints
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary"></div>
      </div>
    );
  }

  if (!quest || !currentStep) {
    return (
      <div className="text-center p-8">
        <p className="text-student-text-secondary">Quest not found or completed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quest Header */}
      <div className="student-card p-6 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
        <h2 className="text-2xl font-bold text-student-text mb-2">{quest.title}</h2>
        <p className="text-student-text-secondary mb-4">{quest.description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-student-text-secondary">
            Step {currentStepIndex + 1} of {quest.steps.length}
          </span>
          <span className="text-student-accent font-bold">
            +{quest.xpReward} XP Reward
          </span>
        </div>
      </div>

      {/* Current Step */}
      <div className="student-card p-6">
        <h3 className="text-xl font-bold text-student-text mb-3">{currentStep.title}</h3>
        <p className="text-student-text-secondary mb-6">{currentStep.narrative}</p>

        {/* Problem Section */}
        {currentStep.problem && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-student-text">
              {currentStep.problem.question}
            </h4>

            {currentStep.problem.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentStep.problem.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setUserAnswer(option)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      userAnswer === option 
                        ? 'border-student-primary bg-student-primary/10 text-student-primary' 
                        : 'border-border hover:border-student-primary/50 hover:bg-student-background'
                    } ${showFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            )}

            {currentStep.problem.type === 'text_input' && (
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
                className="input-student w-full h-32 focus:ring-student-secondary focus:border-student-secondary"
                placeholder="Type your answer here..."
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={useHint}
                disabled={hintsUsed >= 3 || showFeedback}
                className="btn-student-secondary px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💡 Hint ({hintsUsed}/3)
              </button>
              
              {!showFeedback ? (
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim()}
                  className="btn-student-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed student-click-bounce"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={proceedToNextStep}
                  className="btn-student-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 student-click-bounce"
                >
                  {currentStepIndex < quest.steps.length - 1 ? 'Next Step' : 'Complete Quest'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && currentStep.problem && (
          <div className={`mt-6 p-6 rounded-lg border-2 ${
            isCorrect 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              {isCorrect ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white font-bold">✗</span>
                </div>
              )}
              <h4 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Excellent work!' : 'Not quite right'}
              </h4>
            </div>
            
            {currentStep.problem.explanation && (
              <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {currentStep.problem.explanation}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="student-card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-student-text-secondary">Quest Progress</span>
          <span className="text-student-text">
            {Math.round(((currentStepIndex + (showFeedback ? 1 : 0)) / quest.steps.length) * 100)}%
          </span>
        </div>
        <div className="student-progress-bar-enhanced h-3">
          <div 
            className="student-progress-fill-enhanced h-3 transition-all duration-500"
            style={{ 
              width: `${((currentStepIndex + (showFeedback ? 1 : 0)) / quest.steps.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center">
        <button
          onClick={onExit}
          className="text-student-text-secondary hover:text-student-text transition-colors duration-200"
        >
          Exit Quest
        </button>
      </div>
    </div>
  );
};