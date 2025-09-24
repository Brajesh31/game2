import { useState, useEffect } from 'react';
import { ContentService } from '../services/ContentService';
import { useCurrentClass } from './useCurrentClass';
import { useAuth } from './useAuth';

export const useContentLoader = (subject?: string) => {
  const { user } = useAuth();
  const { currentClass } = useCurrentClass();
  const [content, setContent] = useState<any>({ books: [], quests: [], quizzes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      if (!subject || !user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const contentData = await ContentService.getContentForCurrentUser(user.id, subject);
        setContent(contentData);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content');
        setContent({ books: [], quests: [], quizzes: [] });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [subject, currentClass, user?.id]);

  // Listen for database updates
  useEffect(() => {
    const handleDatabaseUpdate = () => {
      if (subject && user?.id) {
        ContentService.getContentForCurrentUser(user.id, subject)
          .then(setContent)
          .catch(console.error);
      }
    };

    const handleClassChange = () => {
      if (subject && user?.id) {
        // Clear cache and reload content when class changes
        ContentService.clearCache();
        ContentService.getContentForCurrentUser(user.id, subject)
          .then(setContent)
          .catch(console.error);
      }
    };

    window.addEventListener('databaseUpdated', handleDatabaseUpdate);
    window.addEventListener('classChanged', handleClassChange);
    
    return () => {
      window.removeEventListener('databaseUpdated', handleDatabaseUpdate);
      window.removeEventListener('classChanged', handleClassChange);
    };
  }, [subject, user?.id]);

  return { content, loading, error };
};