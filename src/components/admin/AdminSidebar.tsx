import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isVisible?: boolean;
  isMobile?: boolean;
}

const navigationItems = [
  { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'User Management' },
  { path: '/admin/content', icon: BookOpen, label: 'Content Management' },
  { path: '/admin/monitoring', icon: Activity, label: 'System Monitoring' },
  { path: '/admin/analytics', icon: TrendingUp, label: 'System Analytics' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
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
        isMobile ? 'shadow-2xl' : 'shadow-admin-card'
      } ${!localCollapsed ? 'sidebar-expanded' : ''}`}
      style={{
        backgroundColor: 'var(--color-admin-bg-secondary)',
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
                  ? 'admin-nav-active shadow-admin-card'
                  : 'hover:shadow-admin-card'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#FFFFFF' : 'var(--color-admin-text-primary)',
              backgroundColor: isActive ? 'var(--color-admin-primary)' : 'transparent'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('admin-nav-active')) {
                e.currentTarget.style.backgroundColor = 'var(--color-admin-bg-tertiary)';
                e.currentTarget.style.color = 'var(--color-admin-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('admin-nav-active')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-admin-text-primary)';
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
                className="absolute left-full ml-2 px-3 py-2 text-sm rounded-lg shadow-admin-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                style={{
                  backgroundColor: 'var(--color-admin-bg-secondary)',
                  color: 'var(--color-admin-text-primary)'
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