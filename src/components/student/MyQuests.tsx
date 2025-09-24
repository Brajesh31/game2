import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useContentLoader } from '../../hooks/useContentLoader';
import { ContentService } from '../../services/ContentService';
import { Student } from '../../types';
import { Target, Clock, Star, Play } from 'lucide-react';

export const MyQuests: React.FC = () => {
  const { userData } = useAuth();
  const { classInfo } = useCurrentClass();
  const [activeTab, setActiveTab] = useState<'available' | 'in-progress' | 'completed'>('in-progress');
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  const [questsLoading, setQuestsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const student = userData as Student | null;

  // Listen for class changes and force update
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  // Load quests effect
  useEffect(() => {
    const loadAllQuests = async () => {
      if (!student?.user?.id) {
        setQuestsLoading(false);
        return;
      }
      
      try {
        setQuestsLoading(true);
        const quests = await ContentService.getAllQuestsForCurrentUser(student.user.id);
        setAvailableQuests(quests);
      } catch (error) {
        console.error('Error loading quests:', error);
        setAvailableQuests([]);
      } finally {
        setQuestsLoading(false);
      }
    };
    
    loadAllQuests();
  }, [student?.user?.id, forceUpdate]);

  if (!student || !student.user || questsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading quests...</p>
        </div>
      </div>
    );
  }

  const completedQuests = [
    {
      id: 'basic-algebra',
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      difficulty: 'Easy',
      xpEarned: 200,
      completedAt: '2024-01-25T10:30:00Z',
      score: 95
    },
    {
      id: 'cell-biology',
      title: 'Cell Structure & Function',
      subject: 'Biology',
      difficulty: 'Medium',
      xpEarned: 350,
      completedAt: '2024-01-23T14:15:00Z',
      score: 88
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🎯 My Learning Quests</h1>
        <p className="text-xl text-student-text-secondary">
          Track your progress and discover new challenges for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {[
            { key: 'available', label: 'Available', count: availableQuests.length },
            { key: 'in-progress', label: 'In Progress', count: student.currentQuests.length },
            { key: 'completed', label: 'Completed', count: completedQuests.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 student-hover-lift ${
                activeTab === tab.key
                  ? 'student-tab-active shadow-student-card'
                  : 'text-student-text-secondary hover:text-student-text hover:bg-student-background hover:shadow-student-card'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {/* Available Quests */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuests.map((quest) => (
              <div key={quest.id} className="student-quest-card shadow-student-card hover:shadow-student-hover p-6 animate-student-slide-up student-hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(quest.difficulty)}`}>
                    {getDifficultyIcon(quest.difficulty)} {quest.difficulty}
                  </span>
                  <span className="text-sm text-student-text-secondary">{quest.subject}</span>
                </div>
                
                <h3 className="text-xl font-bold text-student-text mb-3">{quest.title}</h3>
                <p className="text-student-text-secondary mb-4">{quest.description}</p>
                
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
                
                <Button className="w-full btn-student-primary student-click-bounce" icon={Play}>
                  Start Quest
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* In Progress Quests */}
        {activeTab === 'in-progress' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.currentQuests.map((quest) => (
              <div key={quest.id} className="student-quest-card shadow-student-card hover:shadow-student-hover p-6 animate-student-slide-up student-hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    quest.type === 'daily' ? 'student-quest-daily' :
                    quest.type === 'weekly' ? 'student-quest-weekly' :
                    'student-quest-challenge'
                  }`}>
                    {quest.type.toUpperCase()}
                  </span>
                  {quest.deadline && (
                    <div className="flex items-center text-sm text-student-text-secondary">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(quest.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-student-text mb-3">{quest.title}</h3>
                <p className="text-student-text-secondary mb-4">{quest.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Progress</span>
                    <span className="font-medium text-student-text">{quest.progress}/{quest.maxProgress}</span>
                  </div>
                  
                  <div className="student-progress-bar-enhanced h-4">
                    <div 
                      className="student-progress-fill-enhanced h-4"
                      style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-student-accent font-bold">+{quest.xpReward} XP</span>
                    <span className="text-student-text">
                      {Math.round((quest.progress / quest.maxProgress) * 100)}% Complete
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary student-click-bounce" icon={Target}>
                  Continue Quest
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Completed Quests */}
        {activeTab === 'completed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedQuests.map((quest) => (
              <div key={quest.id} className="student-quest-card shadow-student-card p-6 opacity-90 animate-student-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(quest.difficulty)}`}>
                    {getDifficultyIcon(quest.difficulty)} {quest.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-student-accent">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {quest.score}%
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-student-text mb-3">{quest.title}</h3>
                <p className="text-student-text-secondary mb-4">{quest.subject}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">XP Earned:</span>
                    <span className="font-bold text-student-accent">+{quest.xpEarned} XP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Completed:</span>
                    <span className="text-student-text">{new Date(quest.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="student-progress-bar-enhanced h-4 mb-4">
                  <div className="bg-gradient-to-r from-student-accent to-student-accent-hover h-4 rounded-full w-full"></div>
                </div>
                
                <Button variant="ghost" className="w-full" disabled>
                  ✓ Completed
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};