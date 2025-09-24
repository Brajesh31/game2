import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { Users, MessageCircle, Video, Calendar, Send, Smile } from 'lucide-react';

export const Collaborate: React.FC = () => {
  const { classInfo } = useCurrentClass();
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const studyGroups = [
    {
      id: 'math-masters',
      name: 'Math Masters',
      subject: 'Mathematics',
      members: 8,
      online: 3,
      description: 'Advanced algebra and calculus problem solving',
      avatar: '🧮',
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: 'physics-explorers',
      name: 'Physics Explorers',
      subject: 'Physics',
      members: 12,
      online: 5,
      description: 'Exploring the wonders of physics together',
      avatar: '⚛️',
      lastActivity: '30 minutes ago',
      status: 'active'
    },
    {
      id: 'chem-lab-crew',
      name: 'Chemistry Lab Crew',
      subject: 'Chemistry',
      members: 6,
      online: 2,
      description: 'Virtual chemistry experiments and discussions',
      avatar: '🧪',
      lastActivity: '1 hour ago',
      status: 'active'
    },
    {
      id: 'bio-researchers',
      name: 'Bio Researchers',
      subject: 'Biology',
      members: 10,
      online: 0,
      description: 'Discovering life sciences together',
      avatar: '🔬',
      lastActivity: '1 day ago',
      status: 'inactive'
    }
  ];

  const peerDiscussions = [
    {
      id: 'quadratic-help',
      title: 'Need help with quadratic equations',
      author: 'Priya S.',
      subject: 'Mathematics',
      replies: 7,
      lastReply: '15 minutes ago',
      solved: false
    },
    {
      id: 'gravity-question',
      title: 'Why do objects fall at the same rate?',
      author: 'Arjun K.',
      subject: 'Physics',
      replies: 12,
      lastReply: '1 hour ago',
      solved: true
    },
    {
      id: 'photosynthesis-doubt',
      title: 'Photosynthesis process clarification',
      author: 'Meera R.',
      subject: 'Biology',
      replies: 5,
      lastReply: '3 hours ago',
      solved: false
    }
  ];

  const mockChatMessages = [
    {
      id: 1,
      author: 'Rahul M.',
      message: 'Hey everyone! Did anyone solve problem #15 from today\'s assignment?',
      timestamp: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      author: 'Ananya P.',
      message: 'Yes! I got x = 7. The trick is to factor the quadratic first.',
      timestamp: '10:32 AM',
      isMe: false
    },
    {
      id: 3,
      author: 'You',
      message: 'Thanks Ananya! Can you show the steps?',
      timestamp: '10:33 AM',
      isMe: true
    },
    {
      id: 4,
      author: 'Ananya P.',
      message: 'Sure! First, we have x² - 14x + 49 = 0. This factors to (x-7)² = 0, so x = 7.',
      timestamp: '10:35 AM',
      isMe: false
    },
    {
      id: 5,
      author: 'Vikram S.',
      message: 'That makes sense! I was trying to use the quadratic formula 😅',
      timestamp: '10:36 AM',
      isMe: false
    }
  ];

  const joinGroup = (group: any) => {
    setSelectedGroup(group);
    setShowChat(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (newMessage.trim()) {
      // In a real app, this would send the message
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🤝 Collaborate & Learn</h1>
        <p className="text-xl text-student-text-secondary">
          Connect with peers and learn together in {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Users className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{studyGroups.length}</div>
          <div className="text-student-text-secondary">Study Groups</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <MessageCircle className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">{peerDiscussions.length}</div>
          <div className="text-student-text-secondary">Discussions</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Video className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">2</div>
          <div className="text-student-text-secondary">Live Sessions</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Calendar className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">5</div>
          <div className="text-student-text-secondary">Upcoming Events</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Study Groups */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-student-text">👥 Active Study Groups</h2>
            <Button variant="outline" size="sm" className="border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary">
              Create Group
            </Button>
          </div>
          
          <div className="space-y-4">
            {studyGroups.map((group) => (
              <div key={group.id} className="p-4 bg-student-background-secondary rounded-lg hover:shadow-student-card transition-all duration-200 student-hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{group.avatar}</div>
                    <div>
                      <h3 className="font-bold text-student-text">{group.name}</h3>
                      <p className="text-sm text-student-text-secondary">{group.subject}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    group.status === 'active' ? 'bg-student-accent text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {group.status}
                  </div>
                </div>
                
                <p className="text-student-text-secondary text-sm mb-3">{group.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-student-text-secondary">
                    <span>{group.members} members</span>
                    <span className="text-student-accent">{group.online} online</span>
                    <span>Active {group.lastActivity}</span>
                  </div>
                  <Button 
                    size="sm"
                    className="btn-student-primary student-click-bounce"
                    onClick={() => joinGroup(group)}
                    disabled={group.status === 'inactive'}
                  >
                    Join Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Discussions */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-student-text">💬 Peer Discussions</h2>
            <Button variant="outline" size="sm" className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
              Ask Question
            </Button>
          </div>
          
          <div className="space-y-4">
            {peerDiscussions.map((discussion) => (
              <div key={discussion.id} className="p-4 bg-student-background-secondary rounded-lg hover:shadow-student-card transition-all duration-200 student-hover-lift">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-student-text pr-2">{discussion.title}</h3>
                  {discussion.solved && (
                    <span className="px-2 py-1 bg-student-accent text-white rounded-full text-xs font-bold flex-shrink-0">
                      ✓ Solved
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-student-text-secondary mb-3">
                  <span>by {discussion.author}</span>
                  <span className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                    {discussion.subject}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-student-text-secondary">
                    {discussion.replies} replies • Last reply {discussion.lastReply}
                  </span>
                  <Button variant="ghost" size="sm" className="text-student-primary hover:bg-student-primary hover:text-student-on-primary">
                    View Thread
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Study Sessions */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-2xl font-bold text-student-text mb-6">📅 Upcoming Study Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Calculus Review Session',
              time: 'Today, 4:00 PM',
              host: 'Dr. Kumar',
              participants: 15,
              type: 'Video Call'
            },
            {
              title: 'Physics Problem Solving',
              time: 'Tomorrow, 2:00 PM',
              host: 'Peer Group',
              participants: 8,
              type: 'Study Group'
            },
            {
              title: 'Chemistry Lab Discussion',
              time: 'Friday, 3:30 PM',
              host: 'Lab Assistant',
              participants: 12,
              type: 'Workshop'
            }
          ].map((session, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-student-primary/10 to-student-accent/10 rounded-lg border border-student-primary/20 shadow-student-card student-hover-lift">
              <h3 className="font-bold text-student-text mb-2">{session.title}</h3>
              <div className="space-y-1 text-sm text-student-text-secondary mb-3">
                <p>📅 {session.time}</p>
                <p>👨‍🏫 {session.host}</p>
                <p>👥 {session.participants} participants</p>
                <p>🎯 {session.type}</p>
              </div>
              <Button size="sm" className="w-full btn-student-primary student-click-bounce">
                Join Session
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Modal */}
      <Modal 
        isOpen={showChat} 
        onClose={() => {
          setShowChat(false);
          setSelectedGroup(null);
        }} 
        title={selectedGroup?.name}
        size="lg"
      >
        {selectedGroup && (
          <div className="space-y-4">
            {/* Group Info */}
            <div className="flex items-center justify-between p-4 bg-student-background-secondary rounded-lg shadow-student-card">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{selectedGroup.avatar}</div>
                <div>
                  <h3 className="font-bold text-student-text">{selectedGroup.name}</h3>
                  <p className="text-sm text-student-text-secondary">
                    {selectedGroup.members} members • {selectedGroup.online} online
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" icon={Video} className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
                Start Video Call
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto bg-student-background-secondary rounded-lg p-4 space-y-3 shadow-student-card">
              {mockChatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isMe 
                      ? 'bg-student-primary text-white shadow-student-card' 
                      : 'bg-white border border-border shadow-student-card'
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

            {/* Message Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input-student focus:ring-student-secondary focus:border-student-secondary"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button variant="ghost" size="sm" icon={Smile} className="text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
                <span className="sr-only">Add emoji</span>
              </Button>
              <Button size="sm" icon={Send} onClick={sendMessage} className="btn-student-primary student-click-bounce">
                Send
              </Button>
            </div>

            {/* Demo Note */}
            <div className="bg-student-primary/10 p-3 rounded-lg shadow-student-card">
              <p className="text-student-primary text-sm">
                🚀 <strong>Demo Chat:</strong> This is a simulated group chat interface. 
                In the full version, messages would be real-time with actual peer interactions.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};