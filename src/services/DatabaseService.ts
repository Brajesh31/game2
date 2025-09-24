// Database Service for connecting frontend with backend database files
import { ClassManagementService } from './ClassManagementService';

export interface DatabaseUser {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  classLevel?: string;
  level?: number;
  xp?: number;
  status?: string;
  lastActive?: string;
  guardianId?: string;
  children?: string[];
  subjects?: string[];
  permissions?: string[];
}

export interface DatabaseMessage {
  id: string;
  fromId: string;
  toId: string;
  studentId?: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: string;
  priority?: string;
  attachments?: string[];
}

export interface DatabaseProgress {
  studentId: string;
  classLevel: string;
  currentLevel: number;
  totalXP: number;
  streakCount: number;
  lastActivityDate: string;
  completedQuests: string[];
  questProgress: Record<string, any>;
  subjectProgress: Record<string, any>;
  achievements: any[];
  arLabsCompleted: string[];
  portfolioItems: any[];
  tutorSessions: any[];
}

export class DatabaseService {
  private static userCache: Map<string, DatabaseUser> = new Map();
  private static messageCache: DatabaseMessage[] = [];
  private static progressCache: Map<string, DatabaseProgress> = new Map();

  // Load users from backend database
  static async loadUsers(): Promise<Record<string, DatabaseUser>> {
    try {
      const response = await import('../../backend/database/dynamic/users.json');
      const users = response.users || response.default?.users || {};
      
      // Cache users
      Object.values(users).forEach((user: any) => {
        this.userCache.set(user.id, user);
      });
      
      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  // Load messages from backend database
  static async loadMessages(): Promise<DatabaseMessage[]> {
    try {
      const response = await import('../../backend/database/dynamic/messages.json');
      const messages = response.messages || response.default?.messages || [];
      
      this.messageCache = messages;
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  // Load student progress from backend database
  static async loadStudentProgress(): Promise<Record<string, DatabaseProgress>> {
    try {
      const response = await import('../../backend/database/dynamic/progress.json');
      const progressData = response.studentProgress || response.default?.studentProgress || {};
      
      // Cache progress data
      Object.values(progressData).forEach((progress: any) => {
        this.progressCache.set(progress.studentId, progress);
      });
      
      return progressData;
    } catch (error) {
      console.error('Error loading student progress:', error);
      return {};
    }
  }

  // Get user by ID with class-aware data
  static async getUserById(userId: string): Promise<DatabaseUser | null> {
    if (this.userCache.has(userId)) {
      const user = this.userCache.get(userId)!;
      
      // Update class level if user is a student
      if (user.role === 'student') {
        const currentClass = ClassManagementService.getCurrentClass(userId);
        return { ...user, classLevel: currentClass };
      }
      
      return user;
    }

    // Load from database if not cached
    const users = await this.loadUsers();
    return users[userId] || null;
  }

  // Get messages for user with real-time updates
  static async getMessagesForUser(userId: string): Promise<DatabaseMessage[]> {
    if (this.messageCache.length === 0) {
      await this.loadMessages();
    }
    
    return this.messageCache.filter(message => 
      message.toId === userId || message.fromId === userId
    );
  }

  // Get student progress with class-aware data
  static async getStudentProgress(studentId: string): Promise<DatabaseProgress | null> {
    if (this.progressCache.has(studentId)) {
      const progress = this.progressCache.get(studentId)!;
      
      // Update class level
      const currentClass = ClassManagementService.getCurrentClass(studentId);
      return { ...progress, classLevel: currentClass };
    }

    // Load from database if not cached
    const progressData = await this.loadStudentProgress();
    return progressData[studentId] || null;
  }

  // Update user data
  static async updateUser(userId: string, updates: Partial<DatabaseUser>): Promise<void> {
    const user = await this.getUserById(userId);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.userCache.set(userId, updatedUser);
      
      // In a real app, this would sync to backend
      console.log('User updated:', updatedUser);
    }
  }

  // Add new message
  static async addMessage(message: Omit<DatabaseMessage, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const newMessage: DatabaseMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    this.messageCache.push(newMessage);
    
    // In a real app, this would sync to backend
    console.log('Message added:', newMessage);
  }

  // Update student progress
  static async updateStudentProgress(studentId: string, updates: Partial<DatabaseProgress>): Promise<void> {
    const progress = await this.getStudentProgress(studentId);
    if (progress) {
      const updatedProgress = { ...progress, ...updates };
      this.progressCache.set(studentId, updatedProgress);
      
      // In a real app, this would sync to backend
      console.log('Progress updated:', updatedProgress);
    }
  }

  // Get all students with class filtering
  static async getStudentsByClass(classLevel: string): Promise<DatabaseUser[]> {
    const users = await this.loadUsers();
    return Object.values(users).filter((user: any) => 
      user.role === 'student' && 
      (user.classLevel === classLevel || ClassManagementService.getCurrentClass(user.id) === classLevel)
    );
  }

  // Get analytics data
  static async getAnalyticsData(): Promise<any> {
    const users = await this.loadUsers();
    const messages = await this.loadMessages();
    const progressData = await this.loadStudentProgress();
    
    return {
      totalUsers: Object.keys(users).length,
      totalMessages: messages.length,
      totalStudents: Object.values(users).filter((u: any) => u.role === 'student').length,
      totalTeachers: Object.values(users).filter((u: any) => u.role === 'teacher').length,
      totalGuardians: Object.values(users).filter((u: any) => u.role === 'guardian').length,
      progressData: Object.values(progressData)
    };
  }

  // Clear all caches (useful when class changes)
  static clearCaches(): void {
    this.userCache.clear();
    this.messageCache = [];
    this.progressCache.clear();
  }

  // Sync data across panels
  static async syncDataAcrossPanels(): Promise<void> {
    // Reload all data to ensure consistency
    await Promise.all([
      this.loadUsers(),
      this.loadMessages(),
      this.loadStudentProgress()
    ]);
  }
}