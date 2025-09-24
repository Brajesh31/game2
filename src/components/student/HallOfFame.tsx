import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Crown, Trophy, Star, Medal, Target, Users } from 'lucide-react';

export const HallOfFame: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('global');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time');

  const leaderboards = {
    global: [
      {
        rank: 1,
        name: "Alex Chen",
        country: "Singapore",
        level: 47,
        xp: 125840,
        achievements: 89,
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialization: "Mathematics & Physics"
      },
      {
        rank: 2,
        name: "Priya Sharma",
        country: "India",
        level: 45,
        xp: 118920,
        achievements: 84,
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialization: "Chemistry & Biology"
      },
      {
        rank: 3,
        name: "Marcus Johnson",
        country: "USA",
        level: 44,
        xp: 112560,
        achievements: 81,
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialization: "Computer Science"
      }
    ],
    regional: [
      {
        rank: 1,
        name: "Aria Patel",
        country: "India",
        level: 12,
        xp: 2847,
        achievements: 15,
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialization: "Mathematics"
      },
      {
        rank: 2,
        name: "Rahul Kumar",
        country: "India",
        level: 11,
        xp: 2456,
        achievements: 12,
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialization: "Science"
      }
    ],
    school: [
      {
        rank: 1,
        name: "Aria Patel",
        country: "India",
        level: 12,
        xp: 2847,
        achievements: 15,
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialization: "Mathematics"
      }
    ]
  };

  const categories = [
    { key: 'global', label: 'Global Champions', icon: Crown },
    { key: 'regional', label: 'Regional Leaders', icon: Trophy },
    { key: 'school', label: 'School Heroes', icon: Star }
  ];

  const timeframes = [
    { key: 'all-time', label: 'All Time' },
    { key: 'this-year', label: 'This Year' },
    { key: 'this-month', label: 'This Month' },
    { key: 'this-week', label: 'This Week' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Medal className="w-8 h-8 text-orange-600" />;
      default: return <span className="text-2xl font-bold text-student-text">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-student-background-secondary text-student-text';
    }
  };

  const currentLeaderboard = leaderboards[selectedCategory as keyof typeof leaderboards] || [];

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">👑 Hall of Fame</h1>
        <p className="text-xl text-student-text-secondary">Celebrating the world's top learners and achievers</p>
      </div>

      {/* Category Selector */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 student-hover-lift ${
                  selectedCategory === category.key
                    ? 'student-tab-active shadow-student-card'
                    : 'text-student-text-secondary hover:text-student-text hover:bg-student-background hover:shadow-student-card'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center space-x-2">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe.key}
            variant={selectedTimeframe === timeframe.key ? 'primary' : 'outline'}
            className={selectedTimeframe === timeframe.key ? 'btn-student-primary' : 'border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary'}
            size="sm"
            onClick={() => setSelectedTimeframe(timeframe.key)}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="student-card p-6 animate-student-slide-up">
        <h2 className="text-2xl font-bold text-student-text mb-6 text-center">
          🏆 {categories.find(c => c.key === selectedCategory)?.label} Leaderboard
        </h2>
        
        <div className="space-y-4">
          {currentLeaderboard.map((player, index) => (
            <div 
              key={player.rank} 
              className={`p-6 rounded-xl transition-all duration-300 hover:shadow-student-hover student-hover-lift ${
                player.rank <= 3 
                  ? 'bg-gradient-to-r from-student-primary/10 to-student-accent/10 border-2 border-student-primary/30 student-achievement-glow' 
                  : 'bg-student-background-secondary shadow-student-card'
              }`}
            >
              <div className="flex items-center space-x-6">
                {/* Rank */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-student-card ${getRankBadge(player.rank)}`}>
                  {player.rank <= 3 ? getRankIcon(player.rank) : <span className="text-xl font-bold">#{player.rank}</span>}
                </div>

                {/* Avatar */}
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover shadow-student-card"
                />

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-student-text">{player.name}</h3>
                    <span className="text-sm text-student-text-secondary">🌍 {player.country}</span>
                  </div>
                  <p className="text-student-text-secondary mb-2">{player.specialization}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-student-primary font-bold">Level {player.level}</span>
                    <span className="text-student-accent font-bold">{player.xp.toLocaleString()} XP</span>
                    <span className="text-student-secondary font-bold">{player.achievements} Achievements</span>
                  </div>
                </div>

                {/* Special Badge for Top 3 */}
                {player.rank <= 3 && (
                  <div className="text-center">
                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {player.rank === 1 ? 'CHAMPION' : player.rank === 2 ? 'RUNNER-UP' : 'THIRD PLACE'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Position */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🎯 Your Position</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-student-primary">#1,247</div>
              <div className="text-student-text-secondary">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-secondary">#23</div>
              <div className="text-student-text-secondary">Regional Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-student-accent">#1</div>
              <div className="text-student-text-secondary">School Rank</div>
            </div>
          </div>
          <p className="text-lg text-student-text-secondary mt-4">
            Keep learning to climb higher in the rankings!
          </p>
        </div>
      </div>
    </div>
  );
};