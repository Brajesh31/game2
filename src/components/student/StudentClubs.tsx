import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Users, Plus, MessageCircle, Upload, Crown, Star } from 'lucide-react';

export const StudentClubs: React.FC = () => {
  const { user } = useAuth();
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const clubs = [
    {
      id: 'math-wizards',
      name: 'Math Wizards',
      description: 'Advanced mathematics problem solving and competitions',
      category: 'Academic',
      members: 45,
      leader: 'Aria Patel',
      isJoined: true,
      avatar: '🧮',
      activities: ['Weekly Problem Sets', 'Math Olympiad Prep', 'Peer Tutoring'],
      recentActivity: '2 hours ago'
    },
    {
      id: 'science-explorers',
      name: 'Science Explorers',
      description: 'Hands-on science experiments and research projects',
      category: 'Academic',
      members: 67,
      leader: 'Rahul Kumar',
      isJoined: false,
      avatar: '🔬',
      activities: ['Virtual Lab Sessions', 'Science Fair Projects', 'Research Discussions'],
      recentActivity: '1 hour ago'
    },
    {
      id: 'coding-ninjas',
      name: 'Coding Ninjas',
      description: 'Programming challenges and software development',
      category: 'Technology',
      members: 89,
      leader: 'Priya Singh',
      isJoined: true,
      avatar: '💻',
      activities: ['Coding Challenges', 'App Development', 'Tech Talks'],
      recentActivity: '30 minutes ago'
    },
    {
      id: 'eco-warriors',
      name: 'Eco Warriors',
      description: 'Environmental awareness and sustainability projects',
      category: 'Social',
      members: 34,
      leader: 'Aarav Sharma',
      isJoined: false,
      avatar: '🌱',
      activities: ['Green Projects', 'Awareness Campaigns', 'Community Service'],
      recentActivity: '3 hours ago'
    }
  ];

  const mockMessages = [
    {
      id: 1,
      author: 'Aria Patel',
      message: 'Hey everyone! I found this amazing math problem. Who wants to solve it together?',
      timestamp: '2:30 PM',
      isMe: false
    },
    {
      id: 2,
      author: 'Vikram S.',
      message: 'I\'m in! Share the problem.',
      timestamp: '2:32 PM',
      isMe: false
    },
    {
      id: 3,
      author: 'You',
      message: 'Count me in too! I love challenging problems.',
      timestamp: '2:33 PM',
      isMe: true
    }
  ];

  const joinClub = (clubId: string) => {
    if (!clubId) return;
    
    // Save to localStorage
    const clubData = JSON.parse(localStorage.getItem('student_clubs') || '[]');
    clubData.push({ clubId, joinedAt: new Date().toISOString() });
    localStorage.setItem('student_clubs', JSON.stringify(clubData));
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">👥 Student Clubs</h1>
        <p className="text-xl text-student-text-secondary">Join communities of learners with shared interests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Users className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{clubs.length}</div>
          <div className="text-student-text-secondary">Available Clubs</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Crown className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">{clubs.filter(c => c.isJoined).length}</div>
          <div className="text-student-text-secondary">Joined Clubs</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <MessageCircle className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">12</div>
          <div className="text-student-text-secondary">Active Discussions</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">3</div>
          <div className="text-student-text-secondary">Leadership Roles</div>
        </div>
      </div>

      {/* Create Club Button */}
      <div className="flex justify-center">
        <Button 
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
          className="btn-student-primary student-click-bounce"
          size="lg"
        >
          Create New Club
        </Button>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubs.map((club, index) => (
          <div 
            key={club.id} 
            className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{club.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-student-text">{club.name}</h3>
                  <p className="text-student-text-secondary">{club.category}</p>
                </div>
              </div>
              {club.isJoined && (
                <span className="px-3 py-1 bg-student-accent text-white rounded-full text-sm font-bold">
                  Member
                </span>
              )}
            </div>

            <p className="text-student-text-secondary mb-4">{club.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-student-text-secondary">Members:</span>
                <span className="text-student-text">{club.members}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-student-text-secondary">Leader:</span>
                <span className="text-student-text">{club.leader}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-student-text-secondary">Last Activity:</span>
                <span className="text-student-text">{club.recentActivity}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-student-text mb-2">Activities:</h4>
              <div className="flex flex-wrap gap-1">
                {club.activities.map((activity) => (
                  <span key={activity} className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              {club.isJoined ? (
                <>
                  <Button 
                    className="flex-1 btn-student-primary student-click-bounce"
                    icon={MessageCircle}
                    onClick={() => {
                      setSelectedClub(club);
                      setShowChatModal(true);
                    }}
                  >
                    Open Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                  >
                    Leave Club
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full btn-student-secondary student-click-bounce"
                  onClick={() => joinClub(club.id)}
                >
                  Join Club
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      <Modal 
        isOpen={showChatModal} 
        onClose={() => setShowChatModal(false)} 
        title={`${selectedClub?.name} Chat`}
        size="lg"
      >
        {selectedClub && (
          <div className="space-y-4">
            <div className="h-64 overflow-y-auto bg-student-background rounded-lg p-4 space-y-3">
              {mockMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isMe 
                      ? 'bg-student-primary text-white' 
                      : 'bg-white border border-border'
                  }`}>
                    {!message.isMe && (
                      <p className="text-xs font-semibold mb-1 text-student-primary">{message.author}</p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.isMe ? 'text-white opacity-80' : 'text-student-text-secondary'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input-student focus:ring-student-secondary focus:border-student-secondary"
              />
              <Button 
                onClick={() => setNewMessage('')}
                className="btn-student-primary student-click-bounce"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Club Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Create New Club"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Club Name</label>
            <input
              type="text"
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Enter club name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Description</label>
            <textarea
              className="input-student w-full h-24 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Describe your club's purpose and activities"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Category</label>
            <select className="input-student w-full focus:ring-student-secondary focus:border-student-secondary">
              <option value="academic">Academic</option>
              <option value="technology">Technology</option>
              <option value="social">Social</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setShowCreateModal(false)}
              className="btn-student-primary student-click-bounce"
            >
              Create Club
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};