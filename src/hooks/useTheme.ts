import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem('learnquest-theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem('learnquest-theme');
      if (!storedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all existing theme classes first
    root.classList.remove('dark-theme', 'light-theme');
    body.classList.remove('dark-theme', 'light-theme');
    
    if (newTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark-theme');
      body.classList.add('dark-theme');
      body.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.add('light-theme');
      body.classList.add('light-theme');
      body.removeAttribute('data-theme');
    }
    
    // Apply theme to root container immediately
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
      rootContainer.style.backgroundColor = newTheme === 'dark' ? '#1A1A1A' : '#FFFFFF';
      rootContainer.style.color = newTheme === 'dark' ? '#F8F9FA' : '#212529';
      rootContainer.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    
    // Force immediate CSS variable updates
    const themeVariables = {
      '--color-primary': newTheme === 'dark' ? '#3B82F6' : '#2563EB',
      '--color-primary-hover': newTheme === 'dark' ? '#2563EB' : '#1D4ED8',
      '--color-bg-primary': newTheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
      '--color-bg-secondary': newTheme === 'dark' ? '#2D2D2D' : '#F8F9FA',
      '--color-bg-tertiary': newTheme === 'dark' ? '#404040' : '#E9ECEF',
      '--color-card-bg': newTheme === 'dark' ? '#2D2D2D' : '#FFFFFF',
      '--color-text-primary': newTheme === 'dark' ? '#F8F9FA' : '#212529',
      '--color-text-secondary': newTheme === 'dark' ? '#ADB5BD' : '#6C757D',
      '--color-border': newTheme === 'dark' ? '#495057' : '#DEE2E6'
    };
    
    // Apply all theme variables immediately
    Object.entries(themeVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Force immediate re-render by triggering multiple events
    setTimeout(() => {
      const themeChangeEvent = new CustomEvent('themeChanged', { 
        detail: { theme: newTheme, timestamp: Date.now() } 
      });
      window.dispatchEvent(themeChangeEvent);
      
      const forceUpdateEvent = new CustomEvent('forceThemeUpdate', { 
        detail: { theme: newTheme, timestamp: Date.now() } 
      });
      window.dispatchEvent(forceUpdateEvent);
      
      // Force React re-render by updating a data attribute
      root.setAttribute('data-theme-force-update', Date.now().toString());
    }, 0);
    
    // Store theme preference
    localStorage.setItem('learnquest-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Force immediate state update and DOM changes
    setTimeout(() => {
      setTheme(newTheme);
      
      // Force all components to re-render immediately
      const immediateUpdate = new CustomEvent('immediateThemeUpdate', { 
        detail: { theme: newTheme, timestamp: Date.now() } 
      });
      window.dispatchEvent(immediateUpdate);
    }, 0);
    
    // Also trigger immediate update
    requestAnimationFrame(() => {
      const rafUpdate = new CustomEvent('themeUpdateRAF', { 
        detail: { theme: newTheme, timestamp: Date.now() } 
      });
      window.dispatchEvent(rafUpdate);
    });
  };

  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Force immediate state update and DOM changes
    setTimeout(() => {
      setTheme(newTheme);
      
      // Force all components to re-render immediately
      const immediateUpdate = new CustomEvent('immediateThemeUpdate', { 
        detail: { theme: newTheme, timestamp: Date.now() } 
      });
      window.dispatchEvent(immediateUpdate);
    }, 0);
    
    // Also trigger immediate update
    requestAnimationFrame(() => {
      const rafUpdate = new CustomEvent('themeUpdateRAF', { 
        detail: { theme: newTheme, timestamp: Date.now() } 
      });
      window.dispatchEvent(rafUpdate);
    });
  };

  return { 
    theme, 
    toggleTheme, 
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};