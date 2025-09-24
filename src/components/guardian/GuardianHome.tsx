import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useGlobalState } from '../../hooks/useGlobalState';
import { Guardian } from '../../types';
import { Clock, Target, Mail, Trophy, Bell } from 'lucide-react';

export const GuardianHome: React.FC = () => {
  const { userData } = useAuth();
  const { classInfo } = useCurrentClass();
  const { state } = useGlobalState();
  const navigate = useNavigate();
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  
  const guardian = userData as Guardian;

  if (!guardian || !guardian.user) {
    return <div>Loading...</div>;
  }

  const currentChild = guardian.childrenProgress[selectedChildIndex];
  const unreadMessages = guardian.notifications.filter(n => !n.read).length;

  // Get latest achievement for current child
  const getLatestAchievement = () => {
    const studentId = currentChild?.id;
    if (!studentId) return null;
    
    const achievements = state.achievements?.filter((a: any) => a.studentId === studentId) || [];
    return achievements.sort((a: any, b: any) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())[0];
  };

  const latestAchievement = getLatestAchievement();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-guardian-slide-up bg-guardian-background text-guardian-text min-h-screen p-6">
      {/* Welcome Header - Large and friendly */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guardian-text mb-4">
          Hello, {guardian.user.name}! 👋
        </h1>
        <p className="text-2xl text-guardian-text-secondary">
          Here's how your child is doing today in {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Child Selector - Only show if multiple children */}
      {guardian.childrenProgress.length > 1 && (
        <div className="guardian-card p-6 animate-guardian-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-guardian-text mb-4 text-center">Select Your Child</h2>
          <div className="flex justify-center space-x-4">
            {guardian.childrenProgress.map((child, index) => (
              <Button
                key={child.id}
                className={selectedChildIndex === index ? 'btn-guardian-primary' : 'border-guardian-primary text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary'}
                size="lg"
                onClick={() => setSelectedChildIndex(index)}
              >
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* At a Glance Card */}
      <div className="guardian-card guardian-card-warm p-8 animate-guardian-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold text-guardian-text mb-6 text-center">
          {currentChild?.name}'s Day at a Glance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Time Studied */}
          <div className="text-center p-6 bg-guardian-background-tertiary rounded-xl shadow-guardian-card">
            <Clock className="w-12 h-12 mx-auto text-guardian-secondary mb-3" />
            <div className="text-3xl font-bold text-guardian-text mb-2">
              {currentChild?.timeSpent || '0h 0m'}
            </div>
            <div className="text-xl text-guardian-text-secondary">Time Studied Today</div>
          </div>

          {/* Quests Completed */}
          <div className="text-center p-6 bg-guardian-background-tertiary rounded-xl shadow-guardian-card">
            <Target className="w-12 h-12 mx-auto text-guardian-secondary mb-3" />
            <div className="text-3xl font-bold text-guardian-text mb-2">
              {Math.floor((currentChild?.weeklyProgress || 0) / 20)}
            </div>
            <div className="text-xl text-guardian-text-secondary">Quests Completed This Week</div>
          </div>

          {/* Messages Alert */}
          <div 
            className={`text-center p-6 rounded-xl cursor-pointer transition-all hover:scale-105 shadow-guardian-card hover:shadow-guardian-hover ${
              unreadMessages > 0 ? 'bg-guardian-background-tertiary border-2 border-guardian-accent guardian-card-attention' : 'bg-guardian-background-tertiary'
            }`}
            onClick={() => navigate('/guardian/messages')}
          >
            <div className="relative">
              <Mail className={`w-12 h-12 mx-auto mb-3 ${
                unreadMessages > 0 ? 'text-guardian-accent' : 'text-guardian-text-muted'
              }`} />
              {unreadMessages > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 guardian-notification-badge text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {unreadMessages}
                </div>
              )}
            </div>
            <div className={`text-3xl font-bold text-guardian-text mb-2 ${
              unreadMessages > 0 ? 'text-guardian-accent' : ''
            }`}>
              {unreadMessages > 0 ? 'New!' : 'None'}
            </div>
            <div className="text-xl text-guardian-text-secondary">
              {unreadMessages > 0 ? 'Unread Messages' : 'No New Messages'}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Achievement Card */}
      <div className="guardian-card p-8 animate-guardian-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-3xl font-bold text-guardian-text mb-6 text-center">Latest Achievement</h2>
        
        {latestAchievement ? (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-guardian-primary to-guardian-primary-hover flex items-center justify-center shadow-guardian-hover guardian-achievement-glow animate-guardian-warm-glow">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-guardian-text mb-3">
              {latestAchievement.title}
            </h3>
            <p className="text-xl text-guardian-text-secondary mb-4">
              {latestAchievement.description}
            </p>
            <p className="text-lg text-guardian-secondary font-medium">
              Earned on {new Date(latestAchievement.unlockedAt).toLocaleDateString()}
            </p>
            <Button 
              className="mt-6 btn-guardian-primary" 
              size="lg"
              onClick={() => navigate('/guardian/achievements')}
            >
              View All Achievements
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-24 h-24 mx-auto text-guardian-text-muted mb-6" />
            <h3 className="text-2xl font-bold text-guardian-text mb-3">
              First Achievement Coming Soon!
            </h3>
            <p className="text-xl text-guardian-text-secondary">
              {currentChild?.name} is working hard and will earn their first badge soon!
            </p>
          </div>
        )}
      </div>

      {/* Quick Progress Summary */}
      <div className="guardian-card p-8 animate-guardian-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-bold text-guardian-text mb-6 text-center">This Week's Progress</h2>
        
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-guardian-primary mb-2">
            {currentChild?.weeklyProgress || 0}%
          </div>
          <div className="text-xl text-guardian-text-secondary">Overall Progress</div>
        </div>

        <div className="w-full bg-guardian-background-tertiary rounded-full h-6 mb-6 shadow-guardian-card">
          <div 
            className="guardian-progress-default h-6 rounded-full transition-all duration-1000 shadow-guardian-card"
            style={{ width: `${currentChild?.weeklyProgress || 0}%` }}
          ></div>
        </div>

        <Button 
          className="w-full btn-guardian-primary" 
          size="lg"
          onClick={() => navigate('/guardian/progress')}
        >
          View Detailed Progress
        </Button>
      </div>
    </div>
  );
};