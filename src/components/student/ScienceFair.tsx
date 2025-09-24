import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Beaker, Upload, Eye, Award, Calendar, Users, Star, Clock } from 'lucide-react';

export const ScienceFair: React.FC = () => {
  const [selectedFair, setSelectedFair] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submission, setSubmission] = useState({
    title: '',
    description: '',
    category: 'physics',
    hypothesis: '',
    methodology: ''
  });

  const scienceFairs = [
    {
      id: 'regional-fair-2024',
      title: 'Regional Science Fair 2024',
      description: 'Showcase your scientific research and innovations to judges and peers',
      date: '2024-03-15',
      deadline: '2024-02-28',
      location: 'City Convention Center',
      categories: ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Computer Science'],
      participants: 245,
      prizes: ['₹25,000 First Prize', '₹15,000 Second Prize', '₹10,000 Third Prize'],
      status: 'open',
      mySubmission: null
    },
    {
      id: 'national-innovation-fair',
      title: 'National Innovation Fair',
      description: 'Present innovative solutions to real-world problems',
      date: '2024-04-20',
      deadline: '2024-04-05',
      location: 'National Science Museum, Delhi',
      categories: ['Innovation', 'Technology', 'Sustainability', 'Health', 'Education'],
      participants: 1200,
      prizes: ['National Recognition', 'Mentorship Program', 'Research Grant'],
      status: 'upcoming',
      mySubmission: null
    },
    {
      id: 'school-science-expo',
      title: 'School Science Expo 2024',
      description: 'Internal school science exhibition and competition',
      date: '2024-02-10',
      deadline: '2024-02-05',
      location: 'School Auditorium',
      categories: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
      participants: 89,
      prizes: ['Gold Medal', 'Silver Medal', 'Bronze Medal'],
      status: 'completed',
      mySubmission: {
        title: 'Solar Water Purification System',
        category: 'Environmental Science',
        rank: 2,
        feedback: 'Excellent innovation with practical applications!'
      }
    }
  ];

  const categories = ['physics', 'chemistry', 'biology', 'environmental_science', 'computer_science', 'mathematics'];

  const handleSubmit = () => {
    if (!submission.title || !submission.description) return;

    if (!submission.title || !submission.description) return;

    // In a real app, this would submit to backend
    setShowSubmissionModal(false);
    setSubmission({
      title: '',
      description: '',
      category: 'physics',
      hypothesis: '',
      methodology: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return { text: '🥇 First Place', color: 'bg-yellow-100 text-yellow-800' };
      case 2: return { text: '🥈 Second Place', color: 'bg-gray-100 text-gray-800' };
      case 3: return { text: '🥉 Third Place', color: 'bg-orange-100 text-orange-800' };
      default: return { text: `#${rank} Place`, color: 'bg-blue-100 text-blue-800' };
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🧪 Science Fair</h1>
        <p className="text-xl text-student-text-secondary">Showcase your scientific research and innovations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Beaker className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{scienceFairs.length}</div>
          <div className="text-student-text-secondary">Available Fairs</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Upload className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">1</div>
          <div className="text-student-text-secondary">Submissions</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Award className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">2nd</div>
          <div className="text-student-text-secondary">Best Rank</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">1</div>
          <div className="text-student-text-secondary">Awards Won</div>
        </div>
      </div>

      {/* Science Fairs */}
      <div className="space-y-6">
        {scienceFairs.map((fair, index) => (
          <div 
            key={fair.id} 
            className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-student-text">{fair.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(fair.status)}`}>
                    {fair.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-lg text-student-text-secondary mb-4">{fair.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-student-primary" />
                <div>
                  <div className="text-sm text-student-text-secondary">Event Date</div>
                  <div className="font-medium text-student-text">{new Date(fair.date).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-student-secondary" />
                <div>
                  <div className="text-sm text-student-text-secondary">Deadline</div>
                  <div className="font-medium text-student-text">{new Date(fair.deadline).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-student-accent" />
                <div>
                  <div className="text-sm text-student-text-secondary">Participants</div>
                  <div className="font-medium text-student-text">{fair.participants}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-student-primary" />
                <div>
                  <div className="text-sm text-student-text-secondary">Location</div>
                  <div className="font-medium text-student-text">{fair.location}</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h4 className="font-semibold text-student-text mb-2">Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {fair.categories.map((category) => (
                  <span key={category} className="px-3 py-1 bg-student-primary text-white rounded-full text-sm font-medium shadow-student-card">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Prizes */}
            <div className="mb-6">
              <h4 className="font-semibold text-student-text mb-2">Prizes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {fair.prizes.map((prize, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-student-accent mr-2" />
                    <span className="text-student-text">{prize}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Submission Status */}
            {fair.mySubmission ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-green-800">✅ Your Submission</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRankBadge(fair.mySubmission.rank).color}`}>
                    {getRankBadge(fair.mySubmission.rank).text}
                  </span>
                </div>
                <p className="text-green-700 mb-2"><strong>Project:</strong> {fair.mySubmission.title}</p>
                <p className="text-green-700 mb-2"><strong>Category:</strong> {fair.mySubmission.category}</p>
                <p className="text-green-700"><strong>Judge Feedback:</strong> {fair.mySubmission.feedback}</p>
              </div>
            ) : (
              <div className="bg-student-primary/10 p-4 rounded-lg border border-student-primary/20 mb-4">
                <p className="text-student-primary">
                  {fair.status === 'open' ? '📝 You haven\'t submitted to this fair yet' : 
                   fair.status === 'upcoming' ? '⏰ Submissions will open soon' :
                   '🔒 Submission period has ended'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => setSelectedFair(fair)}
                variant="outline"
                className="border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary"
                icon={Eye}
              >
                View Details
              </Button>
              
              {fair.status === 'open' && !fair.mySubmission && (
                <Button 
                  onClick={() => {
                    setSelectedFair(fair);
                    setShowSubmissionModal(true);
                  }}
                  className="btn-student-primary student-click-bounce"
                  icon={Upload}
                >
                  Submit Project
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      <Modal 
        isOpen={showSubmissionModal} 
        onClose={() => setShowSubmissionModal(false)} 
        title="Submit Your Science Project"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Project Title</label>
            <input
              type="text"
              value={submission.title}
              onChange={(e) => setSubmission({ ...submission, title: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Enter your project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Category</label>
            <select
              value={submission.category}
              onChange={(e) => setSubmission({ ...submission, category: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Project Description</label>
            <textarea
              value={submission.description}
              onChange={(e) => setSubmission({ ...submission, description: e.target.value })}
              className="input-student w-full h-24 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Describe your project and its objectives"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Hypothesis</label>
            <textarea
              value={submission.hypothesis}
              onChange={(e) => setSubmission({ ...submission, hypothesis: e.target.value })}
              className="input-student w-full h-20 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="What do you expect to discover or prove?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Methodology</label>
            <textarea
              value={submission.methodology}
              onChange={(e) => setSubmission({ ...submission, methodology: e.target.value })}
              className="input-student w-full h-24 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Describe your experimental method and procedure"
            />
          </div>

          <div className="bg-student-primary/10 p-4 rounded-lg border border-student-primary/20">
            <h4 className="font-semibold text-student-primary mb-2">📋 Submission Requirements</h4>
            <ul className="text-student-primary text-sm space-y-1">
              <li>• Original research or innovation</li>
              <li>• Clear hypothesis and methodology</li>
              <li>• Supporting data or evidence</li>
              <li>• Presentation slides or poster</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSubmissionModal(false)}
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="btn-student-primary student-click-bounce"
            >
              Submit Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};