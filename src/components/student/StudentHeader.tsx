import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ClassSelector } from '../ui/ClassSelector';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { LogOut, Moon, Sun, ChevronDown, Globe } from 'lucide-react';

interface StudentHeaderProps {
  isVisible?: boolean;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ isVisible = true }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Sync theme state with global theme
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Listen for theme changes and update immediately
  useEffect(() => {
    const handleThemeChange = () => {
      setCurrentTheme(theme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('forceThemeUpdate', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('forceThemeUpdate', handleThemeChange);
    };
  }, [theme]);

  if (!user) {
    return null;
  }

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'];

  const handleLogout = () => {
    logout();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Force immediate UI update
    setTimeout(() => {
      setCurrentTheme(theme === 'light' ? 'dark' : 'light');
    }, 0);
  };
  const toggleMobileSidebar = () => {
    const event = new CustomEvent('toggleMobileSidebar');
    window.dispatchEvent(event);
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 shadow-student-card transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}
      style={{
        background: 'var(--student-header-bg)',
        color: 'var(--student-header-text)',
        boxShadow: 'var(--student-card-shadow)'
      }}
    >
      <div className="flex items-center justify-between max-w-full">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--student-header-text)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: 'var(--student-header-text)' }}>
              STEM-Spark
            </h1>
          </div>
          <span className="hidden sm:inline font-semibold" style={{ color: 'var(--student-header-text)', opacity: 0.9 }}>
            Learning Adventure
          </span>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Class Selector - Always visible */}
          <div className="flex-shrink-0">
            <ClassSelector variant="student" size="sm" />
          </div>

          {/* Language Selector */}
          <div className="relative hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              icon={Globe}
              style={{
                color: 'var(--student-header-text)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {selectedLanguage}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            
            {showLanguageMenu && (
              <div 
                className="absolute right-0 mt-2 w-32 rounded-lg z-10 max-h-48 overflow-y-auto"
                style={{
                  backgroundColor: 'var(--student-card-bg)',
                  border: 'var(--student-card-border)',
                  boxShadow: 'var(--student-card-shadow)'
                }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className="w-full px-4 py-2 text-left transition-colors"
                    style={{
                      color: 'var(--student-body-text)',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--student-component-bg)';
                      e.currentTarget.style.color = 'var(--student-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--student-body-text)';
                    }}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={currentTheme === 'light' ? Moon : Sun}
            style={{
              color: 'var(--student-header-text)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={handleThemeToggle}
          >
            <span className="hidden sm:inline">{currentTheme === 'light' ? 'Dark' : 'Light'}</span>
          </Button>

          {/* User Profile */}
          <div className="relative">
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium truncate max-w-32" style={{ color: 'var(--student-header-text)' }}>
                  {user?.name}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--student-header-text)', opacity: 0.7 }} />
            </div>
            
            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-lg z-10 max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: 'var(--student-card-bg)',
                  border: 'var(--student-card-border)',
                  boxShadow: 'var(--student-card-shadow)'
                }}
              >
                <div className="p-4 border-b border-border">
                  <p className="font-medium truncate" style={{ color: 'var(--student-heading-text)' }}>
                    {user?.name}
                  </p>
                  <p className="text-sm truncate" style={{ color: 'var(--student-body-text)' }}>
                    {user?.email}
                  </p>
                </div>
                <button
                  className="w-full px-4 py-3 text-left transition-colors flex items-center"
                  style={{ color: 'var(--student-body-text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#DC2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--student-body-text)';
                  }}
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};