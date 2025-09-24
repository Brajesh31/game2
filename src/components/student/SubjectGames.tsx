import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveButton } from './ResponsiveButton';
import { GameInterface } from './GameInterface';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { useToast } from '../ToastContainer';
import { ArrowLeft, Play, Trophy, Clock, Star, Gamepad2, Target } from 'lucide-react';

interface Game {
    id: string;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    estimatedTime: string;
    xpReward: number;
    gameType: 'quiz' | 'simulation' | 'puzzle' | 'strategy';
    features: string[];
}

export const SubjectGames: React.FC = () => {
    const { subject } = useParams<{ subject: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentClass, classInfo } = useCurrentClass();
    const { showToast } = useToast();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGameModal, setShowGameModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const studentId = user?.id || 'student-001';

    useEffect(() => {
        const loadGames = async () => {
            if (!subject) return;

            setLoading(true);
            try {
                // Load content and transform quests into games
                const content = await ContentService.getContent(currentClass, subject);

                // Transform quests into interactive games
                const gamesList: Game[] = content.quests.map((quest: any, index: number) => ({
                    id: quest.id,
                    title: getGameTitle(quest.title, quest.type),
                    description: getGameDescription(quest.description, quest.type),
                    type: quest.type,
                    difficulty: quest.difficulty,
                    estimatedTime: quest.estimatedTime,
                    xpReward: quest.xpReward,
                    gameType: getGameType(quest.type, index),
                    features: getGameFeatures(quest.type, subject)
                }));

                setGames(gamesList);
            } catch (error) {
                console.error('Error loading games:', error);
                setGames([]);
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, [currentClass, subject]);

    const getGameTitle = (questTitle: string, questType: string) => {
        // Transform quest titles into game titles
        const gameNames = {
            'exploration_quest': 'Explorer Adventure',
            'skill_quest': 'Skill Challenge',
            'boss_battle': 'Boss Battle Arena',
            'puzzle': 'Mind Puzzle',
            'strategy_quest': 'Strategy Master'
        };

        return questTitle.includes('Kingdom') ? questTitle.replace('Quest', 'Game') :
            questTitle.includes('Adventure') ? questTitle.replace('Quest', 'Game') :
                questTitle.includes('Challenge') ? questTitle.replace('Quest', 'Challenge Game') :
                    questTitle + ' Game';
    };

    const getGameDescription = (questDesc: string, questType: string) => {
        const gameDescriptions = {
            'exploration_quest': 'Explore and discover through interactive gameplay',
            'skill_quest': 'Master skills through engaging challenges',
            'boss_battle': 'Face epic challenges and prove your mastery',
            'puzzle': 'Solve puzzles and unlock new levels',
            'strategy_quest': 'Plan strategies and make tactical decisions'
        };

        return questDesc + ' - ' + (gameDescriptions[questType as keyof typeof gameDescriptions] || 'Interactive learning experience');
    };

    const getGameType = (questType: string, index: number): 'quiz' | 'simulation' | 'puzzle' | 'strategy' => {
        const types: Array<'quiz' | 'simulation' | 'puzzle' | 'strategy'> = ['quiz', 'simulation', 'puzzle', 'strategy'];

        if (questType.includes('battle')) return 'strategy';
        if (questType.includes('exploration')) return 'simulation';
        if (questType.includes('puzzle')) return 'puzzle';

        return types[index % types.length];
    };

    const getGameFeatures = (questType: string, subject: string | undefined) => {
        const baseFeatures = ['Interactive Gameplay', 'Progress Tracking', 'XP Rewards'];
        const subjectFeatures: Record<string, string[]> = {
            'math': ['Problem Solving', 'Visual Math', 'Step-by-Step Hints'],
            'science': ['Virtual Experiments', 'Simulations', '3D Models'],
            'english': ['Story Mode', 'Character Interaction', 'Creative Writing'],
            'social_studies': ['Historical Scenarios', 'Map Exploration', 'Timeline Events']
        };

        return [...baseFeatures, ...(subjectFeatures[subject || ''] || ['Adaptive Learning'])];
    };

    const getSubjectDisplayName = (subjectName: string) => {
        switch (subjectName?.toLowerCase()) {
            case 'math':
                return 'Mathematics';
            case 'social_studies':
                return 'Social Studies';
            case 'business_studies':
                return 'Business Studies';
            case 'political_science':
                return 'Political Science';
            default:
                return subjectName?.charAt(0).toUpperCase() + subjectName?.slice(1) || '';
        }
    };

    const getGameTypeIcon = (gameType: string) => {
        switch (gameType) {
            case 'quiz': return Trophy;
            case 'simulation': return Target;
            case 'puzzle': return Star;
            case 'strategy': return Gamepad2;
            default: return Play;
        }
    };

    const getGameTypeColor = (gameType: string) => {
        switch (gameType) {
            case 'quiz': return 'bg-blue-100 text-blue-800';
            case 'simulation': return 'bg-green-100 text-green-800';
            case 'puzzle': return 'bg-purple-100 text-purple-800';
            case 'strategy': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard':
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handlePlayGame = (game: Game) => {
        setSelectedGame(game);
        setShowGameModal(true);
    };

    const handleGameComplete = (gameId: string, score: number, xpEarned: number) => {
        setShowGameModal(false);
        setSelectedGame(null);

        showToast({
            type: 'success',
            title: 'Game Completed!',
            message: `Great job! You earned ${xpEarned} XP with a score of ${score}%`,
            duration: 3000
        });
    };

    const handleGameExit = () => {
        setShowGameModal(false);
        setSelectedGame(null);
    };

    if (!subject) {
        return <div>Subject not found</div>;
    }

    return (
        <div className="space-y-8 bg-student-background min-h-screen text-student-text">
            {/* Header with Back Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <ResponsiveButton
                    variant="outline"
                    icon={ArrowLeft}
                    onClick={() => navigate('/student/game-zone')}
                    size="md"
                >
                    <span className="hidden sm:inline">Back to Game Zone</span>
                    <span className="sm:hidden">Back</span>
                </ResponsiveButton>

                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold student-text-gradient">
                        🎮 {getSubjectDisplayName(subject)} Games
                    </h1>
                    <p className="text-lg md:text-xl text-student-text-secondary">
                        Interactive learning games for {classInfo?.displayName || 'Class 6'}
                    </p>
                </div>
            </div>

            {/* Games Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
                    <p className="text-student-text-secondary">Loading {getSubjectDisplayName(subject)} games...</p>
                </div>
            ) : games.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game, index) => {
                        const GameTypeIcon = getGameTypeIcon(game.gameType);

                        return (
                            <div
                                key={game.id}
                                className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Game Header */}
                                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGameTypeColor(game.gameType)}`}>
                    <GameTypeIcon className="w-4 h-4 inline mr-1" />
                      {game.gameType.toUpperCase()}
                  </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty.toUpperCase()}
                  </span>
                                </div>

                                {/* Game Info */}
                                <h3 className="text-xl font-bold text-student-text mb-3">{game.title}</h3>
                                <p className="text-student-text-secondary mb-4 text-sm">{game.description}</p>

                                {/* Game Stats */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-student-text-secondary">Duration:</span>
                                        <span className="text-student-text flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                                            {game.estimatedTime}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-student-text-secondary">XP Reward:</span>
                                        <span className="font-bold text-student-accent">+{game.xpReward} XP</span>
                                    </div>
                                </div>

                                {/* Game Features */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-student-text mb-2 text-sm">Game Features:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {game.features.slice(0, 3).map((feature) => (
                                            <span key={feature} className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                        {feature}
                      </span>
                                        ))}
                                        {game.features.length > 3 && (
                                            <span className="px-2 py-1 bg-student-background-secondary text-student-text rounded-full text-xs">
                        +{game.features.length - 3} more
                      </span>
                                        )}
                                    </div>
                                </div>

                                {/* Play Button */}
                                <ResponsiveButton
                                    onClick={() => handlePlayGame(game)}
                                    variant="primary"
                                    size="md"
                                    fullWidth
                                    icon={Play}
                                    className="student-click-bounce"
                                >
                                    Play Now
                                </ResponsiveButton>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Gamepad2 className="w-16 h-16 mx-auto text-student-text-muted mb-4" />
                    <h3 className="text-xl font-bold text-student-text mb-2">Games Coming Soon!</h3>
                    <p className="text-student-text-secondary">
                        Interactive games for {getSubjectDisplayName(subject)} are being developed.
                    </p>
                </div>
            )}

            {/* Game Interface Modal */}
            <Modal
                isOpen={showGameModal}
                onClose={handleGameExit}
                title={selectedGame?.title}
                size="xl"
            >
                {selectedGame && (
                    <GameInterface
                        game={selectedGame}
                        subject={subject}
                        onComplete={handleGameComplete}
                        onExit={handleGameExit}
                    />
                )}
            </Modal>
        </div>
    );
};