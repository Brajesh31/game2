import React from 'react';
import { Compass, MapPin, Trophy, Clock } from 'lucide-react';

interface ExpeditionHUDProps {
  expeditionTitle: string;
  currentClass: string;
  subject: string;
  progress: number;
  completedQuests: number;
  totalQuests: number;
  totalXP: number;
}

export const ExpeditionHUD: React.FC<ExpeditionHUDProps> = ({
  expeditionTitle,
  currentClass,
  subject,
  progress,
  completedQuests,
  totalQuests,
  totalXP
}) => {
  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-student-background/95 backdrop-blur-sm border-b border-student-primary/20 shadow-student-card">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Expedition Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Compass className="w-6 h-6 text-student-primary" />
              <h1 className="text-xl font-bold text-student-text">
                {expeditionTitle}
              </h1>
            </div>
            <div className="hidden md:block text-student-text-secondary">
              {currentClass} • {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-student-accent">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-student-text-secondary">Complete</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-student-secondary">
                {completedQuests}/{totalQuests}
              </div>
              <div className="text-xs text-student-text-secondary">Quests</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-student-primary">
                {totalXP}
              </div>
              <div className="text-xs text-student-text-secondary">XP Earned</div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-32 bg-student-background-secondary rounded-full h-3 shadow-student-card">
              <div 
                className="h-3 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${progress}%`,
                  background: 'var(--student-progress-fill)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};