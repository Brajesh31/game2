import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { LocalStorageService } from '../../services/LocalStorageService';
import { ContentService } from '../../services/ContentService';
import { Student } from '../../types';
import { Play, Target, Trophy, Zap } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { userData } = useAuth();
  const { currentClass } = useCurrentClass();
  const student = userData as Student | null;
  const studentId = student?.user?.id || 'student-001';
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [themeUpdate, setThemeUpdate] = useState(0);
  
  // Get or initialize student progress from Local Storage
  const studentProgress = LocalStorageService.getStudentProgress(studentId) || 
    LocalStorageService.initializeStudentProgress(studentId);
  
  // Listen for class changes and force update
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);
  
  // Listen for theme changes and force immediate re-render
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeUpdate(prev => prev + 1);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('forceThemeUpdate', handleThemeChange);
    window.addEventListener('studentThemeChanged', handleThemeChange);
    window.addEventListener('immediateThemeUpdate', handleThemeChange);
    window.addEventListener('themeUpdateRAF', handleThemeChange);
    window.addEventListener('studentThemeUpdate', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('forceThemeUpdate', handleThemeChange);
      window.removeEventListener('studentThemeChanged', handleThemeChange);
      window.removeEventListener('immediateThemeUpdate', handleThemeChange);
      window.removeEventListener('themeUpdateRAF', handleThemeChange);
      window.removeEventListener('studentThemeUpdate', handleThemeChange);
    };
  }, []);
  
  useEffect(() => {
    // Load available quests when class changes
    const loadQuests = async () => {
      setLoading(true);
      try {
        const quests = await ContentService.getAllQuests(currentClass);
        setAvailableQuests(quests.slice(0, 3)); // Show first 3
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

  if (!student || !student.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      key={themeUpdate} 
      className="space-y-8 min-h-screen transition-all duration-300" 
      style={{
        backgroundColor: 'var(--student-app-bg)',
        color: 'var(--student-body-text)'
      }}
    >
      {/* Welcome Header */}
      <div 
        className="p-8 animate-student-bounce-in rounded-2xl transition-all duration-300"
        style={{
          background: 'var(--student-hero-gradient)',
          color: 'var(--student-header-text)',
          boxShadow: 'var(--student-card-shadow)'
        }}
      >
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--student-header-text)' }}>
          Welcome back, {student.user.name}!
        </h1>
        <p className="text-xl opacity-90" style={{ color: 'var(--student-header-text)' }}>
          Ready to continue your learning adventure?
        </p>
        <div className="mt-4 flex items-center space-x-6">
          <div>
            <div 
              className="w-16 h-16 flex items-center justify-center text-xl font-bold mb-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--student-accent)',
                color: 'var(--student-header-text)',
                boxShadow: 'var(--student-card-shadow)'
              }}
            >
              {studentProgress.level}
            </div>
            <p className="text-sm opacity-80" style={{ color: 'var(--student-header-text)' }}>Current Level</p>
          </div>
          <div>
            <div 
              className="px-4 py-2 text-xl font-bold mb-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: 'var(--student-secondary)',
                color: 'var(--student-header-text)',
                boxShadow: 'var(--student-card-shadow)'
              }}
            >
              {studentProgress.totalXP} XP
            </div>
            <p className="text-sm opacity-80" style={{ color: 'var(--student-header-text)' }}>Experience Points</p>
          </div>
          <div>
            <div 
              className="w-16 h-16 flex items-center justify-center text-xl font-bold mb-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--student-primary)',
                color: 'var(--student-header-text)',
                boxShadow: 'var(--student-card-shadow)'
              }}
            >
              {studentProgress.achievements.length}
            </div>
            <p className="text-sm opacity-80" style={{ color: 'var(--student-header-text)' }}>Achievements</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Challenge Card */}
        <div 
          className="lg:col-span-2 animate-student-slide-up rounded-2xl p-8 transition-all duration-300"
          style={{
            backgroundColor: 'var(--student-card-bg)',
            border: 'var(--student-card-border)',
            boxShadow: 'var(--student-card-shadow)',
            color: 'var(--student-body-text)'
          }}
        >
          <div className="text-center p-8">
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center hover:shadow-student-hover transition-all duration-300 student-hover-lift"
              style={{
                background: 'linear-gradient(135deg, var(--student-secondary), var(--student-accent))',
                boxShadow: 'var(--student-card-hover-glow)'
              }}
            >
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--student-heading-text)' }}>
              ⚡ Today's Challenge
            </h2>
            <h3 
              className="text-2xl mb-4"
              style={{
                background: 'var(--student-hero-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Gravity Puzzle
            </h3>
            <p className="mb-6 text-lg" style={{ color: 'var(--student-body-text)' }}>
              Explore the laws of physics by solving interactive gravity-based puzzles. 
              Complete this challenge to earn 150 XP and unlock the next level!
            </p>
            <Button 
              size="lg" 
              className="px-8 student-click-bounce transition-all duration-300"
              style={{
                backgroundColor: 'var(--student-btn-primary-bg)',
                color: 'var(--student-btn-primary-text)',
                border: 'none'
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Challenge
            </Button>
          </div>
        </div>

        {/* Recent Achievements */}
        <div 
          className="animate-student-slide-up rounded-2xl p-6 transition-all duration-300" 
          style={{ 
            animationDelay: '0.2s',
            backgroundColor: 'var(--student-card-bg)',
            border: 'var(--student-card-border)',
            boxShadow: 'var(--student-card-shadow)',
            color: 'var(--student-body-text)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: 'var(--student-heading-text)' }}>
              🏆 Recent Achievements
            </h2>
            <Trophy className="w-6 h-6" style={{ color: 'var(--student-accent)' }} />
          </div>
          <div className="space-y-4">
            {studentProgress.achievements.slice(0, 3).map((achievement) => (
              <div 
                key={achievement.id} 
                className="flex items-center space-x-3 p-4 rounded-xl student-achievement-glow hover:student-achievement-glow-hover transition-all duration-300 hover:scale-105 student-hover-lift"
                style={{
                  backgroundColor: 'var(--student-component-bg)',
                  border: '1px solid var(--student-primary)',
                  borderOpacity: 0.2
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, var(--student-secondary), var(--student-accent))',
                    boxShadow: 'var(--student-card-shadow)'
                  }}
                >
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--student-heading-text)' }}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--student-body-text)' }}>
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {studentProgress.achievements.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--student-muted-text)' }} />
                <p style={{ color: 'var(--student-body-text)' }}>
                  Complete quests to earn your first achievement!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ongoing Quests */}
      <div 
        className="animate-student-slide-up rounded-2xl p-6 transition-all duration-300" 
        style={{ 
          animationDelay: '0.4s',
          backgroundColor: 'var(--student-card-bg)',
          border: 'var(--student-card-border)',
          boxShadow: 'var(--student-card-shadow)',
          color: 'var(--student-body-text)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--student-heading-text)' }}>
            🎯 Available Learning Quests
          </h2>
          <Target className="w-6 h-6" style={{ color: 'var(--student-primary)' }} />
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: 'var(--student-primary)' }}
            ></div>
            <p style={{ color: 'var(--student-body-text)' }}>Loading quests...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuests.map((quest) => {
            const questProgress = studentProgress.questProgress[quest.id];
            const isCompleted = studentProgress.completedQuests.includes(quest.id);
            
            return (
            <div 
              key={quest.id} 
              className="p-6 hover:shadow-student-hover transition-all duration-300 student-hover-lift rounded-xl"
              style={{
                backgroundColor: 'var(--student-component-bg)',
                border: '1px solid var(--student-primary)',
                borderOpacity: 0.2,
                boxShadow: 'var(--student-card-shadow)',
                color: 'var(--student-body-text)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold" style={{ color: 'var(--student-heading-text)' }}>
                  {quest.title}
                </h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  isCompleted ? 'bg-green-100 text-green-800' :
                  questProgress ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {isCompleted ? 'COMPLETED' : questProgress ? 'IN PROGRESS' : 'AVAILABLE'}
                </span>
              </div>
              
              <p className="text-sm mb-4" style={{ color: 'var(--student-body-text)' }}>
                {quest.description}
              </p>
              
              <div className="space-y-3">
                {questProgress && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--student-body-text)' }}>Progress</span>
                      <span className="font-medium" style={{ color: 'var(--student-heading-text)' }}>
                        {questProgress.completedSteps.length}/{quest.steps.length} steps
                      </span>
                    </div>
                    
                    <div 
                      className="h-4 rounded-full overflow-hidden transition-all duration-300"
                      style={{ backgroundColor: 'var(--student-progress-bg)' }}
                    >
                      <div 
                        className="h-4 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(questProgress.completedSteps.length / quest.steps.length) * 100}%`,
                          background: 'var(--student-progress-fill)'
                        }}
                      ></div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: 'var(--student-accent)' }}>
                    +{quest.xpReward} XP
                  </span>
                  <span className="text-xs" style={{ color: 'var(--student-body-text)' }}>
                    {quest.estimatedTime}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 student-click-bounce transition-all duration-300"
                  style={{
                    borderColor: 'var(--student-primary)',
                    color: 'var(--student-primary)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--student-primary)';
                    e.currentTarget.style.color = 'var(--student-header-text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--student-primary)';
                  }}
                  disabled={isCompleted}
                >
                  {isCompleted ? '✓ Completed' : questProgress ? 'Continue Quest' : 'Start Quest'}
                </Button>
              </div>
            </div>
          );
          })}
        </div>
        )}
      </div>
    </div>
  );
};