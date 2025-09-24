import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { AdaptiveLearningService } from '../../services/AdaptiveLearningService';
import { Play, Lightbulb, CheckCircle, ArrowRight, Star, Trophy } from 'lucide-react';

export const QuestInterface: React.FC = () => {
  const { user } = useAuth();
  const { currentClass, classInfo } = useCurrentClass();
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  const studentId = user?.id || 'student-001';

  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  // Listen for class changes and force update
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  useEffect(() => {
    // Load available quests when class changes
    const loadQuests = async () => {
      setLoading(true);
      try {
        const quests = await ContentService.getAllQuests(currentClass);
        setAvailableQuests(quests);
      } catch (error) {
        console.error('Error loading quests:', error);
        setAvailableQuests([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
    
    // Listen for class changes
    const handleClassChange = () => {
      ContentService.clearCache();
      loadQuests();
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, [currentClass, forceUpdate]);

  useEffect(() => {
    // Initialize student progress if not exists
    if (!studentProgress) {
      LocalStorageService.initializeStudentProgress(studentId, currentClass);
    }
  }, [studentId, studentProgress, currentClass]);

  const handleClassChange = (newClass: string) => {
    ContentService.clearCache(); // Clear cache when class changes
  };
  const startQuest = (quest: any) => {
    setSelectedQuest(quest);
    setCurrentStep(quest.steps[0]);
    setShowQuestModal(true);
    setStartTime(Date.now());
    setHintsUsed(0);
    setShowFeedback(false);
    setUserAnswer('');
  };

  const submitAnswer = () => {
    if (!currentStep || !selectedQuest) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correct = userAnswer === currentStep.problem?.correct_answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    // Log performance
    AdaptiveLearningService.logStepCompletion(
      studentId,
      selectedQuest.id,
      currentStep.id,
      correct,
      timeSpent,
      hintsUsed
    );

    // Award XP for correct answers
    if (correct) {
      const progress = LocalStorageService.getStudentProgress(studentId);
      if (progress) {
        progress.totalXP += 25; // Base XP per correct answer
        LocalStorageService.saveStudentProgress(progress);
      }
    }
  };

  const proceedToNextStep = async () => {
    if (!selectedQuest || !currentStep) return;

    // Get adaptive recommendation for next step
    const recommendation = await AdaptiveLearningService.getNextStep(
      studentId,
      selectedQuest.id,
      currentStep.id,
      currentClass
    );

    const nextStep = selectedQuest.steps.find((step: any) => step.id === recommendation.nextStepId);
    
    if (nextStep) {
      setCurrentStep(nextStep);
      setShowFeedback(false);
      setUserAnswer('');
      setStartTime(Date.now());
      setHintsUsed(0);
    } else {
      // Quest completed
      completeQuest();
    }
  };

  const completeQuest = () => {
    if (!selectedQuest) return;

    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress && !progress.completedQuests.includes(selectedQuest.id)) {
      progress.completedQuests.push(selectedQuest.id);
      progress.totalXP += selectedQuest.xpReward;
      
      // Level up logic
      const newLevel = Math.floor(progress.totalXP / 1000) + 1;
      if (newLevel > progress.level) {
        progress.level = newLevel;
        // Award level up achievement
        LocalStorageService.awardAchievement(studentId, {
          id: `level_${newLevel}`,
          title: `Level ${newLevel} Hero`,
          description: `Reached level ${newLevel}!`,
          icon: 'star'
        });
      }
      
      LocalStorageService.saveStudentProgress(progress);
    }

    setShowQuestModal(false);
    setSelectedQuest(null);
    setCurrentStep(null);
  };

  const useHint = () => {
    setHintsUsed(prev => prev + 1);
    // Show hint logic here
  };

  const getQuestStatus = (questId: string) => {
    if (!studentProgress) return 'available';
    
    if (studentProgress.completedQuests.includes(questId)) {
      return 'completed';
    }
    
    if (studentProgress.questProgress[questId]) {
      return 'in-progress';
    }
    
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🎯 Learning Quests</h1>
        <p className="text-xl text-student-text-secondary">Embark on adaptive learning adventures!</p>
        
        {/* Current Class Display */}
        <div 
          className="mt-4 inline-flex items-center px-6 py-3 rounded-full font-semibold shadow-student-card"
          style={{
            background: 'var(--student-primary, #4F46E5)',
            color: 'var(--student-header-text, #FFFFFF)'
          }}
        >
          <span className="text-lg">
            Current Class: {classInfo?.displayName || 'Class 6'}
          </span>
        </div>
      </div>

      {/* Student Progress Summary */}
      {studentProgress && (
        <div className="student-card p-6 animate-student-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-student-primary">{studentProgress.level}</div>
              <div className="text-student-text-secondary">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-accent">{studentProgress.totalXP}</div>
              <div className="text-student-text-secondary">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-secondary">{studentProgress.completedQuests.length}</div>
              <div className="text-student-text-secondary">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-primary">{studentProgress.streakCount}</div>
              <div className="text-student-text-secondary">Day Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Available Quests */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading quests...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableQuests.map((quest, index) => {
          const status = getQuestStatus(quest.id);
          const progress = studentProgress?.questProgress[quest.id];
          
          return (
            <div 
              key={quest.id} 
              className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(status)}`}>
                  {status === 'in-progress' ? 'In Progress' : 
                   status === 'completed' ? 'Completed' : 'Available'}
                </span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < (quest.difficulty === 'easy' ? 2 : quest.difficulty === 'medium' ? 3 : 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-student-text mb-3">{quest.title}</h3>
              <p className="text-student-text-secondary mb-4">{quest.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-student-text-secondary">XP Reward:</span>
                  <span className="font-bold text-student-accent">+{quest.xpReward} XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-student-text-secondary">Est. Time:</span>
                  <span className="text-student-text">{quest.estimatedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-student-text-secondary">Type:</span>
                  <span className="text-student-text capitalize">{quest.type.replace('_', ' ')}</span>
                </div>
              </div>

              {progress && status === 'in-progress' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-student-text-secondary">Progress</span>
                    <span className="text-student-text">
                      {progress.completedSteps.length}/{quest.steps.length} steps
                    </span>
                  </div>
                  <div className="student-progress-bar-enhanced h-3">
                    <div 
                      className="student-progress-fill-enhanced h-3"
                      style={{ width: `${(progress.completedSteps.length / quest.steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button 
                className={`w-full ${status === 'completed' ? 'btn-student-accent' : 'btn-student-primary'} student-click-bounce`}
                icon={status === 'completed' ? CheckCircle : Play}
                onClick={() => startQuest(quest)}
                disabled={status === 'completed'}
              >
                {status === 'completed' ? 'Completed!' : 
                 status === 'in-progress' ? 'Continue Quest' : 'Start Quest'}
              </Button>
            </div>
          );
        })}
      </div>
      )}

      {/* Quest Modal */}
      <Modal 
        isOpen={showQuestModal} 
        onClose={() => setShowQuestModal(false)} 
        title={selectedQuest?.title}
        size="xl"
      >
        {selectedQuest && currentStep && (
          <div className="space-y-6">
            {/* Story/Narrative Section */}
            <div className="student-card p-6 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
              <h3 className="text-2xl font-bold text-student-text mb-3">{currentStep.title}</h3>
              <p className="text-lg text-student-text-secondary mb-4">{currentStep.narrative}</p>
              
              {selectedQuest.story && (
                <div className="flex items-center space-x-3 text-sm text-student-text-muted">
                  <span>📍 {selectedQuest.story.setting}</span>
                  <span>👤 {selectedQuest.story.character}</span>
                </div>
              )}
            </div>

            {/* Problem Section */}
            {currentStep.problem && (
              <div className="student-card p-6">
                <h4 className="text-xl font-bold text-student-text mb-4">{currentStep.problem.question}</h4>
                
                {currentStep.problem.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {currentStep.problem.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          userAnswer === option 
                            ? 'border-student-primary bg-student-primary/10 text-student-primary' 
                            : 'border-border hover:border-student-primary/50 hover:bg-student-background'
                        }`}
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
                    className="input-student w-full h-32 focus:ring-student-secondary focus:border-student-secondary"
                    placeholder="Type your answer here..."
                  />
                )}

                <div className="flex justify-between items-center mt-6">
                  <Button 
                    variant="outline" 
                    onClick={useHint}
                    className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                    icon={Lightbulb}
                  >
                    Hint ({hintsUsed}/3)
                  </Button>
                  
                  <Button 
                    onClick={submitAnswer}
                    disabled={!userAnswer || showFeedback}
                    className="btn-student-primary student-click-bounce"
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {showFeedback && currentStep.problem && (
              <div className={`student-card p-6 border-2 ${
                isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
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
                  <p className={`mb-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {currentStep.problem.explanation}
                  </p>
                )}

                <Button 
                  onClick={proceedToNextStep}
                  className="btn-student-primary student-click-bounce"
                  icon={ArrowRight}
                >
                  {isCorrect ? 'Continue Adventure' : 'Try Next Step'}
                </Button>
              </div>
            )}

            {/* Quest Progress */}
            <div className="flex justify-between items-center text-sm text-student-text-secondary">
              <span>Step {selectedQuest.steps.findIndex((s: any) => s.id === currentStep.id) + 1} of {selectedQuest.steps.length}</span>
              <span>Hints used: {hintsUsed}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};