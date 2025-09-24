import React from 'react';
import { Play, Trophy, Clock, Star, Zap, Target } from 'lucide-react';

interface QuestBriefingProps {
  quest: {
    id: string;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    estimatedTime: string;
    xpReward: number;
    isCompleted: boolean;
    isActive: boolean;
  };
  onStart: () => void;
  onClose: () => void;
}

export const QuestBriefing: React.FC<QuestBriefingProps> = ({
  quest,
  onStart,
  onClose
}) => {
  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'reading': return '📖';
      case 'experiment': return '🧪';
      case 'quiz': return '❓';
      case 'collaboration': return '🤝';
      case 'boss_battle': return '👑';
      default: return '⭐';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestTypeDescription = (type: string) => {
    switch (type) {
      case 'reading': return 'Dive into knowledge through engaging content';
      case 'experiment': return 'Hands-on virtual laboratory experience';
      case 'quiz': return 'Test your understanding and skills';
      case 'collaboration': return 'Work together with fellow explorers';
      case 'boss_battle': return 'Ultimate challenge to prove mastery';
      default: return 'An exciting learning adventure awaits';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-student-background rounded-2xl shadow-student-hover max-w-lg w-full p-8 border border-student-primary/20 animate-student-slide-up">
        {/* Quest Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getQuestTypeIcon(quest.type)}</div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 ${
            quest.isCompleted ? 'bg-green-100 text-green-800' :
            quest.isActive ? 'bg-blue-100 text-blue-800' :
            'bg-student-primary/10 text-student-primary'
          }`}>
            {quest.isCompleted ? '✅ Quest Completed' :
             quest.isActive ? '🔄 In Progress' :
             '🆕 New Quest'}
          </div>
          
          <h2 className="text-3xl font-bold text-student-text mb-3">
            {quest.title}
          </h2>
          
          <p className="text-lg text-student-text-secondary mb-4">
            {quest.description}
          </p>
          
          <p className="text-student-primary italic">
            {getQuestTypeDescription(quest.type)}
          </p>
        </div>

        {/* Quest Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 bg-student-background-secondary rounded-lg shadow-student-card">
            <Clock className="w-6 h-6 mx-auto text-student-secondary mb-2" />
            <div className="font-bold text-student-text">{quest.estimatedTime}</div>
            <div className="text-student-text-secondary text-sm">Duration</div>
          </div>
          
          <div className="text-center p-4 bg-student-accent/10 rounded-lg border border-student-accent/20">
            <Star className="w-6 h-6 mx-auto text-student-accent mb-2" />
            <div className="font-bold text-student-accent">+{quest.xpReward} XP</div>
            <div className="text-student-text-secondary text-sm">Reward</div>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="text-center mb-8">
          <span className={`px-6 py-3 rounded-full text-lg font-bold ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty.toUpperCase()} DIFFICULTY
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-lg border-2 border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200 font-medium"
          >
            Close Briefing
          </button>
          
          {!quest.isCompleted && (
            <button
              onClick={onStart}
              className="flex-1 py-4 px-6 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>{quest.isActive ? 'Continue Quest' : 'Begin Adventure'}</span>
            </button>
          )}
          
          {quest.isCompleted && (
            <button
              onClick={onStart}
              className="flex-1 py-4 px-6 rounded-lg font-medium bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>Review Quest</span>
            </button>
          )}
        </div>

        {/* Quest Lore */}
        <div className="mt-6 p-4 bg-student-primary/10 rounded-lg border border-student-primary/20">
          <p className="text-student-primary text-sm text-center">
            <strong>🗺️ Explorer's Wisdom:</strong> Every quest is a step on your path to mastery. 
            Embrace the challenge and let curiosity guide your journey!
          </p>
        </div>
      </div>
    </div>
  );
};