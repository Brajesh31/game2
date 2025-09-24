// Enhanced Student Theme Configuration
// This file provides comprehensive theme definitions for the student dashboard

export interface StudentThemeConfig {
  light: StudentThemeMode;
  dark: StudentThemeMode;
}

export interface StudentThemeMode {
  // Core Brand Colors
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
  
  // Background Layers
  appBackground: string;
  componentBackground: string;
  sideNavBackground: string;
  headerBackground: string;
  modalBackground: string;
  
  // Text Colors
  headingText: string;
  bodyText: string;
  mutedText: string;
  linkText: string;
  linkHover: string;
  headerText: string;
  
  // Interactive Elements
  buttonPrimary: {
    background: string;
    backgroundHover: string;
    text: string;
    shadow: string;
  };
  buttonSecondary: {
    background: string;
    backgroundHover: string;
    text: string;
    shadow: string;
  };
  buttonAccent: {
    background: string;
    backgroundHover: string;
    text: string;
    shadow: string;
  };
  
  // Form Elements
  input: {
    background: string;
    border: string;
    borderFocus: string;
    text: string;
    placeholder: string;
    focusRing: string;
  };
  
  // Navigation
  navigation: {
    background: string;
    border: string;
    itemText: string;
    itemHoverBackground: string;
    itemActiveBackground: string;
    elevation: string;
  };
  
  // Cards and Containers
  card: {
    background: string;
    border: string;
    shadow: string;
    hoverShadow: string;
    borderRadius: string;
  };
  
  // Progress Elements
  progress: {
    background: string;
    fill: string;
    fillAccent: string;
  };
  
  // State Colors
  success: {
    background: string;
    text: string;
    border: string;
  };
  error: {
    background: string;
    text: string;
    border: string;
  };
  warning: {
    background: string;
    text: string;
    border: string;
  };
  info: {
    background: string;
    text: string;
    border: string;
  };
  
  // Effects and Animations
  effects: {
    heroGradient: string;
    cardHoverGlow: string;
    focusRing: string;
    achievementGlow: string;
  };
  
  // Typography
  typography: {
    fontHeading: string;
    fontBody: string;
    fontUI: string;
  };
  
  // Transitions
  transitions: {
    fast: string;
    normal: string;
    slow: string;
    easing: string;
    easingBounce: string;
  };
}

