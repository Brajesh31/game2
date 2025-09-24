import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Camera, ThumbsUp, Eye, Share, Plus, Star, Heart } from 'lucide-react';

export const CommunityShowcase: React.FC = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const showcaseItems = [
    {
      id: 'project-1',
      title: 'Solar-Powered Water Purifier',
      description: 'A sustainable solution for clean drinking water using solar energy and natural filtration',
      author: 'Ananya Sharma',
      category: 'Innovation',
      likes: 156,
      views: 892,
      timestamp: '2 days ago',
      image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['sustainability', 'innovation', 'water', 'solar'],
      featured: true
    },
    {
      id: 'project-2',
      title: 'AI-Powered Study Assistant',
      description: 'A chatbot that helps students with homework and provides personalized learning recommendations',
      author: 'Rohan Patel',
      category: 'Technology',
      likes: 234,
      views: 1247,
      timestamp: '1 week ago',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['ai', 'education', 'technology', 'chatbot'],
      featured: true
    },
    {
      id: 'project-3',
      title: 'Vertical Garden System',
      description: 'Space-efficient gardening solution for urban environments using recycled materials',
      author: 'Priya Singh',
      category: 'Environment',
      likes: 89,
      views: 456,
      timestamp: '3 days ago',
      image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['environment', 'gardening', 'recycling', 'urban'],
      featured: false
    },
    {
      id: 'project-4',
      title: 'Mathematical Art Generator',
      description: 'Creating beautiful art patterns using mathematical equations and algorithms',
      author: 'Aarav Kumar',
      category: 'Art & Math',
      likes: 167,
      views: 723,
      timestamp: '5 days ago',
      image: 'https://images.pexels.com/photos/1314543/pexels-photo-1314543.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['mathematics', 'art', 'algorithms', 'creativity'],
      featured: false
    }
  ];

  const likeProject = (projectId: string) => {
    if (!projectId) return;
    
    // Save to localStorage
    const likes = JSON.parse(localStorage.getItem('project_likes') || '[]');
    if (!likes.includes(projectId)) {
      likes.push(projectId);
      localStorage.setItem('project_likes', JSON.stringify(likes));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Innovation': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-purple-100 text-purple-800',
      'Environment': 'bg-green-100 text-green-800',
      'Art & Math': 'bg-orange-100 text-orange-800',
      'Science': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">📸 Community Showcase</h1>
        <p className="text-xl text-student-text-secondary">Share your projects and get inspired by others</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Camera className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{showcaseItems.length}</div>
          <div className="text-student-text-secondary">Projects Shared</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Heart className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">
            {showcaseItems.reduce((sum, item) => sum + item.likes, 0)}
          </div>
          <div className="text-student-text-secondary">Total Likes</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Eye className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">
            {showcaseItems.reduce((sum, item) => sum + item.views, 0)}
          </div>
          <div className="text-student-text-secondary">Total Views</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{showcaseItems.filter(i => i.featured).length}</div>
          <div className="text-student-text-secondary">Featured Projects</div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button 
          icon={Plus}
          onClick={() => setShowUploadModal(true)}
          className="btn-student-primary student-click-bounce"
          size="lg"
        >
          Share Your Project
        </Button>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {showcaseItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer ${
              item.featured ? 'border-2 border-student-accent bg-gradient-to-br from-student-accent/5 to-student-secondary/5' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedProject(item)}
          >
            {item.featured && (
              <div className="flex items-center justify-center mb-4">
                <span className="px-4 py-2 bg-student-accent text-white rounded-full text-sm font-bold flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Featured Project
                </span>
              </div>
            )}

            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-student-card"
            />

            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className="text-sm text-student-text-secondary">{item.timestamp}</span>
            </div>

            <h3 className="text-xl font-bold text-student-text mb-2">{item.title}</h3>
            <p className="text-student-text-secondary mb-4">{item.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-student-text-secondary">by {item.author}</span>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-student-text">{item.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-student-primary" />
                  <span className="text-student-text">{item.views}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                icon={Heart}
                onClick={(e) => {
                  e.stopPropagation();
                  likeProject(item.id);
                }}
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Like
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                icon={Share}
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        title="Share Your Project"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Project Title</label>
            <input
              type="text"
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Give your project a catchy title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Category</label>
            <select className="input-student w-full focus:ring-student-secondary focus:border-student-secondary">
              <option value="innovation">Innovation</option>
              <option value="technology">Technology</option>
              <option value="environment">Environment</option>
              <option value="art">Art & Math</option>
              <option value="science">Science</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Description</label>
            <textarea
              className="input-student w-full h-32 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Describe your project, what it does, and how you built it"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Project Image</label>
            <div className="border-2 border-dashed border-student-primary/30 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 mx-auto text-student-primary mb-4" />
              <p className="text-student-text-secondary">Click to upload project image</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowUploadModal(false)}
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setShowUploadModal(false)}
              className="btn-student-primary student-click-bounce"
            >
              Share Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};