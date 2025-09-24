// Cache Manager Utility for clearing application caches
export class CacheManager {
  private static readonly CACHE_KEYS = [
    'content_cache_',
    'quest_cache_',
    'student_theme_cache',
    'button_interactions',
    'last_content_sync',
    'theme_preferences',
    'ui_state_cache',
    'performance_cache',
    'analytics_cache'
  ];

  // Clear all application caches
  static clearAllCaches(): void {
    console.log('🧹 Clearing application caches...');
    
    // Clear localStorage caches
    this.clearLocalStorageCaches();
    
    // Clear sessionStorage caches
    this.clearSessionStorageCaches();
    
    // Clear browser caches if possible
    this.clearBrowserCaches();
    
    console.log('✅ Cache clearing completed');
  }

  // Clear localStorage caches
  static clearLocalStorageCaches(): void {
    const keys = Object.keys(localStorage);
    let clearedCount = 0;
    
    keys.forEach(key => {
      // Check if key matches any cache pattern
      const shouldClear = this.CACHE_KEYS.some(cacheKey => key.startsWith(cacheKey));
      
      if (shouldClear) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    console.log(`🗑️ Cleared ${clearedCount} localStorage cache entries`);
  }

  // Clear sessionStorage caches
  static clearSessionStorageCaches(): void {
    const keys = Object.keys(sessionStorage);
    let clearedCount = 0;
    
    keys.forEach(key => {
      const shouldClear = this.CACHE_KEYS.some(cacheKey => key.startsWith(cacheKey));
      
      if (shouldClear) {
        sessionStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    console.log(`🗑️ Cleared ${clearedCount} sessionStorage cache entries`);
  }

  // Clear browser caches (limited by browser security)
  static clearBrowserCaches(): void {
    try {
      // Clear any cached images or resources
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            if (cacheName.includes('cache') || cacheName.includes('temp')) {
              caches.delete(cacheName);
            }
          });
        });
      }
    } catch (error) {
      console.warn('Browser cache clearing limited by security policies');
    }
  }

  // Clear specific cache type
  static clearCacheType(cacheType: string): void {
    const keys = Object.keys(localStorage);
    let clearedCount = 0;
    
    keys.forEach(key => {
      if (key.startsWith(cacheType)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    console.log(`🗑️ Cleared ${clearedCount} ${cacheType} cache entries`);
  }

  // Get cache size information
  static getCacheInfo(): {
    localStorageSize: number;
    sessionStorageSize: number;
    cacheEntries: number;
  } {
    let localStorageSize = 0;
    let sessionStorageSize = 0;
    let cacheEntries = 0;

    // Calculate localStorage size
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key) || '';
      localStorageSize += key.length + value.length;
      
      if (this.CACHE_KEYS.some(cacheKey => key.startsWith(cacheKey))) {
        cacheEntries++;
      }
    });

    // Calculate sessionStorage size
    Object.keys(sessionStorage).forEach(key => {
      const value = sessionStorage.getItem(key) || '';
      sessionStorageSize += key.length + value.length;
    });

    return {
      localStorageSize: Math.round(localStorageSize / 1024), // KB
      sessionStorageSize: Math.round(sessionStorageSize / 1024), // KB
      cacheEntries
    };
  }

  // Preserve important data while clearing caches
  static smartCacheClear(): void {
    console.log('🧠 Performing smart cache clear...');
    
    // Preserve important user data
    const importantData = {
      auth: localStorage.getItem('learnquest-auth'),
      theme: localStorage.getItem('learnquest-theme'),
      studentProgress: localStorage.getItem('stem_spark_student_progress'),
      userSettings: localStorage.getItem('student_settings')
    };

    // Clear all caches
    this.clearAllCaches();

    // Restore important data
    Object.entries(importantData).forEach(([key, value]) => {
      if (value) {
        const storageKey = key === 'auth' ? 'learnquest-auth' :
                          key === 'theme' ? 'learnquest-theme' :
                          key === 'studentProgress' ? 'stem_spark_student_progress' :
                          'student_settings';
        localStorage.setItem(storageKey, value);
      }
    });

    console.log('✅ Smart cache clear completed - important data preserved');
  }

  // Schedule automatic cache clearing
  static scheduleAutoCacheClear(intervalHours: number = 24): void {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    setInterval(() => {
      console.log('⏰ Automatic cache clearing triggered');
      this.clearLocalStorageCaches();
    }, intervalMs);
    
    console.log(`📅 Automatic cache clearing scheduled every ${intervalHours} hours`);
  }
}

// Export for easy access
export const {
  clearAllCaches,
  clearLocalStorageCaches,
  clearSessionStorageCaches,
  clearCacheType,
  getCacheInfo,
  smartCacheClear,
  scheduleAutoCacheClear
} = CacheManager;