import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { LoginModal } from './LoginModal';
import { useAuth } from '../hooks/useAuth';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { GraduationCap, UserCheck, Shield, Heart } from 'lucide-react';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Embark on gamified learning adventures',
    icon: GraduationCap,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Create engaging content and track progress',
    icon: UserCheck,
    color: 'from-teal-600 to-teal-700'
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Manage system and analyze performance',
    icon: Shield,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'guardian',
    title: 'Guardian',
    description: 'Monitor your child\'s learning journey',
    icon: Heart,
    color: 'from-pink-500 to-rose-600'
  }
];

export const RoleSelector: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, isLoading, userData, user } = useAuth();
  const { getLandingTheme, theme } = useThemeStyles();

  const landingTheme = getLandingTheme();

  // If user is already authenticated, redirect them
  if (isAuthenticated && !isLoading && user && userData) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-text-secondary">Loading STEM-Spark...</p>
        </div>
      </div>
    );
  }

  const handleRoleSelect = (role: string) => {
    console.log('Role selected:', role);
    setSelectedRole(role);
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    console.log('Closing login modal');
    setShowLoginModal(false);
    setSelectedRole('');
  };

  // Don't render anything if we're still loading or if authenticated
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-text-secondary">Loading STEM-Spark...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-4 transition-all duration-300"
        style={{ 
          background: landingTheme.background,
          color: landingTheme.textPrimary
        }}
      >
        <div className="w-full max-w-6xl" style={{ color: landingTheme.textPrimary }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: landingTheme.textPrimary }}>
              Welcome to <span style={{ color: landingTheme.primaryBrand }}>STEM-Spark</span>
            </h1>
            <p className="text-xl mb-8" style={{ color: landingTheme.textSecondary }}>
              Gamified Learning Platform - Choose Your Adventure
            </p>
            <div 
              className="w-24 h-1 mx-auto rounded-full shadow-lg"
              style={{ background: landingTheme.accentGradient }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="text-center group cursor-pointer p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ 
                  backgroundColor: landingTheme.cardBackground,
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                  color: landingTheme.textPrimary
                }}
                onMouseEnter={(e) => {
                  const roleTheme = landingTheme.roleColors[role.id as keyof typeof landingTheme.roleColors];
                  e.currentTarget.style.backgroundColor = roleTheme.hover;
                  e.currentTarget.style.borderColor = roleTheme.primary;
                  if (theme === 'dark' && roleTheme.glow) {
                    e.currentTarget.style.boxShadow = roleTheme.glow;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = landingTheme.cardBackground;
                  e.currentTarget.style.borderColor = theme === 'dark' ? '#374151' : '#E5E7EB';
                  e.currentTarget.style.boxShadow = theme === 'dark' ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => handleRoleSelect(role.id)}
              >
                <div 
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                  style={{ background: `linear-gradient(135deg, ${landingTheme.roleColors[role.id as keyof typeof landingTheme.roleColors].primary}, ${landingTheme.roleColors[role.id as keyof typeof landingTheme.roleColors].secondary})` }}
                >
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: landingTheme.textPrimary }}>{role.title}</h3>
                <p className="text-sm" style={{ color: landingTheme.textSecondary }}>{role.description}</p>
              </div>
            ))}
          </div>

          {/* Demo Credentials Box */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ 
                backgroundColor: landingTheme.cardBackground,
                border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`
              }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: landingTheme.textPrimary }}>Demo Login Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  className="text-center p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'
                  }}
                >
                  <h4 className="font-bold mb-3" style={{ color: landingTheme.roleColors.student.primary }}>Student</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Username:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >student</div>
                    </div>
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Password:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 flex items-center justify-between border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >
                        <span id="student-pass">pass123</span>
                        <button 
                          onClick={() => {
                            const elem = document.getElementById('student-pass');
                            const btn = document.getElementById('student-eye');
                            if (elem && btn) {
                              if (elem.textContent === 'pass123') {
                                elem.textContent = '•••••••';
                                btn.textContent = '👁️';
                              } else {
                                elem.textContent = 'pass123';
                                btn.textContent = '🙈';
                              }
                            }
                          }}
                          id="student-eye"
                          className="text-xs cursor-pointer"
                        >
                          🙈
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="text-center p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'
                  }}
                >
                  <h4 className="font-bold mb-3" style={{ color: landingTheme.roleColors.teacher.primary }}>Teacher</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Username:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >teacher</div>
                    </div>
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Password:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 flex items-center justify-between border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >
                        <span id="teacher-pass">pass123</span>
                        <button 
                          onClick={() => {
                            const elem = document.getElementById('teacher-pass');
                            const btn = document.getElementById('teacher-eye');
                            if (elem && btn) {
                              if (elem.textContent === 'pass123') {
                                elem.textContent = '•••••••';
                                btn.textContent = '👁️';
                              } else {
                                elem.textContent = 'pass123';
                                btn.textContent = '🙈';
                              }
                            }
                          }}
                          id="teacher-eye"
                          className="text-xs cursor-pointer"
                        >
                          🙈
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="text-center p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'
                  }}
                >
                  <h4 className="font-bold mb-3" style={{ color: landingTheme.roleColors.admin.primary }}>Admin</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Username:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >admin</div>
                    </div>
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Password:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 flex items-center justify-between border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >
                        <span id="admin-pass">pass123</span>
                        <button 
                          onClick={() => {
                            const elem = document.getElementById('admin-pass');
                            const btn = document.getElementById('admin-eye');
                            if (elem && btn) {
                              if (elem.textContent === 'pass123') {
                                elem.textContent = '•••••••';
                                btn.textContent = '👁️';
                              } else {
                                elem.textContent = 'pass123';
                                btn.textContent = '🙈';
                              }
                            }
                          }}
                          id="admin-eye"
                          className="text-xs cursor-pointer"
                        >
                          🙈
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="text-center p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'
                  }}
                >
                  <h4 className="font-bold mb-3" style={{ color: landingTheme.roleColors.guardian.primary }}>Guardian</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Username:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >guardian</div>
                    </div>
                    <div>
                      <span style={{ color: landingTheme.textSecondary }}>Password:</span>
                      <div 
                        className="font-mono px-2 py-1 rounded mt-1 flex items-center justify-between border"
                        style={{ 
                          backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6',
                          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
                          color: landingTheme.textPrimary
                        }}
                      >
                        <span id="guardian-pass">pass123</span>
                        <button 
                          onClick={() => {
                            const elem = document.getElementById('guardian-pass');
                            const btn = document.getElementById('guardian-eye');
                            if (elem && btn) {
                              if (elem.textContent === 'pass123') {
                                elem.textContent = '•••••••';
                                btn.textContent = '👁️';
                              } else {
                                elem.textContent = 'pass123';
                                btn.textContent = '🙈';
                              }
                            }
                          }}
                          id="guardian-eye"
                          className="text-xs cursor-pointer"
                        >
                          🙈
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRole && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseLoginModal}
          selectedRole={selectedRole}
        />
      )}
    </>
  );
};