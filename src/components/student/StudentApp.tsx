import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStudentTheme } from '../../hooks/useStudentTheme';
import { useTheme } from '../../hooks/useTheme';
import { StudentRoutes } from './StudentRoutes';

export const StudentApp: React.FC = () => {
  const { generateStudentCSS, applyStudentTheme, removeStudentTheme, theme: studentThemeMode } = useStudentTheme();
  const { theme: globalTheme } = useTheme();
  const isThemeApplied = useRef(false);
  const [forceRender, setForceRender] = useState(0);
  
  // Memoize student theme styles to prevent unnecessary recalculations
  const studentThemeStyles = useMemo(() => generateStudentCSS(), [generateStudentCSS, globalTheme]);
  
  useEffect(() => {
    // Apply student theme on mount and when theme changes
    applyStudentTheme();
    isThemeApplied.current = true;

    // Cleanup function to remove student theme when component unmounts
    return () => {
      if (isThemeApplied.current) {
        removeStudentTheme();
        isThemeApplied.current = false;
      }
    };
  }, [applyStudentTheme, removeStudentTheme]);

  // Re-apply theme when global theme changes
  useEffect(() => {
    if (isThemeApplied.current) {
      applyStudentTheme();
    }
    
    // Force component re-render for immediate theme change
    setForceRender(prev => prev + 1);
  }, [globalTheme, applyStudentTheme]);
  
  // Listen for theme change events and force re-render
  useEffect(() => {
    const handleThemeChange = () => {
      setForceRender(prev => prev + 1);
      // Force immediate re-render of all student components
      setTimeout(() => {
        setForceRender(prev => prev + 1);
      }, 0);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('forceThemeUpdate', handleThemeChange);
    window.addEventListener('studentThemeChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('forceThemeUpdate', handleThemeChange);
      window.removeEventListener('studentThemeChanged', handleThemeChange);
    };
  }, []);

  return (
    <div 
      key={forceRender} 
      className="student-theme-wrapper" 
      data-student-theme={globalTheme}
      style={{
        backgroundColor: 'var(--student-app-bg)',
        color: 'var(--student-body-text)',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}
    >
      <StudentRoutes />
    </div>
  );
};