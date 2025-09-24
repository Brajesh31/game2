import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import {
  Home,
  Target,
  Trophy,
  FlaskConical,
  Users,
  User,
  Brain,
  Globe,
  Crown,
  Wrench,
  BookOpen,
  Beaker,
  Gamepad2,
  WifiOff,
  Settings,
  BookMarked,
  MessageSquare,
  Lightbulb,
  Briefcase,
  Award,
  Heart,
  Zap,
  Camera,
  Wifi,
  Palette,
  Sword,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StudentSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isVisible?: boolean;
  isMobile?: boolean;
}

const navigationItems = [
  { path: '/student/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/student/my-quests', icon: Target, label: 'My Quests' },
  { path: '/student/epic-quests', icon: Sword, label: 'Epic Quests' },
  { path: '/student/achievements', icon: Trophy, label: 'Achievements' },
  { path: '/student/labs', icon: FlaskConical, label: 'Labs' },
  { path: '/student/collaborate', icon: Users, label: 'Collaborate' },
  { path: '/student/subjects', icon: BookMarked, label: 'Subjects' },
  { path: '/student/clubs', icon: Users, label: 'Student Clubs' },
  { path: '/student/mentorship', icon: Lightbulb, label: 'Peer Mentorship' },
  { path: '/student/forum', icon: MessageSquare, label: 'Doubt Forum' },
  { path: '/student/showcase', icon: Camera, label: 'Community Showcase' },
  { path: '/student/profile', icon: User, label: 'Adventurer Profile' },
  { path: '/student/ai-path', icon: Brain, label: 'AI Learning Path' },
  { path: '/student/world-challenges', icon: Globe, label: 'World Challenges' },
  { path: '/student/hall-of-fame', icon: Crown, label: 'Hall of Fame' },
  { path: '/student/jugaad-studio', icon: Wrench, label: 'Jugaad Studio' },
  { path: '/student/adventure-log', icon: BookOpen, label: 'Adventure Log' },
  { path: '/student/science-fair', icon: Beaker, label: 'Science Fair' },
  { path: '/student/career-explorer', icon: Briefcase, label: 'Career Explorer' },
  { path: '/student/scholarships', icon: Award, label: 'Scholarships' },
  { path: '/student/wellbeing', icon: Heart, label: 'Well-being Mode' },
  { path: '/student/mesh-network', icon: Wifi, label: 'StudentNet' },
  { path: '/student/studentnet', icon: Zap, label: 'StudentNet Hub' },
  { path: '/student/wisdom-bank', icon: Users, label: 'Wisdom Bank' },
  { path: '/student/scenario-sim', icon: Zap, label: 'What If? Simulator' },
  { path: '/student/avatar-builder', icon: Palette, label: 'Avatar Builder' },
  { path: '/student/game-zone', icon: Gamepad2, label: 'Game Zone' },
  { path: '/student/metaverse', icon: Gamepad2, label: 'Learning Metaverse' },
  { path: '/student/offline', icon: WifiOff, label: 'Offline Mode' },
  { path: '/student/settings', icon: Settings, label: 'Settings' },
];

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
                                                                collapsed,
                                                                onToggle,
                                                                isVisible = true,
                                                                isMobile = false
                                                              }) => {
  const [localCollapsed, setLocalCollapsed] = useState(collapsed);
  const { currentClass } = useCurrentClass();

  useEffect(() => {
    setLocalCollapsed(collapsed);
  }, [collapsed]);

  // Force re-render when class changes
  useEffect(() => {
    // This will cause the sidebar to re-render when class changes
  }, [currentClass]);

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
              isMobile ? 'shadow-2xl' : 'shadow-student-card'
          } ${!localCollapsed ? 'sidebar-expanded' : ''}`}
          style={{
            backgroundColor: 'var(--student-nav-bg)',
            borderRight: 'var(--student-nav-border)',
            boxShadow: 'var(--student-nav-elevation)',
            top: isVisible ? '80px' : '16px',
            height: isVisible ? 'calc(100vh - 80px)' : 'calc(100vh - 16px)',
            width: sidebarWidth,
            transform: `translateX(${translateX})`,
          }}
      >
        {/* Navigation */}
        <nav className={`h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            collapsed && !isMobile ? 'px-2 py-4' : 'p-4'
        }`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className={`space-y-2 ${collapsed && !isMobile ? 'space-y-3' : ''}`}>
            {navigationItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      // Ensure navigation works regardless of class
                      if (isMobile) {
                        setLocalCollapsed(true);
                        onToggle();
                      }
                    }}
                    className={({ isActive }) =>
                        `flex items-center rounded-xl transition-all duration-200 group relative ${
                            collapsed && !isMobile
                                ? 'justify-center p-3 mx-auto w-12 h-12'
                                : 'space-x-3 px-4 py-3'
                        } ${
                            isActive
                                ? 'shadow-student-card'
                                : 'hover:shadow-student-card'
                        }`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--student-header-text)' : 'var(--student-nav-item-text)',
                      backgroundColor: isActive ? 'var(--student-nav-item-active-bg)' : 'transparent',
                      boxShadow: isActive ? 'var(--student-card-shadow)' : 'none'
                    })}
                    onMouseEnter={(e) => {
                      const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--student-nav-item-hover-bg)';
                        e.currentTarget.style.color = 'var(--student-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--student-nav-item-text)';
                      }
                    }}
                    title={collapsed && !isMobile ? item.label : undefined}
                >
                  <item.icon className={`flex-shrink-0 ${
                      collapsed && !isMobile ? 'w-6 h-6' : 'w-5 h-5'
                  }`} />
                  {(!collapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && !isMobile && (
                      <div
                          className="absolute left-full ml-2 px-3 py-2 text-sm rounded-lg shadow-student-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                          style={{
                            backgroundColor: 'var(--student-card-bg)',
                            color: 'var(--student-body-text)',
                            boxShadow: 'var(--student-card-shadow)'
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