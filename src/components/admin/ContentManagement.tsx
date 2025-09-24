import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useToast } from '../ToastContainer';
import { BookOpen, Eye, Archive, Calendar, User, Target, Video, Users } from 'lucide-react';

export const ContentManagement: React.FC = () => {
  const { state, updateUser } = useGlobalState();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('quests');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Mock content data with status management
  const [contentStatus, setContentStatus] = useState<Record<string, string>>({});

  const quests = [
    {
      id: 'quest-1',
      title: 'Advanced Physics Concepts',
      author: 'Dr. Rajesh Kumar',
      createdAt: '2024-01-25T10:00:00Z',
      status: contentStatus['quest-1'] || 'Active',
      type: 'Weekly Challenge',
      subject: 'Physics',
      difficulty: 'Hard',
      enrolledStudents: 15
    },
    {
      id: 'quest-2',
      title: 'Algebra Fundamentals',
      author: 'Dr. Rajesh Kumar',
      createdAt: '2024-01-20T14:00:00Z',
      status: contentStatus['quest-2'] || 'Active',
      type: 'Daily Quest',
      subject: 'Mathematics',
      difficulty: 'Medium',
      enrolledStudents: 28
    },
    {
      id: 'quest-3',
      title: 'Chemical Reactions Lab',
      author: 'Dr. Rajesh Kumar',
      createdAt: '2024-01-18T09:00:00Z',
      status: contentStatus['quest-3'] || 'Pending Review',
      type: 'Project Quest',
      subject: 'Chemistry',
      difficulty: 'Easy',
      enrolledStudents: 0
    }
  ];

  const teacherCourses = [
    {
      id: 'course-1',
      title: 'Advanced Teaching Techniques',
      author: 'System Admin',
      createdAt: '2024-01-15T08:00:00Z',
      status: contentStatus['course-1'] || 'Active',
      type: 'Professional Development',
      duration: '6 weeks',
      enrolledTeachers: 12
    },
    {
      id: 'course-2',
      title: 'AR/VR in Education',
      author: 'System Admin',
      createdAt: '2024-01-10T12:00:00Z',
      status: contentStatus['course-2'] || 'Active',
      type: 'Technology Training',
      duration: '4 weeks',
      enrolledTeachers: 8
    }
  ];

  const communityEvents = [
    {
      id: 'event-1',
      title: 'Community Science Fair',
      author: 'Local Education Board',
      createdAt: '2024-01-22T16:00:00Z',
      status: contentStatus['event-1'] || 'Active',
      type: 'Educational Event',
      date: '2024-09-25',
      registrations: 45
    },
    {
      id: 'event-2',
      title: 'Parent-Teacher Workshop',
      author: 'Parent-Teacher Association',
      createdAt: '2024-01-20T10:00:00Z',
      status: contentStatus['event-2'] || 'Active',
      type: 'Workshop',
      date: '2024-10-15',
      registrations: 23
    }
  ];

  const tabs = [
    { key: 'quests', label: 'Quests', count: quests.length, data: quests, icon: Target },
    { key: 'courses', label: 'Teacher Courses', count: teacherCourses.length, data: teacherCourses, icon: Video },
    { key: 'events', label: 'Community Events', count: communityEvents.length, data: communityEvents, icon: Users }
  ];

  const currentTab = tabs.find(tab => tab.key === activeTab);
  const currentTabData = currentTab?.data || [];

  const handleArchiveContent = (contentId: string, contentTitle: string) => {
    setContentStatus(prev => ({ ...prev, [contentId]: 'Archived' }));
    
    showToast({
      type: 'warning',
      title: 'Content Archived',
      message: `"${contentTitle}" has been archived and is no longer visible to users`,
      duration: 3000
    });
  };

  const handlePreviewContent = (content: any) => {
    setSelectedContent(content);
    setShowPreviewModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-admin-primary mb-4">Content Management</h1>
        <p className="text-xl text-text-secondary">Oversee and manage all educational content across the platform</p>
      </div>

      {/* Content Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const activeCount = tab.data.filter((item: any) => item.status === 'Active').length;
          
          return (
            <div key={tab.key} className="admin-card text-center p-6 animate-admin-slide-up">
              <IconComponent className="w-8 h-8 mx-auto text-admin-primary mb-2" />
              <div className="text-2xl font-bold text-text">{tab.count}</div>
              <div className="text-text-secondary">{tab.label}</div>
              <div className="text-sm text-success mt-1">{activeCount} Active</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-admin-background-secondary rounded-lg p-1 shadow-admin-card animate-admin-slide-up" style={{ animationDelay: '0.1s' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-admin-primary text-white shadow-admin-card'
                : 'text-text-secondary hover:text-admin-primary hover:bg-admin-background'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content Table */}
      <div className="admin-card animate-admin-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full admin-table-zebra">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 font-semibold text-text">Content</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Author</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Created</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Engagement</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTabData.map((content: any) => (
                <tr 
                  key={content.id} 
                  className={`border-b border-border transition-colors ${
                    content.status === 'Archived' ? 'opacity-50' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-text">{content.title}</div>
                      <div className="text-sm text-text-secondary">
                        {content.type}
                        {content.subject && ` • ${content.subject}`}
                        {content.difficulty && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(content.difficulty)}`}>
                            {content.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-text-secondary" />
                      <span className="text-text">{content.author}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-text-secondary" />
                      <span className="text-text">{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(content.status)}`}>
                      {content.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {content.enrolledStudents !== undefined && (
                        <div>{content.enrolledStudents} students</div>
                      )}
                      {content.enrolledTeachers !== undefined && (
                        <div>{content.enrolledTeachers} teachers</div>
                      )}
                      {content.registrations !== undefined && (
                        <div>{content.registrations} registrations</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Eye}
                        className="text-admin-primary hover:bg-admin-primary hover:text-white"
                        onClick={() => handlePreviewContent(content)}
                      >
                        Review
                      </Button>
                      {content.status !== 'Archived' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Archive}
                          onClick={() => handleArchiveContent(content.id, content.title)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          Archive
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Preview Modal */}
      <Modal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
        title="Content Preview"
        size="lg"
      >
        {selectedContent && (
          <div className="admin-modal space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text mb-2">{selectedContent.title}</h2>
              <div className="flex justify-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedContent.status)}`}>
                  {selectedContent.status}
                </span>
                <span className="px-3 py-1 bg-admin-primary/10 text-admin-primary rounded-full text-sm font-bold">
                  {selectedContent.type}
                </span>
                {selectedContent.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(selectedContent.difficulty)}`}>
                    {selectedContent.difficulty}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text mb-3">Content Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Author:</strong> {selectedContent.author}</p>
                  <p><strong>Created:</strong> {new Date(selectedContent.createdAt).toLocaleDateString()}</p>
                  <p><strong>Type:</strong> {selectedContent.type}</p>
                  {selectedContent.subject && <p><strong>Subject:</strong> {selectedContent.subject}</p>}
                  {selectedContent.duration && <p><strong>Duration:</strong> {selectedContent.duration}</p>}
                  {selectedContent.date && <p><strong>Event Date:</strong> {new Date(selectedContent.date).toLocaleDateString()}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-text mb-3">Engagement Metrics</h4>
                <div className="space-y-2 text-sm">
                  {selectedContent.enrolledStudents !== undefined && (
                    <p><strong>Enrolled Students:</strong> {selectedContent.enrolledStudents}</p>
                  )}
                  {selectedContent.enrolledTeachers !== undefined && (
                    <p><strong>Enrolled Teachers:</strong> {selectedContent.enrolledTeachers}</p>
                  )}
                  {selectedContent.registrations !== undefined && (
                    <p><strong>Registrations:</strong> {selectedContent.registrations}</p>
                  )}
                  <p><strong>Completion Rate:</strong> 87%</p>
                  <p><strong>Average Rating:</strong> 4.6/5</p>
                </div>
              </div>
            </div>

            {/* Mock Content Preview */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-text mb-3">Content Preview</h4>
              {activeTab === 'quests' && (
                <div className="space-y-3">
                  <p className="text-text-secondary">
                    This quest challenges students to explore advanced concepts in {selectedContent.subject || 'the subject'}.
                  </p>
                  <div className="bg-admin-primary/10 p-3 rounded">
                    <p className="text-admin-primary text-sm">
                      <strong>Learning Objectives:</strong> Students will understand key principles and apply them in practical scenarios.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'courses' && (
                <div className="space-y-3">
                  <p className="text-text-secondary">
                    Professional development course designed to enhance teaching skills and methodologies.
                  </p>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-green-800 text-sm">
                      <strong>Course Modules:</strong> 8 interactive modules with practical exercises and assessments.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'events' && (
                <div className="space-y-3">
                  <p className="text-text-secondary">
                    Community event bringing together students, teachers, and families for educational activities.
                  </p>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-purple-800 text-sm">
                      <strong>Event Highlights:</strong> Interactive demonstrations, workshops, and networking opportunities.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              {selectedContent.status !== 'Archived' && (
                <Button 
                  onClick={() => {
                    handleArchiveContent(selectedContent.id, selectedContent.title);
                    setShowPreviewModal(false);
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Archive Content
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowPreviewModal(false)} className="border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white">
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};