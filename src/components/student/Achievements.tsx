import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useToast } from '../ToastContainer';
import { LocalStorageService } from '../../services/LocalStorageService';
import { Student, Achievement } from '../../types';
import { Trophy, Star, Award, Target, Flame, Calculator, Shield, Crown } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { userData } = useAuth();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const student = userData as Student | null;
  const studentId = student?.user?.id || 'student-001';

  // Get achievements from Local Storage
  const studentProgress = LocalStorageService.getStudentProgress(studentId);
  const earnedAchievements = studentProgress?.achievements || [];

  React.useEffect(() => {
    // Listen for class changes to update achievement context
    const handleClassChange = () => {
      // Achievements are stored per student, not per class, so just refresh the component
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  const [forceUpdate, setForceUpdate] = useState(0);

  if (!student || !student.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading achievements...</p>
        </div>
      </div>
    );
  }

  // All possible achievements (earned + unearned)
  const allAchievements = [
    ...earnedAchievements,
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete 5 quests in under 10 minutes each',
      icon: 'flame',
      unlockedAt: '',
      earned: false
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Achieve 100% accuracy on 20 consecutive challenges',
      icon: 'star',
      unlockedAt: '',
      earned: false
    },
    {
      id: 'team-player',
      title: 'Team Player',
      description: 'Help 10 classmates with their assignments',
      icon: 'shield',
      unlockedAt: '',
      earned: false
    },
    {
      id: 'knowledge-seeker',
      title: 'Knowledge Seeker',
      description: 'Complete quests in 5 different subjects',
      icon: 'target',
      unlockedAt: '',
      earned: false
    },
    {
      id: 'grand-master',
      title: 'Grand Master',
      description: 'Reach level 50 and master all core skills',
      icon: 'crown',
      unlockedAt: '',
      earned: false
    }
  ];

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'calculator': return Calculator;
      case 'flame': return Flame;
      case 'star': return Star;
      case 'shield': return Shield;
      case 'target': return Target;
      case 'crown': return Crown;
      default: return Award;
    }
  };

  const handleVerifyBlockchain = (achievement: Achievement) => {
    if (achievement.mockBlockchainHash) {
      showToast({
        type: 'success',
        title: 'Blockchain Verified!',
        message: `Achievement "${achievement.title}" verified on blockchain`,
        duration: 3000
      });
    } else {
      showToast({
        type: 'info',
        title: 'Verification Pending',
        message: 'This achievement is being processed for blockchain verification',
        duration: 3000
      });
    }
  };

  const earnedCount = earnedAchievements.length;
  const totalCount = allAchievements.length;

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🏆 Achievement Gallery</h1>
        <p className="text-xl text-student-text-secondary mb-6">
          Your trophy room showcasing all accomplishments for {classInfo?.displayName || 'Class 6'}
        </p>
        
        {/* Progress Stats */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-student-accent">{earnedCount}</div>
            <div className="text-student-text-secondary">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{totalCount}</div>
            <div className="text-student-text-secondary">Total</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-student-primary">{Math.round((earnedCount / totalCount) * 100)}%</div>
            <div className="text-student-text-secondary">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 mx-auto mt-4">
          <div className="student-progress-bar-enhanced h-6">
            <div 
              className="student-progress-fill-enhanced h-6"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allAchievements.map((achievement) => {
          const IconComponent = getAchievementIcon(achievement.icon);
          const isEarned = earnedAchievements.some(a => a.id === achievement.id);
          
          return (
            <div 
              key={achievement.id} 
              className={`student-card shadow-student-card hover:shadow-student-hover p-6 text-center cursor-pointer transition-all duration-200 animate-student-slide-up student-hover-lift ${
                isEarned 
                  ? 'student-achievement-glow hover:student-achievement-glow-hover hover:scale-110 bg-gradient-to-br from-student-secondary/10 to-student-accent/10 border border-student-secondary/30' 
                  : 'opacity-50 hover:opacity-75 grayscale hover:grayscale-0 hover:scale-105'
              }`}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isEarned 
                  ? 'bg-gradient-to-br from-student-secondary to-student-accent text-white shadow-student-card student-achievement-glow' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                <IconComponent className="w-8 h-8" />
              </div>
              
              <h3 className={`font-bold mb-2 ${isEarned ? 'text-student-text' : 'text-gray-500'}`}>
                {achievement.title}
              </h3>
              
              <p className={`text-sm ${isEarned ? 'text-student-text-secondary' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
              
              {isEarned && achievement.earnedAt && (
                <div className="mt-3 text-xs text-student-accent font-medium">
                  Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              )}
              
              {!isEarned && (
                <div className="mt-3 text-xs text-gray-400 font-medium">
                  Not yet earned
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      <Modal 
        isOpen={!!selectedAchievement} 
        onClose={() => setSelectedAchievement(null)} 
        title="Achievement Details"
        size="lg"
      >
        {selectedAchievement && (
          <div className="space-y-6">
            <div className="text-center">
              {(() => {
                const IconComponent = getAchievementIcon(selectedAchievement.icon);
                const isEarned = earnedAchievements.some(a => a.id === selectedAchievement.id);
                
                return (
                  <>
                    <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isEarned 
                        ? 'bg-gradient-to-br from-student-secondary to-student-accent text-white shadow-student-hover student-achievement-glow animate-student-bounce-in' 
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      <IconComponent className="w-16 h-16" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-student-text mb-4">{selectedAchievement.title}</h2>
                    <p className="text-lg text-student-text-secondary mb-6">{selectedAchievement.description}</p>
                    
                    {isEarned ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center px-6 py-3 bg-student-accent text-white rounded-full font-medium shadow-student-card student-achievement-glow">
                          <Trophy className="w-5 h-5 mr-2" />
                          Achievement Unlocked!
                        </div>
                        
                        {selectedAchievement.earnedAt && (
                          <p className="text-student-text-secondary">
                            Earned on {new Date(selectedAchievement.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                        
                        <div className="flex justify-center space-x-4">
                          <Button
                            className="btn-student-primary student-click-bounce"
                            onClick={() => handleVerifyBlockchain(selectedAchievement)}
                          >
                            🔗 Verify on Blockchain
                          </Button>
                          <Button variant="outline" className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
                            📤 Share Achievement
                          </Button>
                        </div>
                        
                        {selectedAchievement.mockBlockchainHash && (
                          <div className="mt-4 p-4 bg-student-primary/10 rounded-lg shadow-student-card">
                            <p className="text-sm text-student-primary font-medium mb-2">Blockchain Transaction ID:</p>
                            <code className="text-xs text-student-primary break-all">
                              {selectedAchievement.mockBlockchainHash}
                            </code>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-medium shadow-student-card">
                          <Target className="w-5 h-5 mr-2" />
                          Not Yet Earned
                        </div>
                        
                        <p className="text-student-text-secondary">
                          Keep learning and completing quests to unlock this achievement!
                        </p>
                        
                        <Button variant="outline" disabled className="border-gray-300 text-gray-500">
                          🔒 Locked
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};