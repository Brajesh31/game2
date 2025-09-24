export interface User {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'guardian';
  email: string;
  avatar?: string;
}

export interface Student {
  user: User;
  level: number;
  xp: number;
  achievements: Achievement[];
  skillTree: SkillNode[];
  currentQuests: Quest[];
}

export interface Teacher {
  user: User;
  subjects: string[];
  classes: Class[];
  students: string[];
  recentActivity?: Array<{
    message: string;
    timestamp: string;
  }>;
}

export interface Admin {
  user: User;
  permissions: string[];
  systemMetrics: SystemMetrics;
  analyticsData: {
    userGrowth: Array<{
      month: string;
      students: number;
      teachers: number;
      guardians: number;
    }>;
    engagementMetrics: {
      dailyActive: number[];
      completionRates: {
        quests: number;
        challenges: number;
        assessments: number;
      };
      weeklyRetention: number;
      averageSessionTime: number;
    };
  };
}

export interface Guardian {
  user: User;
  children: string[];
  childrenProgress: Array<{
    id: string;
    name: string;
    currentLevel: number;
    weeklyProgress: number;
    timeSpent: string;
    recentAchievements: number;
    subjects: Array<{
      name: string;
      progress: number;
    }>;
  }>;
  notifications: Notification[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  blockchainTxId?: string;
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in-progress' | 'mastered';
  prerequisites: string[];
  xpRequired: number;
  position: { x: number; y: number };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'challenge';
  progress: number;
  maxProgress: number;
  xpReward: number;
  deadline?: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  avgProgress: number;
}

export interface SystemMetrics {
  totalUsers: number;
  activeToday: number;
  averageEngagement: number;
  systemHealth: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}