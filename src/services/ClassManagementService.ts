// Class Management Service for handling class changes across all panels
export interface ClassInfo {
  id: string;
  name: string;
  displayName: string;
  stream?: string;
}

export class ClassManagementService {
  private static readonly STORAGE_KEY = 'stem_spark_current_class';
  private static readonly USER_CLASS_KEY = 'stem_spark_user_classes';

  // Available classes with proper display names
  private static readonly AVAILABLE_CLASSES: ClassInfo[] = [
    { id: 'class_6', name: 'Class 6', displayName: 'Class 6' },
    { id: 'class_7', name: 'Class 7', displayName: 'Class 7' },
    { id: 'class_8', name: 'Class 8', displayName: 'Class 8' },
    { id: 'class_9', name: 'Class 9', displayName: 'Class 9' },
    { id: 'class_10', name: 'Class 10', displayName: 'Class 10' },
    { id: 'class_11_science', name: 'Class 11 Science', displayName: 'Class 11 (Science)', stream: 'science' },
    { id: 'class_11_commerce', name: 'Class 11 Commerce', displayName: 'Class 11 (Commerce)', stream: 'commerce' },
    { id: 'class_11_humanities', name: 'Class 11 Humanities', displayName: 'Class 11 (Humanities)', stream: 'humanities' },
    { id: 'class_12_pcm', name: 'Class 12 PCM', displayName: 'Class 12 (PCM)', stream: 'science' },
    { id: 'class_12_pcb', name: 'Class 12 PCB', displayName: 'Class 12 (PCB)', stream: 'science' },
    { id: 'class_12_commerce', name: 'Class 12 Commerce', displayName: 'Class 12 (Commerce)', stream: 'commerce' },
    { id: 'class_12_humanities', name: 'Class 12 Humanities', displayName: 'Class 12 (Humanities)', stream: 'humanities' }
  ];

  // Get all available classes
  static getAvailableClasses(): ClassInfo[] {
    return this.AVAILABLE_CLASSES;
  }

  // Get current class for a user
  static getCurrentClass(userId: string): string {
    const userClasses = this.getUserClasses();
    return userClasses[userId] || 'class_6';
  }

  // Set current class for a user
  static setCurrentClass(userId: string, classId: string): void {
    const userClasses = this.getUserClasses();
    userClasses[userId] = classId;
    localStorage.setItem(this.USER_CLASS_KEY, JSON.stringify(userClasses));
    
    // Also set global current class
    localStorage.setItem(this.STORAGE_KEY, classId);
    
    // Trigger class change event
    this.triggerClassChangeEvent(classId);
  }

  // Get user classes mapping
  private static getUserClasses(): Record<string, string> {
    const stored = localStorage.getItem(this.USER_CLASS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // Get class info by ID
  static getClassInfo(classId: string): ClassInfo | null {
    return this.AVAILABLE_CLASSES.find(cls => cls.id === classId) || null;
  }

  // Get classes by stream
  static getClassesByStream(stream: string): ClassInfo[] {
    return this.AVAILABLE_CLASSES.filter(cls => 
      !cls.stream || cls.stream === stream || 
      (stream === 'general' && !cls.stream)
    );
  }

  // Trigger class change event for components to listen
  private static triggerClassChangeEvent(classId: string): void {
    const event = new CustomEvent('classChanged', { 
      detail: { classId, classInfo: this.getClassInfo(classId) } 
    });
    window.dispatchEvent(event);
    
    // Also clear any cached data that might be class-specific
    this.clearRelatedCaches();
    
    // Force components to re-render by updating localStorage timestamp
    localStorage.setItem('last_class_change', Date.now().toString());
  }

  // Listen for class changes
  static onClassChange(callback: (classId: string, classInfo: ClassInfo | null) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail.classId, event.detail.classInfo);
    };
    
    window.addEventListener('classChanged', handler as EventListener);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('classChanged', handler as EventListener);
    };
  }

  // Sync class across all panels (for admin/teacher changes)
  static syncClassAcrossPanels(userId: string, classId: string): void {
    this.setCurrentClass(userId, classId);
    
    // Update any cached data
    this.clearRelatedCaches();
  }

  // Clear related caches when class changes
  private static clearRelatedCaches(): void {
    // Clear content service cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('content_cache_') || key.startsWith('quest_cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get default class for new users
  static getDefaultClass(): string {
    return 'class_6';
  }

  // Validate if class exists
  static isValidClass(classId: string): boolean {
    return this.AVAILABLE_CLASSES.some(cls => cls.id === classId);
  }
}