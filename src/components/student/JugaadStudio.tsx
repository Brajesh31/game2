import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { LocalStorageService } from '../../services/LocalStorageService';
import { Wrench, Plus, Eye, Share, Palette, Code, Beaker, Lightbulb } from 'lucide-react';

export const JugaadStudio: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: 'project',
    tags: [] as string[]
  });

  const studentId = user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);
  const portfolioItems = studentProgress?.portfolioItems || [];

  const projectTypes = [
    { value: 'project', label: 'Science Project', icon: Beaker, color: 'from-green-500 to-emerald-600' },
    { value: 'artwork', label: 'Digital Art', icon: Palette, color: 'from-purple-500 to-pink-600' },
    { value: 'writing', label: 'Creative Writing', icon: Code, color: 'from-blue-500 to-indigo-600' },
    { value: 'experiment', label: 'Experiment Log', icon: Lightbulb, color: 'from-yellow-500 to-orange-600' }
  ];

  const sparkForgeChallenges = [
    {
      id: 'eco-innovation',
      title: 'Eco Innovation Challenge',
      description: 'Design a solution to reduce plastic waste in your community',
      deadline: '2024-02-15',
      participants: 1247,
      prize: 'Innovation Badge + ₹5,000',
      difficulty: 'Medium'
    },
    {
      id: 'space-habitat',
      title: 'Space Habitat Design',
      description: 'Create a sustainable living space for Mars colonization',
      deadline: '2024-02-20',
      participants: 892,
      prize: 'Space Pioneer Badge + NASA Mentorship',
      difficulty: 'Hard'
    },
    {
      id: 'ai-helper',
      title: 'AI Learning Assistant',
      description: 'Design an AI tool to help students with homework',
      deadline: '2024-02-10',
      participants: 2156,
      prize: 'Tech Innovator Badge + Coding Course',
      difficulty: 'Advanced'
    }
  ];

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description) return;

    if (!newProject.title || !newProject.description) return;

    const project = {
      id: `project_${Date.now()}`,
      ...newProject,
      createdAt: new Date().toISOString(),
      content: `This is a ${newProject.type} created in Jugaad Studio.`
    };

    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress) {
      progress.portfolioItems.push(project);
      LocalStorageService.saveStudentProgress(progress);
    }

    setNewProject({ title: '', description: '', type: 'project', tags: [] });
    setShowCreateModal(false);
  };

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
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🔧 Jugaad Studio</h1>
        <p className="text-xl text-student-text-secondary">Create, innovate, and build your digital portfolio</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {projectTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div 
              key={type.value}
              className="student-card p-6 text-center cursor-pointer hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
              onClick={() => {
                setNewProject({ ...newProject, type: type.value });
                setShowCreateModal(true);
              }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 hover:scale-110`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">{type.label}</h3>
              <Button size="sm" className="btn-student-primary student-click-bounce">
                Create New
              </Button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Portfolio */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-student-text">🎨 My Portfolio</h2>
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
              className="btn-student-primary student-click-bounce"
              size="sm"
            >
              Add Item
            </Button>
          </div>
          
          {portfolioItems.length > 0 ? (
            <div className="space-y-4">
              {portfolioItems.map((item) => (
                <div key={item.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200 student-hover-lift">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-student-text">{item.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.type === 'project' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'artwork' ? 'bg-purple-100 text-purple-800' :
                      item.type === 'writing' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-student-text-secondary text-sm mb-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-student-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" icon={Eye} className="text-student-primary hover:bg-student-primary hover:text-student-on-primary">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon={Share} className="text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="w-16 h-16 mx-auto text-student-text-muted mb-4" />
              <p className="text-student-text-secondary mb-4">Your portfolio is empty</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="btn-student-primary student-click-bounce"
              >
                Create Your First Project
              </Button>
            </div>
          )}
        </div>

        {/* Spark Forge Challenges */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-student-text mb-6">⚡ Spark Forge Challenges</h2>
          
          <div className="space-y-4">
            {sparkForgeChallenges.map((challenge) => (
              <div key={challenge.id} className="p-4 bg-gradient-to-r from-student-accent/10 to-student-secondary/10 rounded-lg border border-student-accent/20 shadow-student-card hover:shadow-student-hover transition-all duration-200 student-hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-student-text">{challenge.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <p className="text-student-text-secondary text-sm mb-3">{challenge.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Deadline:</span>
                    <span className="text-student-text">{new Date(challenge.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Participants:</span>
                    <span className="text-student-text">{challenge.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-student-text-secondary">Prize:</span>
                    <span className="text-student-accent font-bold">{challenge.prize}</span>
                  </div>
                </div>
                
                <Button size="sm" className="w-full btn-student-accent student-click-bounce">
                  Join Challenge
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Create New Portfolio Item"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Project Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Project Type</label>
            <div className="grid grid-cols-2 gap-4">
              {projectTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setNewProject({ ...newProject, type: type.value })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      newProject.type === type.value
                        ? 'border-student-primary bg-student-primary/10'
                        : 'border-border hover:border-student-primary/50'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto mb-2 text-student-primary" />
                    <span className="text-sm font-medium text-student-text">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input-student w-full h-24 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Describe your project..."
            />
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
              onClick={handleCreateProject}
              className="btn-student-primary student-click-bounce"
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};