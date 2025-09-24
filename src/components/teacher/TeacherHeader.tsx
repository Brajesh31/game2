import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ClassSelector } from '../ui/ClassSelector';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { LogOut, Moon, Sun, ChevronDown, Globe } from 'lucide-react';

interface TeacherHeaderProps {
  isVisible?: boolean;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({ isVisible = true }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  if (!user) {
    return null;
  }

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'];

  const handleLogout = () => {
    logout();
  };

  const toggleMobileSidebar = () => {
    const event = new CustomEvent('toggleMobileSidebar');
    window.dispatchEvent(event);
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}
      style={{
        backgroundColor: 'var(--color-teacher-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        color: 'var(--color-teacher-text-primary)'
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
                color: 'var(--color-teacher-primary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-teacher-bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ color: 'var(--color-teacher-primary)' }}
            >
              STEM-Spark
            </h1>
          </div>
          <span 
            className="hidden sm:inline"
            style={{ color: 'var(--color-teacher-text-secondary)' }}
          >
            Teacher Portal
          </span>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Language Selector */}
          <div className="relative hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              icon={Globe}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {selectedLanguage}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-teacher-background-secondary border border-border rounded-lg shadow-teacher-card z-10">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className="w-full px-4 py-2 text-left hover:bg-teacher-background text-text hover:text-teacher-primary transition-colors"
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
            icon={theme === 'light' ? Moon : Sun}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
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
                <p className="text-sm font-medium text-text truncate max-w-32">{user?.name}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-text-secondary flex-shrink-0" />
            </div>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-teacher-background-secondary border border-border rounded-lg shadow-teacher-card z-10 max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-text truncate">{user?.name}</p>
                  <p className="text-sm text-text-secondary truncate">{user?.email}</p>
                </div>
                {/* Mobile-only items */}
                <div className="sm:hidden border-b border-border">
                </div>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-teacher-background text-text hover:text-red-600 transition-colors flex items-center"
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