import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ClassSelector } from '../ui/ClassSelector';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { LogOut, Moon, Sun, ChevronDown, Globe } from 'lucide-react';

interface GuardianHeaderProps {
  isVisible?: boolean;
}

export const GuardianHeader: React.FC<GuardianHeaderProps> = ({ isVisible = true }) => {
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
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 shadow-guardian-card transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}
      style={{
        backgroundColor: 'var(--color-guardian-bg-secondary)',
        borderBottom: '1px solid var(--color-border)',
        color: 'var(--color-guardian-text-primary)'
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
                color: 'var(--color-guardian-primary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-guardian-bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 
              className="text-xl sm:text-2xl font-bold truncate"
              style={{ color: 'var(--color-guardian-primary)' }}
            >
              STEM-Spark
            </h1>
          </div>
          <span 
            className="hidden sm:inline font-semibold"
            style={{ color: 'var(--color-guardian-accent)' }}
          >
            Family Portal
          </span>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Language Selector - Prominent for accessibility */}
          <div className="relative hidden md:block">
            <Button
              variant="outline"
              size="sm"
              icon={Globe}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="border-guardian-primary text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary"
            >
              {selectedLanguage}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-guardian-background-secondary border border-border rounded-lg shadow-guardian-card z-10 max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className="w-full px-4 py-2 text-left hover:bg-guardian-background text-guardian-text hover:text-guardian-primary transition-colors"
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
            className="text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary"
          >
            <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </Button>

          {/* User Profile */}
          <div className="relative">
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded-lg hover:bg-guardian-background transition-colors"
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
                <p className="text-sm font-medium text-guardian-text truncate max-w-32">{user?.name}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-guardian-text-secondary flex-shrink-0" />
            </div>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-guardian-background-secondary border border-border rounded-lg shadow-guardian-card z-10 max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-guardian-text truncate">{user?.name}</p>
                  <p className="text-sm text-guardian-text-secondary truncate">{user?.email}</p>
                  <p className="text-xs text-guardian-accent font-semibold mt-1">Family Guardian</p>
                </div>
                {/* Mobile-only items */}
                <div className="sm:hidden border-b border-border">
                </div>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-guardian-background text-guardian-text hover:text-red-600 transition-colors flex items-center"
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