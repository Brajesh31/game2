import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelector } from './components/RoleSelector';
import { GlobalLayout } from './components/layout/GlobalLayout';
import { StudentRoutes } from './components/student/StudentRoutes';
import { TeacherRoutes } from './components/teacher/TeacherRoutes';
import { AdminRoutes } from './components/admin/AdminRoutes';
import { GuardianRoutes } from './components/guardian/GuardianRoutes';
import { ToastContainer } from './components/ToastContainer';
import { GlobalStateProvider } from './hooks/useGlobalState';
import { DatabaseSyncService } from './services/DatabaseSyncService';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useStudentTheme } from './hooks/useStudentTheme';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole: string }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, userData, isAuthenticated, isLoading } = useAuth();
  
  console.log('ProtectedRoute check:', { 
    isLoading, 
    isAuthenticated, 
    userRole: user?.role, 
    requiredRole,
    hasUserData: !!userData 
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user || !userData || user.role !== requiredRole) {
    console.log('Access denied:', { 
      isAuthenticated, 
      hasUser: !!user, 
      hasUserData: !!userData, 
      userRole: user?.role, 
      requiredRole 
    });
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const { generateStudentCSS } = useStudentTheme();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const { user } = useAuth();

  // Track current user role for theme application
  useEffect(() => {
    setCurrentUserRole(user?.role || null);
  }, [user?.role]);

  useEffect(() => {
    // Initialize database sync when app starts
    DatabaseSyncService.initialize();
    
    // Initialize cache management
    import('./utils/cacheManager').then(({ CacheManager }) => {
      // Schedule automatic cache clearing every 24 hours
      CacheManager.scheduleAutoCacheClear(24);
      
      // Log current cache info
      const cacheInfo = CacheManager.getCacheInfo();
      console.log('📊 Cache Info:', cacheInfo);
    });
    
    return () => {
      DatabaseSyncService.cleanup();
    };
  }, []);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Clear all existing theme classes first
    root.classList.remove('dark-theme', 'light-theme');
    body.classList.remove('dark-theme', 'light-theme');
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark-theme');
      body.classList.add('dark-theme');
      body.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.add('light-theme');
      body.classList.add('light-theme');
      body.removeAttribute('data-theme');
    }
    
    // Apply CSS variables immediately
    const themeVariables = {
      '--color-primary': theme === 'dark' ? '#3B82F6' : '#2563EB',
      '--color-bg-primary': theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
      '--color-text-primary': theme === 'dark' ? '#F8F9FA' : '#212529'
    };
    
    Object.entries(themeVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Force immediate re-render of theme-dependent components - no delay
    const themeChangeEvent = new CustomEvent('themeChanged', { 
      detail: { theme, timestamp: Date.now() } 
    });
    window.dispatchEvent(themeChangeEvent);
    
    const forceUpdateEvent = new CustomEvent('forceThemeUpdate', { 
      detail: { theme, timestamp: Date.now() } 
    });
    window.dispatchEvent(forceUpdateEvent);
    
    // Apply theme to root container
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
      rootContainer.style.backgroundColor = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
      rootContainer.style.color = theme === 'dark' ? '#F8F9FA' : '#212529';
      rootContainer.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-background ${theme} overflow-x-hidden transition-all duration-300`} data-theme={theme}>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute requiredRole="student">
              <GlobalLayout>
                <StudentRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute requiredRole="teacher">
              <GlobalLayout>
                <TeacherRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/*" 
          element={
            <ProtectedRoute requiredRole="teacher">
              <GlobalLayout>
                <TeacherRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <GlobalLayout>
                <AdminRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <GlobalLayout>
                <AdminRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/guardian" 
          element={
            <ProtectedRoute requiredRole="guardian">
              <GlobalLayout>
                <GuardianRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/guardian/*" 
          element={
            <ProtectedRoute requiredRole="guardian">
              <GlobalLayout>
                <GuardianRoutes />
              </GlobalLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <GlobalStateProvider>
        <ToastContainer>
          <AppContent />
        </ToastContainer>
      </GlobalStateProvider>
    </Router>
  );
}

export default App;