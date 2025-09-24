import React, { useState } from 'react';
import { Button } from './Button';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { GraduationCap, ChevronDown } from 'lucide-react';

interface ClassSelectorProps {
  variant?: 'student' | 'teacher' | 'admin' | 'guardian';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({ 
  variant = 'student', 
  size = 'md',
  className = '' 
}) => {
  const { currentClass, classInfo, changeClass, getAvailableClasses } = useCurrentClass();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const availableClasses = getAvailableClasses();

  const getVariantStyles = () => {
    switch (variant) {
      case 'student':
        return {
          button: 'text-student-primary hover:bg-student-primary hover:text-student-on-primary border-student-primary',
          dropdown: 'bg-student-background-secondary border-border shadow-student-card',
          item: 'hover:bg-student-background text-student-text hover:text-student-primary'
        };
      case 'teacher':
        return {
          button: 'text-teacher-primary hover:bg-teacher-primary hover:text-white border-teacher-primary',
          dropdown: 'bg-teacher-background-secondary border-border shadow-teacher-card',
          item: 'hover:bg-teacher-background text-text hover:text-teacher-primary'
        };
      case 'admin':
        return {
          button: 'text-admin-primary hover:bg-admin-primary hover:text-white border-admin-primary',
          dropdown: 'bg-admin-background-secondary border-border shadow-admin-card',
          item: 'hover:bg-admin-background text-text hover:text-admin-primary'
        };
      case 'guardian':
        return {
          button: 'text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary border-guardian-primary',
          dropdown: 'bg-guardian-background-secondary border-border shadow-guardian-card',
          item: 'hover:bg-guardian-background text-guardian-text hover:text-guardian-primary'
        };
      default:
        return {
          button: 'text-primary hover:bg-primary hover:text-white border-primary',
          dropdown: 'bg-background-secondary border-border shadow-professional-md',
          item: 'hover:bg-background text-text hover:text-primary'
        };
    }
  };

  const styles = getVariantStyles();

  const handleClassChange = (newClassId: string) => {
    changeClass(newClassId);
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className} min-w-0 flex-shrink-0`}>
      <Button
        variant="outline"
        size={size}
        icon={GraduationCap}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`${styles.button} truncate whitespace-nowrap`}
      >
        <span className="truncate max-w-24 sm:max-w-32">{classInfo?.displayName || 'Class'}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>
      
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute right-0 mt-2 w-56 sm:w-64 ${styles.dropdown} rounded-lg z-20 max-h-80 overflow-y-auto shadow-lg`}>
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Select Class
              </div>
              {availableClasses.map((cls) => (
                <button
                  key={cls.id}
                  className={`w-full px-3 py-3 text-left rounded-md transition-colors ${styles.item} ${
                    currentClass === cls.id ? 'bg-primary/10 text-primary font-medium' : ''
                  }`}
                  onClick={() => handleClassChange(cls.id)}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate">{cls.displayName}</span>
                    {cls.stream && (
                      <span className="text-xs text-text-secondary capitalize mt-1">
                        {cls.stream}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};