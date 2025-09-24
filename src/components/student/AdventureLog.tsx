import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { LocalStorageService } from '../../services/LocalStorageService';
import { BookOpen, Trophy, Target, Star, Clock, Filter } from 'lucide-react';

export const AdventureLog: React.FC = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'quests' | 'achievements' | 'projects'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
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

  // Generate activity log from student progress
  const generateActivityLog = () => {
    const activities: any[] = [];

    // Add achievements
    studentProgress?.achievements.forEach((achievement) => {
      activities.push({
        id: `achievement_${achievement.id}`,
        type: 'achievement',
        title: `Earned "${achievement.title}" Achievement`,
        description: achievement.description,
        timestamp: achievement.earnedAt,
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        xp: 100
      });
    });

    // Add completed quests
    studentProgress?.completedQuests.forEach((questId) => {
      const questProgress = studentProgress.questProgress[questId];
      activities.push({
        id: `quest_${questId}`,
        type: 'quest',
        title: `Completed Quest: ${questId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        description: 'Successfully completed all quest objectives',
        timestamp: questProgress?.lastActivity || new Date().toISOString(),
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        xp: 150
      });
    });

    // Add portfolio items
    studentProgress?.portfolioItems.forEach((item) => {
      activities.push({
        id: `portfolio_${item.id}`,
        type: 'project',
        title: `Created: ${item.title}`,
        description: item.description,
        timestamp: item.createdAt,
        icon: Star,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        xp: 75
      });
    });

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const allActivities = generateActivityLog();

  const filteredActivities = allActivities.filter((activity) => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    
    if (timeFilter !== 'all') {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      
      switch (timeFilter) {
        case 'today':
          return activityDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return activityDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return activityDate >= monthAgo;
      }
    }
    
    return true;
  });

  const getActivityStats = () => {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: allActivities.length,
      today: allActivities.filter(a => new Date(a.timestamp).toDateString() === today).length,
      thisWeek: allActivities.filter(a => new Date(a.timestamp) >= weekAgo).length,
      totalXP: allActivities.reduce((sum, a) => sum + (a.xp || 0), 0)
    };
  };

  const stats = getActivityStats();

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">📖 Adventure Log</h1>
        <p className="text-xl text-student-text-secondary">Your complete learning journey timeline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <BookOpen className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{stats.total}</div>
          <div className="text-student-text-secondary">Total Activities</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Clock className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">{stats.today}</div>
          <div className="text-student-text-secondary">Today</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Target className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">{stats.thisWeek}</div>
          <div className="text-student-text-secondary">This Week</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{stats.totalXP}</div>
          <div className="text-student-text-secondary">XP Earned</div>
        </div>
      </div>

      {/* Filters */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-student-primary" />
            <span className="font-medium text-student-text">Filter Activities:</span>
            
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'quests', label: 'Quests' },
                { key: 'achievements', label: 'Achievements' },
                { key: 'projects', label: 'Projects' }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={filterType === filter.key ? 'primary' : 'outline'}
                  className={filterType === filter.key ? 'btn-student-primary' : 'border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary'}
                  size="sm"
                  onClick={() => setFilterType(filter.key as any)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Time' },
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={timeFilter === filter.key ? 'secondary' : 'ghost'}
                className={timeFilter === filter.key ? 'btn-student-secondary' : 'text-student-secondary hover:bg-student-secondary hover:text-student-on-primary'}
                size="sm"
                onClick={() => setTimeFilter(filter.key as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-bold text-student-text mb-6">📅 Activity Timeline</h2>
        
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              
              return (
                <div key={activity.id} className={`p-4 rounded-lg border-l-4 ${activity.bgColor} border-l-student-primary shadow-student-card hover:shadow-student-hover transition-all duration-200 student-hover-lift`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-student-card`}>
                      <IconComponent className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-student-text">{activity.title}</h3>
                        <div className="flex items-center space-x-2">
                          {activity.xp && (
                            <span className="px-2 py-1 bg-student-accent text-white rounded-full text-xs font-bold">
                              +{activity.xp} XP
                            </span>
                          )}
                          <span className="text-sm text-student-text-secondary">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-student-text-secondary">{activity.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-student-text-muted mb-4" />
            <p className="text-student-text-secondary">No activities found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};