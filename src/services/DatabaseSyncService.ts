// Database Sync Service for real-time data synchronization
import { DatabaseService } from './DatabaseService';
import { ClassManagementService } from './ClassManagementService';
import { ContentService } from './ContentService';

export class DatabaseSyncService {
  private static syncInterval: NodeJS.Timeout | null = null;
  private static isInitialized = false;

  // Initialize real-time sync
  static initialize(): void {
    if (this.isInitialized) return;

    // Listen for class changes and sync data
    ClassManagementService.onClassChange(async (classId) => {
      await this.syncClassRelatedData(classId);
    });

    // Set up periodic sync (every 30 seconds)
    this.syncInterval = setInterval(() => {
      this.performPeriodicSync();
    }, 30000);

    this.isInitialized = true;
  }

  // Sync data when class changes
  private static async syncClassRelatedData(classId: string): Promise<void> {
    try {
      // Clear content cache
      ContentService.clearCache();
      
      // Reload database data
      await DatabaseService.syncDataAcrossPanels();
      
      // Trigger UI updates
      this.triggerUIRefresh();
      
      console.log(`Data synced for class: ${classId}`);
    } catch (error) {
      console.error('Error syncing class-related data:', error);
    }
  }

  // Perform periodic sync
  private static async performPeriodicSync(): Promise<void> {
    try {
      // Check for updates in backend files
      await DatabaseService.syncDataAcrossPanels();
      
      // Update content cache if needed
      const lastSync = localStorage.getItem('last_content_sync');
      const now = Date.now();
      
      if (!lastSync || now - parseInt(lastSync) > 300000) { // 5 minutes
        ContentService.clearCache();
        localStorage.setItem('last_content_sync', now.toString());
      }
    } catch (error) {
      console.error('Error in periodic sync:', error);
    }
  }

  // Trigger UI refresh across all components
  private static triggerUIRefresh(): void {
    const event = new CustomEvent('databaseUpdated', { 
      detail: { timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
  }

  // Sync specific user data across panels
  static async syncUserAcrossPanels(userId: string, updates: any): Promise<void> {
    try {
      // Update in database service
      await DatabaseService.updateUser(userId, updates);
      
      // If it's a class change for a student, sync class management
      if (updates.classLevel && updates.role === 'student') {
        ClassManagementService.syncClassAcrossPanels(userId, updates.classLevel);
      }
      
      // Trigger UI refresh
      this.triggerUIRefresh();
    } catch (error) {
      console.error('Error syncing user across panels:', error);
    }
  }

  // Sync quest progress
  static async syncQuestProgress(studentId: string, questId: string, progress: any): Promise<void> {
    try {
      const studentProgress = await DatabaseService.getStudentProgress(studentId);
      if (studentProgress) {
        studentProgress.questProgress[questId] = progress;
        await DatabaseService.updateStudentProgress(studentId, studentProgress);
      }
      
      this.triggerUIRefresh();
    } catch (error) {
      console.error('Error syncing quest progress:', error);
    }
  }

  // Cleanup
  static cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isInitialized = false;
  }

  // Force full sync
  static async forceFullSync(): Promise<void> {
    try {
      // Clear all caches
      DatabaseService.clearCaches();
      ContentService.clearCache();
      
      // Use CacheManager for comprehensive cache clearing
      const { CacheManager } = await import('../utils/cacheManager');
      CacheManager.clearLocalStorageCaches();
      
      // Reload all data
      await DatabaseService.syncDataAcrossPanels();
      
      // Trigger UI refresh
      this.triggerUIRefresh();
      
      console.log('Full database sync completed');
    } catch (error) {
      console.error('Error in full sync:', error);
    }
  }
}