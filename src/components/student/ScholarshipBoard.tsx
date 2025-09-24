import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  Award,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  Bell,
} from 'lucide-react';

export const ScholarshipBoard: React.FC = () => {
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const scholarships = [
    {
      id: 'kishore-vaigyanik',
      title: 'Kishore Vaigyanik Protsahan Yojana (KVPY)',
      provider: 'Indian Institute of Science',
      amount: '₹5,000 - ₹7,000 per month',
      deadline: '2024-10-15',
      category: 'Science',
      eligibility: 'Class 11, 12 and undergraduate students',
      description:
        'Fellowship program to encourage students to pursue research careers in science',
      benefits: [
        'Monthly fellowship',
        'Annual contingency grant',
        'Admission to IISc/IISERs',
        'Research opportunities',
      ],
      requirements: [
        'Strong academic record in science',
        'Aptitude test and interview',
        'Commitment to research career',
      ],
      applicationLink: 'https://kvpy.iisc.ac.in',
      difficulty: 'High',
    },
    {
      id: 'inspire-scholarship',
      title: 'INSPIRE Scholarship',
      provider: 'Department of Science & Technology',
      amount: '₹80,000 per year',
      deadline: '2024-09-30',
      category: 'Science',
      eligibility: 'Top 1% students in Class 12 board exams',
      description:
        'Scholarship for pursuing undergraduate studies in natural sciences',
      benefits: [
        'Annual scholarship of ₹80,000',
        'Summer research fellowship',
        'Mentorship program',
        'Research exposure',
      ],
      requirements: [
        'Top 1% in Class 12 boards',
        'Pursue BSc/BTech in natural sciences',
        'Maintain good academic performance',
      ],
      applicationLink: 'https://inspire-dst.gov.in',
      difficulty: 'Medium',
    },
    {
      id: 'ntse-scholarship',
      title: 'National Talent Search Examination (NTSE)',
      provider: 'NCERT',
      amount: '₹1,250 - ₹2,000 per month',
      deadline: '2024-11-20',
      category: 'General',
      eligibility: 'Class 10 students',
      description: 'National level scholarship for talented students',
      benefits: [
        'Monthly scholarship throughout academic career',
        'Recognition certificate',
        'Priority in various programs',
        'Career guidance',
      ],
      requirements: [
        'Clear state and national level exams',
        'Strong academic performance',
        'Indian citizenship',
      ],
      applicationLink: 'https://ncert.nic.in/ntse',
      difficulty: 'High',
    },
    {
      id: 'jn-tata-endowment',
      title: 'J.N. Tata Endowment for Higher Education',
      provider: 'Tata Trusts',
      amount: 'Up to ₹10 lakhs',
      deadline: '2024-12-31',
      category: 'Higher Education',
      eligibility: 'Indian students for overseas studies',
      description: 'Loan scholarship for higher studies abroad',
      benefits: [
        'Interest-free loan',
        'Flexible repayment',
        'Global education opportunity',
        'Network access',
      ],
      requirements: [
        'Admission to recognized foreign university',
        'Strong academic record',
        'Clear interview process',
      ],
      applicationLink: 'https://jntataendowment.org',
      difficulty: 'Medium',
    },
  ];

  const categories = [
    { key: 'all', label: 'All Scholarships' },
    { key: 'Science', label: 'Science & Research' },
    { key: 'Technology', label: 'Technology' },
    { key: 'General', label: 'General Merit' },
    { key: 'Higher Education', label: 'Higher Education' },
  ];

  const subscribeToAlerts = (scholarshipId: string) => {
    if (!scholarshipId) return;
    
    // Save to localStorage
    const subscriptions = JSON.parse(
      localStorage.getItem('scholarship_alerts') || '[]'
    );
    if (!subscriptions.includes(scholarshipId)) {
      subscriptions.push(scholarshipId);
      localStorage.setItem('scholarship_alerts', JSON.stringify(subscriptions));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Science':
        return 'bg-blue-100 text-blue-800';
      case 'Technology':
        return 'bg-purple-100 text-purple-800';
      case 'General':
        return 'bg-green-100 text-green-800';
      case 'Higher Education':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return 0;
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">
          🏆 Scholarship & Opportunities
        </h1>
        <p className="text-xl text-student-text-secondary">
          Find funding for your educational journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Award className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">
            {scholarships.length}
          </div>
          <div className="text-student-text-secondary">
            Available Scholarships
          </div>
        </div>

        <div
          className="student-card text-center p-6 animate-student-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <DollarSign className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">₹50L+</div>
          <div className="text-student-text-secondary">Total Value</div>
        </div>

        <div
          className="student-card text-center p-6 animate-student-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Calendar className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">3</div>
          <div className="text-student-text-secondary">Closing Soon</div>
        </div>

        <div
          className="student-card text-center p-6 animate-student-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Bell className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">2</div>
          <div className="text-student-text-secondary">Subscribed Alerts</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setFilterCategory(category.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 student-hover-lift ${
                filterCategory === category.key
                  ? 'student-tab-active shadow-student-card'
                  : 'text-student-text-secondary hover:text-student-text hover:bg-student-background hover:shadow-student-card'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarships List */}
      <div className="space-y-6">
        {scholarships
          .filter(
            (scholarship) =>
              filterCategory === 'all' ||
              scholarship.category === filterCategory
          )
          .map((scholarship, index) => {
            const daysLeft = getDaysUntilDeadline(scholarship.deadline);

            return (
              <div
                key={scholarship.id}
                className={`student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer ${
                  daysLeft <= 30 ? 'border-2 border-red-300 bg-red-50/50' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedScholarship(scholarship)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-student-text">
                        {scholarship.title}
                      </h3>
                      {daysLeft <= 30 && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-student-text-secondary mb-2">
                      {scholarship.provider}
                    </p>
                    <p className="text-student-text-secondary">
                      {scholarship.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-student-text-secondary">
                      Amount:
                    </span>
                    <p className="font-bold text-student-accent">
                      {scholarship.amount}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-student-text-secondary">
                      Deadline:
                    </span>
                    <p className="font-bold text-student-text">
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-red-600">{daysLeft} days left</p>
                  </div>
                  <div>
                    <span className="text-sm text-student-text-secondary">
                      Category:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                        scholarship.category
                      )}`}
                    >
                      {scholarship.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-student-text-secondary">
                      Difficulty:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                        scholarship.difficulty
                      )}`}
                    >
                      {scholarship.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    className="flex-1 btn-student-primary student-click-bounce"
                    icon={ExternalLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(scholarship.applicationLink, '_blank');
                    }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    icon={Bell}
                    onClick={(e) => {
                      e.stopPropagation();
                      subscribeToAlerts(scholarship.id);
                    }}
                    className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                  >
                    Set Alert
                  </Button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Scholarship Detail Modal */}
      <Modal
        isOpen={!!selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        title={selectedScholarship?.title}
        size="xl"
      >
        {selectedScholarship && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-student-primary to-student-accent flex items-center justify-center shadow-student-hover">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-student-text mb-2">
                {selectedScholarship.title}
              </h2>
              <p className="text-student-text-secondary">
                {selectedScholarship.provider}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-student-text mb-3">
                  💰 Financial Benefits
                </h4>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-student-accent">
                    {selectedScholarship.amount}
                  </p>
                  <ul className="space-y-1">
                    {selectedScholarship.benefits.map(
                      (benefit: string, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-student-primary rounded-full mr-2"></div>
                          <span className="text-student-text">{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-student-text mb-3">
                  📋 Requirements
                </h4>
                <ul className="space-y-2">
                  {selectedScholarship.requirements.map(
                    (req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-student-secondary rounded-full mr-2 mt-2"></div>
                        <span className="text-student-text text-sm">{req}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-student-primary/10 p-4 rounded-lg border border-student-primary/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-student-primary">
                  Application Deadline
                </h4>
                <span className="text-student-primary font-bold">
                  {getDaysUntilDeadline(selectedScholarship.deadline)} days left
                </span>
              </div>
              <p className="text-student-primary">
                {new Date(selectedScholarship.deadline).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                icon={ExternalLink}
                onClick={() =>
                  window.open(selectedScholarship.applicationLink, '_blank')
                }
                className="btn-student-primary student-click-bounce"
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Bell}
                onClick={() => subscribeToAlerts(selectedScholarship.id)}
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                Set Reminder
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
