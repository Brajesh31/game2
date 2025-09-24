import { useState, useEffect } from 'react';
import { User, Student, Teacher, Admin, Guardian } from '../types';
import { ClassManagementService } from '../services/ClassManagementService';
import { LocalStorageService } from '../services/LocalStorageService';
import studentData from '../data/studentData.json';
import teacherData from '../data/teacherData.json';
import adminData from '../data/adminData.json';
import guardianData from '../data/guardianData.json';

interface AuthState {
  user: User | null;
  userData: Student | Teacher | Admin | Guardian | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userData: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth data
    const storedAuth = localStorage.getItem('learnquest-auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        // Validate the stored auth data
        if (parsed.user && parsed.userData && parsed.isAuthenticated === true) {
          setAuthState({
            ...parsed,
            isLoading: false
          });
        } else {
          // Invalid stored data, clear it
          localStorage.removeItem('learnquest-auth');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        // Invalid JSON, clear it
        localStorage.removeItem('learnquest-auth');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    // Mock authentication - in real app would validate with backend
    if (password !== 'pass123') return false;

    // Use static data for demo
    let userData;
    switch (role) {
      case 'student':
        if (username !== 'student') return false;
        userData = studentData;
        break;
      case 'teacher':
        if (username !== 'teacher') return false;
        userData = teacherData;
        break;
      case 'admin':
        if (username !== 'admin') return false;
        userData = adminData;
        break;
      case 'guardian':
        if (username !== 'guardian') return false;
        userData = guardianData;
        break;
      default:
        return false;
    }

    // Validate that userData was loaded correctly
    if (!userData || !userData.user) {
      console.error(`Failed to load user data for role: ${role}`);
      console.error('Available userData:', userData);
      return false;
    }

    // Initialize student progress if it's a student
    if (role === 'student' && userData.user) {
      const existingProgress = LocalStorageService.getStudentProgress(userData.user.id);
      if (!existingProgress) {
        LocalStorageService.initializeStudentProgress(userData.user.id);
      }
    }

    // Update class level for student
    if (role === 'student' && userData.user) {
      const currentClass = ClassManagementService.getCurrentClass(userData.user.id);
      userData.user.classLevel = currentClass;
    }

    const newAuthState = {
      user: userData.user,
      userData,
      isAuthenticated: true,
      isLoading: false
    };

    setAuthState(newAuthState);
    localStorage.setItem('learnquest-auth', JSON.stringify(newAuthState));
    
    console.log('Login successful for role:', role, 'User:', userData.user);
    return true;
  };

  const logout = () => {
    const newAuthState = {
      user: null,
      userData: null,
      isAuthenticated: false,
      isLoading: false
    };
    setAuthState(newAuthState);
    localStorage.removeItem('learnquest-auth');
    
    // Clear caches on logout for security and performance
    import('../utils/cacheManager').then(({ CacheManager }) => {
      CacheManager.clearLocalStorageCaches();
    });
    
    // Force navigation to home page
    window.location.href = '/';
  };

  return {
    ...authState,
    login,
    logout
  };
};