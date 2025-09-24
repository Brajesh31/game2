// Local Storage Service for managing dynamic user data
import { ClassManagementService } from './ClassManagementService';

export interface StudentProgress {
  studentId: string;
  classLevel: string;
  completedQuests: string[];
  questProgress: Record<string, QuestProgress>;
  achievements: Achievement[];
  streakCount: number;
  lastActivityDate: string;
  totalXP: number;
  level: number;
  portfolioItems: PortfolioItem[];
  arLabsCompleted: string[];
  tutorSessions: TutorSession[];
}

export interface QuestProgress {
  questId: string;
  currentStep: string;
  completedSteps: string[];
  startedAt: string;
  lastActivity: string;
  attempts: number;
  score?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  mockBlockchainHash: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'artwork' | 'writing' | 'experiment';
  createdAt: string;
  tags: string[];
  content: string; // For text content or file references
}

export interface TutorSession {
  id: string;
  studentId: string;
  startTime: string;
  endTime: string;
  messages: TutorMessage[];
  topic: string;
  helpfulness: number; // 1-5 rating
}

export interface TutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  message: string;
  timestamp: string;
  type: 'text' | 'voice' | 'image';
}

export interface StudentPerformanceLog {
  studentId: string;
  questId: string;
  stepId: string;
  wasCorrect: boolean;
  timestamp: string;
  timeSpent: number; // in seconds
  hintsUsed: number;
  difficulty: string;
}

export interface TeamProject {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
  dueDate: string;
  status: 'active' | 'completed' | 'submitted';
  submissions: ProjectSubmission[];
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'drawing';
}

export interface ProjectSubmission {
  id: string;
  studentId: string;
  content: string;
  submittedAt: string;
  fileReferences: string[]; // Mock file names
}

export interface PeerEvaluation {
  id: string;
  evaluatorId: string;
  subjectId: string;
  projectId: string;
  scores: {
    collaboration: number;
    contribution: number;
    communication: number;
    creativity: number;
  };
  comments: string;
  submittedAt: string;
}

export interface CompetitionSubmission {
  id: string;
  competitionId: string;
  studentId: string;
  title: string;
  description: string;
  submittedAt: string;
  fileReferences: string[];
  score?: number;
  judgeComments?: string;
}

export class LocalStorageService {
  private static readonly KEYS = {
    STUDENT_PROGRESS: 'stem_spark_student_progress',
    PERFORMANCE_LOG: 'stem_spark_performance_log',
    TEAM_PROJECTS: 'stem_spark_team_projects',
    PEER_EVALUATIONS: 'stem_spark_peer_evaluations',
    COMPETITION_SUBMISSIONS: 'stem_spark_competition_submissions',
    TUTOR_SESSIONS: 'stem_spark_tutor_sessions'
  };

  // Student Progress Management
  static getStudentProgress(studentId: string): StudentProgress | null {
    const allProgress = this.getAllStudentProgress();
    const progress = allProgress.find(p => p.studentId === studentId) || null;
    
    // Update class level to current class
    if (progress) {
      const currentClass = ClassManagementService.getCurrentClass(studentId);
      progress.classLevel = currentClass;
    }
    
    return progress;
  }

  static getAllStudentProgress(): StudentProgress[] {
    const data = localStorage.getItem(this.KEYS.STUDENT_PROGRESS);
    return data ? JSON.parse(data) : [];
  }

