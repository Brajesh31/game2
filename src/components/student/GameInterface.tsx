import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { AdaptiveLearningService } from '../../services/AdaptiveLearningService';
import { ResponsiveButton } from './ResponsiveButton';
import {
    Play,
    Pause,
    RotateCcw,
    Trophy,
    Star,
    Target,
    Clock,
    Lightbulb,
    CheckCircle,
    XCircle,
    Gamepad2
} from 'lucide-react';

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

interface GameInterfaceProps {
    game: Game;
    subject: string;
    onComplete: (gameId: string, score: number, xpEarned: number) => void;
    onExit: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
                                                                game,
                                                                subject,
                                                                onComplete,
                                                                onExit
                                                            }) => {
    const { user } = useAuth();
    const { currentClass } = useCurrentClass();
    const [gameStarted, setGameStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameData, setGameData] = useState<any>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const studentId = user?.id || 'student-001';

    useEffect(() => {
        const loadGameData = async () => {
            try {
                // Load the quest data that will power the game
                const quest = await ContentService.getQuestById(game.id, currentClass);
                setGameData(quest);
            } catch (error) {
                console.error('Error loading game data:', error);
            }
        };

        loadGameData();
    }, [game.id, currentClass]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameStarted && !gameCompleted) {
            timer = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted, gameCompleted]);

    const startGame = () => {
        setGameStarted(true);
        setCurrentStep(0);
        setScore(0);
        setTimeElapsed(0);
        setHintsUsed(0);
    };

    const submitAnswer = () => {
        if (!gameData || !gameData.steps[currentStep]) return;

        const currentQuestion = gameData.steps[currentStep];
        const correct = userAnswer === currentQuestion.problem?.correct_answer;

        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) {
            setScore(prev => prev + 1);

            // Log performance for adaptive learning
            AdaptiveLearningService.logStepCompletion(
                studentId,
                game.id,
                currentQuestion.id,
                true,
                timeElapsed,
                hintsUsed
            );
        }
    };

    const nextStep = () => {
        if (currentStep < (gameData?.steps.length - 1)) {
            setCurrentStep(prev => prev + 1);
            setUserAnswer('');
            setShowFeedback(false);
            setIsCorrect(false);
        } else {
            completeGame();
        }
    };

    const completeGame = () => {
        setGameCompleted(true);

        const finalScore = Math.round((score / (gameData?.steps.length || 1)) * 100);
        const xpEarned = Math.floor(game.xpReward * (finalScore / 100));

        // Save progress
        const progress = LocalStorageService.getStudentProgress(studentId);
        if (progress) {
            progress.totalXP += xpEarned;

            // Award achievement for first game completion
            if (!progress.achievements.some(a => a.id === 'first_game_complete')) {
                LocalStorageService.awardAchievement(studentId, {
                    id: 'first_game_complete',
                    title: 'Game Master',
                    description: 'Completed your first interactive learning game!',
                    icon: 'gamepad'
                });
            }

            LocalStorageService.saveStudentProgress(progress);
        }

        onComplete(game.id, finalScore, xpEarned);
    };

    const useHint = () => {
        if (hintsUsed < 3) {
            setHintsUsed(prev => prev + 1);
        }
    };

    const resetGame = () => {
        setGameStarted(false);
        setCurrentStep(0);
        setScore(0);
        setTimeElapsed(0);
        setUserAnswer('');
        setShowFeedback(false);
        setGameCompleted(false);
        setHintsUsed(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Game Start Screen
    if (!gameStarted) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-student-primary to-student-secondary flex items-center justify-center shadow-student-hover">
                        <Gamepad2 className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-student-text mb-4">{game.title}</h2>
                    <p className="text-lg text-student-text-secondary mb-6">{game.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-primary">{gameData?.steps.length || 0}</div>
                            <div className="text-student-text-secondary">Challenges</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-accent">{game.estimatedTime}</div>
                            <div className="text-student-text-secondary">Duration</div>
                        </div>
                        <div className="text-2xl font-bold text-student-secondary">{game.xpReward}</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-primary">{game.difficulty}</div>
                            <div className="text-student-text-secondary">Difficulty</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-student-text mb-3">Game Features:</h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {game.features.map((feature) => (
                                <span key={feature} className="px-3 py-1 bg-student-primary text-white rounded-full text-sm">
                  {feature}
                </span>
                            ))}
                        </div>
                    </div>

                    <ResponsiveButton
                        onClick={startGame}
                        size="xl"
                        icon={Play}
                        className="px-12"
                    >
                        Start Game
                    </ResponsiveButton>
                </div>
            </div>
        );
    }

    // Game Completion Screen
    if (gameCompleted) {
        const finalScore = Math.round((score / (gameData?.steps.length || 1)) * 100);

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-student-hover ${
                        finalScore >= 80 ? 'bg-green-500' : finalScore >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}>
                        <Trophy className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-student-text mb-4">Game Complete!</h2>
                    <div className="text-6xl font-bold mb-4 text-student-primary">{finalScore}%</div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-accent">{score}</div>
                            <div className="text-student-text-secondary">Correct</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-secondary">{gameData?.steps.length || 0}</div>
                            <div className="text-student-text-secondary">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-primary">{formatTime(timeElapsed)}</div>
                            <div className="text-student-text-secondary">Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-student-accent">{Math.floor(game.xpReward * (finalScore / 100))}</div>
                            <div className="text-student-text-secondary">XP Earned</div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <ResponsiveButton
                            onClick={resetGame}
                            variant="outline"
                            size="lg"
                            icon={RotateCcw}
                        >
                            Play Again
                        </ResponsiveButton>
                        <ResponsiveButton
                            onClick={onExit}
                            size="lg"
                        >
                            Continue Learning
                        </ResponsiveButton>
                    </div>
                </div>
            </div>
        );
    }

    // Game Interface
    const currentQuestion = gameData?.steps[currentStep];

    return (
        <div className="space-y-6">
            {/* Game Header */}
            <div className="student-card p-4 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-student-text">{game.title}</h2>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-student-accent">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="font-bold">{formatTime(timeElapsed)}</span>
                        </div>
                        <div className="flex items-center text-student-secondary">
                            <Trophy className="w-4 h-4 mr-1" />
                            <span className="font-bold">{score}/{gameData?.steps.length || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between text-sm text-student-text-secondary mb-2">
                    <span>Challenge {currentStep + 1} of {gameData?.steps.length || 0}</span>
                    <span>Score: {Math.round((score / Math.max(currentStep, 1)) * 100)}%</span>
                </div>

                <div className="student-progress-bar-enhanced h-3">
                    <div
                        className="student-progress-fill-enhanced h-3 transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / (gameData?.steps.length || 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Current Challenge */}
            {currentQuestion && (
                <div className="student-card p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center shadow-student-card">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-student-text">{currentQuestion.title}</h3>
                    </div>

                    <div className="bg-student-primary/10 p-4 rounded-lg mb-6 border border-student-primary/20">
                        <p className="text-lg text-student-primary italic">"{currentQuestion.narrative}"</p>
                    </div>

                    {currentQuestion.problem && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-student-text">
                                🎯 {currentQuestion.problem.question}
                            </h4>

                            {currentQuestion.problem.type === 'multiple_choice' && (
                                <div className="space-y-3">
                                    {currentQuestion.problem.options?.map((option: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setUserAnswer(option)}
                                            disabled={showFeedback}
                                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                                                userAnswer === option
                                                    ? 'border-student-primary bg-student-primary/10 text-student-primary'
                                                    : 'border-border hover:border-student-primary/50 hover:bg-student-background'
                                            } ${showFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-student-card'}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                                                    userAnswer === option ? 'border-student-primary bg-student-primary text-white' : 'border-gray-300'
                                                }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span className="font-medium">{option}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={useHint}
                                    disabled={hintsUsed >= 3 || showFeedback}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    <span>Hint ({hintsUsed}/3)</span>
                                </button>

                                {!showFeedback ? (
                                    <button
                                        onClick={submitAnswer}
                                        disabled={!userAnswer.trim()}
                                        className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Target className="w-5 h-5" />
                                        <span>Submit Answer</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium btn-student-primary student-click-bounce"
                                    >
                                        {currentStep < (gameData?.steps.length - 1) ? (
                                            <>
                                                <Play className="w-5 h-5" />
                                                <span>Next Challenge</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trophy className="w-5 h-5" />
                                                <span>Complete Game</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Feedback Section */}
                    {showFeedback && currentQuestion.problem && (
                        <div className={`mt-6 p-6 rounded-lg border-2 ${
                            isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-orange-500 bg-orange-50'
                        }`}>
                            <div className="flex items-center space-x-3 mb-4">
                                {isCorrect ? (
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-student-card">
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-student-card">
                                        <XCircle className="w-8 h-8 text-white" />
                                    </div>
                                )}
                                <div>
                                    <h4 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                                        {isCorrect ? '🎉 Excellent!' : '🤔 Try Again!'}
                                    </h4>
                                    <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                                        {isCorrect ? 'You got it right!' : 'Learning opportunity!'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h5 className="font-semibold text-student-text mb-2">💡 Explanation:</h5>
                                <p className="text-student-text">{currentQuestion.problem.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Game Controls */}
            <div className="student-card p-4">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button
                            onClick={resetGame}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-student-accent text-student-accent hover:bg-student-accent hover:text-white transition-all duration-200"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Restart</span>
                        </button>
                    </div>

                    <button
                        onClick={onExit}
                        className="text-student-text-secondary hover:text-student-text transition-colors duration-200"
                    >
                        Exit Game
                    </button>
                </div>
            </div>
        </div>
    );
};