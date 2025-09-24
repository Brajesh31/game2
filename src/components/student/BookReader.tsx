import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { ChevronLeft, ChevronRight, BookOpen, Bookmark, Search } from 'lucide-react';

interface BookChapter {
  id: string;
  title: string;
  topics: string[];
  content?: string;
}

interface Book {
  id: string;
  title: string;
  description: string;
  chapters: BookChapter[];
  difficulty: string;
  estimatedHours: number;
}

interface BookReaderProps {
  bookId: string;
  subject: string;
  onClose: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  bookId,
  subject,
  onClose
}) => {
  const { user } = useAuth();
  const { currentClass } = useCurrentClass();
  const [book, setBook] = useState<Book | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const studentId = user?.id || 'student-001';

  useEffect(() => {
    const loadBook = async () => {
      try {
        const content = await ContentService.getContent(currentClass, subject);
        const bookData = content.books.find((b: any) => b.id === bookId);
        
        if (bookData) {
          // Add mock content for demonstration
          const enhancedBook = {
            ...bookData,
            chapters: bookData.chapters.map((chapter: BookChapter, index: number) => ({
              ...chapter,
              content: generateMockContent(chapter, subject, index)
            }))
          };
          setBook(enhancedBook);
        }
      } catch (error) {
        console.error('Error loading book:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem(`bookmarks_${bookId}`);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, [bookId, subject, currentClass]);

  const generateMockContent = (chapter: BookChapter, subject: string, index: number): string => {
    const subjectContent: Record<string, string[]> = {
      math: [
        "Mathematics is the language of the universe. In this chapter, we'll explore fundamental concepts that form the building blocks of mathematical thinking.",
        "Let's begin with understanding numbers and their properties. Numbers are everywhere around us - from counting objects to measuring distances.",
        "Practice is key to mastering mathematics. Work through the examples step by step and don't hesitate to ask questions."
      ],
      science: [
        "Science helps us understand the natural world through observation, experimentation, and logical reasoning.",
        "The scientific method is our tool for discovering truth about how things work in nature.",
        "Remember that every great scientist started as a curious student asking 'why' and 'how' questions."
      ],
      english: [
        "Language is a powerful tool for communication and expression. Through literature, we explore human experiences and emotions.",
        "Reading comprehension involves understanding not just what is written, but also what the author means to convey.",
        "Writing skills develop through practice. Start with simple sentences and gradually build complexity."
      ]
    };

    const content = subjectContent[subject] || subjectContent.science;
    return content[index % content.length] + "\n\n" + 
           chapter.topics.map(topic => `• ${topic}: This topic covers essential concepts that will help you understand the subject better.`).join('\n');
  };

  const toggleBookmark = () => {
    const chapterId = book?.chapters[currentChapterIndex]?.id;
    if (!chapterId) return;

    const newBookmarks = bookmarks.includes(chapterId)
      ? bookmarks.filter(id => id !== chapterId)
      : [...bookmarks, chapterId];
    
    setBookmarks(newBookmarks);
    localStorage.setItem(`bookmarks_${bookId}`, JSON.stringify(newBookmarks));
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!book) return;

    if (direction === 'prev' && currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    } else if (direction === 'next' && currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }

    // Track reading progress
    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress) {
      if (!progress.portfolioItems.some(item => item.id === `reading_${bookId}_${currentChapterIndex}`)) {
        progress.portfolioItems.push({
          id: `reading_${bookId}_${currentChapterIndex}`,
          title: `Read: ${book?.chapters[currentChapterIndex]?.title}`,
          description: `Completed reading chapter from ${book?.title}`,
          type: 'reading',
          createdAt: new Date().toISOString(),
          tags: [subject, 'reading'],
          content: `Chapter: ${book?.chapters[currentChapterIndex]?.title}`
        });
        LocalStorageService.saveStudentProgress(progress);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center p-8">
        <p className="text-student-text-secondary">Book not found.</p>
      </div>
    );
  }

  const currentChapter = book.chapters[currentChapterIndex];
  const isBookmarked = currentChapter && bookmarks.includes(currentChapter.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Book Header */}
      <div className="student-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-student-text">{book.title}</h1>
            <p className="text-student-text-secondary">{book.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-student-text-secondary hover:text-student-text transition-colors duration-200"
          >
            ✕ Close
          </button>
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateChapter('prev')}
            disabled={currentChapterIndex === 0}
            className="flex items-center py-2 px-4 rounded-lg border border-student-primary text-student-primary hover:bg-student-primary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-student-text">
              {currentChapter?.title}
            </h2>
            <p className="text-sm text-student-text-secondary">
              Chapter {currentChapterIndex + 1} of {book.chapters.length}
            </p>
          </div>

          <button
            onClick={() => navigateChapter('next')}
            disabled={currentChapterIndex === book.chapters.length - 1}
            className="flex items-center py-2 px-4 rounded-lg border border-student-primary text-student-primary hover:bg-student-primary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Reading Controls */}
      <div className="student-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleBookmark}
              className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-student-accent text-white' 
                  : 'border border-student-accent text-student-accent hover:bg-student-accent hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-student-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in book..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-student-primary focus:border-student-primary"
              />
            </div>
          </div>

          <div className="text-sm text-student-text-secondary">
            📖 Est. reading time: {Math.round(book.estimatedHours / book.chapters.length * 60)} min
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="student-card p-8">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-student-text mb-6">
            {currentChapter?.title}
          </h2>
          
          {/* Topics Overview */}
          <div className="bg-student-background-secondary p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-student-text mb-3">📚 Topics Covered:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentChapter?.topics.map((topic, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-student-primary rounded-full mr-2"></div>
                  <span className="text-student-text text-sm">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chapter Content */}
          <div className="text-student-text leading-relaxed whitespace-pre-line">
            {currentChapter?.content}
          </div>

          {/* Interactive Elements */}
          <div className="mt-8 p-6 bg-gradient-to-r from-student-primary/10 to-student-accent/10 rounded-lg border border-student-primary/20">
            <h4 className="font-semibold text-student-primary mb-3">🤔 Think About It:</h4>
            <p className="text-student-primary">
              How does this chapter relate to what you've learned before? 
              Can you think of real-world examples where these concepts apply?
            </p>
          </div>
        </div>
      </div>

      {/* Chapter Progress */}
      <div className="student-card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-student-text-secondary">Reading Progress</span>
          <span className="text-student-text">
            {Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100)}%
          </span>
        </div>
        <div className="student-progress-bar-enhanced h-3">
          <div 
            className="student-progress-fill-enhanced h-3 transition-all duration-500"
            style={{ width: `${((currentChapterIndex + 1) / book.chapters.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};