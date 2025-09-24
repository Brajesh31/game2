import React from 'react';
import { useEffect, useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick 
}) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Listen for theme changes to force re-render
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('forceThemeUpdate', handleThemeChange);
    window.addEventListener('studentThemeChanged', handleThemeChange);
    window.addEventListener('immediateThemeUpdate', handleThemeChange);
    window.addEventListener('themeUpdateRAF', handleThemeChange);
    window.addEventListener('studentThemeUpdate', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('forceThemeUpdate', handleThemeChange);
      window.removeEventListener('studentThemeChanged', handleThemeChange);
      window.removeEventListener('immediateThemeUpdate', handleThemeChange);
      window.removeEventListener('themeUpdateRAF', handleThemeChange);
      window.removeEventListener('studentThemeUpdate', handleThemeChange);
    };
  }, []);
  
  const baseClasses = 'card-professional bg-background border border-border shadow-card-default rounded-xl p-6 transition-all duration-300';
  const hoverClasses = hover ? 'cursor-pointer hover:shadow-card-hover hover:scale-[1.02] transition-all duration-200' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};