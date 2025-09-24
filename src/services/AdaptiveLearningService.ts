// Adaptive Learning Service for quest difficulty adjustment
import { ContentService } from './ContentService';
import { LocalStorageService, StudentPerformanceLog } from './LocalStorageService';

export interface AdaptiveRecommendation {
  nextStepId: string;
  difficulty: 'easier' | 'same' | 'harder';
  reason: string;
  confidenceLevel: number; // 0-1
}

export class AdaptiveLearningService {
  private static readonly PERFORMANCE_WINDOW = 5; // Look at last 5 attempts
  private static readonly SUCCESS_THRESHOLD = 0.7; // 70% success rate
  private static readonly STRUGGLE_THRESHOLD = 0.4; // 40% success rate

  static async getNextStep(studentId: string, questId: string, currentStepId: string, classLevel: string): Promise<AdaptiveRecommendation> {
    const quest = await ContentService.getQuestById(questId, classLevel);
    if (!quest) {
      return {
        nextStepId: currentStepId,
        difficulty: 'same',
        reason: 'Quest not found',
        confidenceLevel: 0
      };
    }

    const currentStep = quest.steps.find((step: any) => step.id === currentStepId);
    if (!currentStep || !currentStep.adaptivity) {
      // No adaptivity defined, follow linear progression
      const currentIndex = quest.steps.findIndex((step: any) => step.id === currentStepId);
      const nextStep = quest.steps[currentIndex + 1];
      
      return {
        nextStepId: nextStep?.id || currentStepId,
        difficulty: 'same',
        reason: 'Linear progression',
        confidenceLevel: 1.0
      };
    }

    // Analyze recent performance
    const recentPerformance = this.analyzeRecentPerformance(studentId, questId);
    const recommendation = this.makeAdaptiveDecision(currentStep, recentPerformance);

    return recommendation;
  }

  private static analyzeRecentPerformance(studentId: string, questId: string): {
    successRate: number;
    averageTime: number;
    hintsUsed: number;
    attempts: number;
  } {
    const logs = LocalStorageService.getPerformanceLogs(studentId)
      .filter(log => log.questId === questId)
      .slice(-this.PERFORMANCE_WINDOW); // Get recent attempts

    if (logs.length === 0) {
      return {
        successRate: 0.5, // Neutral starting point
        averageTime: 0,
        hintsUsed: 0,
        attempts: 0
      };
    }

    const successRate = logs.filter(log => log.wasCorrect).length / logs.length;
    const averageTime = logs.reduce((sum, log) => sum + log.timeSpent, 0) / logs.length;
    const hintsUsed = logs.reduce((sum, log) => sum + log.hintsUsed, 0);

    return {
      successRate,
      averageTime,
      hintsUsed,
      attempts: logs.length
    };
  }

  private static makeAdaptiveDecision(currentStep: any, performance: any): AdaptiveRecommendation {
    const { successRate, averageTime, hintsUsed } = performance;

    // Student is struggling - provide remedial content
    if (successRate < this.STRUGGLE_THRESHOLD || hintsUsed > 3) {
      return {
        nextStepId: currentStep.adaptivity.on_incorrect || currentStep.id + '_remedial',
        difficulty: 'easier',
        reason: `Low success rate (${Math.round(successRate * 100)}%) indicates need for additional support`,
        confidenceLevel: 0.8
      };
    }

    // Student is excelling - provide advanced content or skip ahead
    if (successRate > this.SUCCESS_THRESHOLD && averageTime < 30 && hintsUsed === 0) {
      const advancedStep = currentStep.adaptivity.on_mastery || currentStep.adaptivity.on_correct;
      return {
        nextStepId: advancedStep,
        difficulty: 'harder',
        reason: `High success rate (${Math.round(successRate * 100)}%) with quick completion suggests readiness for advanced content`,
        confidenceLevel: 0.9
      };
    }

    // Student is performing adequately - continue normal progression
    return {
      nextStepId: currentStep.adaptivity.on_correct,
      difficulty: 'same',
      reason: `Steady performance (${Math.round(successRate * 100)}% success) indicates appropriate difficulty level`,
      confidenceLevel: 0.7
    };
  }

