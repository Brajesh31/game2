import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useStudentTheme } from '../../hooks/useStudentTheme';
import { StudentHeader } from '../student/StudentHeader';
import { TeacherHeader } from '../teacher/TeacherHeader';
import { AdminHeader } from '../admin/AdminHeader';
import { GuardianHeader } from '../guardian/GuardianHeader';
import { StudentSidebar } from '../student/StudentSidebar';
import { TeacherSidebar } from '../teacher/TeacherSidebar';
import { AdminSidebar } from '../admin/AdminSidebar';
import { GuardianSidebar } from '../guardian/GuardianSidebar';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { generateStudentCSS, mode } = useStudentTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mobile menu toggle
  useEffect(() => {
    const handleToggleMobile = () => {
      if (isMobile) {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };

    window.addEventListener('toggleMobileSidebar', handleToggleMobile);
    return () => window.removeEventListener('toggleMobileSidebar', handleToggleMobile);
  }, [isMobile, sidebarCollapsed]);

  // Apply theme classes to the layout
  const getThemeClasses = () => {
    if (!user) return '';
    
    const baseClasses = theme === 'dark' ? 'dark' : 'light';
    
    switch (user.role) {
      case 'student':
        return `${baseClasses} student-theme-container`;
      case 'teacher':
        return `${baseClasses} teacher-theme-container`;
      case 'admin':
        return `${baseClasses} admin-theme-container`;
      case 'guardian':
        return `${baseClasses} guardian-theme-container`;
      default:
        return baseClasses;
    }
  };
  
  // Listen for theme changes and force re-render
  useEffect(() => {
    const handleThemeChange = () => {
      // Force component re-render when theme changes
      setHeaderVisible(prev => prev);
      // Force immediate update
      setTimeout(() => {
        setHeaderVisible(prev => !prev);
        setTimeout(() => setHeaderVisible(prev => !prev), 1);
      }, 0);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('immediateThemeUpdate', handleThemeChange);
    window.addEventListener('themeUpdateRAF', handleThemeChange);
    
    return () => window.removeEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('immediateThemeUpdate', handleThemeChange);
      window.removeEventListener('themeUpdateRAF', handleThemeChange);
    };
  }, []);

  // Apply theme changes to CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Clear all existing theme classes
    body.classList.remove('dark-theme', 'light-theme', 'student-theme-container', 'teacher-theme-container', 'admin-theme-container', 'guardian-theme-container');
    root.classList.remove('dark-theme', 'light-theme');
    
    // Apply theme class to body for global theme changes
    if (theme === 'dark') {
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
    
    // Apply role-specific theme classes (but don't apply student theme here - handled by StudentApp)
    if (user?.role === 'student') {
      // Student theme is handled by StudentApp component
      body.classList.add('student-theme-container');
    } else if (user?.role === 'teacher') {
      body.classList.add('teacher-theme-container');
    } else if (user?.role === 'admin') {
      body.classList.add('admin-theme-container');
    } else if (user?.role === 'guardian') {
      body.classList.add('guardian-theme-container');
    }
    
    // Apply CSS variables immediately for instant theme change
    const themeVariables = {
      '--color-primary': theme === 'dark' ? '#3B82F6' : '#2563EB',
      '--color-primary-hover': theme === 'dark' ? '#2563EB' : '#1D4ED8',
      '--color-bg-primary': theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
      '--color-bg-secondary': theme === 'dark' ? '#2D2D2D' : '#F8F9FA',
      '--color-bg-tertiary': theme === 'dark' ? '#404040' : '#E9ECEF',
      '--color-card-bg': theme === 'dark' ? '#2D2D2D' : '#FFFFFF',
      '--color-modal-bg': theme === 'dark' ? '#2D2D2D' : '#FFFFFF',
      '--color-input-bg': theme === 'dark' ? '#404040' : '#FFFFFF',
      '--color-text-primary': theme === 'dark' ? '#F8F9FA' : '#212529',
      '--color-text-secondary': theme === 'dark' ? '#ADB5BD' : '#6C757D',
      '--color-text-muted': theme === 'dark' ? '#6C757D' : '#ADB5BD',
      '--color-border': theme === 'dark' ? '#495057' : '#DEE2E6',
      '--color-border-light': theme === 'dark' ? '#6C757D' : '#E9ECEF'
    };
    
    Object.entries(themeVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Apply theme to root container
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
      // For student role, use student theme variables
      if (user?.role === 'student') {
        rootContainer.style.backgroundColor = theme === 'dark' ? 'var(--student-app-bg, #111827)' : 'var(--student-app-bg, #F9FAFB)';
        rootContainer.style.color = theme === 'dark' ? 'var(--student-body-text, #E5E7EB)' : 'var(--student-body-text, #374151)';
      } else {
        rootContainer.style.backgroundColor = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
        rootContainer.style.color = theme === 'dark' ? '#F8F9FA' : '#212529';
      }
      rootContainer.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    
    // Force immediate theme change events
    const themeChangeEvent = new CustomEvent('themeChanged', { 
      detail: { theme, role: user?.role, timestamp: Date.now() } 
    });
    window.dispatchEvent(themeChangeEvent);
    
    // Also trigger a force update event
    const forceUpdateEvent = new CustomEvent('forceThemeUpdate', { 
      detail: { theme, timestamp: Date.now() } 
    });
    window.dispatchEvent(forceUpdateEvent);
    
    // Force immediate React component re-render
    setHeaderVisible(prev => !prev);
    setTimeout(() => setHeaderVisible(prev => !prev), 1);
    
    // Additional immediate updates
    requestAnimationFrame(() => {
      const rafEvent = new CustomEvent('themeUpdateRAF', { 
        detail: { theme, timestamp: Date.now() } 
      });
      window.dispatchEvent(rafEvent);
    });
  }, [theme, mode, user?.role]);
  
  const renderHeader = () => {
    if (!user) return null;

    const headerProps = {
      isVisible: headerVisible,
    };

    switch (user.role) {
      case 'student':
        return <StudentHeader {...headerProps} />;
      case 'teacher':
        return <TeacherHeader {...headerProps} />;
      case 'admin':
        return <AdminHeader {...headerProps} />;
      case 'guardian':
        return <GuardianHeader {...headerProps} />;
      default:
        return null;
    }
  };

  const renderSidebar = () => {
    if (!user) return null;

    const sidebarProps = {
      collapsed: sidebarCollapsed,
      onToggle: () => setSidebarCollapsed(!sidebarCollapsed),
      isVisible: headerVisible,
      isMobile,
    };

    switch (user.role) {
      case 'student':
        return <StudentSidebar {...sidebarProps} />;
      case 'teacher':
        return <TeacherSidebar {...sidebarProps} />;
      case 'admin':
        return <AdminSidebar {...sidebarProps} />;
      case 'guardian':
        return <GuardianSidebar {...sidebarProps} />;
      default:
        return null;
    }
  };

  // Calculate sidebar width for main content margin
  const getSidebarWidth = () => {
    if (!user || isMobile) return '0';
    return sidebarCollapsed ? '64px' : '280px';
  };
  return (
    <div className={`global-layout ${getThemeClasses()}`} data-theme={theme}>
      {renderHeader()}
      
      <div className="flex">
        {renderSidebar()}
        
        <main 
          className={`global-main-content w-full transition-all duration-300 bg-background text-text ${getThemeClasses()}`}
          style={{
            marginLeft: getSidebarWidth(),
            paddingTop: user && headerVisible ? '80px' : '0',
          }}
        >
          <div className={`global-content-container bg-background text-text ${getThemeClasses()}`}>
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default GlobalLayout;