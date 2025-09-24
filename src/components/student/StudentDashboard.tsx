import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveButton } from '../ResponsiveButton';
import { QuestProgressEngine } from '../QuestProgressEngine';
import { Modal } from '../../ui/Modal';
import { useAuth } from '../../../hooks/useAuth';
import { useCurrentClass } from '../../../hooks/useCurrentClass';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { ContentService } from '../../../services/ContentService';
import { useToast } from '../../ToastContainer';
import { Student } from '../../../types';
import { Play, Target, Trophy, Zap, BookOpen, FlaskConical, Gamepad2 } from 'lucide-react';
import { Sword } from 'lucide-react';

export const EnhancedStudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();
    const { currentClass, classInfo } = useCurrentClass();
    const { showToast } = useToast();
    const [availableQuests, setAvailableQuests] = useState<any[]>([]);
    const [dailyChallenge, setDailyChallenge] = useState<any>(null);
    const [showQuestModal, setShowQuestModal] = useState(false);
    const [selectedQuestId, setSelectedQuestId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0);

    const student = userData as Student | null;
    const studentId = student?.user?.id || 'student-001';

    // Get or initialize student progress
    const studentProgress = LocalStorageService.getStudentProgress(studentId) ||
        LocalStorageService.initializeStudentProgress(studentId);

    // Listen for class changes
    useEffect(() => {
        const handleClassChange = () => {
            setForceUpdate(prev => prev + 1);
        };

        window.addEventListener('classChanged', handleClassChange);
        return () => window.removeEventListener('classChanged', handleClassChange);
    }, []);

    useEffect(() => {
        const loadDashboardContent = async () => {
            setLoading(true);
            try {
                // Load available quests
                const quests = await ContentService.getAllQuests(currentClass);
                setAvailableQuests(quests.slice(0, 3)); // Show first 3

                // Set daily challenge (first available quest)
                const uncompletedQuests = quests.filter(
                    (quest: any) => !studentProgress.completedQuests.includes(quest.id)
                );
                if (uncompletedQuests.length > 0) {
                    setDailyChallenge(uncompletedQuests[0]);
                }
            } catch (error) {
                console.error('Error loading dashboard content:', error);
                setAvailableQuests([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardContent();
    }, [currentClass, forceUpdate, studentProgress.completedQuests]);

    const handleStartChallenge = () => {
        if (dailyChallenge) {
            // Track button interaction for analytics
            console.log('Daily challenge started:', dailyChallenge.id);
            setSelectedQuestId(dailyChallenge.id);
            setShowQuestModal(true);
        }
    };

    const handleStartQuest = (questId: string) => {
        // Track quest start for analytics
        console.log('Quest started from dashboard:', questId);
        setSelectedQuestId(questId);
        setShowQuestModal(true);
    };

    const handleContinueQuest = (questId: string) => {
        // Track quest continuation for analytics
        console.log('Quest continued from dashboard:', questId);
        setSelectedQuestId(questId);
        setShowQuestModal(true);
    };

    const handleQuestComplete = (questId: string, xpEarned: number) => {
        setShowQuestModal(false);
        setSelectedQuestId('');

        showToast({
            type: 'success',
            title: 'Quest Completed!',
            message: `You earned ${xpEarned} XP! Great work!`,
            duration: 3000
        });

        // Refresh dashboard content
        setForceUpdate(prev => prev + 1);
    };

    const handleQuestExit = () => {
        setShowQuestModal(false);
        setSelectedQuestId('');
    };

    const navigateToSubjects = () => {
        navigate('/student/subjects');
    };

    const navigateToLabs = () => {
        navigate('/student/labs');
    };

    const navigateToMyQuests = () => {
        navigate('/student/my-quests');
    };

    const navigateToAchievements = () => {
        navigate('/student/achievements');
    };

    if (!student || !student.user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
                    <p className="text-student-text-secondary">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 min-h-screen bg-student-background text-student-text">
            {/* Welcome Header */}
            <div className="student-welcome-header p-6 md:p-8 rounded-2xl">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                    Welcome back, {student.user.name}!
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-4">
                    Ready to continue your learning adventure in {classInfo?.displayName || 'Class 6'}?
                </p>

                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center">
                        <div className="student-level-badge w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-lg md:text-xl font-bold mb-2 rounded-full">
                            {studentProgress.level}
                        </div>
                        <p className="text-xs md:text-sm opacity-80">Level</p>
                    </div>
                    <div className="text-center">
                        <div className="student-xp-counter px-3 md:px-4 py-2 text-lg md:text-xl font-bold mb-2 rounded-lg">
                            {studentProgress.totalXP}
                        </div>
                        <p className="text-xs md:text-sm opacity-80">XP</p>
                    </div>
                    <div className="text-center">
                        <div className="student-achievement-badge w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-lg md:text-xl font-bold mb-2 rounded-full">
                            {studentProgress.achievements.length}
                        </div>
                        <p className="text-xs md:text-sm opacity-80">Badges</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <ResponsiveButton
                    onClick={() => navigate('/student/game-zone')}
                    variant="primary"
                    size="lg"
                    icon={Gamepad2}
                    fullWidth
                    className="h-20 md:h-24 flex-col space-y-2"
                >
                    <span className="text-sm md:text-base font-medium">Game Zone</span>
                </ResponsiveButton>

                <ResponsiveButton
                    onClick={() => navigate('/student/studentnet')}
                    variant="secondary"
                    size="lg"
                    icon={Zap}
                    fullWidth
                    className="h-20 md:h-24 flex-col space-y-2"
                >
                    <span className="text-sm md:text-base font-medium">StudentNet Hub</span>
                </ResponsiveButton>

                <ResponsiveButton
                    onClick={navigateToSubjects}
                    variant="primary"
                    size="lg"
                    icon={BookOpen}
                    fullWidth
                    className="h-20 md:h-24 flex-col space-y-2"
                >
                    <span className="text-sm md:text-base font-medium">Explore Subjects</span>
                </ResponsiveButton>

                <ResponsiveButton
                    onClick={navigateToLabs}
                    variant="accent"
                    size="lg"
                    icon={FlaskConical}
                    fullWidth
                    className="h-20 md:h-24 flex-col space-y-2"
                >
                    <span className="text-sm md:text-base font-medium">Virtual Labs</span>
                </ResponsiveButton>

            </div>

            {/* Daily Challenge Section */}
            {dailyChallenge && (
                <div className="student-card-daily-challenge p-6 md:p-8">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-300">
                            <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-student-text">
                            ⚡ Today's Challenge
                        </h2>

                        <h3 className="text-lg md:text-2xl mb-3 md:mb-4 student-text-gradient">
                            {dailyChallenge.title}
                        </h3>

                        <p className="text-base md:text-lg mb-4 md:mb-6 text-student-text-secondary max-w-2xl mx-auto">
                            {dailyChallenge.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-lg md:text-xl font-bold text-student-accent">
                                    +{dailyChallenge.xpReward} XP
                                </div>
                                <div className="text-sm text-student-text-secondary">Reward</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg md:text-xl font-bold text-student-secondary">
                                    {dailyChallenge.estimatedTime}
                                </div>
                                <div className="text-sm text-student-text-secondary">Duration</div>
                            </div>
                        </div>

                        <ResponsiveButton
                            onClick={handleStartChallenge}
                            size="xl"
                            icon={Play}
                            className="px-8 md:px-12"
                        >
                            Start Challenge
                        </ResponsiveButton>
                    </div>
                </div>
            )}

            {/* Available Quests */}
            <div className="student-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-student-text">
                        🎯 Available Learning Quests
                    </h2>
                    <ResponsiveButton
                        onClick={navigateToMyQuests}
                        variant="outline"
                        size="sm"
                    >
                        View All
                    </ResponsiveButton>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-student-primary mx-auto mb-4"></div>
                        <p className="text-student-text-secondary">Loading quests...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {availableQuests.map((quest) => {
                            const questProgress = studentProgress.questProgress[quest.id];
                            const isCompleted = studentProgress.completedQuests.includes(quest.id);

                            return (
                                <div
                                    key={quest.id}
                                    className="student-quest-card p-4 md:p-6 hover:shadow-student-hover transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-student-text text-sm md:text-base">
                                            {quest.title}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                            isCompleted ? 'bg-green-100 text-green-800' :
                                                questProgress ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                      {isCompleted ? 'DONE' : questProgress ? 'ACTIVE' : 'NEW'}
                    </span>
                                    </div>

                                    <p className="text-xs md:text-sm mb-4 text-student-text-secondary">
                                        {quest.description}
                                    </p>

                                    {questProgress && !isCompleted && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-student-text-secondary">Progress</span>
                                                <span className="text-student-text">
                          {questProgress.completedSteps?.length || 0}/{quest.steps?.length || 1}
                        </span>
                                            </div>
                                            <div className="student-progress-bar-enhanced h-2">
                                                <div
                                                    className="student-progress-fill-enhanced h-2 transition-all duration-500"
                                                    style={{
                                                        width: `${((questProgress.completedSteps?.length || 0) / (quest.steps?.length || 1)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mb-4">
                    <span className="text-xs md:text-sm font-bold text-student-accent">
                      +{quest.xpReward} XP
                    </span>
                                        <span className="text-xs text-student-text-secondary">
                      {quest.estimatedTime}
                    </span>
                                    </div>

                                    <ResponsiveButton
                                        onClick={() => {
                                            if (isCompleted) {
                                                showToast({
                                                    type: 'info',
                                                    title: 'Quest Already Completed',
                                                    message: 'You have already completed this quest!',
                                                    duration: 2000
                                                });
                                            } else if (questProgress) {
                                                handleContinueQuest(quest.id);
                                            } else {
                                                handleStartQuest(quest.id);
                                            }
                                        }}
                                        variant={isCompleted ? 'ghost' : 'primary'}
                                        size="sm"
                                        fullWidth
                                        disabled={isCompleted}
                                        icon={isCompleted ? Trophy : Play}
                                    >
                                        {isCompleted ? 'Completed!' :
                                            questProgress ? 'Continue Quest' : 'Start Quest'}
                                    </ResponsiveButton>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Recent Achievements */}
            <div className="student-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-student-text">
                        🏆 Recent Achievements
                    </h2>
                    <ResponsiveButton
                        onClick={navigateToAchievements}
                        variant="outline"
                        size="sm"
                    >
                        View All
                    </ResponsiveButton>
                </div>

                {studentProgress.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studentProgress.achievements.slice(0, 3).map((achievement) => (
                            <div
                                key={achievement.id}
                                className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-student-secondary/10 to-student-accent/10 border border-student-secondary/30 student-achievement-glow hover:student-achievement-glow-hover transition-all duration-300"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-student-text text-sm md:text-base truncate">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-student-text-secondary">
                                        {new Date(achievement.earnedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-student-text-muted" />
                        <p className="text-student-text-secondary">
                            Complete quests to earn your first achievement!
                        </p>
                    </div>
                )}
            </div>

            {/* Quest Progress Modal */}
            <Modal
                isOpen={showQuestModal}
                onClose={handleQuestExit}
                title="Quest in Progress"
                size="xl"
            >
                {selectedQuestId && (
                    <QuestProgressEngine
                        questId={selectedQuestId}
                        onComplete={handleQuestComplete}
                        onExit={handleQuestExit}
                    />
                )}
            </Modal>
        </div>
    );
};