import React from 'react';
import { Trophy, Star, Crown, Zap, Gift } from 'lucide-react';

interface QuestRewardsProps {
  xpEarned: number;
  badges: string[];
  unlocks: string[];
  isVisible: boolean;
  onClose: () => void;
}

export const QuestRewards: React.FC<QuestRewardsProps> = ({
  xpEarned,
  badges,
  unlocks,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-student-background rounded-2xl shadow-student-hover max-w-md w-full p-8 border border-student-primary/20 animate-student-bounce-in">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-student-hover student-achievement-glow animate-student-pulse">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-student-text mb-2">
            🎉 Quest Completed!
          </h2>
          
          <p className="text-xl text-student-text-secondary">
            Excellent work, brave explorer!
          </p>
        </div>

        {/* XP Reward */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-student-accent to-student-secondary rounded-full text-white font-bold text-xl shadow-student-card">
            <Zap className="w-6 h-6 mr-3" />
            +{xpEarned} XP Earned!
          </div>
        </div>

        {/* Badges Earned */}
        {badges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-student-text mb-4 text-center">
              🏆 Badges Earned
            </h3>
            <div className="space-y-2">
              {badges.map((badge, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 bg-gradient-to-r from-student-secondary/10 to-student-accent/10 rounded-lg border border-student-secondary/30 animate-student-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center mr-3">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-student-text">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Content */}
        {unlocks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-student-text mb-4 text-center">
              🔓 New Adventures Unlocked
            </h3>
            <div className="space-y-2">
              {unlocks.map((unlock, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 bg-student-primary/10 rounded-lg border border-student-primary/20 animate-student-slide-up"
                  style={{ animationDelay: `${(badges.length + index) * 0.2}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-student-primary to-student-secondary flex items-center justify-center mr-3">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-student-text capitalize">
                    {unlock.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="w-full py-4 px-8 rounded-lg font-bold text-lg btn-student-primary student-click-bounce transition-all duration-200"
          >
            Continue Your Journey
          </button>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary rounded-lg">
          <p className="text-student-primary text-center font-medium">
            🌟 "Every quest completed is a step closer to becoming a legendary scholar!" 🌟
          </p>
        </div>
      </div>
    </div>
  );
};