import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { LocalStorageService } from '../../services/LocalStorageService';
import { BookOpen, Star, Trophy, Lightbulb, Target, Users } from 'lucide-react';

const WisdomBank: React.FC = () => {
  const { user } = useAuth();
  const { classInfo } = useCurrentClass();
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const wisdomCategories = [
    { key: 'all', label: 'All Knowledge', icon: BookOpen },
    { key: 'achievements', label: 'Achievements', icon: Trophy },
    { key: 'insights', label: 'Learning Insights', icon: Lightbulb },
    { key: 'goals', label: 'Goals & Targets', icon: Target },
    { key: 'community', label: 'Community Wisdom', icon: Users }
  ];

  const wisdomItems = [
    {
      id: 'knowledge-points',
      title: 'Knowledge Points',
      description: 'Collect wisdom points as you learn and grow through your educational journey.',
      category: 'insights',
      points: studentProgress?.totalXP || 0,
      icon: Star,
      color: 'from-student-primary to-student-secondary'
    },
    {
      id: 'achievement-collection',
      title: 'Achievement Collection',
      description: 'Unlock badges and certificates that showcase your learning milestones.',
      category: 'achievements',
      points: studentProgress?.achievements.length || 0,
      icon: Trophy,
      color: 'from-student-accent to-green-600'
    },
    {
      id: 'learning-resources',
      title: 'Learning Resources',
      description: 'Access curated content and study materials tailored to your learning path.',
      category: 'insights',
      points: studentProgress?.completedQuests.length || 0,
      icon: BookOpen,
      color: 'from-student-secondary to-orange-600'
    },
    {
      id: 'community-contributions',
      title: 'Community Contributions',
      description: 'Share knowledge and help fellow learners in your educational community.',
      category: 'community',
      points: 5,
      icon: Users,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? wisdomItems 
    : wisdomItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🏛️ Wisdom Bank</h1>
        <p className="text-xl text-student-text-secondary">
          Your repository of knowledge, achievements, and learning insights for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <BookOpen className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{studentProgress?.totalXP || 0}</div>
          <div className="text-student-text-secondary">Wisdom Points</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Trophy className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">{studentProgress?.achievements.length || 0}</div>
          <div className="text-student-text-secondary">Achievements</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Target className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">{studentProgress?.completedQuests.length || 0}</div>
          <div className="text-student-text-secondary">Quests Completed</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{studentProgress?.level || 1}</div>
          <div className="text-student-text-secondary">Current Level</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {wisdomCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 student-hover-lift ${
                  selectedCategory === category.key
                    ? 'student-tab-active shadow-student-card'
                    : 'text-student-text-secondary hover:text-student-text hover:bg-student-background hover:shadow-student-card'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wisdom Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <div 
              key={item.id} 
              className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 hover:scale-110`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-student-text mb-3 text-center">{item.title}</h3>
              <p className="text-student-text-secondary text-center mb-4">{item.description}</p>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-student-primary">{item.points}</div>
                <div className="text-student-text-secondary">Points Collected</div>
              </div>
              
              <Button 
                className="w-full btn-student-primary student-click-bounce"
                onClick={() => {
                  // Handle wisdom item interaction
                }}
              >
                Explore {item.title}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Wisdom Summary */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">💡 Your Learning Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-student-text mb-2">Knowledge Collection</h3>
              <p className="text-student-text-secondary text-sm">Gather wisdom from every quest and challenge you complete</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-student-text mb-2">Achievement Tracking</h3>
              <p className="text-student-text-secondary text-sm">Monitor your progress and celebrate every milestone</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-student-text mb-2">Community Sharing</h3>
              <p className="text-student-text-secondary text-sm">Share insights and learn from your peers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisdomBank;