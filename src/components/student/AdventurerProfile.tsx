import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { LocalStorageService } from '../../services/LocalStorageService';
import { User, Trophy, Star, Target, Edit, Share, Camera } from 'lucide-react';

export const AdventurerProfile: React.FC = () => {
  const { user } = useAuth();
  const { classInfo } = useCurrentClass();
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "Passionate learner exploring the wonders of science and mathematics!",
    favoriteSubjects: ['Mathematics', 'Physics'],
    learningGoals: "Master calculus and quantum physics",
    motto: "Every problem is an opportunity to learn!"
  });
  const [forceUpdate, setForceUpdate] = useState(0);

  const studentId = user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  // Listen for class changes
  React.useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  const topAchievements = studentProgress?.achievements.slice(0, 6) || [];
  const portfolioItems = studentProgress?.portfolioItems.slice(0, 4) || [];

  const stats = {
    level: studentProgress?.level || 1,
    totalXP: studentProgress?.totalXP || 0,
    questsCompleted: studentProgress?.completedQuests.length || 0,
    achievementsEarned: studentProgress?.achievements.length || 0,
    streakDays: studentProgress?.streakCount || 0,
    arLabsCompleted: studentProgress?.arLabsCompleted.length || 0
  };

  const handleSaveProfile = () => {
    // Save profile data to localStorage
    localStorage.setItem('student_profile', JSON.stringify(profileData));
    setShowEditModal(false);
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🎭 Adventurer Profile</h1>
        <p className="text-xl text-student-text-secondary">Showcase your learning journey and achievements</p>
      </div>

      {/* Profile Header Card */}
      <div className="student-card p-8 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20 animate-student-slide-up">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-student-primary to-student-secondary flex items-center justify-center shadow-student-hover student-achievement-glow">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.name} 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-student-accent rounded-full flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 hover:scale-110">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-student-text mb-2">{user?.name}</h2>
            <p className="text-lg text-student-primary font-medium mb-2">{classInfo?.displayName || 'Class 6'} Student</p>
            <p className="text-xl text-student-text-secondary mb-4">{profileData.bio}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {profileData.favoriteSubjects.map((subject) => (
                <span key={subject} className="px-3 py-1 bg-student-primary text-white rounded-full text-sm font-medium shadow-student-card">
                  {subject}
                </span>
              ))}
            </div>

            <div className="flex justify-center md:justify-start space-x-4">
              <Button 
                icon={Edit}
                onClick={() => setShowEditModal(true)}
                className="btn-student-primary student-click-bounce"
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                icon={Share}
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-3xl font-bold text-student-primary mb-2">{stats.level}</div>
          <div className="text-student-text-secondary">Level</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-3xl font-bold text-student-accent mb-2">{stats.totalXP.toLocaleString()}</div>
          <div className="text-student-text-secondary">Total XP</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-3xl font-bold text-student-secondary mb-2">{stats.questsCompleted}</div>
          <div className="text-student-text-secondary">Quests</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-3xl font-bold text-student-primary mb-2">{stats.achievementsEarned}</div>
          <div className="text-student-text-secondary">Achievements</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-3xl font-bold text-student-accent mb-2">{stats.streakDays}</div>
          <div className="text-student-text-secondary">Day Streak</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-3xl font-bold text-student-secondary mb-2">{stats.arLabsCompleted}</div>
          <div className="text-student-text-secondary">AR Labs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Achievements Showcase */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold text-student-text mb-6">🏆 Achievement Showcase</h2>
          
          {topAchievements.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {topAchievements.map((achievement) => (
                <div key={achievement.id} className="p-4 bg-gradient-to-br from-student-secondary/10 to-student-accent/10 rounded-lg border border-student-secondary/30 text-center student-achievement-glow hover:student-achievement-glow-hover transition-all duration-200 hover:scale-105">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center shadow-student-card">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-student-text text-sm mb-1">{achievement.title}</h3>
                  <p className="text-xs text-student-text-secondary">{new Date(achievement.earnedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 mx-auto text-student-text-muted mb-4" />
              <p className="text-student-text-secondary">Complete quests to earn achievements!</p>
            </div>
          )}
        </div>

        {/* Portfolio Preview */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-2xl font-bold text-student-text mb-6">🎨 Portfolio Preview</h2>
          
          {portfolioItems.length > 0 ? (
            <div className="space-y-4">
              {portfolioItems.map((item) => (
                <div key={item.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200 student-hover-lift">
                  <h3 className="font-bold text-student-text mb-1">{item.title}</h3>
                  <p className="text-student-text-secondary text-sm mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.type === 'project' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'artwork' ? 'bg-purple-100 text-purple-800' :
                      item.type === 'writing' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-student-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-16 h-16 mx-auto text-student-text-muted mb-4" />
              <p className="text-student-text-secondary">Create projects to build your portfolio!</p>
            </div>
          )}
        </div>
      </div>

      {/* Learning Goals */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.9s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🎯 My Learning Goals</h2>
          <p className="text-xl text-student-text-secondary mb-4">"{profileData.learningGoals}"</p>
          <p className="text-lg text-student-primary font-medium">💭 "{profileData.motto}"</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Edit Your Adventurer Profile"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="input-student w-full h-24 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Learning Goals</label>
            <input
              type="text"
              value={profileData.learningGoals}
              onChange={(e) => setProfileData({ ...profileData, learningGoals: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Personal Motto</label>
            <input
              type="text"
              value={profileData.motto}
              onChange={(e) => setProfileData({ ...profileData, motto: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Your inspiring motto..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile}
              className="btn-student-primary student-click-bounce"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};