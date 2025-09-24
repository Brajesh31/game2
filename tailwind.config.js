/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/index.css'],
  darkMode: ['class', '[data-theme="dark"]', '.dark-theme'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      colors: {
        // Primary colors
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        
        // Student panel colors
        'student-primary': 'var(--student-primary, #4F46E5)',
        'student-primary-hover': 'var(--student-primary, #6366F1)',
        'student-secondary': 'var(--student-secondary, #F97316)',
        'student-secondary-hover': 'var(--student-secondary, #FB923C)',
        'student-accent': 'var(--student-accent, #10B981)',
        'student-accent-hover': 'var(--student-accent, #34D399)',
        
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        
        // Background colors
        background: 'var(--color-bg-primary)',
        'background-secondary': 'var(--color-bg-secondary)',
        'background-tertiary': 'var(--color-bg-tertiary)',
        
        // Card and component backgrounds
        'card-bg': 'var(--color-card-bg, var(--color-bg-primary))',
        'modal-bg': 'var(--color-modal-bg, var(--color-bg-primary))',
        'input-bg': 'var(--color-input-bg, var(--color-bg-primary))',
        
        // Teacher background colors
        'teacher-background': 'var(--color-teacher-bg-primary)',
        'teacher-background-secondary': 'var(--color-teacher-bg-secondary)',
        'teacher-background-tertiary': 'var(--color-teacher-bg-tertiary)',
        
        // Admin background colors
        'admin-background': 'var(--color-admin-bg-primary)',
        'admin-background-secondary': 'var(--color-admin-bg-secondary)',
        'admin-background-tertiary': 'var(--color-admin-bg-tertiary)',
        
        // Guardian background colors
        'guardian-background': 'var(--color-guardian-bg-primary)',
        'guardian-background-secondary': 'var(--color-guardian-bg-secondary)',
        'guardian-background-tertiary': 'var(--color-guardian-bg-tertiary)',
        
        // Student background colors
        'student-background': 'var(--student-app-bg, #F9FAFB)',
        'student-background-secondary': 'var(--student-component-bg, #FFFFFF)',
        'student-background-tertiary': 'var(--student-sidenav-bg, #EEF2FF)',
        
        // Text colors
        text: 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-on-primary': 'var(--color-text-on-primary)',
        
        // Teacher text colors
        'teacher-text': 'var(--color-teacher-text-primary)',
        'teacher-text-secondary': 'var(--color-teacher-text-secondary)',
        'teacher-text-muted': 'var(--color-teacher-text-muted)',
        'teacher-primary': 'var(--color-teacher-primary)',
        'teacher-secondary': 'var(--color-teacher-secondary)',
        'teacher-accent': 'var(--color-teacher-accent)',
        
        // Admin text colors
        'admin-text': 'var(--color-admin-text-primary)',
        'admin-text-secondary': 'var(--color-admin-text-secondary)',
        'admin-text-muted': 'var(--color-admin-text-muted)',
        'admin-primary': 'var(--color-admin-primary)',
        'admin-secondary': 'var(--color-admin-secondary)',
        'admin-accent': 'var(--color-admin-accent)',
        
        // Guardian text colors
        'guardian-text': 'var(--color-guardian-text-primary)',
        'guardian-text-secondary': 'var(--color-guardian-text-secondary)',
        'guardian-text-muted': 'var(--color-guardian-text-muted)',
        'guardian-primary': 'var(--color-guardian-primary)',
        'guardian-secondary': 'var(--color-guardian-secondary)',
        'guardian-accent': 'var(--color-guardian-accent)',
        
        // Student text colors
        'student-text': 'var(--student-heading-text, #1F2937)',
        'student-text-secondary': 'var(--student-body-text, #374151)',
        'student-text-muted': 'var(--student-muted-text, #6B7280)',
        'student-on-primary': 'var(--student-header-text, #FFFFFF)',
        
        // Border colors
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        
        // Feedback colors
        success: 'var(--color-success)',
        'success-hover': 'var(--color-success-hover)',
        danger: 'var(--color-danger)',
        'danger-hover': 'var(--color-danger-hover)',
        warning: 'var(--color-warning)',
        'warning-hover': 'var(--color-warning-hover)',
        info: 'var(--color-info)',
        'info-hover': 'var(--color-info-hover)',
      },
      boxShadow: {
        'professional-sm': 'var(--shadow-sm)',
        'professional-md': 'var(--shadow-md)',
        'professional-lg': 'var(--shadow-lg)',
        'professional-xl': 'var(--shadow-xl)',
        
        // Student shadows
        'student-card': 'var(--student-shadow-card)',
        'student-hover': 'var(--student-shadow-hover)',
        'student-modal': 'var(--student-shadow-modal)',
        'student-glow': 'var(--student-shadow-glow)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'student-bounce-in': 'student-bounce-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'student-slide-up': 'student-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'student-pulse': 'student-pulse 2s infinite',
        'teacher-slide-up': 'teacher-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'admin-slide-up': 'admin-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'guardian-slide-up': 'guardian-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'guardian-warm-glow': 'guardian-warm-glow 3s infinite',
      },
      keyframes: {
        'slide-in': {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '300% 0' },
          '100%': { backgroundPosition: '-300% 0' },
        },
        'student-bounce-in': {
          '0%': {
            transform: 'scale(0.3) translateY(20px)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.05) translateY(-5px)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1) translateY(0)',
            opacity: '1',
          },
        },
        'student-slide-up': {
          from: {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'student-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
        'teacher-slide-up': {
          from: {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'admin-slide-up': {
          from: {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'guardian-slide-up': {
          from: {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'guardian-warm-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(236, 72, 153, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(236, 72, 153, 0.4)' 
          },
        },
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
};