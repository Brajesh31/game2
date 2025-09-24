import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-student-primary text-white shadow-student-card hover:shadow-student-hover';
      case 'secondary':
        return 'btn-student-secondary text-white shadow-student-card hover:shadow-student-hover';
      case 'accent':
        return 'btn-student-accent text-white shadow-student-card hover:shadow-student-hover';
      case 'outline':
        return 'border-2 border-student-primary text-student-primary hover:bg-student-primary hover:text-white bg-transparent';
      case 'ghost':
        return 'text-student-primary hover:bg-student-primary/10 bg-transparent';
      default:
        return 'btn-student-primary text-white shadow-student-card hover:shadow-student-hover';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm min-h-[36px] min-w-[36px]'; // Minimum 36px for mobile
      case 'md':
        return 'px-4 py-2 text-base min-h-[44px] min-w-[44px]'; // Standard 44px touch target
      case 'lg':
        return 'px-6 py-3 text-lg min-h-[48px] min-w-[48px]'; // Larger for important actions
      case 'xl':
        return 'px-8 py-4 text-xl min-h-[56px] min-w-[56px]'; // Extra large for hero actions
      default:
        return 'px-4 py-2 text-base min-h-[44px] min-w-[44px]';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-student-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    student-click-bounce
    ${fullWidth ? 'w-full' : ''}
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
      ) : null}
      
      <span className="truncate">{children}</span>
      
      {Icon && iconPosition === 'right' && !loading ? (
        <Icon className="w-4 h-4 ml-2 flex-shrink-0" />
      ) : null}
    </button>
  );
};

// Responsive Button Styles for CSS
export const responsiveButtonStyles = `
/* Responsive Button Styles */
.responsive-button-base {
  /* Ensure minimum touch targets on all devices */
  min-height: 44px;
  min-width: 44px;
  
  /* Smooth transitions */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Focus styles for accessibility */
  focus:outline-none;
  focus:ring-2;
  focus:ring-offset-2;
}

/* Mobile-first responsive design */
@media (max-width: 767px) {
  .responsive-button-base {
    /* Larger touch targets on mobile */
    min-height: 48px;
    min-width: 48px;
    
    /* Adjust padding for mobile */
    padding: 12px 16px;
    
    /* Larger text on mobile for readability */
    font-size: 16px;
  }
  
  .responsive-button-sm {
    min-height: 40px;
    min-width: 40px;
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .responsive-button-lg {
    min-height: 56px;
    min-width: 56px;
    padding: 16px 24px;
    font-size: 18px;
  }
}

/* Tablet styles */
@media (min-width: 768px) and (max-width: 1024px) {
  .responsive-button-base {
    min-height: 44px;
    min-width: 44px;
    padding: 10px 16px;
    font-size: 15px;
  }
}

/* Desktop styles */
@media (min-width: 1025px) {
  .responsive-button-base {
    min-height: 40px;
    min-width: 40px;
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .responsive-button-base:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .responsive-button-base {
    /* Slightly larger for high DPI screens */
    min-height: 46px;
    min-width: 46px;
  }
}

/* Accessibility - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .responsive-button-base {
    transition: none;
  }
  
  .responsive-button-base:hover {
    transform: none;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .responsive-button-base {
    /* Ensure sufficient contrast in dark mode */
    border-width: 1px;
  }
}
`;