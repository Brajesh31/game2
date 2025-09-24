import React from 'react';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
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
  
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div 
          className={`modal-professional inline-block w-full ${sizeClasses[size]} p-6 my-8 text-left align-middle transition-all transform rounded-xl relative`}
          style={{
            backgroundColor: 'var(--color-modal-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)'
          }}
          role="dialog"
          aria-modal="true"
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};