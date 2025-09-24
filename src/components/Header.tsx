import React from 'react';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { LogOut, Moon, Sun, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) {
    return null;
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">STEM-Spark</h1>
          {user && (
            <div className="hidden md:block text-text-secondary">
              <span className="capitalize">{user.role}</span> Dashboard
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? Moon : Sun}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </Button>

          {user && (
            <>
              <Button variant="ghost" size="sm" icon={Bell}>
                <span className="sr-only">Notifications</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-text">{user.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};