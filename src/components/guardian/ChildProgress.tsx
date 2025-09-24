import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useGlobalState } from '../../hooks/useGlobalState';
import { Guardian } from '../../types';
import { CheckCircle, AlertCircle, Lightbulb, BookOpen, Calculator, Atom, Microscope } from 'lucide-react';

export const ChildProgress: React.FC = () => {
  const { userData } = useAuth();
  const { classInfo } = useCurrentClass();
  const { state } = useGlobalState();
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  
  const guardian = userData as Guardian;

  if (!guardian || !guardian.user) {
    return <div>Loading...</div>;
  }

  const currentChild = guardian.childrenProgress[selectedChildIndex];
  
  // Get teacher's feedback from student status
  const getTeacherFeedback = () => {
    const studentId = currentChild?.id;
    if (!studentId) return null;
    
    const student = state.users[studentId];
    if (!student) return null;
    
    const status = student.status;
    
    switch (status) {
      case 'On Track':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-50',
          message: `Teacher says: ${currentChild.name} is doing great!`,
          emoji: '✅'
        };
      case 'Needs Help':
        return {
          icon: Lightbulb,
          color: 'text-yellow-600 bg-yellow-50',
          message: `Teacher's Note: Extra practice would be helpful for ${currentChild.name}.`,
          emoji: '💡'
        };
      case 'Struggling':
        return {
          icon: AlertCircle,
          color: 'text-orange-600 bg-orange-50',
          message: `Teacher recommends: Let's work together to help ${currentChild.name} catch up.`,
          emoji: '🤝'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-blue-600 bg-blue-50',
          message: `${currentChild.name} is making steady progress!`,
          emoji: '📚'
        };
    }
  };

  const teacherFeedback = getTeacherFeedback();

  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'mathematics':
      case 'math':
        return Calculator;
      case 'physics':
        return Atom;
      case 'chemistry':
        return Microscope;
      case 'biology':
      case 'science':
        return Microscope;
      default:
        return BookOpen;
    }
  };

  const overallProgress = currentChild?.subjects.reduce((sum, subject) => sum + subject.progress, 0) / currentChild?.subjects.length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-guardian-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guardian-text mb-4">
          {currentChild?.name}'s Learning Journey
        </h1>
        <p className="text-2xl text-guardian-text-secondary">
          Track progress and celebrate growth in {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Child Selector - Only show if multiple children */}
      {guardian.childrenProgress.length > 1 && (
        <div className="guardian-card p-6 animate-guardian-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-guardian-text mb-4 text-center">Select Your Child</h2>
          <div className="flex justify-center space-x-4">
            {guardian.childrenProgress.map((child, index) => (
              <Button
                key={child.id}
                className={selectedChildIndex === index ? 'btn-guardian-primary' : 'border-guardian-primary text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary'}
                size="lg"
                onClick={() => setSelectedChildIndex(index)}
              >
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Overall Progress - Large, visual gauge */}
      <div className="guardian-card p-8 animate-guardian-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold text-guardian-text mb-8 text-center">Overall Progress</h2>
        
        <div className="text-center">
          {/* Progress Ring Visual */}
          <div className="relative w-48 h-48 mx-auto mb-6 guardian-progress-ring">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="var(--color-guardian-bg-tertiary)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#guardianGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${overallProgress * 2.51} 251`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="guardianGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-guardian-primary)" />
                  <stop offset="100%" stopColor="var(--color-guardian-secondary)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Percentage in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-guardian-text">
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-lg text-guardian-text-secondary">Complete</div>
              </div>
            </div>
          </div>
          
          <p className="text-2xl text-guardian-text-secondary">
            {currentChild?.name} has completed {Math.round(overallProgress)}% of their learning goals
          </p>
        </div>
      </div>

      {/* Teacher's Feedback - Prominent interconnectivity feature */}
      {teacherFeedback && (
        <div className={`guardian-card p-8 border-2 border-guardian-secondary animate-guardian-slide-up ${
          teacherFeedback.color.includes('green') ? 'guardian-card-warm' : 
          teacherFeedback.color.includes('yellow') ? 'guardian-card-attention' : 
          'guardian-card-warm'
        }`} style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold text-guardian-text mb-6 text-center">Teacher's Update</h2>
          
          <div className="p-6 rounded-xl bg-guardian-background-tertiary border-l-4 border-guardian-secondary shadow-guardian-card">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl mr-4">{teacherFeedback.emoji}</div>
              <teacherFeedback.icon className="w-12 h-12 text-guardian-secondary" />
            </div>
            <p className="text-2xl font-bold text-center text-guardian-text">
              {teacherFeedback.message}
            </p>
          </div>
        </div>
      )}

      {/* Progress by Subject - Simple horizontal bars */}
      <div className="guardian-card p-8 animate-guardian-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-bold text-guardian-text mb-8 text-center">Progress by Subject</h2>
        
        <div className="space-y-6">
          {currentChild?.subjects.map((subject) => {
            const IconComponent = getSubjectIcon(subject.name);
            
            // Assign colors based on subject
            const getSubjectProgressClass = (subjectName: string) => {
              switch (subjectName.toLowerCase()) {
                case 'mathematics':
                case 'math':
                  return 'guardian-progress-math';
                case 'science':
                case 'physics':
                case 'chemistry':
                case 'biology':
                  return 'guardian-progress-science';
                case 'english':
                case 'language':
                  return 'guardian-progress-language';
                default:
                  return 'guardian-progress-default';
              }
            };
            
            return (
              <div key={subject.name} className="p-6 bg-guardian-background-secondary rounded-xl shadow-guardian-card hover:shadow-guardian-hover transition-all duration-300">
                <div className="flex items-center mb-4">
                  <IconComponent className="w-8 h-8 text-guardian-primary mr-4" />
                  <h3 className="text-2xl font-bold text-guardian-text">{subject.name}</h3>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-guardian-background-tertiary rounded-full h-6 shadow-guardian-card">
                      <div 
                        className={`${getSubjectProgressClass(subject.name)} h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2 shadow-guardian-card`}
                        style={{ width: `${subject.progress}%` }}
                      >
                        <span className="text-white font-bold text-sm">
                          {subject.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-guardian-text w-16 text-right">
                    {subject.progress}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encouragement Section */}
      <div className="guardian-card p-8 bg-gradient-to-r from-guardian-background-tertiary to-guardian-background-secondary animate-guardian-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-guardian-text mb-4">Keep Going!</h2>
          <p className="text-xl text-guardian-text-secondary mb-6">
            {currentChild?.name} is making wonderful progress. Every step forward is an achievement!
          </p>
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-lg text-guardian-text-secondary">
            Remember: Learning is a journey, not a race. Celebrate every milestone!
          </p>
        </div>
      </div>
    </div>
  );
};