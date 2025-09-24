// Button Utility Functions for Enhanced Functionality

export interface ButtonConfig {
  id: string;
  label: string;
  action: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  analytics?: {
    category: string;
    action: string;
    label?: string;
  };
}

export class ButtonUtils {
  // Track button interactions for analytics
  static trackButtonClick(buttonId: string, category: string, action: string, label?: string) {
    // In a real implementation, this would send to analytics service
    console.log('Button clicked:', { buttonId, category, action, label, timestamp: new Date().toISOString() });
    
    // Store in localStorage for demo purposes
    const interactions = JSON.parse(localStorage.getItem('button_interactions') || '[]');
    interactions.push({
      buttonId,
      category,
      action,
      label,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    localStorage.setItem('button_interactions', JSON.stringify(interactions));
  }

  // Validate button accessibility
  static validateAccessibility(buttonElement: HTMLButtonElement): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check minimum size
    const rect = buttonElement.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      issues.push('Button is smaller than minimum touch target (44px)');
    }
    
    // Check contrast
    const styles = window.getComputedStyle(buttonElement);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Simplified contrast check (in real app, would use proper contrast calculation)
    if (backgroundColor === color) {
      issues.push('Insufficient color contrast');
    }
    
    // Check for accessible label
    const hasLabel = buttonElement.textContent?.trim() || 
                   buttonElement.getAttribute('aria-label') ||
                   buttonElement.getAttribute('title');
    
    if (!hasLabel) {
      issues.push('Button lacks accessible label');
    }
    
    // Check for focus indicator
    if (!buttonElement.matches(':focus-visible')) {
      // This is a simplified check
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  // Generate responsive button classes
  static generateResponsiveClasses(
    variant: string = 'primary',
    size: string = 'md',
    fullWidth: boolean = false,
    disabled: boolean = false,
    loading: boolean = false
  ): string {
    const baseClasses = [
      'responsive-btn-base',
      `responsive-btn-${size}`,
      `btn-student-${variant}`,
      'student-click-bounce'
    ];

    if (fullWidth) {
      baseClasses.push('w-full');
    }

    if (disabled) {
      baseClasses.push('responsive-btn-disabled');
    }

    if (loading) {
      baseClasses.push('responsive-btn-loading');
    }

    return baseClasses.join(' ');
  }

  // Create button configuration for common actions
  static createQuestButtonConfig(
    questId: string,
    questTitle: string,
    status: 'available' | 'in-progress' | 'completed',
    onAction: (questId: string) => void
  ): ButtonConfig {
    const configs = {
      available: {
        label: 'Start Quest',
        variant: 'primary' as const,
        icon: 'Play'
      },
      'in-progress': {
        label: 'Continue Quest',
        variant: 'secondary' as const,
        icon: 'Play'
      },
      completed: {
        label: 'Completed!',
        variant: 'ghost' as const,
        icon: 'CheckCircle',
        disabled: true
      }
    };

    const config = configs[status];

    return {
      id: `quest_${questId}`,
      label: config.label,
      action: () => onAction(questId),
      variant: config.variant,
      size: 'md',
      disabled: config.disabled,
      analytics: {
        category: 'Quest',
        action: status === 'available' ? 'Start' : status === 'in-progress' ? 'Continue' : 'View',
        label: questTitle
      }
    };
  }

  // Create experiment button configuration
  static createExperimentButtonConfig(
    experimentId: string,
    experimentTitle: string,
    completed: boolean,
    onAction: (experimentId: string) => void
  ): ButtonConfig {
    return {
      id: `experiment_${experimentId}`,
      label: completed ? 'View Again' : 'Begin Experiment',
      action: () => onAction(experimentId),
      variant: completed ? 'accent' : 'primary',
      size: 'md',
      analytics: {
        category: 'Experiment',
        action: completed ? 'Review' : 'Start',
        label: experimentTitle
      }
    };
  }

  // Create navigation button configuration
  static createNavigationButtonConfig(
    path: string,
    label: string,
    icon: any,
    onNavigate: (path: string) => void
  ): ButtonConfig {
    return {
      id: `nav_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
      label,
      action: () => onNavigate(path),
      variant: 'outline',
      size: 'md',
      icon,
      analytics: {
        category: 'Navigation',
        action: 'Navigate',
        label: path
      }
    };
  }

  // Batch create button configurations
  static createButtonBatch(configs: Partial<ButtonConfig>[]): ButtonConfig[] {
    return configs.map((config, index) => ({
      id: config.id || `button_${index}`,
      label: config.label || 'Button',
      action: config.action || (() => {}),
      variant: config.variant || 'primary',
      size: config.size || 'md',
      ...config
    }));
  }

  // Get button analytics data
  static getButtonAnalytics(): any[] {
    return JSON.parse(localStorage.getItem('button_interactions') || '[]');
  }

  // Clear button analytics
  static clearButtonAnalytics(): void {
    localStorage.removeItem('button_interactions');
  }

  // Get most clicked buttons
  static getMostClickedButtons(limit: number = 10): Array<{
    buttonId: string;
    clickCount: number;
    lastClicked: string;
  }> {
    const interactions = this.getButtonAnalytics();
    const buttonCounts: Record<string, { count: number; lastClicked: string }> = {};

    interactions.forEach((interaction: any) => {
      if (!buttonCounts[interaction.buttonId]) {
        buttonCounts[interaction.buttonId] = { count: 0, lastClicked: interaction.timestamp };
      }
      buttonCounts[interaction.buttonId].count++;
      buttonCounts[interaction.buttonId].lastClicked = interaction.timestamp;
    });

    return Object.entries(buttonCounts)
      .map(([buttonId, data]) => ({
        buttonId,
        clickCount: data.count,
        lastClicked: data.lastClicked
      }))
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, limit);
  }

  // Validate button configuration
  static validateButtonConfig(config: ButtonConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.id) {
      errors.push('Button ID is required');
    }

    if (!config.label) {
      errors.push('Button label is required');
    }

    if (typeof config.action !== 'function') {
      errors.push('Button action must be a function');
    }

    const validVariants = ['primary', 'secondary', 'accent', 'outline', 'ghost'];
    if (config.variant && !validVariants.includes(config.variant)) {
      errors.push(`Invalid variant: ${config.variant}`);
    }

    const validSizes = ['sm', 'md', 'lg', 'xl'];
    if (config.size && !validSizes.includes(config.size)) {
      errors.push(`Invalid size: ${config.size}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create responsive button props
  static createResponsiveProps(
    config: ButtonConfig,
    additionalProps?: Record<string, any>
  ): Record<string, any> {
    return {
      onClick: () => {
        this.trackButtonClick(
          config.id,
          config.analytics?.category || 'General',
          config.analytics?.action || 'Click',
          config.analytics?.label
        );
        config.action();
      },
      variant: config.variant,
      size: config.size,
      icon: config.icon,
      disabled: config.disabled,
      loading: config.loading,
      title: config.tooltip,
      'aria-label': config.tooltip || config.label,
      ...additionalProps
    };
  }
}

// Utility function to create button with automatic analytics
export const createAnalyticsButton = (
  config: ButtonConfig,
  additionalProps?: Record<string, any>
) => {
  const validation = ButtonUtils.validateButtonConfig(config);
  
  if (!validation.isValid) {
    console.warn('Invalid button configuration:', validation.errors);
  }

  return ButtonUtils.createResponsiveProps(config, additionalProps);
};

// Responsive breakpoint utilities
export const ResponsiveBreakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  largeDesktop: '(min-width: 1440px)',
  
  isMobile: () => window.matchMedia('(max-width: 767px)').matches,
  isTablet: () => window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches,
  isDesktop: () => window.matchMedia('(min-width: 1025px)').matches,
  
  // Get appropriate button size based on screen size
  getResponsiveSize: (baseSizes: { mobile?: string; tablet?: string; desktop?: string }) => {
    if (ResponsiveBreakpoints.isMobile()) {
      return baseSizes.mobile || 'md';
    } else if (ResponsiveBreakpoints.isTablet()) {
      return baseSizes.tablet || 'md';
    } else {
      return baseSizes.desktop || 'md';
    }
  }
};