import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveButton } from './ResponsiveButton';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import {
    Calculator,
    Atom,
    Microscope,
    BookOpen,
    Globe,
    Gamepad2,
    Play,
    Trophy,
    Target,
    Zap
} from 'lucide-react';

export const GameZone: React.FC = () => {
    const navigate = useNavigate();
    const { currentClass, classInfo } = useCurrentClass();
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubjects = () => {
            setLoading(true);
            try {
                const subjects = ContentService.getAvailableSubjects(currentClass);
                setAvailableSubjects(subjects);
            } catch (error) {
                console.error('Error loading subjects for Game Zone:', error);
                setAvailableSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        loadSubjects();

        // Listen for class changes
        const handleClassChange = () => {
            ContentService.clearCache();
            loadSubjects();
        };

        window.addEventListener('classChanged', handleClassChange);
        return () => window.removeEventListener('classChanged', handleClassChange);
    }, [currentClass]);

    const getSubjectIcon = (subject: string) => {
        switch (subject.toLowerCase()) {
            case 'math':
            case 'mathematics':
                return Calculator;
            case 'physics':
                return Atom;
            case 'chemistry':
                return Microscope;
            case 'biology':
            case 'science':
                return Microscope;
            case 'english':
                return BookOpen;
            case 'hindi':
                return BookOpen;
            case 'social_studies':
            case 'history':
            case 'geography':
            case 'political_science':
                return Globe;
            default:
                return BookOpen;
        }
    };

    const getSubjectColor = (subject: string) => {
        switch (subject.toLowerCase()) {
            case 'math':
            case 'mathematics':
                return 'from-blue-500 to-indigo-600';
            case 'physics':
                return 'from-purple-500 to-violet-600';
            case 'chemistry':
                return 'from-green-500 to-emerald-600';
            case 'biology':
            case 'science':
                return 'from-teal-500 to-cyan-600';
            case 'english':
                return 'from-orange-500 to-red-600';
            case 'hindi':
                return 'from-yellow-500 to-amber-600';
            case 'social_studies':
            case 'history':
            case 'geography':
            case 'political_science':
                return 'from-pink-500 to-rose-600';
            default:
                return 'from-gray-500 to-slate-600';
        }
    };

    const getSubjectDisplayName = (subject: string) => {
        switch (subject.toLowerCase()) {
            case 'math':
                return 'Mathematics';
            case 'social_studies':
                return 'Social Studies';
            case 'business_studies':
                return 'Business Studies';
            case 'political_science':
                return 'Political Science';
            default:
                return subject.charAt(0).toUpperCase() + subject.slice(1);
        }
    };

    const handleSubjectClick = (subject: string) => {
        navigate(`/student/game-zone/${subject}`);
    };

    return (
        <div className="space-y-8 bg-student-background min-h-screen text-student-text">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 student-text-gradient">
                    🎮 Game Zone
                </h1>
                <p className="text-xl text-student-text-secondary">
                    Interactive learning games for {classInfo?.displayName || 'Class 6'}
                </p>
                <div className="mt-4 inline-flex items-center px-6 py-3 rounded-full font-semibold shadow-student-card bg-student-primary text-white">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    <span>Play & Learn Adventures</span>
                </div>
            </div>

            {/* Game Zone Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="student-card text-center p-6 animate-student-slide-up">
                    <Gamepad2 className="w-8 h-8 mx-auto text-student-primary mb-2" />
                    <div className="text-2xl font-bold text-student-text">{availableSubjects.length}</div>
                    <div className="text-student-text-secondary">Game Subjects</div>
                </div>

                <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
                    <Play className="w-8 h-8 mx-auto text-student-accent mb-2" />
                    <div className="text-2xl font-bold text-student-text">25+</div>
                    <div className="text-student-text-secondary">Interactive Games</div>
                </div>

                <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Trophy className="w-8 h-8 mx-auto text-student-secondary mb-2" />
                    <div className="text-2xl font-bold text-student-text">Fun</div>
                    <div className="text-student-text-secondary">Learning Mode</div>
                </div>

                <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Target className="w-8 h-8 mx-auto text-student-primary mb-2" />
                    <div className="text-2xl font-bold text-student-text">Adaptive</div>
                    <div className="text-student-text-secondary">Difficulty</div>
                </div>
            </div>

            {/* Subject Cards */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
                    <p className="text-student-text-secondary">Loading game subjects...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {availableSubjects.map((subject, index) => {
                        const IconComponent = getSubjectIcon(subject);
                        const colorClass = getSubjectColor(subject);
                        const displayName = getSubjectDisplayName(subject);

                        return (
                            <div
                                key={subject}
                                className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handleSubjectClick(subject)}
                            >
                                {/* Game Icon */}
                                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 group-hover:scale-110`}>
                                    <IconComponent className="w-10 h-10 text-white" />
                                </div>

                                {/* Subject Info */}
                                <h3 className="text-xl font-bold text-student-text mb-3 text-center">
                                    {displayName}
                                </h3>

                                {/* Game Preview */}
                                <div className="text-center mb-4">
                                    <div className="flex items-center justify-center space-x-2 text-sm text-student-text-secondary mb-2">
                                        <Gamepad2 className="w-4 h-4" />
                                        <span>Interactive Games Available</span>
                                    </div>
                                    <div className="flex justify-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-2 h-2 bg-student-accent rounded-full"></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Play Button */}
                                <ResponsiveButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubjectClick(subject);
                                    }}
                                    variant="primary"
                                    size="md"
                                    fullWidth
                                    icon={Play}
                                    className="group-hover:scale-105 transition-transform duration-200"
                                >
                                    <span className="hidden sm:inline">Play {displayName} Games</span>
                                    <span className="sm:hidden">Play Games</span>
                                </ResponsiveButton>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Game Zone Features */}
            <div className="student-card p-8 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-student-text mb-6">🎯 Game Zone Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-primary flex items-center justify-center shadow-student-card">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-student-text mb-2">Interactive Learning</h3>
                            <p className="text-student-text-secondary text-sm">
                                Hands-on games that make learning fun and engaging
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-secondary flex items-center justify-center shadow-student-card">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-student-text mb-2">Adaptive Difficulty</h3>
                            <p className="text-student-text-secondary text-sm">
                                Games adjust to your skill level for optimal challenge
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-accent flex items-center justify-center shadow-student-card">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-student-text mb-2">Earn Rewards</h3>
                            <p className="text-student-text-secondary text-sm">
                                Complete games to earn XP, badges, and achievements
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};