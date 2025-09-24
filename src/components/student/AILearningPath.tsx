import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { LocalStorageService } from '../../services/LocalStorageService';
import { AdaptiveLearningService } from '../../services/AdaptiveLearningService';
import { Brain, Target, TrendingUp, Lightbulb, Star, CheckCircle } from 'lucide-react';

export const AILearningPath: React.FC = () => {
  const { user } = useAuth();
  const { currentClass, classInfo } = useCurrentClass();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const studentId = user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  // Listen for class changes
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const recs = await AdaptiveLearningService.getPersonalizedRecommendations(studentId, currentClass);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setRecommendations({
          recommendedQuests: [],
          skillsToImprove: [],
          strengths: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [studentId, currentClass, forceUpdate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-student-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">AI is analyzing your learning pattern...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🧠 AI Learning Path</h1>
        <p className="text-xl text-student-text-secondary">
          Personalized recommendations powered by artificial intelligence for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* AI Analysis Summary */}
      <div className="student-card p-8 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20 animate-student-slide-up">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-student-primary to-student-secondary flex items-center justify-center shadow-student-hover student-achievement-glow">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-student-text mb-4">AI Analysis Complete</h2>
          <p className="text-xl text-student-text-secondary">
            Based on your learning patterns, here's your personalized path forward
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Quests */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-student-primary flex items-center justify-center shadow-student-card">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-student-text">🎯 Recommended Quests</h2>
          </div>
          
          {recommendations?.recommendedQuests.length > 0 ? (
            <div className="space-y-4">
              {recommendations.recommendedQuests.slice(0, 3).map((questId: string) => (
                <div key={questId} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200 student-hover-lift">
                  <h3 className="font-bold text-student-text mb-2">
                    {questId.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h3>
                  <p className="text-student-text-secondary text-sm mb-3">
                    AI recommends this quest based on your learning progress
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full btn-student-primary student-click-bounce"
                  >
                    Start Quest
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-student-text-muted mb-3" />
              <p className="text-student-text-secondary">Complete more quests to get AI recommendations</p>
            </div>
          )}
        </div>

        {/* Skills to Improve */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-student-secondary flex items-center justify-center shadow-student-card">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-student-text">📈 Focus Areas</h2>
          </div>
          
          {recommendations?.skillsToImprove.length > 0 ? (
            <div className="space-y-3">
              {recommendations.skillsToImprove.map((skill: string) => (
                <div key={skill} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800 capitalize">
                      {skill.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    AI suggests focusing on this area for improvement
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
              <p className="text-student-text-secondary">Great job! No specific areas need improvement</p>
            </div>
          )}
        </div>

        {/* Strengths */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-student-accent flex items-center justify-center shadow-student-card">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-student-text">⭐ Your Strengths</h2>
          </div>
          
          {recommendations?.strengths.length > 0 ? (
            <div className="space-y-3">
              {recommendations.strengths.map((strength: string) => (
                <div key={strength} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-600 fill-current" />
                    <span className="font-medium text-green-800 capitalize">
                      {strength.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You excel in this area! Keep up the great work.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto text-student-text-muted mb-3" />
              <p className="text-student-text-secondary">Complete more activities to identify your strengths</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Learning Insights */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🤖 AI Learning Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-student-text mb-2">Learning Pattern Analysis</h3>
              <p className="text-student-text-secondary text-sm">AI analyzes your progress to identify optimal learning times and methods</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-student-text mb-2">Adaptive Difficulty</h3>
              <p className="text-student-text-secondary text-sm">Content difficulty adjusts automatically based on your performance</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-student-text mb-2">Personalized Goals</h3>
              <p className="text-student-text-secondary text-sm">AI sets achievable goals that challenge you at the right level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};