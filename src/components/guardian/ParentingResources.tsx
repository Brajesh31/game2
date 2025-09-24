import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { BookOpen, Video, Users, Download, Star, Clock } from 'lucide-react';

export const ParentingResources: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const resources = [
    {
      id: 'supporting-learning-home',
      title: 'Supporting Learning at Home',
      description: 'Practical strategies to create an effective learning environment',
      type: 'Guide',
      duration: '15 min read',
      rating: 4.8,
      downloads: 1247,
      content: {
        sections: [
          'Creating a dedicated study space',
          'Establishing routines and schedules',
          'Encouraging curiosity and questions',
          'Balancing screen time and activities'
        ]
      },
      icon: '📚'
    },
    {
      id: 'understanding-child-development',
      title: 'Understanding Child Development Stages',
      description: 'Age-appropriate expectations and developmental milestones',
      type: 'Video Series',
      duration: '45 min',
      rating: 4.9,
      downloads: 892,
      content: {
        sections: [
          'Cognitive development patterns',
          'Social and emotional growth',
          'Physical development milestones',
          'Supporting individual differences'
        ]
      },
      icon: '🧠'
    },
    {
      id: 'homework-help-strategies',
      title: 'Effective Homework Help Strategies',
      description: 'How to help without doing the work for them',
      type: 'Interactive Workshop',
      duration: '30 min',
      rating: 4.7,
      downloads: 1456,
      content: {
        sections: [
          'When to step in and when to step back',
          'Asking the right questions',
          'Building problem-solving skills',
          'Celebrating effort over results'
        ]
      },
      icon: '✏️'
    },
    {
      id: 'digital-citizenship',
      title: 'Digital Citizenship for Families',
      description: 'Navigating technology and online safety together',
      type: 'Guide',
      duration: '20 min read',
      rating: 4.6,
      downloads: 734,
      content: {
        sections: [
          'Online safety fundamentals',
          'Screen time management',
          'Digital footprint awareness',
          'Cyberbullying prevention'
        ]
      },
      icon: '💻'
    },
    {
      id: 'motivation-engagement',
      title: 'Keeping Children Motivated and Engaged',
      description: 'Strategies to maintain enthusiasm for learning',
      type: 'Webinar',
      duration: '60 min',
      rating: 4.8,
      downloads: 1123,
      content: {
        sections: [
          'Understanding intrinsic motivation',
          'Setting achievable goals',
          'Celebrating small wins',
          'Dealing with learning challenges'
        ]
      },
      icon: '🎯'
    },
    {
      id: 'communication-teachers',
      title: 'Effective Communication with Teachers',
      description: 'Building strong parent-teacher partnerships',
      type: 'Guide',
      duration: '12 min read',
      rating: 4.9,
      downloads: 1567,
      content: {
        sections: [
          'Preparing for parent-teacher meetings',
          'Asking the right questions',
          'Sharing concerns constructively',
          'Following up on discussions'
        ]
      },
      icon: '🤝'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Guide': return 'bg-blue-100 text-blue-800';
      case 'Video Series': return 'bg-purple-100 text-purple-800';
      case 'Interactive Workshop': return 'bg-green-100 text-green-800';
      case 'Webinar': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (resourceId: string) => {
    showToast({
      type: 'success',
      title: 'Download Started',
      message: 'Resource is being downloaded to your device',
      duration: 3000
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-guardian-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guardian-text mb-4">Parenting Resources</h1>
        <p className="text-2xl text-guardian-text-secondary">
          Expert guidance to support your child's learning journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.1s' }}>
          <BookOpen className="w-8 h-8 mx-auto text-guardian-primary mb-2" />
          <div className="text-2xl font-bold text-guardian-text">{resources.length}</div>
          <div className="text-guardian-text-secondary">Available Resources</div>
        </div>
        
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.2s' }}>
          <Download className="w-8 h-8 mx-auto text-guardian-secondary mb-2" />
          <div className="text-2xl font-bold text-guardian-text">
            {resources.reduce((sum, r) => sum + r.downloads, 0).toLocaleString()}
          </div>
          <div className="text-guardian-text-secondary">Total Downloads</div>
        </div>
        
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-guardian-accent mb-2" />
          <div className="text-2xl font-bold text-guardian-text">4.8</div>
          <div className="text-guardian-text-secondary">Average Rating</div>
        </div>
        
        <div className="guardian-card text-center p-6 animate-guardian-slide-up" style={{ animationDelay: '0.4s' }}>
          <Users className="w-8 h-8 mx-auto text-guardian-primary mb-2" />
          <div className="text-2xl font-bold text-guardian-text">Free</div>
          <div className="text-guardian-text-secondary">All Resources</div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <div 
            key={resource.id} 
            className="guardian-card p-6 hover:shadow-guardian-hover transition-all duration-300 animate-guardian-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => {
              setSelectedResource(resource);
              setShowResourceModal(true);
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{resource.icon}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getTypeColor(resource.type)}`}>
                {resource.type}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-guardian-text mb-3">{resource.title}</h3>
            <p className="text-guardian-text-secondary mb-4">{resource.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-guardian-text-secondary" />
                  <span className="text-guardian-text">{resource.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-guardian-text">{resource.rating}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-guardian-text-secondary">Downloads:</span>
                <span className="text-guardian-text">{resource.downloads.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 btn-guardian-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedResource(resource);
                  setShowResourceModal(true);
                }}
              >
                Read More
              </Button>
              <Button 
                variant="outline" 
                icon={Download}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(resource.id);
                }}
                className="border-guardian-secondary text-guardian-secondary hover:bg-guardian-secondary hover:text-guardian-on-primary"
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Detail Modal */}
      <Modal 
        isOpen={showResourceModal} 
        onClose={() => setShowResourceModal(false)} 
        title={selectedResource?.title}
        size="lg"
      >
        {selectedResource && (
          <div className="guardian-modal space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedResource.icon}</div>
              <h2 className="text-2xl font-bold text-guardian-text mb-2">{selectedResource.title}</h2>
              <p className="text-guardian-text-secondary">{selectedResource.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-guardian-text mb-2">Resource Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Type:</strong> {selectedResource.type}</p>
                  <p><strong>Duration:</strong> {selectedResource.duration}</p>
                  <p><strong>Rating:</strong> ⭐ {selectedResource.rating}/5</p>
                  <p><strong>Downloads:</strong> {selectedResource.downloads.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-guardian-text mb-2">What You'll Learn</h4>
                <ul className="space-y-1">
                  {selectedResource.content.sections.map((section: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <div className="w-2 h-2 bg-guardian-primary rounded-full mr-2 mt-2"></div>
                      <span className="text-guardian-text-secondary">{section}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-guardian-background-tertiary p-4 rounded-lg">
              <p className="text-guardian-accent text-sm">
                💡 <strong>Expert Tip:</strong> These resources are created by child development experts 
                and experienced educators to help you support your child's learning journey effectively.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                size="lg"
                onClick={() => handleDownload(selectedResource.id)}
                className="btn-guardian-primary"
                icon={Download}
              >
                Download Resource
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowResourceModal(false)}
                className="border-guardian-secondary text-guardian-secondary hover:bg-guardian-secondary hover:text-guardian-on-primary"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};