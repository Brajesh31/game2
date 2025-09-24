import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const communityEvents = [
    {
      id: 'science-fair',
      title: 'Community Science Fair',
      date: 'September 25th, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Community Center, Main Hall',
      description: 'Join us for an exciting day of science experiments, demonstrations, and learning! Students from all grades will showcase their projects.',
      category: 'Educational Event',
      ageGroup: 'All Ages',
      cost: 'Free',
      organizer: 'Local Education Board',
      highlights: [
        'Interactive science experiments',
        'Student project displays',
        'Meet local scientists',
        'Fun activities for the whole family'
      ]
    },
    {
      id: 'stem-artisan',
      title: 'Meet a Local STEM Artisan',
      date: 'September 30th, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'Innovation Workshop, Tech District',
      description: 'Discover how traditional crafts meet modern technology! Meet local artisans who use STEM principles in their work.',
      category: 'Workshop',
      ageGroup: '8-16 years',
      cost: '₹200 per child',
      organizer: 'STEM Community Initiative',
      highlights: [
        'Hands-on craft activities',
        'Learn about 3D printing in art',
        'Meet professional artisans',
        'Take home your creations'
      ]
    },
    {
      id: 'coding-bootcamp',
      title: 'Kids Coding Bootcamp',
      date: 'October 5th-7th, 2024',
      time: '9:00 AM - 12:00 PM',
      location: 'Digital Learning Center',
      description: 'A 3-day introduction to coding for beginners. Kids will learn basic programming concepts through fun games and activities.',
      category: 'Workshop Series',
      ageGroup: '10-14 years',
      cost: '₹1,500 for 3 days',
      organizer: 'CodeForKids Foundation',
      highlights: [
        'Learn Scratch programming',
        'Create your own games',
        'Work in small groups',
        'Certificate of completion'
      ]
    },
    {
      id: 'math-olympiad',
      title: 'Regional Math Olympiad',
      date: 'October 12th, 2024',
      time: '10:00 AM - 1:00 PM',
      location: 'City High School Auditorium',
      description: 'Challenge your mathematical skills in this friendly competition. Open to all students who love problem-solving!',
      category: 'Competition',
      ageGroup: '12-16 years',
      cost: '₹100 registration fee',
      organizer: 'Mathematics Teachers Association',
      highlights: [
        'Individual and team rounds',
        'Prizes for top performers',
        'Meet other math enthusiasts',
        'Fun problem-solving challenges'
      ]
    },
    {
      id: 'parent-workshop',
      title: 'Supporting Your Child\'s Learning at Home',
      date: 'October 15th, 2024',
      time: '7:00 PM - 9:00 PM',
      location: 'Community Library, Conference Room',
      description: 'Learn practical strategies to support your child\'s education at home. Tips for creating a learning environment and helping with homework.',
      category: 'Parent Workshop',
      ageGroup: 'For Parents',
      cost: 'Free',
      organizer: 'Parent-Teacher Association',
      highlights: [
        'Expert tips from educators',
        'Q&A session',
        'Take-home resources',
        'Connect with other parents'
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Educational Event': return 'bg-blue-100 text-blue-800';
      case 'Workshop': return 'bg-green-100 text-green-800';
      case 'Workshop Series': return 'bg-purple-100 text-purple-800';
      case 'Competition': return 'bg-orange-100 text-orange-800';
      case 'Parent Workshop': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-guardian-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guardian-text mb-4">Community Hub</h1>
        <p className="text-2xl text-guardian-text-secondary">
          Discover local learning opportunities and events
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.1s' }}>
          <Calendar className="w-8 h-8 mx-auto text-guardian-primary mb-2" />
          <div className="text-2xl font-bold text-guardian-text">{communityEvents.length}</div>
          <div className="text-guardian-text-secondary">Upcoming Events</div>
        </div>
        
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.2s' }}>
          <Users className="w-8 h-8 mx-auto text-guardian-secondary mb-2" />
          <div className="text-2xl font-bold text-guardian-text">3</div>
          <div className="text-guardian-text-secondary">Free Events</div>
        </div>
        
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-guardian-accent mb-2" />
          <div className="text-2xl font-bold text-guardian-text">All Ages</div>
          <div className="text-guardian-text-secondary">Family Friendly</div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6 animate-guardian-slide-up" style={{ animationDelay: '0.4s' }}>
        {communityEvents.map((event) => (
          <div key={event.id} className="guardian-card hover:shadow-guardian-hover p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]" onClick={() => setSelectedEvent(event)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-guardian-text">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <p className="text-lg text-guardian-text-secondary mb-3">{event.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-guardian-primary" />
                <span className="text-guardian-text">{event.date}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-guardian-secondary" />
                <span className="text-guardian-text">{event.time}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-guardian-accent" />
                <span className="text-guardian-text">{event.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-guardian-accent" />
                <span className="text-guardian-text">{event.ageGroup}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-lg font-bold text-guardian-secondary">
                {event.cost}
              </div>
              <Button className="border-guardian-primary text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary">
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Detail Modal */}
      <Modal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        title={selectedEvent?.title}
        size="lg"
      >
        {selectedEvent && (
          <div className="guardian-modal space-y-6">
            {/* Event Header */}
            <div className="text-center">
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold mb-4 ${getCategoryColor(selectedEvent.category)}`}>
                {selectedEvent.category}
              </span>
              <p className="text-xl text-guardian-text-secondary">{selectedEvent.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-guardian-primary" />
                  <div>
                    <div className="font-semibold text-guardian-text">Date</div>
                    <div className="text-guardian-text-secondary">{selectedEvent.date}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-guardian-secondary" />
                  <div>
                    <div className="font-semibold text-guardian-text">Time</div>
                    <div className="text-guardian-text-secondary">{selectedEvent.time}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-guardian-accent" />
                  <div>
                    <div className="font-semibold text-guardian-text">Location</div>
                    <div className="text-guardian-text-secondary">{selectedEvent.location}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-guardian-accent" />
                  <div>
                    <div className="font-semibold text-guardian-text">Age Group</div>
                    <div className="text-guardian-text-secondary">{selectedEvent.ageGroup}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-semibold text-guardian-text mb-1">Cost</div>
                  <div className="text-2xl font-bold text-guardian-secondary">{selectedEvent.cost}</div>
                </div>
                
                <div>
                  <div className="font-semibold text-guardian-text mb-1">Organizer</div>
                  <div className="text-guardian-text-secondary">{selectedEvent.organizer}</div>
                </div>
              </div>
            </div>

            {/* Event Highlights */}
            <div>
              <h4 className="text-xl font-bold text-guardian-text mb-3">What to Expect</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedEvent.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-guardian-primary rounded-full flex-shrink-0"></div>
                    <span className="text-guardian-text-secondary">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="px-8 btn-guardian-primary">
                Register Now
              </Button>
              <Button size="lg" className="border-guardian-secondary text-guardian-secondary hover:bg-guardian-secondary hover:text-white">
                Share Event
              </Button>
            </div>

            {/* Contact Info */}
            <div className="bg-guardian-background-tertiary p-4 rounded-lg text-center border border-guardian-accent/20">
              <p className="text-guardian-accent">
                <strong>Questions?</strong> Contact the organizer or visit the community center for more information.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Community Message */}
      <div className="guardian-card p-8 bg-gradient-to-r from-guardian-background-tertiary to-guardian-background-secondary animate-guardian-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-guardian-text mb-4">Join Our Learning Community!</h2>
          <p className="text-xl text-guardian-text-secondary mb-4">
            These events are designed to support your child's learning journey and connect families in our community.
          </p>
          <div className="text-5xl mb-4">🤝</div>
          <p className="text-lg text-guardian-text-secondary">
            Together, we can create amazing learning opportunities for all our children!
          </p>
        </div>
      </div>
    </div>
  );
};