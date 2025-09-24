import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useToast } from '../ToastContainer';
import { PlusCircle, Save, Eye, Video, FileText, HelpCircle, Gamepad2, MessageSquare, Beaker } from 'lucide-react';

export const ContentCreator: React.FC = () => {
  const { addQuest } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [showQuestBuilder, setShowQuestBuilder] = useState(false);
  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    type: 'daily',
    subject: 'Mathematics',
    difficulty: 'Easy',
    xpReward: 50,
    estimatedTime: '15 min'
  });

  const contentElements = [
    { id: 'video', name: 'Video Lecture', icon: Video, color: 'from-teal-500 to-teal-600' },
    { id: 'quiz', name: 'Interactive Quiz', icon: HelpCircle, color: 'from-teal-600 to-teal-700' },
    { id: 'text', name: 'Text Content', icon: FileText, color: 'from-teal-500 to-cyan-600' },
    { id: 'simulation', name: 'AR Simulation', icon: Beaker, color: 'from-amber-500 to-orange-600' },
    { id: 'assignment', name: 'Assignment', icon: PlusCircle, color: 'from-teal-600 to-emerald-600' },
    { id: 'discussion', name: 'Discussion Forum', icon: MessageSquare, color: 'from-amber-500 to-yellow-600' },
    { id: 'game', name: 'Learning Game', icon: Gamepad2, color: 'from-teal-500 to-blue-600' }
  ];

  const questTypes = [
    { value: 'daily', label: 'Daily Quest', description: 'Short, daily activities' },
    { value: 'weekly', label: 'Weekly Challenge', description: 'Longer-term objectives' },
    { value: 'project', label: 'Project Quest', description: 'Multi-day projects' }
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSaveQuest = () => {
    if (!questForm.title || !questForm.description) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        duration: 3000
      });
      return;
    }

    if (!questForm.title || !questForm.description) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        duration: 3000
      });
      return;
    }

    addQuest({
      ...questForm,
      createdBy: 'teacher-001'
    });

    showToast({
      type: 'success',
      title: 'Quest Created!',
      message: `"${questForm.title}" has been added to the quest library`,
      duration: 3000
    });

    setQuestForm({
      title: '',
      description: '',
      type: 'daily',
      subject: 'Mathematics',
      difficulty: 'Easy',
      xpReward: 50,
      estimatedTime: '15 min'
    });
    setShowQuestBuilder(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Content Creator</h1>
        <p className="text-xl text-text-secondary">
          Build engaging learning experiences for {classInfo?.displayName || 'Class 6'} students
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="teacher-card text-center p-6 cursor-pointer animate-teacher-slide-up" onClick={() => setShowQuestBuilder(true)}>
          <PlusCircle className="w-8 h-8 mx-auto text-teacher-primary mb-3" />
          <h3 className="font-bold text-text">Create Quest</h3>
          <p className="text-sm text-text-secondary">Build new learning quests</p>
        </div>
        
        <div className="teacher-card text-center p-6 cursor-pointer animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
          <Video className="w-8 h-8 mx-auto text-teacher-primary mb-3" />
          <h3 className="font-bold text-text">Record Lesson</h3>
          <p className="text-sm text-text-secondary">Create video content</p>
        </div>
        
        <div className="teacher-card text-center p-6 cursor-pointer animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
          <HelpCircle className="w-8 h-8 mx-auto text-teacher-primary mb-3" />
          <h3 className="font-bold text-text">Build Quiz</h3>
          <p className="text-sm text-text-secondary">Interactive assessments</p>
        </div>
        
        <div className="teacher-card text-center p-6 cursor-pointer animate-teacher-slide-up" style={{ animationDelay: '0.3s' }}>
          <Beaker className="w-8 h-8 mx-auto text-teacher-accent mb-3" />
          <h3 className="font-bold text-text">AR Lab</h3>
          <p className="text-sm text-text-secondary">Virtual experiments</p>
        </div>
      </div>

      {/* Content Elements Library */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">Content Elements Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentElements.map((element) => {
            const IconComponent = element.icon;
            return (
              <div key={element.id} className="teacher-card p-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${element.color} flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text text-center mb-2">{element.name}</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
                    Use Template
                  </Button>
                  <Button variant="ghost" size="sm" icon={Eye} className="text-teacher-primary hover:bg-teacher-primary hover:text-white">
                    Preview
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Content */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Recent Content</h2>
          <Button variant="outline" size="sm" className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {[
            { title: 'Algebra Fundamentals', type: 'Quest', subject: 'Mathematics', created: '2 days ago' },
            { title: 'Physics Lab: Motion', type: 'AR Simulation', subject: 'Physics', created: '1 week ago' },
            { title: 'Chemical Reactions Quiz', type: 'Quiz', subject: 'Chemistry', created: '1 week ago' }
          ].map((content, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-teacher-background-tertiary rounded-lg transition-all duration-300 hover:shadow-teacher-card hover:bg-teacher-background-secondary">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teacher-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-text">{content.title}</h3>
                  <p className="text-sm text-text-secondary">{content.type} • {content.subject} • {content.created}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" icon={Eye} className="text-teacher-primary hover:bg-teacher-primary hover:text-white">
                  View
                </Button>
                <Button variant="ghost" size="sm" className="text-teacher-primary hover:bg-teacher-primary hover:text-white">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Builder Modal */}
      <Modal 
        isOpen={showQuestBuilder} 
        onClose={() => setShowQuestBuilder(false)} 
        title="Create New Quest"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Quest Title *</label>
              <input
                type="text"
                value={questForm.title}
                onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
                placeholder="Enter quest title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Subject</label>
              <select
                value={questForm.subject}
                onChange={(e) => setQuestForm({ ...questForm, subject: e.target.value })}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Description *</label>
            <textarea
              value={questForm.description}
              onChange={(e) => setQuestForm({ ...questForm, description: e.target.value })}
              rows={3}
              className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              placeholder="Describe what students will learn and do"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Quest Type</label>
              <select
                value={questForm.type}
                onChange={(e) => setQuestForm({ ...questForm, type: e.target.value })}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              >
                {questTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Difficulty</label>
              <select
                value={questForm.difficulty}
                onChange={(e) => setQuestForm({ ...questForm, difficulty: e.target.value })}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">XP Reward</label>
              <input
                type="number"
                value={questForm.xpReward}
                onChange={(e) => setQuestForm({ ...questForm, xpReward: parseInt(e.target.value) })}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
                min="10"
                max="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Estimated Time</label>
            <input
              type="text"
              value={questForm.estimatedTime}
              onChange={(e) => setQuestForm({ ...questForm, estimatedTime: e.target.value })}
              className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              placeholder="e.g., 30 min, 1 hour"
            />
          </div>

          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold text-teal-800 mb-2">Quest Preview</h4>
            <div className="text-teal-700 text-sm">
              <p><strong>Title:</strong> {questForm.title || 'Untitled Quest'}</p>
              <p><strong>Type:</strong> {questTypes.find(t => t.value === questForm.type)?.label}</p>
              <p><strong>Reward:</strong> {questForm.xpReward} XP</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowQuestBuilder(false)}>
              Cancel
            </Button>
            <Button icon={Save} onClick={handleSaveQuest} className="btn-teacher-primary">
              Save Quest
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};