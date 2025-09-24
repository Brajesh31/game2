import React, { useEffect, useState } from 'react';
import { Trophy, Star, Crown, Zap, Sparkles } from 'lucide-react';

interface QuestCompletionCelebrationProps {
  questTitle: string;
  xpEarned: number;
  newLevel?: number;
  badges: string[];
  isVisible: boolean;
  onComplete: () => void;
}

export const QuestCompletionCelebration: React.FC<QuestCompletionCelebrationProps> = ({
  questTitle,
  xpEarned,
  newLevel,
  badges,
  isVisible,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const phases = [
        () => setAnimationPhase(1), // XP animation
        () => setAnimationPhase(2), // Badge animation
        () => setAnimationPhase(3), // Level up (if applicable)
        () => setAnimationPhase(4)  // Final celebration
      ];

      phases.forEach((phase, index) => {
        setTimeout(phase, index * 1000);
      });

      // Auto-close after celebration
      setTimeout(() => {
        onComplete();
        setAnimationPhase(0);
      }, 5000);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-student-background rounded-2xl shadow-student-hover max-w-lg w-full p-8 border border-student-primary/20 text-center">
        {/* Main Trophy */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-student-hover student-achievement-glow animate-student-bounce-in">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-student-text mb-4">
            🎉 Quest Completed!
          </h1>
          
          <h2 className="text-2xl font-bold text-student-primary mb-2">
            {questTitle}
          </h2>
          
          <p className="text-xl text-student-text-secondary">
            Outstanding work, brave explorer!
          </p>
        </div>

        {/* XP Animation */}
        {animationPhase >= 1 && (
          <div className="mb-8 animate-student-slide-up">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-student-accent to-student-secondary rounded-full text-white font-bold text-2xl shadow-student-card">
              <Zap className="w-8 h-8 mr-3" />
              +{xpEarned} XP
            </div>
          </div>
        )}

        {/* Level Up Animation */}
        {animationPhase >= 3 && newLevel && (
          <div className="mb-8 animate-student-bounce-in">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white font-bold text-2xl shadow-student-card">
              <Crown className="w-8 h-8 mr-3" />
              Level {newLevel}!
            </div>
            <p className="text-student-primary mt-2 font-medium">
              🎊 You've reached a new level of mastery!
            </p>
          </div>
        )}

        {/* Badges Animation */}
        {animationPhase >= 2 && badges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-student-text mb-4">
              🏆 New Badges Earned!
            </h3>
            <div className="space-y-3">
              {badges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-student-secondary/10 to-student-accent/10 rounded-lg border border-student-secondary/30 animate-student-slide-up"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-student-text text-lg">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Celebration */}
        {animationPhase >= 4 && (
          <div className="animate-student-slide-up">
            <div className="flex justify-center space-x-2 mb-6">
              {Array.from({ length: 5 }, (_, i) => (
                <Sparkles 
                  key={i} 
                  className="w-6 h-6 text-yellow-400 animate-pulse" 
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            
            <button
              onClick={() => {
                onComplete();
                setAnimationPhase(0);
              }}
              className="w-full py-4 px-8 rounded-lg font-bold text-lg btn-student-primary student-click-bounce transition-all duration-200"
            >
              Continue Your Journey
            </button>
            
            <p className="text-student-primary mt-4 font-medium">
              🌟 "Knowledge is the treasure that follows its owner everywhere!" 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
};