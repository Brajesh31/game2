import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { enhancedStudentTheme, getStudentThemeCSS } from '../../themes/student/enhancedTheme';

interface StudentThemeContextType {
  studentTheme: 'light' | 'dark';
  toggleStudentTheme: () => void;
  applyTheme: () => void;
  removeTheme: () => void;
  isThemeActive: boolean;
}

const StudentThemeContext = createContext<StudentThemeContextType | null>(null);

interface StudentThemeProviderProps {
  children: React.ReactNode;
}

export const StudentThemeProvider: React.FC<StudentThemeProviderProps> = ({ children }) => {
  const { theme: globalTheme } = useTheme();
  const [isThemeActive, setIsThemeActive] = useState(false);
  const studentTheme = globalTheme; // Student theme follows global theme

  const applyTheme = () => {
    const root = document.documentElement;
    const body = document.body;
    const themeCSS = getStudentThemeCSS(studentTheme);
    
    // Apply all CSS custom properties
    Object.entries(themeCSS).forEach(([property, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(property, value);
      }
    });
    
    // Add student theme class for scoped styling
    body.classList.add('student-theme-active');
    setIsThemeActive(true);
    
    // Dispatch theme applied event
    const event = new CustomEvent('studentThemeApplied', {
      detail: { theme: studentTheme, styles: themeCSS }
    });
    window.dispatchEvent(event);
  };

  const removeTheme = () => {
    const body = document.body;
    body.classList.remove('student-theme-active');
    setIsThemeActive(false);
    
    // Dispatch theme removed event
    const event = new CustomEvent('studentThemeRemoved');
    window.dispatchEvent(event);
  };

  const toggleStudentTheme = () => {
    // Student theme follows global theme, so this would trigger global theme toggle
    // This is handled by the global theme hook
  };

  // Apply theme when component mounts or global theme changes
  useEffect(() => {
    applyTheme();
    
    return () => {
      removeTheme();
    };
  }, [globalTheme]);

  const contextValue: StudentThemeContextType = {
    studentTheme,
    toggleStudentTheme,
    applyTheme,
    removeTheme,
    isThemeActive
  };

  return (
    <StudentThemeContext.Provider value={contextValue}>
      <div 
        className="student-theme-container"
        data-student-theme={studentTheme}
        style={{
          backgroundColor: 'var(--student-app-bg)',
          color: 'var(--student-body-text)',
          minHeight: '100vh',
          transition: 'all 0.3s ease'
        }}
      >
        {children}
      </div>
    </StudentThemeContext.Provider>
  );
};

export const useStudentThemeContext = () => {
  const context = useContext(StudentThemeContext);
  if (!context) {
    throw new Error('useStudentThemeContext must be used within a StudentThemeProvider');
  }
  return context;
};