  static logStepCompletion(
    studentId: string, 
    questId: string, 
    stepId: string, 
    wasCorrect: boolean, 
    timeSpent: number, 
    hintsUsed: number = 0
  ): void {
    const log: StudentPerformanceLog = {
      studentId,
      questId,
      stepId,
      wasCorrect,
      timestamp: new Date().toISOString(),
      timeSpent,
      hintsUsed,
      difficulty: 'medium' // Could be determined dynamically
    };

    LocalStorageService.logPerformance(log);
    LocalStorageService.updateQuestProgress(studentId, questId, stepId, wasCorrect);

    // Check for achievements
    this.checkForAchievements(studentId, questId, wasCorrect);
  }

  private static checkForAchievements(studentId: string, questId: string, wasCorrect: boolean): void {
    const progress = LocalStorageService.getStudentProgress(studentId);
    if (!progress) return;

    // First quest completion
    if (wasCorrect && progress.completedQuests.length === 0) {
      LocalStorageService.awardAchievement(studentId, {
        id: 'first_quest_complete',
        title: 'Quest Conqueror',
        description: 'Completed your first learning quest!',
        icon: 'trophy'
      });
    }

    // Streak achievements
    if (progress.streakCount === 7) {
      LocalStorageService.awardAchievement(studentId, {
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintained a 7-day learning streak!',
        icon: 'flame'
      });
    }

    // Perfect performance achievement
    const recentLogs = LocalStorageService.getPerformanceLogs(studentId)
      .filter(log => log.questId === questId)
      .slice(-5);

    if (recentLogs.length >= 5 && recentLogs.every(log => log.wasCorrect)) {
      LocalStorageService.awardAchievement(studentId, {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieved 100% accuracy on 5 consecutive problems!',
        icon: 'star'
      });
    }
  }

  static async getPersonalizedRecommendations(studentId: string, classLevel: string): Promise<{
    recommendedQuests: string[];
    skillsToImprove: string[];
    strengths: string[];
  }> {
    const progress = LocalStorageService.getStudentProgress(studentId);
    const logs = LocalStorageService.getPerformanceLogs(studentId);

    if (!progress || logs.length === 0) {
      return {
        recommendedQuests: ['number_explorer', 'scientist_detective'],
        skillsToImprove: [],
        strengths: []
      };
    }

    // Analyze performance by topic/skill
    const skillPerformance = this.analyzeSkillPerformance(logs);
    
    const strengths = Object.entries(skillPerformance)
      .filter(([_, performance]: [string, any]) => performance.successRate > 0.8)
      .map(([skill, _]) => skill);

    const skillsToImprove = Object.entries(skillPerformance)
      .filter(([_, performance]: [string, any]) => performance.successRate < 0.6)
      .map(([skill, _]) => skill);

    // Recommend quests based on skill gaps and completed content
    const allQuests = await ContentService.getAllQuests(classLevel);
    const recommendedQuests = allQuests
      .filter(quest => !progress.completedQuests.includes(quest.id))
      .slice(0, 3)
      .map(quest => quest.id);

    return {
      recommendedQuests,
      skillsToImprove,
      strengths
    };
  }

  private static analyzeSkillPerformance(logs: StudentPerformanceLog[]): Record<string, any> {
    // Group logs by difficulty/topic (simplified)
    const skillGroups: Record<string, StudentPerformanceLog[]> = {};
    
    logs.forEach(log => {
      const skill = log.difficulty || 'general';
      if (!skillGroups[skill]) {
        skillGroups[skill] = [];
      }
      skillGroups[skill].push(log);
    });

    // Calculate performance metrics for each skill
    const skillPerformance: Record<string, any> = {};
    
    Object.entries(skillGroups).forEach(([skill, skillLogs]) => {
      const successRate = skillLogs.filter(log => log.wasCorrect).length / skillLogs.length;
      const averageTime = skillLogs.reduce((sum, log) => sum + log.timeSpent, 0) / skillLogs.length;
      
      skillPerformance[skill] = {
        successRate,
        averageTime,
        attempts: skillLogs.length
      };
    });

    return skillPerformance;
  }
}