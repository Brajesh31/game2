import React, { useState, useEffect } from 'react';
import { QuestMap } from './QuestMap';
import { ExpeditionHUD } from './ExpeditionHUD';
import { QuestProgressEngine } from '../QuestProgressEngine';
import { Modal } from '../../ui/Modal';
import { useAuth } from '../../../hooks/useAuth';
import { useCurrentClass } from '../../../hooks/useCurrentClass';
import { ContentService } from '../../../services/ContentService';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { useToast } from '../../ToastContainer';
import { Student } from '../../../types';
import { Target, Clock, Star, Play, Trophy, CheckCircle, Map, List } from 'lucide-react';

export const EnhancedMyQuests: React.FC = () => {
  const { userData } = useAuth();
  const { currentClass, classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeTab, setActiveTab] = useState<'available' | 'in-progress' | 'completed'>('in-progress');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const student = userData as Student | null;
  const studentId = student?.user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  // Listen for class changes
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  useEffect(() => {
    const loadQuests = async () => {
      if (!student?.user?.id) return;
      
      setLoading(true);
      try {
        const content = await ContentService.getContent(currentClass, selectedSubject);
        const quests = content.quests || [];
        setAvailableQuests(quests);
      } catch (error) {
        console.error('Error loading quests:', error);
        setAvailableQuests([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, [student?.user?.id, currentClass, selectedSubject, forceUpdate]);

  const getQuestsByTab = () => {
    if (!studentProgress) return [];

    switch (activeTab) {
      case 'available':
        return availableQuests.filter(quest => 
          !studentProgress.completedQuests.includes(quest.id) &&
          !studentProgress.questProgress[quest.id]
        );
      
      case 'in-progress':
        return availableQuests.filter(quest => 
          studentProgress.questProgress[quest.id] &&
          !studentProgress.completedQuests.includes(quest.id)
        );
      
      case 'completed':
        return availableQuests.filter(quest => 
          studentProgress.completedQuests.includes(quest.id)
        );
      
      default:
        return [];
    }
  };

  const handleStartQuest = (questId: string) => {
    // Validate quest availability before starting
    const quest = availableQuests.find(q => q.id === questId);
    if (!quest) {
      showToast({
        type: 'error',
        title: 'Quest Not Found',
        message: 'The selected quest is no longer available.',
        duration: 3000
      });
      return;
    }
    
    console.log('Starting quest from My Quests:', questId);
    setSelectedQuestId(questId);
    setShowQuestModal(true);
  };

  const handleQuestComplete = (questId: string, xpEarned: number) => {
    setShowQuestModal(false);
    setSelectedQuestId('');
    
    showToast({
      type: 'success',
      title: 'Quest Completed!',
      message: `You earned ${xpEarned} XP! Excellent work!`,
      duration: 3000
    });

    // Refresh quest list
    setForceUpdate(prev => prev + 1);
  };

  const handleQuestExit = () => {
    setShowQuestModal(false);
    setSelectedQuestId('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const questsByTab = getQuestsByTab();

  if (!student || !student.user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading quests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 student-text-gradient">
          🗺️ My Learning Expeditions
        </h1>
        <p className="text-lg md:text-xl text-student-text-secondary">
          Your personal journey through the realms of knowledge for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Expedition Overview */}
      <div className="student-card p-6 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🎯 Current Expeditions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-student-primary">{studentProgress?.level || 1}</div>
              <div className="text-student-text-secondary">Explorer Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-accent">{studentProgress?.totalXP || 0}</div>
              <div className="text-student-text-secondary">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-secondary">{studentProgress?.completedQuests.length || 0}</div>
              <div className="text-student-text-secondary">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-primary">{studentProgress?.streakCount || 0}</div>
              <div className="text-student-text-secondary">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'map'
                  ? 'student-tab-active shadow-student-card'
                  : 'text-student-text-secondary hover:text-student-text hover:bg-student-background'
              }`}
            >
              <Map className="w-5 h-5" />
              <span>🗺️ Expedition Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'student-tab-active shadow-student-card'
                  : 'text-student-text-secondary hover:text-student-text hover:bg-student-background'
              }`}
            >
              <List className="w-5 h-5" />
              <span>📋 Quest Log</span>
            </button>
          </div>
          
          {/* Subject Selector */}
          <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
            {['math', 'science', 'english', 'hindi', 'social_studies'].map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
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
      </div>

      {/* Main Content */}
      <div className="min-h-96">
        {viewMode === 'map' ? (
          <QuestMap 
            subject={selectedSubject}
            onQuestSelect={(questId) => {
              setSelectedQuestId(questId);
              setShowQuestModal(true);
            }}
          />
        ) : (
          /* List View - Original Quest Grid */
          <div className="space-y-8">
            {/* Tab Navigation for List View */}
            <div className="flex justify-center mb-8">
              <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
                {[
                  { key: 'available', label: 'Available', icon: Target },
                  { key: 'in-progress', label: 'In Progress', icon: Clock },
                  { key: 'completed', label: 'Completed', icon: CheckCircle }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const count = getQuestsByTab().length;
                  
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? 'student-tab-active shadow-student-card'
                          : 'text-student-text-secondary hover:text-student-text hover:bg-student-background'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                      <span className="ml-1">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quest Grid for List View */}
            {questsByTab.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {questsByTab.map((quest) => {
                  const questProgress = studentProgress?.questProgress[quest.id];
                  const isCompleted = studentProgress?.completedQuests.includes(quest.id);
                  
                  return (
                    <div 
                      key={quest.id} 
                      className="student-quest-card p-4 md:p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(quest.difficulty)}`}>
                          {quest.difficulty}
                        </span>
                        <span className="text-xs md:text-sm text-student-text-secondary">
                          {quest.subject}
                        </span>
                      </div>
                      
                      <h3 className="text-lg md:text-xl font-bold text-student-text mb-3">
                        {quest.title}
                      </h3>
                      <p className="text-sm md:text-base text-student-text-secondary mb-4">
                        {quest.description}
                      </p>
                      
                      {/* Progress for in-progress quests */}
                      {questProgress && !isCompleted && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-student-text-secondary">Progress</span>
                            <span className="text-student-text">
                              {questProgress.completedSteps?.length || 0}/{quest.steps?.length || 1}
                            </span>
                          </div>
                          <div className="student-progress-bar-enhanced h-3">
                            <div 
                              className="student-progress-fill-enhanced h-3 transition-all duration-500"
                              style={{ 
                                width: `${((questProgress.completedSteps?.length || 0) / (quest.steps?.length || 1)) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-student-text-secondary">Reward:</span>
                          <span className="font-bold text-student-accent">+{quest.xpReward} XP</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-student-text-secondary">Est. Time:</span>
                          <span className="text-student-text">{quest.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleStartQuest(quest.id)}
                        disabled={isCompleted}
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                          isCompleted 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                            : questProgress 
                            ? 'btn-student-secondary student-click-bounce' 
                            : 'btn-student-primary student-click-bounce'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Trophy className="w-5 h-5" />
                            <span>Completed!</span>
                          </>
                        ) : questProgress ? (
                          <>
                            <Play className="w-5 h-5" />
                            <span>Continue Quest</span>
                          </>
                        ) : (
                          <>
                            <Target className="w-5 h-5" />
                            <span>Start Quest</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-student-background-secondary flex items-center justify-center">
                  <Target className="w-8 h-8 md:w-12 md:h-12 text-student-text-muted" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-student-text mb-2">
                  {activeTab === 'available' && 'No new quests available'}
                  {activeTab === 'in-progress' && 'No quests in progress'}
                  {activeTab === 'completed' && 'No completed quests yet'}
                </h3>
                <p className="text-student-text-secondary">
                  {activeTab === 'available' && 'Check back later for new learning adventures!'}
                  {activeTab === 'in-progress' && 'Start a quest to see it here!'}
                  {activeTab === 'completed' && 'Complete your first quest to see it here!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Quest Progress Modal */}
      <Modal 
        isOpen={showQuestModal} 
        onClose={handleQuestExit} 
        title="Quest in Progress"
        size="xl"
      >
        {selectedQuestId && (
          <QuestProgressEngine
            questId={selectedQuestId}
            onComplete={handleQuestComplete}
            onExit={handleQuestExit}
          />
        )}
      </Modal>
    </div>
  );
};