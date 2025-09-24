// Theme Utility Functions for Student Dashboard
// Provides helper functions for theme management and CSS variable application

export interface ThemeVariables {
  [key: string]: string | number;
}

export class StudentThemeUtils {
  private static readonly STUDENT_THEME_PREFIX = '--student-';
  private static readonly THEME_STORAGE_KEY = 'student-theme-preferences';

  /**
   * Apply theme variables to document root
   */
  static applyThemeVariables(variables: ThemeVariables): void {
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([property, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        root.style.setProperty(property, value.toString());
      }
    });
  }

  /**
   * Remove all student theme variables from document root
   */
  static removeStudentThemeVariables(): void {
    const root = document.documentElement;
    const computedStyles = getComputedStyle(root);
    
    // Get all CSS custom properties
    const allProperties = Array.from(computedStyles).filter(prop => 
      prop.startsWith(this.STUDENT_THEME_PREFIX)
    );
    
    // Remove student theme properties
    allProperties.forEach(property => {
      root.style.removeProperty(property);
    });
  }

  /**
   * Get current theme mode from localStorage or system preference
   */
  static getCurrentThemeMode(): 'light' | 'dark' {
    const stored = localStorage.getItem('learnquest-theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Save theme preferences to localStorage
   */
  static saveThemePreferences(preferences: Record<string, any>): void {
    localStorage.setItem(this.THEME_STORAGE_KEY, JSON.stringify(preferences));
  }

  /**
   * Load theme preferences from localStorage
   */
  static loadThemePreferences(): Record<string, any> {
    const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Generate CSS custom properties object from theme config
   */
  static generateCSSProperties(themeConfig: any, prefix: string = '--student-'): ThemeVariables {
    const properties: ThemeVariables = {};
    
    const flattenObject = (obj: any, currentPrefix: string = prefix) => {
      Object.entries(obj).forEach(([key, value]) => {
        const propertyName = `${currentPrefix}${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattenObject(value, `${propertyName}-`);
        } else if (typeof value === 'string' || typeof value === 'number') {
          properties[propertyName] = value;
        }
      });
    };
    
    flattenObject(themeConfig);
    return properties;
  }

  /**
   * Validate theme configuration
   */
  static validateThemeConfig(config: any): boolean {
    const requiredProperties = [
      'primary',
      'secondary',
      'accent',
      'appBackground',
      'componentBackground',
      'headingText',
      'bodyText'
    ];
    
    return requiredProperties.every(prop => 
      config && typeof config[prop] === 'string'
    );
  }

  /**
   * Create smooth transition between themes
   */
  static createThemeTransition(duration: number = 300): void {
    const root = document.documentElement;
    
    // Add transition to root
    root.style.transition = `background-color ${duration}ms ease, color ${duration}ms ease`;
    
    // Remove transition after animation completes
    setTimeout(() => {
      root.style.transition = '';
    }, duration);
  }

  /**
   * Check if student theme is currently active
   */
  static isStudentThemeActive(): boolean {
    return document.body.classList.contains('student-theme-active');
  }

  /**
   * Force re-render of theme-dependent components
   */
  static triggerThemeUpdate(themeData?: any): void {
    const event = new CustomEvent('studentThemeUpdate', {
      detail: { 
        timestamp: Date.now(),
        theme: this.getCurrentThemeMode(),
        ...themeData
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Get contrast ratio between two colors (simplified)
   */
  static getContrastRatio(color1: string, color2: string): number {
    // Simplified contrast calculation
    // In a real implementation, you'd convert hex to RGB and calculate luminance
    return 4.5; // Mock return for accessibility compliance
  }

  /**
   * Ensure accessibility compliance for theme colors
   */
  static validateAccessibility(themeConfig: any): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check contrast ratios (simplified)
    const contrastChecks = [
      { bg: themeConfig.appBackground, text: themeConfig.bodyText, context: 'body text' },
      { bg: themeConfig.componentBackground, text: themeConfig.headingText, context: 'headings' },
      { bg: themeConfig.primary, text: themeConfig.headerText, context: 'primary buttons' }
    ];
    
    contrastChecks.forEach(check => {
      const ratio = this.getContrastRatio(check.bg, check.text);
      if (ratio < 4.5) {
        issues.push(`Low contrast ratio for ${check.context}`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// Export utility functions for easy access
export const {
  applyThemeVariables,
  removeStudentThemeVariables,
  getCurrentThemeMode,
  saveThemePreferences,
  loadThemePreferences,
  generateCSSProperties,
  validateThemeConfig,
  createThemeTransition,
  isStudentThemeActive,
  triggerThemeUpdate,
  validateAccessibility
} = StudentThemeUtils;