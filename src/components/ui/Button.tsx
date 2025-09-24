import React from 'react';
import { useEffect, useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading,
  children,
  className = '',
  disabled,
  ...props
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
  
  const baseClasses = 'btn-professional inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'focus:ring-primary',
    secondary: 'focus:ring-primary shadow-card-default hover:shadow-card-hover',
    outline: 'border focus:ring-primary hover:border-primary',
    ghost: 'focus:ring-primary',
    danger: 'focus:ring-danger shadow-card-default hover:shadow-card-hover',
    success: 'focus:ring-success shadow-card-default hover:shadow-card-hover',
    warning: 'focus:ring-warning shadow-card-default hover:shadow-card-hover'
  };
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)',
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary, #6C757D)',
          color: '#FFFFFF',
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: 'none'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger, #DC3545)',
          color: '#FFFFFF',
          border: 'none'
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-success, #28A745)',
          color: '#FFFFFF',
          border: 'none'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning, #FFC107)',
          color: '#FFFFFF',
          border: 'none'
        };
      default:
        return {};
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={getVariantStyles(variant)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
      {Icon && iconPosition === 'right' && !isLoading ? (
        <Icon className="w-4 h-4 ml-2" />
      ) : null}
    </button>
  );
};