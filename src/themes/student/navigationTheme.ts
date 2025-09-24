export const studentNavigationTheme = {
  light: {
    // Side Navigation
    sidebar: {
      background: '#EEF2FF',
      border: '1px solid #E0E7FF',
      shadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      width: '280px',
      collapsedWidth: '64px'
    },
    
    // Navigation Items
    navItem: {
      default: {
        background: 'transparent',
        text: '#1F2937',
        icon: '#6B7280',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem'
      },
      hover: {
        background: 'rgba(79, 70, 229, 0.1)',
        text: '#4F46E5',
        icon: '#4F46E5',
        shadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
      },
      active: {
        background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
        text: '#FFFFFF',
        icon: '#FFFFFF',
        shadow: '0 4px 8px rgba(79, 70, 229, 0.3)',
        fontWeight: '600'
      }
    },
    
    // Header Navigation
    header: {
      background: '#4F46E5',
      text: '#FFFFFF',
      shadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      height: '80px',
      borderBottom: 'none'
    },
    
    // Mobile Navigation
    mobile: {
      overlay: 'rgba(0, 0, 0, 0.5)',
      sidebarBackground: '#EEF2FF',
      backdropBlur: 'blur(8px)'
    }
  },
  dark: {
    // Side Navigation
    sidebar: {
      background: '#404040',
      border: '1px solid #495057',
      shadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
      width: '280px',
      collapsedWidth: '64px'
    },
    
    // Navigation Items
    navItem: {
      default: {
        background: 'transparent',
        text: '#F8F9FA',
        icon: '#9CA3AF',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem'
      },
      hover: {
        background: 'rgba(99, 102, 241, 0.2)',
        text: '#818CF8',
        icon: '#818CF8',
        shadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
      },
      active: {
        background: '#6366F1',
        text: '#FFFFFF',
        icon: '#FFFFFF',
        shadow: '0 4px 8px rgba(99, 102, 241, 0.4)',
        fontWeight: '600'
      }
    },
    
    // Header Navigation
    header: {
      background: '#6366F1',
      text: '#FFFFFF',
      shadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
      height: '80px',
      borderBottom: 'none'
    },
    
    // Mobile Navigation
    mobile: {
      overlay: 'rgba(0, 0, 0, 0.8)',
      sidebarBackground: '#404040',
      backdropBlur: 'blur(12px)'
    }
  }
};