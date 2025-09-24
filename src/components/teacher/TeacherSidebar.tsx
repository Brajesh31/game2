import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  PlusCircle, 
  TrendingUp, 
  MessageSquare, 
  GraduationCap,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface TeacherSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isVisible?: boolean;
  isMobile?: boolean;
}

const navigationItems = [
  { path: '/teacher/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/teacher/classroom', icon: Users, label: 'Classroom Manager' },
  { path: '/teacher/content', icon: PlusCircle, label: 'Content Creator' },
  { path: '/teacher/gradebook', icon: BookOpen, label: 'Grade Book' },
  { path: '/teacher/attendance', icon: Calendar, label: 'Attendance Tracker' },
  { path: '/teacher/analytics', icon: TrendingUp, label: 'Analytics & Reports' },
  { path: '/teacher/communication', icon: MessageSquare, label: 'Parent Communication' },
  { path: '/teacher/development', icon: GraduationCap, label: 'Professional Development' },
];

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ 
  collapsed, 
  onToggle, 
  isVisible = true, 
  isMobile = false 
}) => {
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  
  useEffect(() => {
    setLocalCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    const handleToggleMobile = () => {
      if (isMobile) {
        setLocalCollapsed(!localCollapsed);
        onToggle();
      }
    };

    window.addEventListener('toggleMobileSidebar', handleToggleMobile);
    return () => window.removeEventListener('toggleMobileSidebar', handleToggleMobile);
  }, [localCollapsed, onToggle]);

  const sidebarWidth = isMobile ? (localCollapsed ? '0' : '320px') : (collapsed ? '64px' : '280px');
  const translateX = isMobile && localCollapsed ? '-100%' : '0';

  return (
    <aside 
      id="global-sidebar"
      className={`fixed left-0 z-40 transition-all duration-300 ${
        isMobile ? 'shadow-2xl' : 'shadow-teacher-card'
      } ${!localCollapsed ? 'sidebar-expanded' : ''}`}
      style={{
        backgroundColor: 'var(--color-teacher-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        top: isVisible ? '80px' : '16px',
        height: isVisible ? 'calc(100vh - 80px)' : 'calc(100vh - 16px)',
        width: sidebarWidth,
        transform: `translateX(${translateX})`,
      }}
    >
      {/* Navigation */}
      <nav className={`h-full overflow-y-auto transition-all duration-300 ${
        collapsed && !isMobile ? 'px-2 py-4' : 'p-4'
      }`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className={`space-y-2 ${collapsed && !isMobile ? 'space-y-3' : ''}`}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center rounded-xl transition-all duration-200 group relative ${
                collapsed && !isMobile
                  ? 'justify-center p-3 mx-auto w-12 h-12' 
                  : 'space-x-3 px-4 py-3'
              } ${
                isActive
                  ? 'teacher-nav-active shadow-teacher-card'
                  : 'hover:shadow-teacher-card'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#FFFFFF' : 'var(--color-teacher-text-primary)',
              backgroundColor: isActive ? 'var(--color-teacher-primary)' : 'transparent'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('teacher-nav-active')) {
                e.currentTarget.style.backgroundColor = 'var(--color-teacher-bg-tertiary)';
                e.currentTarget.style.color = 'var(--color-teacher-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('teacher-nav-active')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-teacher-text-primary)';
              }
            }}
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <item.icon className={`flex-shrink-0 transition-colors duration-300 ${
              collapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5'
            }`} />
            {(!collapsed || isMobile) && (
              <span className="font-medium transition-colors duration-300">{item.label}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {collapsed && !isMobile && (
              <div 
                className="absolute left-full ml-2 px-3 py-2 text-sm rounded-lg shadow-teacher-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                style={{
                  backgroundColor: 'var(--color-teacher-bg-secondary)',
                  color: 'var(--color-teacher-text-primary)'
                }}
              >
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
        </div>
      </nav>
    </aside>
  );
};