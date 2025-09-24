import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Globe, Trophy, Users, Clock, Star, Play, Crown } from 'lucide-react';

export const WorldChallenges: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'past'>('current');

  const currentChallenges = [
    {
      id: 'global-math-olympiad',
      title: 'Global Math Olympiad 2024',
      description: 'Compete with students worldwide in mathematical problem-solving',
      category: 'Mathematics',
      participants: 15420,
      timeLeft: '5 days 12 hours',
      difficulty: 'Advanced',
      prizes: ['Gold Medal + ₹50,000', 'Silver Medal + ₹25,000', 'Bronze Medal + ₹10,000'],
      status: 'active',
      myRank: 1247,
      icon: '🏆',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'climate-action-challenge',
      title: 'Climate Action Challenge',
      description: 'Design innovative solutions for environmental problems',
      category: 'Environmental Science',
      participants: 8934,
      timeLeft: '12 days 8 hours',
      difficulty: 'Medium',
      prizes: ['Eco Warrior Badge', 'Tree Planting Certificate', 'Green Innovation Award'],
      status: 'active',
      myRank: 456,
      icon: '🌱',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'space-exploration-quest',
      title: 'Space Exploration Quest',
      description: 'Design a mission to Mars and solve space-related challenges',
      category: 'Physics & Astronomy',
      participants: 6721,
      timeLeft: '8 days 15 hours',
      difficulty: 'Hard',
      prizes: ['Astronaut Badge', 'NASA Internship Opportunity', 'Space Science Kit'],
      status: 'active',
      myRank: 892,
      icon: '🚀',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const upcomingChallenges = [
    {
      id: 'coding-championship',
      title: 'International Coding Championship',
      description: 'Programming competition for young coders',
      category: 'Computer Science',
      startsIn: '15 days',
      difficulty: 'Advanced',
      icon: '💻',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'innovation-fair',
      title: 'Young Innovators Fair',
      description: 'Showcase your creative inventions and innovations',
      category: 'Innovation',
      startsIn: '22 days',
      difficulty: 'Medium',
      icon: '💡',
      color: 'from-amber-500 to-yellow-600'
    }
  ];

  const pastChallenges = [
    {
      id: 'science-quiz-bowl',
      title: 'International Science Quiz Bowl',
      description: 'Global science knowledge competition',
      category: 'General Science',
      completedOn: '2024-01-15',
      myRank: 234,
      totalParticipants: 12000,
      prize: 'Science Champion Badge',
      icon: '🧪',
      color: 'from-teal-500 to-green-600'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank: number) => {
    if (rank <= 10) return 'text-yellow-600';
    if (rank <= 100) return 'text-gray-600';
    if (rank <= 1000) return 'text-orange-600';
    return 'text-student-text';
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🌍 World Challenges</h1>
        <p className="text-xl text-student-text-secondary">Compete globally and showcase your skills</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Globe className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{currentChallenges.length}</div>
          <div className="text-student-text-secondary">Active Challenges</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Users className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">31K+</div>
          <div className="text-student-text-secondary">Global Participants</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Trophy className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">1</div>
          <div className="text-student-text-secondary">Badges Earned</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Crown className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">234</div>
          <div className="text-student-text-secondary">Best Rank</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {[
            { key: 'current', label: 'Current', count: currentChallenges.length },
            { key: 'upcoming', label: 'Upcoming', count: upcomingChallenges.length },
            { key: 'past', label: 'Past', count: pastChallenges.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 student-hover-lift ${
                activeTab === tab.key
                  ? 'student-tab-active shadow-student-card'
                  : 'text-student-text-secondary hover:text-student-text hover:bg-student-background hover:shadow-student-card'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Content */}
      <div className="min-h-96">
        {/* Current Challenges */}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentChallenges.map((challenge, index) => (
              <div 
                key={challenge.id} 
                className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedChallenge(challenge)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{challenge.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-student-text mb-3">{challenge.title}</h3>
                <p className="text-student-text-secondary mb-4">{challenge.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Participants:</span>
                    <span className="text-student-text">{challenge.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Time Left:</span>
                    <span className="text-student-text font-bold">{challenge.timeLeft}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">My Rank:</span>
                    <span className={`font-bold ${getRankColor(challenge.myRank)}`}>#{challenge.myRank}</span>
                  </div>
                </div>
                
                <Button className="w-full btn-student-primary student-click-bounce" icon={Play}>
                  Continue Challenge
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Challenges */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingChallenges.map((challenge, index) => (
              <div 
                key={challenge.id} 
                className="student-card p-6 animate-student-slide-up student-hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{challenge.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-student-text mb-3">{challenge.title}</h3>
                <p className="text-student-text-secondary mb-4">{challenge.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Category:</span>
                    <span className="text-student-text">{challenge.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Starts In:</span>
                    <span className="text-student-text font-bold">{challenge.startsIn}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
                  Set Reminder
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Past Challenges */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastChallenges.map((challenge, index) => (
              <div 
                key={challenge.id} 
                className="student-card p-6 animate-student-slide-up student-hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{challenge.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-student-text">{challenge.title}</h3>
                      <p className="text-student-text-secondary">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getRankColor(challenge.myRank)}`}>
                      #{challenge.myRank}
                    </div>
                    <div className="text-student-text-secondary text-sm">
                      of {challenge.totalParticipants.toLocaleString()}
                    </div>
                    <div className="text-student-accent text-sm font-medium mt-1">
                      {challenge.prize}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      <Modal 
        isOpen={!!selectedChallenge} 
        onClose={() => setSelectedChallenge(null)} 
        title={selectedChallenge?.title}
        size="lg"
      >
        {selectedChallenge && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedChallenge.color} flex items-center justify-center shadow-student-hover student-achievement-glow`}>
                <span className="text-4xl">{selectedChallenge.icon}</span>
              </div>
              <p className="text-lg text-student-text-secondary">{selectedChallenge.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-student-text mb-2">Challenge Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Category:</strong> {selectedChallenge.category}</p>
                  <p><strong>Participants:</strong> {selectedChallenge.participants?.toLocaleString()}</p>
                  <p><strong>Time Left:</strong> {selectedChallenge.timeLeft}</p>
                  <p><strong>Your Rank:</strong> #{selectedChallenge.myRank}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-student-text mb-2">Prizes</h4>
                <div className="space-y-1">
                  {selectedChallenge.prizes?.map((prize: string, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-student-accent mr-2" />
                      <span className="text-student-text">{prize}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-student-primary/10 p-4 rounded-lg border border-student-primary/20">
              <h4 className="font-semibold text-student-primary mb-2">🎯 Challenge Rules</h4>
              <ul className="text-student-primary text-sm space-y-1">
                <li>• Submit your best solution before the deadline</li>
                <li>• Original work only - no plagiarism</li>
                <li>• Multiple attempts allowed</li>
                <li>• Fair play and sportsmanship required</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                size="lg"
                className="btn-student-primary student-click-bounce"
                icon={Play}
              >
                Continue Challenge
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};