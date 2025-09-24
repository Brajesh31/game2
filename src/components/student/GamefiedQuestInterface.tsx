import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { AdaptiveLearningService } from '../../services/AdaptiveLearningService';
import { useToast } from '../ToastContainer';
import { 
  Play, 
  Star, 
  Trophy, 
  Crown, 
  Sword, 
  Shield, 
  Zap, 
  Target,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Clock,
  Award
} from 'lucide-react';

interface QuestStep {
  id: string;
  type: string;
  title: string;
  narrative: string;
  problem?: {
    question: string;
    type: 'multiple_choice' | 'text_input' | 'essay';
    options?: string[];
    correct_answer: string;
    explanation: string;
  };
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  xpReward: number;
  story?: {
    introduction: string;
    setting: string;
    character: string;
  };
  steps: QuestStep[];
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
}

export const GamefiedQuestInterface: React.FC = () => {
  const { user } = useAuth();
  const { currentClass, classInfo } = useCurrentClass();
  const { showToast } = useToast();
  
  // State management
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [questStarted, setQuestStarted] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('social_studies');

  const studentId = user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  // Load quests when component mounts or class changes
  useEffect(() => {
    const loadQuests = async () => {
      setLoading(true);
      try {
        const content = await ContentService.getContent(currentClass, selectedSubject);
        setAvailableQuests(content.quests || []);
      } catch (error) {
        console.error('Error loading quests:', error);
        setAvailableQuests([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, [currentClass, selectedSubject]);

  // Get quest status
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

  // Start quest
  const startQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setCurrentStepIndex(0);
    setQuestStarted(true);
    setQuestCompleted(false);
    setStartTime(Date.now());
    setHintsUsed(0);
    setShowFeedback(false);
    setUserAnswer('');
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!selectedQuest || !selectedQuest.steps[currentStepIndex] || !userAnswer.trim()) return;

    const currentStep = selectedQuest.steps[currentStepIndex];
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correct = userAnswer.trim() === currentStep.problem?.correct_answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    // Log performance for adaptive learning
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
        progress.totalXP += 25;
        LocalStorageService.saveStudentProgress(progress);
      }
    }
  };

  // Proceed to next step
  const proceedToNextStep = () => {
    if (!selectedQuest) return;

    if (currentStepIndex < selectedQuest.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setShowFeedback(false);
      setUserAnswer('');
      setStartTime(Date.now());
      setHintsUsed(0);
    } else {
      completeQuest();
    }
  };

  // Complete quest
  const completeQuest = () => {
    if (!selectedQuest) return;

    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress && !progress.completedQuests.includes(selectedQuest.id)) {
      progress.completedQuests.push(selectedQuest.id);
      progress.totalXP += selectedQuest.xpReward;
      
      // Award badges
      selectedQuest.rewards.badges.forEach(badge => {
        LocalStorageService.awardAchievement(studentId, {
          id: `${selectedQuest.id}_${badge.toLowerCase().replace(/\s+/g, '_')}`,
          title: badge,
          description: `Earned by completing ${selectedQuest.title}`,
          icon: 'trophy'
        });
      });
      
      LocalStorageService.saveStudentProgress(progress);
    }

    setQuestCompleted(true);
    
    showToast({
      type: 'success',
      title: 'Quest Completed!',
      message: `You earned ${selectedQuest.xpReward} XP and unlocked new adventures!`,
      duration: 4000
    });
  };

  // Use hint
  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      showToast({
        type: 'info',
        title: 'Hint Used',
        message: 'Think about the key concepts you\'ve learned!',
        duration: 2000
      });
    }
  };

  // Exit quest
  const exitQuest = () => {
    setSelectedQuest(null);
    setQuestStarted(false);
    setQuestCompleted(false);
    setCurrentStepIndex(0);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get quest type icon
  const getQuestTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strategy_quest': return Crown;
      case 'exploration_quest': return Target;
      case 'creative_quest': return Star;
      case 'social_exploration_quest': return Shield;
      case 'boss_battle': return Sword;
      default: return Play;
    }
  };

  // Render quest selection screen
  if (!questStarted || !selectedQuest) {
    return (
      <div className="space-y-8 bg-student-background min-h-screen text-student-text">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 student-text-gradient">
            ⚔️ Epic Learning Quests
          </h1>
          <p className="text-xl text-student-text-secondary">
            Embark on legendary adventures in {classInfo?.displayName || 'Class 7'} - {selectedSubject.replace('_', ' ').toUpperCase()}
          </p>
        </div>

        {/* Subject Selector */}
        <div className="flex justify-center">
          <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
            {['social_studies', 'math', 'science', 'english', 'hindi'].map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedSubject === subject
                    ? 'student-tab-active shadow-student-card'
                    : 'text-student-text-secondary hover:text-student-text hover:bg-student-background'
                }`}
              >
                {subject.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Student Progress Summary */}
        {studentProgress && (
          <div className="student-card p-6 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-student-primary">{studentProgress.level}</div>
                <div className="text-student-text-secondary">Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-student-accent">{studentProgress.totalXP}</div>
                <div className="text-student-text-secondary">Total XP</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-student-secondary">{studentProgress.completedQuests.length}</div>
                <div className="text-student-text-secondary">Quests Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-student-primary">{studentProgress.achievements.length}</div>
                <div className="text-student-text-secondary">Badges Earned</div>
              </div>
            </div>
          </div>
        )}

        {/* Available Quests */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
            <p className="text-student-text-secondary">Loading epic quests...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuests.map((quest, index) => {
              const status = getQuestStatus(quest.id);
              const IconComponent = getQuestTypeIcon(quest.type);
              
              return (
                <div 
                  key={quest.id} 
                  className={`student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift ${
                    status === 'completed' ? 'border-2 border-student-accent bg-gradient-to-br from-student-accent/5 to-student-secondary/5' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Quest Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-student-primary to-student-secondary flex items-center justify-center shadow-student-card ${
                      status === 'completed' ? 'student-achievement-glow' : ''
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        status === 'completed' ? 'bg-green-100 text-green-800' :
                        status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status === 'completed' ? 'COMPLETED' : 
                         status === 'in-progress' ? 'IN PROGRESS' : 'AVAILABLE'}
                      </span>
                    </div>
                  </div>

                  {/* Quest Info */}
                  <h3 className="text-xl font-bold text-student-text mb-3">{quest.title}</h3>
                  <p className="text-student-text-secondary mb-4">{quest.description}</p>

                  {/* Quest Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-student-text-secondary">Type:</span>
                      <span className="text-student-text capitalize">{quest.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-student-text-secondary">Duration:</span>
                      <span className="text-student-text">{quest.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-student-text-secondary">Reward:</span>
                      <span className="font-bold text-student-accent">+{quest.xpReward} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-student-text-secondary">Steps:</span>
                      <span className="text-student-text">{quest.steps.length} challenges</span>
                    </div>
                  </div>

                  {/* Badges Preview */}
                  {quest.rewards.badges.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-student-text-secondary mb-2">Badges to Earn:</p>
                      <div className="flex flex-wrap gap-1">
                        {quest.rewards.badges.slice(0, 2).map((badge) => (
                          <span key={badge} className="px-2 py-1 bg-student-secondary text-white rounded-full text-xs">
                            🏆 {badge}
                          </span>
                        ))}
                        {quest.rewards.badges.length > 2 && (
                          <span className="px-2 py-1 bg-student-background-secondary text-student-text rounded-full text-xs">
                            +{quest.rewards.badges.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => startQuest(quest)}
                    disabled={status === 'completed'}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 student-click-bounce ${
                      status === 'completed' 
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                        : 'btn-student-primary hover:shadow-student-hover'
                    }`}
                  >
                    {status === 'completed' ? (
                      <>
                        <Trophy className="w-5 h-5 mr-2 inline" />
                        Quest Completed!
                      </>
                    ) : status === 'in-progress' ? (
                      <>
                        <Play className="w-5 h-5 mr-2 inline" />
                        Continue Adventure
                      </>
                    ) : (
                      <>
                        <Sword className="w-5 h-5 mr-2 inline" />
                        Begin Quest
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render quest completion screen
  if (questCompleted && selectedQuest) {
    return (
      <div className="space-y-8 bg-student-background min-h-screen text-student-text flex items-center justify-center">
        <div className="student-card p-8 max-w-2xl mx-auto text-center bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-student-accent to-student-secondary flex items-center justify-center shadow-student-hover student-achievement-glow animate-student-bounce-in">
            <Crown className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-green-800 mb-4">Quest Completed!</h2>
          <h3 className="text-2xl font-bold text-student-text mb-4">{selectedQuest.title}</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-student-accent">+{selectedQuest.xpReward}</div>
              <div className="text-student-text-secondary">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-secondary">{selectedQuest.rewards.badges.length}</div>
              <div className="text-student-text-secondary">Badges Earned</div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="mb-6">
            <h4 className="font-semibold text-student-text mb-3">🏆 Badges Earned:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedQuest.rewards.badges.map((badge) => (
                <span key={badge} className="px-4 py-2 bg-student-accent text-white rounded-full font-medium shadow-student-card">
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Unlocked Content */}
          {selectedQuest.rewards.unlocks.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-student-text mb-3">🔓 New Quests Unlocked:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedQuest.rewards.unlocks.map((unlock) => (
                  <span key={unlock} className="px-3 py-1 bg-student-primary text-white rounded-full text-sm">
                    ⭐ {unlock.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={exitQuest}
            className="btn-student-primary px-8 py-3 text-lg font-medium student-click-bounce"
          >
            Continue Your Journey
          </button>
        </div>
      </div>
    );
  }

  // Render quest interface
  const currentStep = selectedQuest?.steps[currentStepIndex];

  return (
    <div className="space-y-6 bg-student-background min-h-screen text-student-text p-6">
      {/* Quest Header */}
      <div className="student-card p-6 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-student-text">{selectedQuest?.title}</h1>
            <p className="text-student-text-secondary">{selectedQuest?.story?.setting}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-student-accent">+{selectedQuest?.xpReward} XP</div>
            <div className="text-student-text-secondary">Quest Reward</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-student-text-secondary">Quest Progress</span>
            <span className="text-student-text">
              Step {currentStepIndex + 1} of {selectedQuest?.steps.length}
            </span>
          </div>
          <div className="student-progress-bar-enhanced h-4">
            <div 
              className="student-progress-fill-enhanced h-4 transition-all duration-500"
              style={{ 
                width: `${((currentStepIndex + (showFeedback ? 1 : 0)) / (selectedQuest?.steps.length || 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Character Introduction */}
        {selectedQuest?.story && (
          <div className="bg-student-background-secondary p-4 rounded-lg border border-student-primary/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-student-secondary flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-student-text">{selectedQuest.story.character}</h4>
                <p className="text-student-text-secondary text-sm">{selectedQuest.story.setting}</p>
              </div>
            </div>
            <p className="text-student-primary italic">"{selectedQuest.story.introduction}"</p>
          </div>
        )}
      </div>

      {/* Current Step */}
      {currentStep && (
        <div className="student-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center shadow-student-card">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-student-text">{currentStep.title}</h2>
          </div>

          {/* Narrative */}
          <div className="bg-student-primary/10 p-4 rounded-lg mb-6 border border-student-primary/20">
            <p className="text-lg text-student-primary italic">"{currentStep.narrative}"</p>
          </div>

          {/* Problem */}
          {currentStep.problem && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-student-text mb-4">
                🎯 {currentStep.problem.question}
              </h3>

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
                      } ${showFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-student-card'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                          userAnswer === option ? 'border-student-primary bg-student-primary text-white' : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
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
                  placeholder="Share your thoughts and analysis..."
                />
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={useHint}
                  disabled={hintsUsed >= 3 || showFeedback}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Hint ({hintsUsed}/3)</span>
                </button>
                
                {!showFeedback ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Submit Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={proceedToNextStep}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium btn-student-primary student-click-bounce"
                  >
                    <ArrowRight className="w-5 h-5" />
                    <span>
                      {currentStepIndex < (selectedQuest?.steps.length || 1) - 1 ? 'Next Challenge' : 'Complete Quest'}
                    </span>
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
                : 'border-orange-500 bg-orange-50'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                {isCorrect ? (
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-student-card">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-student-card">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h4 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                    {isCorrect ? '🎉 Excellent Work, Hero!' : '🤔 Not Quite Right, But Keep Going!'}
                  </h4>
                  <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                    {isCorrect ? 'You\'ve mastered this challenge!' : 'Every great hero learns from mistakes!'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-student-text mb-2">📚 Learning Insight:</h5>
                <p className="text-student-text">{currentStep.problem.explanation}</p>
              </div>

              {isCorrect && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full font-medium">
                    <Star className="w-4 h-4 mr-2" />
                    +25 XP Earned!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quest Stats */}
      <div className="student-card p-4">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <Clock className="w-5 h-5 mx-auto text-student-primary mb-1" />
            <div className="font-bold text-student-text">
              {Math.floor((Date.now() - startTime) / 60000)}m {Math.floor(((Date.now() - startTime) % 60000) / 1000)}s
            </div>
            <div className="text-student-text-secondary">Time Spent</div>
          </div>
          <div>
            <Lightbulb className="w-5 h-5 mx-auto text-student-secondary mb-1" />
            <div className="font-bold text-student-text">{hintsUsed}/3</div>
            <div className="text-student-text-secondary">Hints Used</div>
          </div>
          <div>
            <Award className="w-5 h-5 mx-auto text-student-accent mb-1" />
            <div className="font-bold text-student-text">
              {Math.round(((currentStepIndex + (showFeedback ? 1 : 0)) / (selectedQuest?.steps.length || 1)) * 100)}%
            </div>
            <div className="text-student-text-secondary">Progress</div>
          </div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center">
        <button
          onClick={exitQuest}
          className="text-student-text-secondary hover:text-student-text transition-colors duration-200"
        >
          Exit Quest
        </button>
      </div>
    </div>
  );
};