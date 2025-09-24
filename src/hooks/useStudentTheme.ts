import { useTheme } from './useTheme';
import { studentMainTheme } from '../themes/student/mainTheme';
import { studentComponentTheme } from '../themes/student/componentTheme';
import { studentNavigationTheme } from '../themes/student/navigationTheme';
import { studentTypographyTheme } from '../themes/student/typographyTheme';
import { studentStateTheme } from '../themes/student/stateTheme';
import { studentAnimationTheme } from '../themes/student/animationTheme';
import { useEffect, useCallback } from 'react';

export const useStudentTheme = () => {
  const { theme } = useTheme();
  const mode = theme === 'light' ? 'light' : 'dark';

  // Memoized CSS generation function
  const generateStudentCSS = useCallback(() => {
    const main = getMainTheme();
    const component = getComponentTheme();
    const navigation = getNavigationTheme();
    const typography = getTypographyTheme();
    const state = getStateTheme();
    const animation = getAnimationTheme();

    return {
      // Main Theme Variables
      '--student-app-bg': main.appBackground || (mode === 'dark' ? '#111827' : '#F9FAFB'),
      '--student-component-bg': main.componentBackground || (mode === 'dark' ? '#1F2937' : '#FFFFFF'),
      '--student-sidenav-bg': main.sideNavBackground || (mode === 'dark' ? '#312E81' : '#EEF2FF'),
      '--student-header-bg': main.headerBackground || (mode === 'dark' ? '#6366F1' : '#4F46E5'),
      
      // Core Colors
      '--student-primary': main.primary || (mode === 'dark' ? '#6366F1' : '#4F46E5'),
      '--student-secondary': main.secondary || '#F97316',
      '--student-accent': main.accent || '#10B981',
      '--student-error': main.error || (mode === 'dark' ? '#F87171' : '#DC2626'),
      '--student-warning': main.warning || (mode === 'dark' ? '#FBBF24' : '#F59E0B'),
      '--student-info': main.info || (mode === 'dark' ? '#38BDF8' : '#0EA5E9'),
      
      // Text Colors
      '--student-heading-text': main.headingText || (mode === 'dark' ? '#F9FAFB' : '#1F2937'),
      '--student-body-text': main.bodyText || (mode === 'dark' ? '#E5E7EB' : '#374151'),
      '--student-muted-text': main.mutedText || (mode === 'dark' ? '#9CA3AF' : '#6B7280'),
      '--student-link-text': main.linkText || (mode === 'dark' ? '#818CF8' : '#4F46E5'),
      '--student-link-hover': main.linkHover || (mode === 'dark' ? '#A5B4FC' : '#6366F1'),
      '--student-header-text': main.headerText || '#FFFFFF',
      
      // Component Colors
      '--student-card-bg': component.card?.background || (mode === 'dark' ? '#1F2937' : '#FFFFFF'),
      '--student-card-border': component.card?.border || (mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB'),
      '--student-card-shadow': component.card?.shadow || (mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.35)' : '0 4px 12px rgba(0, 0, 0, 0.08)'),
      '--student-card-hover-shadow': component.card?.hoverShadow || (mode === 'dark' ? '0 8px 20px rgba(129, 140, 248, 0.25)' : '0 8px 20px rgba(79, 70, 229, 0.15)'),
      
      // Button Colors
      '--student-btn-primary-bg': component.buttons?.primary?.background || (mode === 'dark' ? '#6366F1' : '#4F46E5'),
      '--student-btn-primary-hover': component.buttons?.primary?.backgroundHover || (mode === 'dark' ? '#4F46E5' : '#4338CA'),
      '--student-btn-primary-text': component.buttons?.primary?.text || '#FFFFFF',
      '--student-btn-secondary-bg': component.buttons?.secondary?.background || '#F97316',
      '--student-btn-secondary-hover': component.buttons?.secondary?.backgroundHover || '#EA580C',
      '--student-btn-accent-bg': component.buttons?.accent?.background || '#10B981',
      '--student-btn-accent-hover': component.buttons?.accent?.backgroundHover || '#059669',
      
      // Input Colors
      '--student-input-bg': component.inputs?.background || (mode === 'dark' ? '#1F2937' : '#FFFFFF'),
      '--student-input-border': component.inputs?.border || (mode === 'dark' ? '#374151' : '#D1D5DB'),
      '--student-input-focus': component.inputs?.borderFocus || (mode === 'dark' ? '#6366F1' : '#4F46E5'),
      '--student-input-text': component.inputs?.text || (mode === 'dark' ? '#E5E7EB' : '#374151'),
      '--student-input-placeholder': component.inputs?.placeholder || (mode === 'dark' ? '#9CA3AF' : '#6B7280'),
      
      // Navigation Colors
      '--student-nav-bg': navigation.sidebar?.background || (mode === 'dark' ? '#312E81' : '#EEF2FF'),
      '--student-nav-border': navigation.sidebar?.border || (mode === 'dark' ? '1px solid #4C1D95' : '1px solid #E0E7FF'),
      '--student-nav-item-text': navigation.navItem?.default?.text || (mode === 'dark' ? '#E5E7EB' : '#1F2937'),
      '--student-nav-item-hover-bg': navigation.navItem?.hover?.background || (mode === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(79, 70, 229, 0.1)'),
      '--student-nav-item-active-bg': navigation.navItem?.active?.background || (mode === 'dark' ? '#6366F1' : '#4F46E5'),
      
      // Progress Colors
      '--student-progress-bg': component.progressBar?.background || (mode === 'dark' ? '#374151' : '#E5E7EB'),
      '--student-progress-fill': component.progressBar?.fill || (mode === 'dark' ? 'linear-gradient(90deg, #6366F1, #F97316)' : 'linear-gradient(90deg, #4F46E5, #F97316)'),
      '--student-progress-accent': component.progressBar?.fillAccent || 'linear-gradient(90deg, #10B981, #059669)',
      
      // State Colors
      '--student-success-bg': state.success?.background || (mode === 'dark' ? '#064E3B' : '#ECFDF5'),
      '--student-success-text': state.success?.text || (mode === 'dark' ? '#A7F3D0' : '#065F46'),
      '--student-error-bg': state.error?.background || (mode === 'dark' ? '#7F1D1D' : '#FEF2F2'),
      '--student-error-text': state.error?.text || (mode === 'dark' ? '#FCA5A5' : '#991B1B'),
      '--student-warning-bg': state.warning?.background || (mode === 'dark' ? '#78350F' : '#FFFBEB'),
      '--student-warning-text': state.warning?.text || (mode === 'dark' ? '#FCD34D' : '#92400E'),
      '--student-info-bg': state.info?.background || (mode === 'dark' ? '#0C4A6E' : '#F0F9FF'),
      '--student-info-text': state.info?.text || (mode === 'dark' ? '#7DD3FC' : '#0C4A6E'),
      
      // Typography
      '--student-font-heading': typography.fonts?.heading || "'Poppins', sans-serif",
      '--student-font-body': typography.fonts?.body || "'Inter', sans-serif",
      '--student-font-ui': typography.fonts?.ui || "'Inter', sans-serif",
      
      // Animations
      '--student-transition-fast': animation.durations?.fast || '150ms',
      '--student-transition-normal': animation.durations?.normal || '200ms',
      '--student-transition-slow': animation.durations?.slow || '300ms',
      '--student-easing-default': animation.easing?.default || 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--student-easing-bounce': animation.easing?.bounce || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      
      // Shadows and Effects
      '--student-hero-gradient': main.heroGradient || (mode === 'dark' ? 'linear-gradient(90deg, #6366F1, #F97316)' : 'linear-gradient(90deg, #4F46E5, #F97316)'),
      '--student-card-hover-glow': main.cardHoverGlow || (mode === 'dark' ? 'rgba(129, 140, 248, 0.3)' : 'rgba(79, 70, 229, 0.2)'),
      '--student-focus-ring': main.focusRing || (mode === 'dark' ? 'rgba(129, 140, 248, 0.6)' : 'rgba(79, 70, 229, 0.5)'),
      '--student-nav-elevation': main.navElevation || (mode === 'dark' ? '0 2px 6px rgba(0, 0, 0, 0.4)' : '0 2px 6px rgba(0, 0, 0, 0.15)'),
      
      // Icon Colors
      '--student-icon-active': main.activeIcon || (mode === 'dark' ? '#818CF8' : '#4F46E5'),
      '--student-icon-inactive': main.inactiveIcon || (mode === 'dark' ? '#9CA3AF' : '#6B7280')
    } as React.CSSProperties;
  }, [mode, theme]);

  // Apply theme changes to CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const studentThemeStyles = generateStudentCSS();
    
    Object.entries(studentThemeStyles).forEach(([property, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(property, value);
      }
    });
    
    // Force immediate re-render with multiple events
    const themeChangeEvent = new CustomEvent('studentThemeChanged', { 
      detail: { theme, mode, timestamp: Date.now() } 
    });
    window.dispatchEvent(themeChangeEvent);
    
    const globalThemeEvent = new CustomEvent('themeChanged', { 
      detail: { theme, timestamp: Date.now() } 
    });
    window.dispatchEvent(globalThemeEvent);
    
    const forceUpdateEvent = new CustomEvent('forceThemeUpdate', { 
      detail: { theme, timestamp: Date.now() } 
    });
    window.dispatchEvent(forceUpdateEvent);
    
    // Force immediate DOM update
    requestAnimationFrame(() => {
      const studentThemeEvent = new CustomEvent('studentThemeUpdate', { 
        detail: { theme, mode, timestamp: Date.now() } 
      });
      window.dispatchEvent(studentThemeEvent);
    });
  }, [theme, mode, generateStudentCSS]);

  const getMainTheme = useCallback(() => studentMainTheme[mode] || {}, [mode]);
  const getComponentTheme = useCallback(() => studentComponentTheme[mode] || {}, [mode]);
  const getNavigationTheme = useCallback(() => studentNavigationTheme[mode] || {}, [mode]);
  const getTypographyTheme = useCallback(() => studentTypographyTheme, []);
  const getStateTheme = useCallback(() => studentStateTheme[mode] || {}, [mode]);
  const getAnimationTheme = useCallback(() => studentAnimationTheme, []);

  // Apply student theme to document root
  const applyStudentTheme = useCallback(() => {
    const root = document.documentElement;
    const body = document.body;
    const studentThemeStyles = generateStudentCSS();
    
    // Apply all student theme variables to root
    Object.entries(studentThemeStyles).forEach(([property, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(property, value);
      }
    });
    
    // Apply student theme class to body for scoped styling
    body.classList.add('student-theme-active');
    
    // Force immediate theme change events
    const studentThemeEvent = new CustomEvent('studentThemeApplied', { 
      detail: { theme, mode, styles: studentThemeStyles } 
    });
    window.dispatchEvent(studentThemeEvent);
    
    // Force immediate re-render
    requestAnimationFrame(() => {
      const updateEvent = new CustomEvent('studentThemeUpdate', { 
        detail: { theme, mode, timestamp: Date.now() } 
      });
      window.dispatchEvent(updateEvent);
    });
  }, [generateStudentCSS, theme, mode]);

  // Remove student theme when component unmounts
  const removeStudentTheme = useCallback(() => {
    const body = document.body;
    body.classList.remove('student-theme-active');
  }, []);

  return {
    getMainTheme,
    getComponentTheme,
    getNavigationTheme,
    getTypographyTheme,
    getStateTheme,
    getAnimationTheme,
    generateStudentCSS,
    applyStudentTheme,
    removeStudentTheme,
    theme,
    mode
  };
};