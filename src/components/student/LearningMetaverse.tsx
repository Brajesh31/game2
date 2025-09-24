import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Gamepad2, Users, Globe, Zap, Eye, Play } from 'lucide-react';

export const LearningMetaverse: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<any>(null);

  const virtualWorlds = [
    {
      id: 'ancient-egypt',
      title: 'Ancient Egypt Explorer',
      description: 'Walk through the pyramids and learn about ancient Egyptian civilization',
      category: 'History',
      participants: 1247,
      difficulty: 'Medium',
      features: ['3D Pyramid Tours', 'Hieroglyphics Decoder', 'Virtual Museum', 'Time Travel Quests'],
      image: '🏺',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'molecular-lab',
      title: 'Molecular Laboratory',
      description: 'Manipulate atoms and molecules in a virtual chemistry lab',
      category: 'Chemistry',
      participants: 892,
      difficulty: 'Advanced',
      features: ['Atom Builder', 'Reaction Simulator', 'Molecular Viewer', 'Chemical Experiments'],
      image: '⚛️',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'space-station',
      title: 'International Space Station',
      description: 'Experience life in space and conduct zero-gravity experiments',
      category: 'Physics',
      participants: 2156,
      difficulty: 'Hard',
      features: ['Zero-G Physics', 'Spacecraft Controls', 'Earth Observation', 'Space Experiments'],
      image: '🚀',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'rainforest-ecosystem',
      title: 'Amazon Rainforest',
      description: 'Explore biodiversity and ecosystem interactions in the Amazon',
      category: 'Biology',
      participants: 1534,
      difficulty: 'Medium',
      features: ['Species Discovery', 'Food Chain Analysis', 'Climate Studies', 'Conservation Missions'],
      image: '🌳',
      color: 'from-green-600 to-teal-600'
    }
  ];

  const upcomingFeatures = [
    {
      title: 'AI-Powered NPCs',
      description: 'Intelligent virtual characters that adapt to your learning style',
      eta: 'Q2 2024',
      icon: '🤖'
    },
    {
      title: 'Haptic Feedback',
      description: 'Feel textures and forces in virtual experiments',
      eta: 'Q3 2024',
      icon: '👋'
    },
    {
      title: 'Collaborative Worlds',
      description: 'Work together with classmates in shared virtual spaces',
      eta: 'Q4 2024',
      icon: '🤝'
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

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🎮 Learning Metaverse</h1>
        <p className="text-xl text-student-text-secondary">Immersive virtual worlds for experiential learning</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="student-card p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 animate-student-slide-up">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-student-text mb-4">Coming Soon to STEM-Spark!</h2>
          <p className="text-xl text-student-text-secondary mb-6">
            Revolutionary VR/AR learning experiences are in development
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full font-semibold shadow-student-card">
            <Zap className="w-5 h-5 mr-2" />
            Beta Testing Starts Q1 2024
          </div>
        </div>
      </div>

      {/* Virtual Worlds Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {virtualWorlds.map((world, index) => (
          <div 
            key={world.id} 
            className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{world.image}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(world.difficulty)}`}>
                {world.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-student-text mb-3">{world.title}</h3>
            <p className="text-student-text-secondary mb-4">{world.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-student-text-secondary">Category:</span>
                <span className="text-student-text">{world.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-student-text-secondary">Explorers:</span>
                <span className="text-student-text">{world.participants.toLocaleString()}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-semibold text-student-text mb-2 text-sm">Features:</h4>
              <div className="grid grid-cols-2 gap-1">
                {world.features.map((feature) => (
                  <div key={feature} className="flex items-center text-xs">
                    <div className="w-2 h-2 bg-student-accent rounded-full mr-2"></div>
                    <span className="text-student-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 btn-student-primary student-click-bounce"
                icon={Play}
                disabled
              >
                Coming Soon
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                icon={Eye}
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                disabled
              >
                Preview
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Features */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-bold text-student-text mb-6">🔮 Upcoming Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-student-background-secondary rounded-lg shadow-student-card">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-student-text mb-2">{feature.title}</h3>
              <p className="text-student-text-secondary text-sm mb-3">{feature.description}</p>
              <span className="px-3 py-1 bg-student-accent text-white rounded-full text-xs font-bold">
                {feature.eta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Beta Signup */}
      <div className="student-card p-8 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-student-text mb-4">🎯 Join the Beta Program!</h2>
          <p className="text-xl text-student-text-secondary mb-6">
            Be among the first to experience the future of immersive learning
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="btn-student-primary student-click-bounce">
              Sign Up for Beta
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};