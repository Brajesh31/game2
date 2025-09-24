// Content Service for managing dynamic curriculum data
import { ClassManagementService } from './ClassManagementService';

export interface ContentStructure {
  books: any[];
  quests: any[];
  quizzes: any[];
}

export class ContentService {
  private static contentCache: Map<string, ContentStructure> = new Map();
  
  // Dynamic content loading based on class and subject
  private static async loadContentFile(classLevel: string, subject: string, contentType: 'books' | 'quests' | 'quizzes'): Promise<any[]> {
    try {
      const path = `../../backend/database/content/classes/${classLevel}/subjects/${subject}/${contentType}.json`;
      const module = await import(path);
      return module[contentType] || module.default?.[contentType] || [];
    } catch (error) {
      console.warn(`Content file not found: ${classLevel}/${subject}/${contentType}.json`);
      return [];
    }
  }
  
  // Define available content structure to map class levels to subjects
  private static readonly AVAILABLE_CONTENT_STRUCTURE: Record<string, string[]> = {
    'class_6': ['math', 'science', 'english', 'hindi', 'social_studies'],
    'class_7': ['math', 'science', 'english', 'hindi', 'social_studies'],
    'class_8': ['math', 'science', 'english', 'hindi', 'social_studies'],
    'class_9': ['math', 'science', 'english', 'hindi', 'social_studies'],
    'class_10': ['math', 'science', 'english', 'hindi', 'social_studies'],
    'class_11_science': ['math', 'physics', 'chemistry', 'biology', 'english'],
    'class_11_commerce': ['accountancy', 'business_studies', 'economics', 'english'],
    'class_11_humanities': ['history', 'geography', 'political_science', 'english'],
    'class_12_pcm': ['math', 'physics', 'chemistry'],
    'class_12_pcb': ['physics', 'chemistry', 'biology'],
    'class_12_commerce': ['accountancy', 'business_studies', 'economics'],
    'class_12_humanities': ['history', 'geography', 'political_science']
  };

  static async getContent(classLevel: string, subject: string): Promise<ContentStructure> {
    const cacheKey = `${classLevel}_${subject}`;
    
    // Return cached content if available
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey)!;
    }

    const content: ContentStructure = { books: [], quests: [], quizzes: [] };

    try {
      // Load books, quests, and quizzes using dynamic imports
      content.books = await this.loadContentFile(classLevel, subject, 'books');
      content.quests = await this.loadContentFile(classLevel, subject, 'quests');
      content.quizzes = await this.loadContentFile(classLevel, subject, 'quizzes');

      // Cache the content
      this.contentCache.set(cacheKey, content);
      
    } catch (error) {
      console.error(`Error loading content for ${classLevel}/${subject}:`, error);
    }

    return content;
  }

  static async getAllQuests(classLevel: string): Promise<any[]> {
    const subjects = this.AVAILABLE_CONTENT_STRUCTURE[classLevel] || [];
    const allQuests: any[] = [];

    for (const subject of subjects) {
      try {
        const content = await this.getContent(classLevel, subject);
        allQuests.push(...content.quests);
      } catch (error) {
        console.warn(`Failed to load quests for ${classLevel}/${subject}`);
      }
    }

    return allQuests;
  }

  static async getQuestById(questId: string, classLevel: string = 'class_6'): Promise<any> {
    const allQuests = await this.getAllQuests(classLevel);
    return allQuests.find(quest => quest.id === questId);
  }

  static getAvailableClasses(): string[] {
    return Object.keys(this.AVAILABLE_CONTENT_STRUCTURE);
  }

  static getAvailableSubjects(classLevel: string): string[] {
    return this.AVAILABLE_CONTENT_STRUCTURE[classLevel] || [];
  }

  // Clear cache when class changes
  static clearCache(): void {
    this.contentCache.clear();
    
    // Use CacheManager for more efficient clearing
    import('../utils/cacheManager').then(({ CacheManager }) => {
      CacheManager.clearCacheType('content_cache_');
      CacheManager.clearCacheType('quest_cache_');
    });
  }

  // Get content with automatic class detection
  static async getContentForCurrentUser(userId: string, subject: string): Promise<ContentStructure> {
    const currentClass = ClassManagementService.getCurrentClass(userId);
    return this.getContent(currentClass, subject);
  }

  // Get all quests for current user's class
  static async getAllQuestsForCurrentUser(userId: string): Promise<any[]> {
    const currentClass = ClassManagementService.getCurrentClass(userId);
    return this.getAllQuests(currentClass);
  }
}