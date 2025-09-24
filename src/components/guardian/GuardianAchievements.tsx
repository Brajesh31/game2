import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalState } from '../../hooks/useGlobalState';
import { Guardian } from '../../types';
import { Trophy, Star, Award, Calculator, Flame } from 'lucide-react';

export const GuardianAchievements: React.FC = () => {
  const { userData } = useAuth();
  const { state } = useGlobalState();
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  
  const guardian = userData as Guardian;

  if (!guardian || !guardian.user) {
    return <div>Loading...</div>;
  }

  const currentChild = guardian.childrenProgress[selectedChildIndex];
  
  // Get achievements for current child - only earned ones
  const getChildAchievements = () => {
    const studentId = currentChild?.id;
    if (!studentId) return [];
    
    return state.achievements?.filter((a: any) => a.studentId === studentId) || [];
  };

  const achievements = getChildAchievements();

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'calculator': return Calculator;
      case 'flame': return Flame;
      case 'star': return Star;
      default: return Award;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-guardian-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guardian-text mb-4">
          {currentChild?.name}'s Achievements
        </h1>
        <p className="text-2xl text-guardian-text-secondary">
          Celebrating every success along the way
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

      {/* Achievement Count */}
      <div className="guardian-card guardian-card-warm p-8 animate-guardian-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="text-center">
          <div className="text-6xl font-bold text-guardian-primary mb-4">
            {achievements.length}
          </div>
          <h2 className="text-3xl font-bold text-guardian-text mb-2">
            Achievement{achievements.length !== 1 ? 's' : ''} Earned!
          </h2>
          <p className="text-xl text-guardian-text-secondary">
            {achievements.length > 0 
              ? `${currentChild?.name} has earned ${achievements.length} special badge${achievements.length !== 1 ? 's' : ''}!`
              : `${currentChild?.name} is working toward their first achievement!`
            }
          </p>
        </div>
      </div>

      {/* Achievements Grid - Only show earned achievements */}
      {achievements.length > 0 ? (
        <div className="guardian-card p-8 animate-guardian-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-guardian-text mb-8 text-center">Badge Collection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement: any) => {
              const IconComponent = getAchievementIcon(achievement.icon);
              
              return (
                <div 
                  key={achievement.id} 
                  className="guardian-card p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br from-guardian-background-tertiary to-guardian-background-secondary border-guardian-primary/20 guardian-achievement-glow hover:guardian-achievement-glow-hover"
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-guardian-primary to-guardian-primary-hover flex items-center justify-center shadow-guardian-hover">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-guardian-text mb-3">
                    {achievement.title}
                  </h3>
                  
                  <p className="text-guardian-text-secondary mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="text-sm text-guardian-secondary font-medium">
                    Earned {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* No achievements yet - Encouraging message */
        <div className="guardian-card p-12 animate-guardian-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-guardian-background-tertiary flex items-center justify-center shadow-guardian-card">
              <Trophy className="w-16 h-16 text-guardian-text-muted" />
            </div>
            <h2 className="text-3xl font-bold text-guardian-text mb-4">
              First Badge Coming Soon!
            </h2>
            <p className="text-xl text-guardian-text-secondary mb-6">
              {currentChild?.name} is working hard and will earn their first achievement badge soon!
            </p>
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-lg text-guardian-text-secondary">
              Keep learning, keep growing, and the badges will come!
            </p>
          </div>
        </div>
      )}

      {/* Achievement Detail Modal - Simple and positive */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 guardian-login-bg">
          <div className="guardian-modal max-w-md w-full p-8">
            <div className="text-center">
              {(() => {
                const IconComponent = getAchievementIcon(selectedAchievement.icon);
                return (
                  <>
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-guardian-primary to-guardian-primary-hover flex items-center justify-center shadow-guardian-hover guardian-achievement-glow">
                      <IconComponent className="w-16 h-16 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-guardian-text mb-4">
                      {selectedAchievement.title}
                    </h2>
                    
                    <p className="text-xl text-guardian-text-secondary mb-6">
                      {selectedAchievement.description}
                    </p>
                    
                    <div className="text-6xl mb-4">🎉</div>
                    
                    <p className="text-lg text-guardian-secondary font-medium mb-6">
                      Earned on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                    
                    <Button 
                      size="lg" 
                      onClick={() => setSelectedAchievement(null)}
                      className="w-full btn-guardian-primary"
                    >
                      Close
                    </Button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Encouragement Section */}
      <div className="guardian-card p-8 bg-gradient-to-r from-guardian-background-tertiary to-guardian-background-secondary animate-guardian-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-guardian-text mb-4">You're Doing Great!</h2>
          <p className="text-xl text-guardian-text-secondary mb-4">
            Every achievement represents hard work and dedication. 
          </p>
          <div className="text-5xl mb-4">👏</div>
          <p className="text-lg text-guardian-text-secondary">
            Keep encouraging {currentChild?.name} - your support makes all the difference!
          </p>
        </div>
      </div>
    </div>
  );
};