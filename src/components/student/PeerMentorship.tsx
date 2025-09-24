import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Lightbulb, Users, MessageCircle, Star, Crown, Heart } from 'lucide-react';

export const PeerMentorship: React.FC = () => {
  const { user } = useAuth();
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'find' | 'my-mentors' | 'become'>('find');

  const availableMentors = [
    {
      id: 'mentor-1',
      name: 'Ananya Sharma',
      level: 25,
      subjects: ['Mathematics', 'Physics'],
      rating: 4.9,
      sessions: 156,
      bio: 'Passionate about helping students master calculus and physics concepts',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      achievements: ['Math Master', 'Physics Expert', 'Top Mentor'],
      availability: 'Weekends, 2-5 PM'
    },
    {
      id: 'mentor-2',
      name: 'Rohan Patel',
      level: 22,
      subjects: ['Chemistry', 'Biology'],
      rating: 4.8,
      sessions: 89,
      bio: 'Medical student helping with science subjects and exam preparation',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      achievements: ['Science Champion', 'Helpful Mentor'],
      availability: 'Weekdays, 6-8 PM'
    }
  ];

  const myMentors = [
    {
      id: 'mentor-1',
      name: 'Ananya Sharma',
      subject: 'Mathematics',
      nextSession: 'Tomorrow, 3:00 PM',
      progress: 'Working on Calculus basics',
      messages: 5
    }
  ];

  const requestMentorship = (mentorId: string) => {
    if (!mentorId || !user?.id) return;
    
    // Save to localStorage
    const requests = JSON.parse(localStorage.getItem('mentorship_requests') || '[]');
    requests.push({
      mentorId,
      studentId: user?.id,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('mentorship_requests', JSON.stringify(requests));
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🤝 Peer Mentorship</h1>
        <p className="text-xl text-student-text-secondary">Learn from senior students and help others grow</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {[
            { key: 'find', label: 'Find Mentors' },
            { key: 'my-mentors', label: 'My Mentors' },
            { key: 'become', label: 'Become Mentor' }
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {/* Find Mentors */}
        {activeTab === 'find' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableMentors.map((mentor, index) => (
              <div 
                key={mentor.id} 
                className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover shadow-student-card"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-student-text">{mentor.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-student-primary font-bold">Level {mentor.level}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-student-text ml-1">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-student-text-secondary mb-4">{mentor.bio}</p>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-sm text-student-text-secondary">Subjects: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mentor.subjects.map((subject) => (
                        <span key={subject} className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Sessions:</span>
                    <span className="text-student-text">{mentor.sessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Available:</span>
                    <span className="text-student-text">{mentor.availability}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 btn-student-primary student-click-bounce"
                    onClick={() => requestMentorship(mentor.id)}
                  >
                    Request Mentorship
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setShowMentorModal(true);
                    }}
                    className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Mentors */}
        {activeTab === 'my-mentors' && (
          <div className="space-y-6">
            {myMentors.map((mentor) => (
              <div key={mentor.id} className="student-card p-6 animate-student-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-student-text">{mentor.name}</h3>
                    <p className="text-student-text-secondary">{mentor.subject} Mentor</p>
                  </div>
                  <Button 
                    icon={MessageCircle}
                    className="btn-student-primary student-click-bounce"
                  >
                    Chat
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-student-text-secondary">Next Session:</span>
                    <p className="font-bold text-student-text">{mentor.nextSession}</p>
                  </div>
                  <div>
                    <span className="text-sm text-student-text-secondary">Current Progress:</span>
                    <p className="font-bold text-student-text">{mentor.progress}</p>
                  </div>
                  <div>
                    <span className="text-sm text-student-text-secondary">Unread Messages:</span>
                    <p className="font-bold text-student-accent">{mentor.messages}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Become Mentor */}
        {activeTab === 'become' && (
          <div className="student-card p-8 text-center animate-student-slide-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-student-secondary to-student-accent flex items-center justify-center shadow-student-hover">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-student-text mb-4">Become a Peer Mentor</h2>
            <p className="text-xl text-student-text-secondary mb-6">
              Share your knowledge and help junior students succeed
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto text-student-primary mb-2" />
                <h3 className="font-bold text-student-text mb-2">Help Others</h3>
                <p className="text-student-text-secondary text-sm">Make a positive impact on junior students</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto text-student-accent mb-2" />
                <h3 className="font-bold text-student-text mb-2">Earn Recognition</h3>
                <p className="text-student-text-secondary text-sm">Gain leadership badges and certificates</p>
              </div>
              <div className="text-center">
                <Lightbulb className="w-8 h-8 mx-auto text-student-secondary mb-2" />
                <h3 className="font-bold text-student-text mb-2">Strengthen Skills</h3>
                <p className="text-student-text-secondary text-sm">Teaching others reinforces your own learning</p>
              </div>
            </div>

            <Button size="lg" className="btn-student-primary student-click-bounce">
              Apply to Become Mentor
            </Button>
          </div>
        )}
      </div>

      {/* Mentor Profile Modal */}
      <Modal 
        isOpen={showMentorModal} 
        onClose={() => setShowMentorModal(false)} 
        title="Mentor Profile"
        size="lg"
      >
        {selectedMentor && (
          <div className="space-y-6">
            <div className="text-center">
              <img 
                src={selectedMentor.avatar} 
                alt={selectedMentor.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-student-hover"
              />
              <h2 className="text-2xl font-bold text-student-text">{selectedMentor.name}</h2>
              <p className="text-student-text-secondary">Level {selectedMentor.level} Mentor</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-student-text mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.subjects.map((subject: string) => (
                    <span key={subject} className="px-3 py-1 bg-student-primary text-white rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-student-text mb-2">Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.achievements.map((achievement: string) => (
                    <span key={achievement} className="px-3 py-1 bg-student-accent text-white rounded-full text-sm">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-student-primary/10 p-4 rounded-lg">
              <p className="text-student-primary">{selectedMentor.bio}</p>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg"
                onClick={() => requestMentorship(selectedMentor.id)}
                className="btn-student-primary student-click-bounce"
              >
                Request Mentorship
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};