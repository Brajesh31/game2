export const studentComponentTheme = {
  light: {
    // Card Components
    card: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '1rem',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      hoverShadow: '0 8px 20px rgba(79, 70, 229, 0.15)',
      hoverTransform: 'translateY(-2px)'
    },
    
    // Button Components
    buttons: {
      primary: {
        background: '#4F46E5',
        backgroundHover: '#4338CA',
        text: '#FFFFFF',
        shadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
        activeGlow: '0 0 8px rgba(99, 102, 241, 0.6)',
        disabled: '#9CA3AF'
      },
      secondary: {
        background: '#F97316',
        backgroundHover: '#EA580C',
        text: '#FFFFFF',
        shadow: '0 2px 4px rgba(249, 115, 22, 0.2)',
        activeGlow: '0 0 8px rgba(249, 115, 22, 0.6)'
      },
      accent: {
        background: '#10B981',
        backgroundHover: '#059669',
        text: '#FFFFFF',
        shadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
        activeGlow: '0 0 8px rgba(16, 185, 129, 0.6)'
      },
      outline: {
        background: 'transparent',
        backgroundHover: '#4F46E5',
        border: '1px solid #4F46E5',
        text: '#4F46E5',
        textHover: '#FFFFFF'
      },
      ghost: {
        background: 'transparent',
        backgroundHover: 'rgba(79, 70, 229, 0.1)',
        text: '#4F46E5',
        textHover: '#4338CA'
      }
    },
    
    // Input Components
    inputs: {
      background: '#FFFFFF',
      border: '1px solid #D1D5DB',
      borderFocus: '#4F46E5',
      text: '#374151',
      placeholder: '#9CA3AF',
      focusGlow: 'rgba(79, 70, 229, 0.4)',
      focusRing: '0 0 0 3px rgba(79, 70, 229, 0.5)'
    },
    
    // Progress Bars
    progressBar: {
      background: '#E5E7EB',
      fill: 'linear-gradient(90deg, #4F46E5, #F97316)',
      fillAccent: 'linear-gradient(90deg, #10B981, #059669)',
      height: '0.75rem',
      borderRadius: '9999px',
      shadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
    }
  },
  dark: {
    // Card Components
    card: {
      background: '#2D2D2D',
      border: '1px solid #495057',
      borderRadius: '1rem',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      hoverShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
      hoverTransform: 'translateY(-2px)'
    },
    
    // Button Components
    buttons: {
      primary: {
        background: '#6366F1',
        backgroundHover: '#4F46E5',
        text: '#FFFFFF',
        shadow: '0 2px 4px rgba(99, 102, 241, 0.4)',
        activeGlow: '0 0 8px rgba(99, 102, 241, 0.6)',
        disabled: '#495057'
      },
      secondary: {
        background: '#F97316',
        backgroundHover: '#EA580C',
        text: '#FFFFFF',
        shadow: '0 2px 4px rgba(249, 115, 22, 0.4)',
        activeGlow: '0 0 8px rgba(249, 115, 22, 0.6)'
      },
      accent: {
        background: '#10B981',
        backgroundHover: '#059669',
        text: '#FFFFFF',
        shadow: '0 2px 4px rgba(16, 185, 129, 0.4)',
        activeGlow: '0 0 8px rgba(16, 185, 129, 0.6)'
      },
      outline: {
        background: 'transparent',
        backgroundHover: '#6366F1',
        border: '1px solid #6366F1',
        text: '#6366F1',
        textHover: '#FFFFFF'
      },
      ghost: {
        background: 'transparent',
        backgroundHover: 'rgba(99, 102, 241, 0.2)',
        text: '#818CF8',
        textHover: '#A5B4FC'
      }
    },
    
    // Input Components
    inputs: {
      background: '#2D2D2D',
      border: '1px solid #495057',
      borderFocus: '#6366F1',
      text: '#F8F9FA',
      placeholder: '#9CA3AF',
      focusGlow: 'rgba(99, 102, 241, 0.4)',
      focusRing: '0 0 0 3px rgba(99, 102, 241, 0.5)'
    },
    
    // Progress Bars
    progressBar: {
      background: '#495057',
      fill: 'linear-gradient(90deg, #6366F1, #F97316)',
      fillAccent: 'linear-gradient(90deg, #10B981, #059669)',
      height: '0.75rem',
      borderRadius: '9999px',
      shadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)'
    }
  }
};