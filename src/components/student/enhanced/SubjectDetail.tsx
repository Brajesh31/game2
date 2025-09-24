import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveButton } from '../ResponsiveButton';
import { BookReader } from '../BookReader';
import { QuestProgressEngine } from '../QuestProgressEngine';
import { QuizEngine } from '../QuizEngine';
import { Modal } from '../../ui/Modal';
import { useAuth } from '../../../hooks/useAuth';
import { useCurrentClass } from '../../../hooks/useCurrentClass';
import { ContentService } from '../../../services/ContentService';
import { useToast } from '../../ToastContainer';
import { BookOpen, Target, Trophy, ArrowLeft, Play, CheckCircle } from 'lucide-react';

export const EnhancedSubjectDetail: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentClass, classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [content, setContent] = useState<any>({ books: [], quests: [], quizzes: [] });
  const [loading, setLoading] = useState(true);
  const [showBookReader, setShowBookReader] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedQuestId, setSelectedQuestId] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');

  const studentId = user?.id || 'student-001';

  useEffect(() => {
    const loadContent = async () => {
      if (!subject) return;
      
      setLoading(true);
      try {
        const subjectContent = await ContentService.getContent(currentClass, subject);
        setContent(subjectContent);
      } catch (error) {
        console.error('Error loading subject content:', error);
        setContent({ books: [], quests: [], quizzes: [] });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
    
    // Listen for class changes
    const handleClassChange = () => {
      ContentService.clearCache();
      loadContent();
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, [currentClass, subject]);

  const getSubjectDisplayName = (subjectName: string) => {
    switch (subjectName?.toLowerCase()) {
      case 'math':
        return 'Mathematics';
      case 'social_studies':
        return 'Social Studies';
      case 'business_studies':
        return 'Business Studies';
      case 'political_science':
        return 'Political Science';
      default:
        return subjectName?.charAt(0).toUpperCase() + subjectName?.slice(1) || '';
    }
  };

  const handleReadBook = (bookId: string) => {
    // Validate book availability
    const book = content.books.find((b: any) => b.id === bookId);
    if (!book) {
      showToast({
        type: 'error',
        title: 'Book Not Found',
        message: 'The selected book is not available.',
        duration: 3000
      });
      return;
    }
    
    console.log('Opening book reader for:', bookId);
    setSelectedBookId(bookId);
    setShowBookReader(true);
  };

  const handleStartQuest = (questId: string) => {
    // Validate quest availability
    const quest = content.quests.find((q: any) => q.id === questId);
    if (!quest) {
      showToast({
        type: 'error',
        title: 'Quest Not Found',
        message: 'The selected quest is not available.',
        duration: 3000
      });
      return;
    }
    
    console.log('Starting quest from subject detail:', questId);
    setSelectedQuestId(questId);
    setShowQuestModal(true);
  };

  const handleTakeQuiz = (quizId: string) => {
    // Validate quiz availability
    const quiz = content.quizzes.find((q: any) => q.id === quizId);
    if (!quiz) {
      showToast({
        type: 'error',
        title: 'Quiz Not Found',
        message: 'The selected quiz is not available.',
        duration: 3000
      });
      return;
    }
    
    console.log('Starting quiz from subject detail:', quizId);
    setSelectedQuizId(quizId);
    setShowQuizModal(true);
  };

  const handleQuestComplete = (questId: string, xpEarned: number) => {
    setShowQuestModal(false);
    setSelectedQuestId('');
    
    showToast({
      type: 'success',
      title: 'Quest Completed!',
      message: `You earned ${xpEarned} XP! Great work!`,
      duration: 3000
    });
  };

  const handleQuizComplete = (quizId: string, score: number, passed: boolean) => {
    setShowQuizModal(false);
    setSelectedQuizId('');
    
    showToast({
      type: passed ? 'success' : 'warning',
      title: passed ? 'Quiz Passed!' : 'Quiz Completed',
      message: passed 
        ? `Excellent! You scored ${score}% and earned XP!`
        : `You scored ${score}%. Review the material and try again!`,
      duration: 3000
    });
  };

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <ResponsiveButton 
          variant="outline" 
          icon={ArrowLeft}
          onClick={() => navigate('/student/subjects')}
          size="md"
        >
          <span className="hidden sm:inline">Back to Subjects</span>
          <span className="sm:hidden">Back</span>
        </ResponsiveButton>
        
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold student-text-gradient">
            {getSubjectDisplayName(subject)}
          </h1>
          <p className="text-lg md:text-xl text-student-text-secondary">
            All learning materials for {classInfo?.displayName || 'Class 6'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading {getSubjectDisplayName(subject)} content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Books Section */}
          <div className="student-card p-4 md:p-6 animate-student-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-student-primary flex items-center justify-center shadow-student-card">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-student-text">📚 Books & Chapters</h2>
            </div>
            
            {content.books.length > 0 ? (
              <div className="space-y-4">
                {content.books.map((book: any) => (
                  <div key={book.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200">
                    <h3 className="font-bold text-student-text mb-2">{book.title}</h3>
                    <p className="text-student-text-secondary text-sm mb-3">{book.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Chapters:</span>
                        <span className="text-student-text">{book.chapters?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Est. Hours:</span>
                        <span className="text-student-text">{book.estimatedHours || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          book.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          book.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {book.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <ResponsiveButton
                      onClick={() => handleReadBook(book.id)}
                      variant="outline"
                      size="sm"
                      fullWidth
                      icon={BookOpen}
                    >
                      Read Book
                    </ResponsiveButton>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 mx-auto text-student-text-muted mb-3" />
                <p className="text-student-text-secondary">No books available for this subject yet</p>
              </div>
            )}
          </div>

          {/* Quests Section */}
          <div className="student-card p-4 md:p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-student-secondary flex items-center justify-center shadow-student-card">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-student-text">🎯 Learning Quests</h2>
            </div>
            
            {content.quests.length > 0 ? (
              <div className="space-y-4">
                {content.quests.map((quest: any) => (
                  <div key={quest.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200">
                    <h3 className="font-bold text-student-text mb-2">{quest.title}</h3>
                    <p className="text-student-text-secondary text-sm mb-3">{quest.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">XP Reward:</span>
                        <span className="font-bold text-student-accent">+{quest.xpReward} XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Est. Time:</span>
                        <span className="text-student-text">{quest.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          quest.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <ResponsiveButton
                      onClick={() => handleStartQuest(quest.id)}
                      variant="secondary"
                      size="sm"
                      fullWidth
                      icon={Play}
                    >
                      Start Quest
                    </ResponsiveButton>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-10 h-10 md:w-12 md:h-12 mx-auto text-student-text-muted mb-3" />
                <p className="text-student-text-secondary">No quests available for this subject yet</p>
              </div>
            )}
          </div>

          {/* Quizzes Section */}
          <div className="student-card p-4 md:p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-student-accent flex items-center justify-center shadow-student-card">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-student-text">📝 Practice Quizzes</h2>
            </div>
            
            {content.quizzes.length > 0 ? (
              <div className="space-y-4">
                {content.quizzes.map((quiz: any) => (
                  <div key={quiz.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200">
                    <h3 className="font-bold text-student-text mb-2">{quiz.title}</h3>
                    <p className="text-student-text-secondary text-sm mb-3">{quiz.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Questions:</span>
                        <span className="text-student-text">{quiz.questions?.length || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">Time Limit:</span>
                        <span className="text-student-text">{Math.floor((quiz.timeLimit || 0) / 60)} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-student-text-secondary">XP Reward:</span>
                        <span className="font-bold text-student-accent">+{quiz.rewards?.xp || 0} XP</span>
                      </div>
                    </div>
                    
                    <ResponsiveButton
                      onClick={() => handleTakeQuiz(quiz.id)}
                      variant="accent"
                      size="sm"
                      fullWidth
                      icon={Trophy}
                    >
                      Take Quiz
                    </ResponsiveButton>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-10 h-10 md:w-12 md:h-12 mx-auto text-student-text-muted mb-3" />
                <p className="text-student-text-secondary">No quizzes available for this subject yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subject Summary */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-student-text mb-4">
            📊 {getSubjectDisplayName(subject)} Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-student-primary">{content.books.length}</div>
              <div className="text-student-text-secondary">Available Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-student-secondary">{content.quests.length}</div>
              <div className="text-student-text-secondary">Learning Quests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-student-accent">{content.quizzes.length}</div>
              <div className="text-student-text-secondary">Practice Quizzes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Reader Modal */}
      <Modal 
        isOpen={showBookReader} 
        onClose={() => setShowBookReader(false)} 
        title="Book Reader"
        size="xl"
      >
        {selectedBookId && (
          <BookReader
            bookId={selectedBookId}
            subject={subject}
            onClose={() => setShowBookReader(false)}
          />
        )}
      </Modal>

      {/* Quest Progress Modal */}
      <Modal 
        isOpen={showQuestModal} 
        onClose={() => setShowQuestModal(false)} 
        title="Quest in Progress"
        size="xl"
      >
        {selectedQuestId && (
          <QuestProgressEngine
            questId={selectedQuestId}
            onComplete={handleQuestComplete}
            onExit={() => setShowQuestModal(false)}
          />
        )}
      </Modal>

      {/* Quiz Engine Modal */}
      <Modal 
        isOpen={showQuizModal} 
        onClose={() => setShowQuizModal(false)} 
        title="Quiz in Progress"
        size="xl"
      >
        {selectedQuizId && (
          <QuizEngine
            quizId={selectedQuizId}
            subject={subject}
            onComplete={handleQuizComplete}
            onExit={() => setShowQuizModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};