  static saveStudentProgress(progress: StudentProgress): void {
    const allProgress = this.getAllStudentProgress();
    const existingIndex = allProgress.findIndex(p => p.studentId === progress.studentId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(this.KEYS.STUDENT_PROGRESS, JSON.stringify(allProgress));
  }

  static initializeStudentProgress(studentId: string, classLevel: string = 'class_6'): StudentProgress {
    // Use current class from ClassManagementService
    const currentClass = ClassManagementService.getCurrentClass(studentId);
    
    const progress: StudentProgress = {
      studentId,
      classLevel: currentClass,
      completedQuests: [],
      questProgress: {},
      achievements: [],
      streakCount: 0,
      lastActivityDate: new Date().toISOString(),
      totalXP: 0,
      level: 1,
      portfolioItems: [],
      arLabsCompleted: [],
      tutorSessions: []
    };
    
    this.saveStudentProgress(progress);
    return progress;
  }

  // Performance Logging
  static logPerformance(log: StudentPerformanceLog): void {
    const allLogs = this.getPerformanceLogs();
    allLogs.push(log);
    localStorage.setItem(this.KEYS.PERFORMANCE_LOG, JSON.stringify(allLogs));
  }

  static getPerformanceLogs(studentId?: string): StudentPerformanceLog[] {
    const data = localStorage.getItem(this.KEYS.PERFORMANCE_LOG);
    const allLogs = data ? JSON.parse(data) : [];
    return studentId ? allLogs.filter((log: StudentPerformanceLog) => log.studentId === studentId) : allLogs;
  }

  // Quest Progress Management
  static updateQuestProgress(studentId: string, questId: string, stepId: string, completed: boolean = false): void {
    const progress = this.getStudentProgress(studentId) || this.initializeStudentProgress(studentId);
    
    // Ensure class level is current
    progress.classLevel = ClassManagementService.getCurrentClass(studentId);
    
    if (!progress.questProgress[questId]) {
      progress.questProgress[questId] = {
        questId,
        currentStep: stepId,
        completedSteps: [],
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        attempts: 0
      };
    }
    
    const questProgress = progress.questProgress[questId];
    questProgress.currentStep = stepId;
    questProgress.lastActivity = new Date().toISOString();
    questProgress.attempts += 1;
    
    if (completed && !questProgress.completedSteps.includes(stepId)) {
      questProgress.completedSteps.push(stepId);
    }
    
    // Update streak
    const today = new Date().toDateString();
    const lastActivity = new Date(progress.lastActivityDate).toDateString();
    
    if (today !== lastActivity) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivity === yesterday.toDateString()) {
        progress.streakCount += 1;
      } else {
        progress.streakCount = 1;
      }
    }
    
    progress.lastActivityDate = new Date().toISOString();
    this.saveStudentProgress(progress);
  }

  // Achievement Management
  static awardAchievement(studentId: string, achievement: Omit<Achievement, 'earnedAt' | 'mockBlockchainHash'>): void {
    const progress = this.getStudentProgress(studentId) || this.initializeStudentProgress(studentId);
    
    // Check if already earned
    if (progress.achievements.some(a => a.id === achievement.id)) {
      return;
    }
    
    const newAchievement: Achievement = {
      ...achievement,
      earnedAt: new Date().toISOString(),
      mockBlockchainHash: this.generateMockHash()
    };
    
    progress.achievements.push(newAchievement);
    this.saveStudentProgress(progress);
  }

  // Team Projects Management
  static getTeamProjects(): TeamProject[] {
    const data = localStorage.getItem(this.KEYS.TEAM_PROJECTS);
    return data ? JSON.parse(data) : [];
  }

  static saveTeamProject(project: TeamProject): void {
    const projects = this.getTeamProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(this.KEYS.TEAM_PROJECTS, JSON.stringify(projects));
  }

  static addChatMessage(projectId: string, message: ChatMessage): void {
    const projects = this.getTeamProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      project.chatMessages.push(message);
      this.saveTeamProject(project);
    }
  }

  // Tutor Sessions Management
  static saveTutorSession(session: TutorSession): void {
    const sessions = this.getTutorSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(this.KEYS.TUTOR_SESSIONS, JSON.stringify(sessions));
  }

  static getTutorSessions(studentId?: string): TutorSession[] {
    const data = localStorage.getItem(this.KEYS.TUTOR_SESSIONS);
    const allSessions = data ? JSON.parse(data) : [];
    return studentId ? allSessions.filter((s: TutorSession) => s.studentId === studentId) : allSessions;
  }

  // Utility Methods
  private static generateMockHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  static clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Analytics for Admin/Teacher dashboards
  static getAnalytics() {
    const allProgress = this.getAllStudentProgress();
    const allLogs = this.getPerformanceLogs();
    const allProjects = this.getTeamProjects();
    
    return {
      totalStudents: allProgress.length,
      averageLevel: allProgress.reduce((sum, p) => sum + p.level, 0) / allProgress.length || 0,
      totalQuestsCompleted: allProgress.reduce((sum, p) => sum + p.completedQuests.length, 0),
      averageStreak: allProgress.reduce((sum, p) => sum + p.streakCount, 0) / allProgress.length || 0,
      totalAchievements: allProgress.reduce((sum, p) => sum + p.achievements.length, 0),
      activeProjects: allProjects.filter(p => p.status === 'active').length,
      performanceData: allLogs
    };
  }
}