export const enhancedStudentTheme: StudentThemeConfig = {
  light: {
    // Core Brand Colors
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    secondary: '#F97316',
    secondaryHover: '#EA580C',
    accent: '#10B981',
    accentHover: '#059669',
    
    // Background Layers
    appBackground: '#F9FAFB',
    componentBackground: '#FFFFFF',
    sideNavBackground: '#EEF2FF',
    headerBackground: '#4F46E5',
    modalBackground: '#FFFFFF',
    
    // Text Colors
    headingText: '#1F2937',
    bodyText: '#374151',
    mutedText: '#6B7280',
    linkText: '#4F46E5',
    linkHover: '#6366F1',
    headerText: '#FFFFFF',
    
    // Interactive Elements
    buttonPrimary: {
      background: '#4F46E5',
      backgroundHover: '#4338CA',
      text: '#FFFFFF',
      shadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
    },
    buttonSecondary: {
      background: '#F97316',
      backgroundHover: '#EA580C',
      text: '#FFFFFF',
      shadow: '0 2px 4px rgba(249, 115, 22, 0.2)'
    },
    buttonAccent: {
      background: '#10B981',
      backgroundHover: '#059669',
      text: '#FFFFFF',
      shadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
    },
    
    // Form Elements
    input: {
      background: '#FFFFFF',
      border: '#D1D5DB',
      borderFocus: '#4F46E5',
      text: '#374151',
      placeholder: '#9CA3AF',
      focusRing: 'rgba(79, 70, 229, 0.5)'
    },
    
    // Navigation
    navigation: {
      background: '#EEF2FF',
      border: '1px solid #E0E7FF',
      itemText: '#1F2937',
      itemHoverBackground: 'rgba(79, 70, 229, 0.1)',
      itemActiveBackground: '#4F46E5',
      elevation: '0 2px 6px rgba(0, 0, 0, 0.15)'
    },
    
    // Cards and Containers
    card: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      hoverShadow: '0 8px 20px rgba(79, 70, 229, 0.15)',
      borderRadius: '1rem'
    },
    
    // Progress Elements
    progress: {
      background: '#E5E7EB',
      fill: 'linear-gradient(90deg, #4F46E5, #F97316)',
      fillAccent: 'linear-gradient(90deg, #10B981, #059669)'
    },
    
    // State Colors
    success: {
      background: '#ECFDF5',
      text: '#065F46',
      border: '#10B981'
    },
    error: {
      background: '#FEF2F2',
      text: '#991B1B',
      border: '#DC2626'
    },
    warning: {
      background: '#FFFBEB',
      text: '#92400E',
      border: '#F59E0B'
    },
    info: {
      background: '#F0F9FF',
      text: '#0C4A6E',
      border: '#0EA5E9'
    },
    
    // Effects and Animations
    effects: {
      heroGradient: 'linear-gradient(90deg, #4F46E5, #F97316)',
      cardHoverGlow: 'rgba(79, 70, 229, 0.2)',
      focusRing: 'rgba(79, 70, 229, 0.5)',
      achievementGlow: '0 0 15px rgba(79, 70, 229, 0.3)'
    },
    
    // Typography
    typography: {
      fontHeading: "'Poppins', sans-serif",
      fontBody: "'Inter', sans-serif",
      fontUI: "'Inter', sans-serif"
    },
    
    // Transitions
    transitions: {
      fast: '100ms',
      normal: '150ms',
      slow: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  dark: {
    // Core Brand Colors
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#F97316',
    secondaryHover: '#EA580C',
    accent: '#10B981',
    accentHover: '#059669',
    
    // Background Layers
    appBackground: '#111827',
    componentBackground: '#1F2937',
    sideNavBackground: '#312E81',
    headerBackground: '#6366F1',
    modalBackground: '#1F2937',
    
    // Text Colors
    headingText: '#F9FAFB',
    bodyText: '#E5E7EB',
    mutedText: '#9CA3AF',
    linkText: '#818CF8',
    linkHover: '#A5B4FC',
    headerText: '#FFFFFF',
    
    // Interactive Elements
    buttonPrimary: {
      background: '#6366F1',
      backgroundHover: '#4F46E5',
      text: '#FFFFFF',
      shadow: '0 2px 4px rgba(99, 102, 241, 0.4)'
    },
    buttonSecondary: {
      background: '#F97316',
      backgroundHover: '#EA580C',
      text: '#FFFFFF',
      shadow: '0 2px 4px rgba(249, 115, 22, 0.4)'
    },
    buttonAccent: {
      background: '#10B981',
      backgroundHover: '#059669',
      text: '#FFFFFF',
      shadow: '0 2px 4px rgba(16, 185, 129, 0.4)'
    },
    
    // Form Elements
    input: {
      background: '#1F2937',
      border: '#374151',
      borderFocus: '#6366F1',
      text: '#E5E7EB',
      placeholder: '#9CA3AF',
      focusRing: 'rgba(99, 102, 241, 0.5)'
    },
    
    // Navigation
    navigation: {
      background: '#312E81',
      border: '1px solid #4C1D95',
      itemText: '#E5E7EB',
      itemHoverBackground: 'rgba(129, 140, 248, 0.2)',
      itemActiveBackground: '#6366F1',
      elevation: '0 2px 6px rgba(0, 0, 0, 0.4)'
    },
    
    // Cards and Containers
    card: {
      background: '#1F2937',
      border: '1px solid #374151',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
      hoverShadow: '0 8px 20px rgba(129, 140, 248, 0.25)',
      borderRadius: '1rem'
    },
    
    // Progress Elements
    progress: {
      background: '#374151',
      fill: 'linear-gradient(90deg, #6366F1, #F97316)',
      fillAccent: 'linear-gradient(90deg, #10B981, #059669)'
    },
    
    // State Colors
    success: {
      background: '#064E3B',
      text: '#A7F3D0',
      border: '#10B981'
    },
    error: {
      background: '#7F1D1D',
      text: '#FCA5A5',
      border: '#F87171'
    },
    warning: {
      background: '#78350F',
      text: '#FCD34D',
      border: '#FBBF24'
    },
    info: {
      background: '#0C4A6E',
      text: '#7DD3FC',
      border: '#38BDF8'
    },
    
    // Effects and Animations
    effects: {
      heroGradient: 'linear-gradient(90deg, #6366F1, #F97316)',
      cardHoverGlow: 'rgba(129, 140, 248, 0.3)',
      focusRing: 'rgba(129, 140, 248, 0.6)',
      achievementGlow: '0 0 15px rgba(129, 140, 248, 0.4)'
    },
    
    // Typography
    typography: {
      fontHeading: "'Poppins', sans-serif",
      fontBody: "'Inter', sans-serif",
      fontUI: "'Inter', sans-serif"
    },
    
    // Transitions
    transitions: {
      fast: '100ms',
      normal: '150ms',
      slow: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
};

// Theme utility functions
export const getStudentThemeCSS = (mode: 'light' | 'dark') => {
  const theme = enhancedStudentTheme[mode];
  
  return {
    // Core Colors
    '--student-primary': theme.primary,
    '--student-primary-hover': theme.primaryHover,
    '--student-secondary': theme.secondary,
    '--student-secondary-hover': theme.secondaryHover,
    '--student-accent': theme.accent,
    '--student-accent-hover': theme.accentHover,
    
    // Backgrounds
    '--student-app-bg': theme.appBackground,
    '--student-component-bg': theme.componentBackground,
    '--student-sidenav-bg': theme.sideNavBackground,
    '--student-header-bg': theme.headerBackground,
    '--student-modal-bg': theme.modalBackground,
    
    // Text
    '--student-heading-text': theme.headingText,
    '--student-body-text': theme.bodyText,
    '--student-muted-text': theme.mutedText,
    '--student-link-text': theme.linkText,
    '--student-link-hover': theme.linkHover,
    '--student-header-text': theme.headerText,
    
    // Buttons
    '--student-btn-primary-bg': theme.buttonPrimary.background,
    '--student-btn-primary-hover': theme.buttonPrimary.backgroundHover,
    '--student-btn-primary-text': theme.buttonPrimary.text,
    '--student-btn-primary-shadow': theme.buttonPrimary.shadow,
    
    '--student-btn-secondary-bg': theme.buttonSecondary.background,
    '--student-btn-secondary-hover': theme.buttonSecondary.backgroundHover,
    '--student-btn-secondary-text': theme.buttonSecondary.text,
    '--student-btn-secondary-shadow': theme.buttonSecondary.shadow,
    
    '--student-btn-accent-bg': theme.buttonAccent.background,
    '--student-btn-accent-hover': theme.buttonAccent.backgroundHover,
    '--student-btn-accent-text': theme.buttonAccent.text,
    '--student-btn-accent-shadow': theme.buttonAccent.shadow,
    
    // Inputs
    '--student-input-bg': theme.input.background,
    '--student-input-border': theme.input.border,
    '--student-input-focus': theme.input.borderFocus,
    '--student-input-text': theme.input.text,
    '--student-input-placeholder': theme.input.placeholder,
    '--student-focus-ring': theme.input.focusRing,
    
    // Navigation
    '--student-nav-bg': theme.navigation.background,
    '--student-nav-border': theme.navigation.border,
    '--student-nav-item-text': theme.navigation.itemText,
    '--student-nav-item-hover-bg': theme.navigation.itemHoverBackground,
    '--student-nav-item-active-bg': theme.navigation.itemActiveBackground,
    '--student-nav-elevation': theme.navigation.elevation,
    
    // Cards
    '--student-card-bg': theme.card.background,
    '--student-card-border': theme.card.border,
    '--student-card-shadow': theme.card.shadow,
    '--student-card-hover-shadow': theme.card.hoverShadow,
    '--student-card-border-radius': theme.card.borderRadius,
    
    // Progress
    '--student-progress-bg': theme.progress.background,
    '--student-progress-fill': theme.progress.fill,
    '--student-progress-accent': theme.progress.fillAccent,
    
    // States
    '--student-success-bg': theme.success.background,
    '--student-success-text': theme.success.text,
    '--student-success-border': theme.success.border,
    
    '--student-error-bg': theme.error.background,
    '--student-error-text': theme.error.text,
    '--student-error-border': theme.error.border,
    
    '--student-warning-bg': theme.warning.background,
    '--student-warning-text': theme.warning.text,
    '--student-warning-border': theme.warning.border,
    
    '--student-info-bg': theme.info.background,
    '--student-info-text': theme.info.text,
    '--student-info-border': theme.info.border,
    
    // Effects
    '--student-hero-gradient': theme.effects.heroGradient,
    '--student-card-hover-glow': theme.effects.cardHoverGlow,
    '--student-achievement-glow': theme.effects.achievementGlow,
    
    // Typography
    '--student-font-heading': theme.typography.fontHeading,
    '--student-font-body': theme.typography.fontBody,
    '--student-font-ui': theme.typography.fontUI,
    
    // Transitions
    '--student-transition-fast': theme.transitions.fast,
    '--student-transition-normal': theme.transitions.normal,
    '--student-transition-slow': theme.transitions.slow,
    '--student-easing-default': theme.transitions.easing,
    '--student-easing-bounce': theme.transitions.easingBounce
  } as React.CSSProperties;
};