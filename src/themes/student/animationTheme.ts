export const studentAnimationTheme = {
  // Transition Durations
  durations: {
    fast: '100ms',
    normal: '150ms',
    slow: '300ms',
    slower: '500ms'
  },
  
  // Easing Functions
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  
  // Hover Effects
  hover: {
    lift: 'translateY(-2px)',
    scale: 'scale(1.02)',
    glow: '0 8px 20px rgba(79, 70, 229, 0.15)',
    glowDark: '0 8px 20px rgba(129, 140, 248, 0.25)'
  },
  
  // Click Effects
  click: {
    scale: 'scale(0.98)',
    bounce: 'scale(1.05)'
  },
  
  // Loading Animations
  loading: {
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite'
  },
  
  // Achievement Animations
  achievement: {
    glow: 'achievement-glow 2s ease-in-out infinite',
    bounceIn: 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    slideUp: 'slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Page Transitions
  pageTransition: {
    slideIn: 'slide-in 0.3s ease-out',
    fadeIn: 'fade-in 0.3s ease-out'
  }
};