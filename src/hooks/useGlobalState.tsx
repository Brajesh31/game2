import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { ClassManagementService } from '../services/ClassManagementService';

interface GlobalState {
  users: Record<string, any>;
  classes: Record<string, any>;
  quests: any[];
  messages: any[];
  achievements: any[];
  studentProgress: Record<string, any>;
  systemMetrics: any;
}

interface GlobalStateContextType {
  state: GlobalState;
  updateUser: (userId: string, updates: any) => void;
  addQuest: (quest: any) => void;
  addMessage: (message: any) => void;
  updateStudentStatus: (studentId: string, status: string) => void;
  updateTeacherProgress: (teacherId: string, moduleId: string) => void;
  getStudentsByStatus: (status: string) => any[];
  getMessagesForUser: (userId: string) => any[];
  getQuestsForStudent: (studentId: string) => any[];
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>({
    users: {},
    classes: {},
    quests: [],
    messages: [],
    achievements: [],
    studentProgress: {},
    systemMetrics: {}
  });

  // Load initial data
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        // Load data from backend database files
        const [users, messages, progressData] = await Promise.all([
          DatabaseService.loadUsers(),
          DatabaseService.loadMessages(),
          DatabaseService.loadStudentProgress()
        ]);
        
        setState({
          users,
          classes: {}, // Will be populated from content service
          quests: [], // Will be loaded dynamically based on class
          messages,
          achievements: [], // Will be loaded from progress data
          studentProgress: progressData,
          systemMetrics: {
            totalUsers: Object.keys(users).length,
            activeToday: Math.floor(Object.keys(users).length * 0.7),
            averageEngagement: 76.3,
            systemHealth: 98.5
          }
        });
      } catch (error) {
        console.error('Failed to load database:', error);
      }
    };
    
    loadDatabase();
    
    // Listen for class changes to reload relevant data
    const cleanup = ClassManagementService.onClassChange(() => {
      DatabaseService.clearCaches();
      loadDatabase();
    });
    
    return cleanup;
  }, []);

  const updateUser = (userId: string, updates: any) => {
    // Update in database service
    DatabaseService.updateUser(userId, updates);
    
    // Update local state
    setState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [userId]: {
          ...prev.users[userId],
          ...updates
        }
      }
    }));
  };

  const addQuest = (quest: any) => {
    const newQuest = {
      ...quest,
      id: `quest-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    setState(prev => ({
      ...prev,
      quests: [...prev.quests, newQuest]
    }));
  };

  const addMessage = (message: any) => {
    // Add to database service
    DatabaseService.addMessage(message);
    
    // Update local state
    const newMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  const updateStudentStatus = (studentId: string, status: string) => {
    setState(prev => {
      const updatedUsers = {
        ...prev.users,
        [studentId]: {
          ...prev.users[studentId],
          status,
          lastUpdated: new Date().toISOString()
        }
      };

      // Update system metrics
      const strugglingCount = Object.values(updatedUsers)
        .filter((user: any) => user.role === 'student' && (user.status === 'Struggling' || user.status === 'Needs Help'))
        .length;

      return {
        ...prev,
        users: updatedUsers,
        systemMetrics: {
          ...prev.systemMetrics,
          strugglingStudents: strugglingCount
        }
      };
    });
  };

  const updateTeacherProgress = (teacherId: string, moduleId: string) => {
    setState(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [teacherId]: {
          ...prev.users[teacherId],
          professionalDevelopment: {
            ...prev.users[teacherId].professionalDevelopment,
            completedModules: prev.users[teacherId].professionalDevelopment.completedModules + 1
          }
        }
      }
    }));
  };

  const getStudentsByStatus = (status: string) => {
    return Object.values(state.users).filter(
      (user: any) => user.role === 'student' && user.status === status
    );
  };

  const getMessagesForUser = (userId: string) => {
    return state.messages.filter(
      (message: any) => message.toId === userId || message.fromId === userId
    );
  };

  const getQuestsForStudent = (studentId: string) => {
    return state.quests.filter((quest: any) => quest.status === 'active');
  };

  return (
    <GlobalStateContext.Provider value={{
      state,
      updateUser,
      addQuest,
      addMessage,
      updateStudentStatus,
      updateTeacherProgress,
      getStudentsByStatus,
      getMessagesForUser,
      getQuestsForStudent
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};