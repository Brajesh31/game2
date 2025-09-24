import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'essay' | 'numerical';
  question: string;
  options?: string[];
  correct_answer: string;
  points: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number; // in seconds
  questions: QuizQuestion[];
  passing_score: number;
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
}

interface QuizEngineProps {
  quizId: string;
  subject: string;
  onComplete: (quizId: string, score: number, passed: boolean) => void;
  onExit: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quizId,
  subject,
  onComplete,
  onExit
}) => {
  const { user } = useAuth();
  const { currentClass } = useCurrentClass();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const studentId = user?.id || 'student-001';

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const content = await ContentService.getContent(currentClass, subject);
        const quizData = content.quizzes.find((q: any) => q.id === quizId);
        
        if (quizData) {
          setQuiz(quizData);
          setTimeRemaining(quizData.timeLimit);
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, subject, currentClass]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeRemaining]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quiz?.timeLimit || 600);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (!quiz) return;

    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'next' && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitQuiz = () => {
    if (!quiz) return;

    setQuizCompleted(true);
    
    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    quiz.questions.forEach(question => {
      maxScore += question.points;
      if (answers[question.id] === question.correct_answer) {
        totalScore += question.points;
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= quiz.passing_score;
    
    setScore(percentage);
    setShowResults(true);

    // Save quiz completion
    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress) {
      progress.totalXP += passed ? quiz.rewards.xp : Math.floor(quiz.rewards.xp * 0.5);
      
      // Award badges if passed
      if (passed) {
        quiz.rewards.badges.forEach(badge => {
          LocalStorageService.awardAchievement(studentId, {
            id: `quiz_${quiz.id}`,
            title: badge,
            description: `Passed ${quiz.title} with ${percentage}% score`,
            icon: 'trophy'
          });
        });
      }
      
      LocalStorageService.saveStudentProgress(progress);
    }

    onComplete(quiz.id, percentage, passed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-8">
        <p className="text-student-text-secondary">Quiz not found.</p>
      </div>
    );
  }

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="student-card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-student-primary to-student-accent flex items-center justify-center shadow-student-card">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-student-text mb-4">{quiz.title}</h1>
          <p className="text-lg text-student-text-secondary mb-6">{quiz.description}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-student-primary">{quiz.questions.length}</div>
              <div className="text-student-text-secondary">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-student-accent">{formatTime(quiz.timeLimit)}</div>
              <div className="text-student-text-secondary">Time Limit</div>
            </div>
          </div>

          <div className="bg-student-primary/10 p-4 rounded-lg mb-6">
            <p className="text-student-primary">
              <strong>Passing Score:</strong> {quiz.passing_score}% | 
              <strong> Reward:</strong> {quiz.rewards.xp} XP
            </p>
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-3 px-6 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const passed = score >= quiz.passing_score;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`student-card p-8 text-center border-2 ${
          passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
        }`}>
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {passed ? (
              <CheckCircle className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-4 ${
            passed ? 'text-green-800' : 'text-red-800'
          }`}>
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          
          <div className="text-6xl font-bold mb-4 text-student-text">{score}%</div>
          
          <p className={`text-lg mb-6 ${
            passed ? 'text-green-700' : 'text-red-700'
          }`}>
            {passed 
              ? `You passed with flying colors! You've earned ${quiz.rewards.xp} XP.`
              : `You need ${quiz.passing_score}% to pass. Review the material and try again!`
            }
          </p>

          {passed && quiz.rewards.badges.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-student-text mb-3">🏆 Badges Earned:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {quiz.rewards.badges.map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-student-accent text-white rounded-full text-sm font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={onExit}
              className="py-3 px-6 rounded-lg font-medium btn-student-primary student-click-bounce"
            >
              Continue Learning
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setQuizCompleted(false);
                  setShowResults(false);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                }}
                className="py-3 px-6 rounded-lg font-medium border border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="student-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-student-text">{quiz.title}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-student-accent">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-student-text-secondary">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{answeredQuestions} answered</span>
        </div>
        
        <div className="student-progress-bar-enhanced h-2 mt-2">
          <div 
            className="student-progress-fill-enhanced h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question */}
      <div className="student-card p-6">
        <h3 className="text-lg font-semibold text-student-text mb-6">
          {currentQuestion.question}
        </h3>

        {currentQuestion.type === 'multiple_choice' && (
          <div className="space-y-3 mb-6">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(currentQuestion.id, option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion.id] === option 
                    ? 'border-student-primary bg-student-primary/10 text-student-primary' 
                    : 'border-border hover:border-student-primary/50 hover:bg-student-background'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'essay' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
            className="input-student w-full h-32 mb-6 focus:ring-student-secondary focus:border-student-secondary"
            placeholder="Write your answer here..."
          />
        )}

        {currentQuestion.type === 'numerical' && (
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
            className="input-student w-full mb-6 focus:ring-student-secondary focus:border-student-secondary"
            placeholder="Enter your numerical answer"
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigateQuestion('prev')}
            disabled={currentQuestionIndex === 0}
            className="py-2 px-4 rounded-lg border border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={answeredQuestions < quiz.questions.length}
              className="py-2 px-6 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => navigateQuestion('next')}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
              className="py-2 px-4 rounded-lg border border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <div className="student-card p-4">
        <h4 className="font-semibold text-student-text mb-3">Question Overview</h4>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                index === currentQuestionIndex
                  ? 'bg-student-primary text-white'
                  : answers[quiz.questions[index].id]
                  ? 'bg-student-accent text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center">
        <button
          onClick={onExit}
          className="text-student-text-secondary hover:text-student-text transition-colors duration-200"
        >
          Exit Quiz
        </button>
      </div>
    </div>
  );
};