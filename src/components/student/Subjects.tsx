import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import {
  Calculator,
  Atom,
  Microscope,
  BookOpen,
  Globe,
  Palette,
  Music,
  Dumbbell,
  Trophy,
  Target,
} from 'lucide-react';

export const Subjects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentClass, classInfo } = useCurrentClass();
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  const studentId = user?.id || 'student-001';

  // Listen for class changes and force update
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  useEffect(() => {
    // Load available subjects when class changes
    const loadSubjects = () => {
      setLoading(true);
      try {
        const subjects = ContentService.getAvailableSubjects(currentClass);
        setAvailableSubjects(subjects);
      } catch (error) {
        console.error('Error loading subjects:', error);
        setAvailableSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
    
    // Listen for class changes
    const handleClassChange = () => {
      ContentService.clearCache();
      loadSubjects();
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, [currentClass, forceUpdate]);

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'math':
      case 'mathematics':
        return Calculator;
      case 'physics':
        return Atom;
      case 'chemistry':
        return Microscope;
      case 'biology':
      case 'science':
        return Microscope;
      case 'english':
        return BookOpen;
      case 'hindi':
      case 'language':
        return BookOpen;
      case 'social_studies':
      case 'history':
      case 'geography':
      case 'political_science':
        return Globe;
      case 'economics':
      case 'business_studies':
      case 'accountancy':
        return Calculator;
      case 'art':
        return Palette;
      case 'music':
        return Music;
      case 'physical_education':
        return Dumbbell;
      default:
        return BookOpen;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'math':
      case 'mathematics':
        return 'from-blue-500 to-indigo-600';
      case 'physics':
        return 'from-purple-500 to-violet-600';
      case 'chemistry':
        return 'from-green-500 to-emerald-600';
      case 'biology':
      case 'science':
        return 'from-teal-500 to-cyan-600';
      case 'english':
        return 'from-orange-500 to-red-600';
      case 'hindi':
        return 'from-yellow-500 to-amber-600';
      case 'social_studies':
      case 'history':
      case 'geography':
      case 'political_science':
        return 'from-pink-500 to-rose-600';
      case 'economics':
      case 'business_studies':
      case 'accountancy':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getSubjectDisplayName = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'math':
        return 'Mathematics';
      case 'social_studies':
        return 'Social Studies';
      case 'business_studies':
        return 'Business Studies';
      case 'political_science':
        return 'Political Science';
      case 'physical_education':
        return 'Physical Education';
      default:
        return subject.charAt(0).toUpperCase() + subject.slice(1);
    }
  };

  const handleSubjectClick = (subject: string) => {
    navigate(`/student/subjects/${subject}`);
  };

  const getSubjectProgress = (subject: string) => {
    // Mock progress data - in real app would come from localStorage
    const progressData: Record<string, number> = {
      math: 78,
      science: 65,
      english: 71,
      hindi: 82,
      social_studies: 69,
      physics: 73,
      chemistry: 67,
      biology: 75,
    };
    return progressData[subject] || 0;
  };
  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">
          📚 My Subjects
        </h1>
        <p className="text-xl text-student-text-secondary">
          Explore all your learning materials organized by subject
        </p>

        {/* Current Class Display */}
        <div 
          className="mt-4 inline-flex items-center px-6 py-3 rounded-full font-semibold shadow-student-card"
          style={{
            background: 'var(--student-primary, #4F46E5)',
            color: 'var(--student-header-text, #FFFFFF)'
          }}
        >
          <span className="text-lg">
            Current Class: {classInfo?.displayName || 'Class 6'}
          </span>
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading subjects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableSubjects.map((subject, index) => {
            const IconComponent = getSubjectIcon(subject);
            const colorClass = getSubjectColor(subject);
            const displayName = getSubjectDisplayName(subject);
            const progress = getSubjectProgress(subject);

            return (
              <div
                key={subject}
                className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleSubjectClick(subject)}
              >
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 hover:scale-110`}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl font-bold text-student-text mb-3 text-center">
                  {displayName}
                </h3>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-student-text-secondary">
                      Progress
                    </span>
                    <span className="font-bold text-student-text">
                      {progress}%
                    </span>
                  </div>
                  <div className="student-progress-bar-enhanced h-3">
                    <div
                      className="student-progress-fill-enhanced h-3"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <div className="text-sm text-student-text-secondary">
                    📖 Books • 🎯 Quests • 📝 Quizzes
                  </div>

                  <Button
                    className="w-full btn-student-primary student-click-bounce mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubjectClick(subject);
                    }}
                  >
                    Explore {displayName}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div
        className="student-card p-8 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20 animate-student-slide-up"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">
            📖 How to Use Subjects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-primary flex items-center justify-center shadow-student-card">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">
                📚 Books & Chapters
              </h3>
              <p className="text-student-text-secondary text-sm">
                Read textbooks and study materials organized by chapters
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-secondary flex items-center justify-center shadow-student-card">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">
                🎯 Subject Quests
              </h3>
              <p className="text-student-text-secondary text-sm">
                Complete interactive learning adventures for each subject
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-accent flex items-center justify-center shadow-student-card">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">
                📝 Practice Quizzes
              </h3>
              <p className="text-student-text-secondary text-sm">
                Test your knowledge with subject-specific quizzes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
