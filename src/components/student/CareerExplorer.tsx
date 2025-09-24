import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { Briefcase, TrendingUp, DollarSign, MapPin, Clock, Star } from 'lucide-react';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Technology': return 'text-blue-600 bg-blue-100';
    case 'Healthcare': return 'text-green-600 bg-green-100';
    case 'Environment': return 'text-emerald-600 bg-emerald-100';
    case 'Engineering': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const CareerExplorer: React.FC = () => {
  const { classInfo } = useCurrentClass();
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const careers = [
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      category: 'Technology',
      description: 'Analyze complex data to help organizations make informed decisions',
      averageSalary: '₹12-25 LPA',
      growthRate: 'Very High',
      education: 'Bachelor\'s in Computer Science, Statistics, or Mathematics',
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
      dayInLife: [
        'Collect and clean data from various sources',
        'Build predictive models using machine learning',
        'Create visualizations and reports',
        'Present findings to stakeholders'
      ],
      relatedSubjects: ['Mathematics', 'Computer Science', 'Statistics'],
      icon: '📊'
    },
    {
      id: 'biomedical-engineer',
      title: 'Biomedical Engineer',
      category: 'Healthcare',
      description: 'Design medical devices and equipment to improve healthcare',
      averageSalary: '₹8-18 LPA',
      growthRate: 'High',
      education: 'Bachelor\'s in Biomedical Engineering or related field',
      skills: ['Biology', 'Engineering Design', 'Medical Knowledge', 'Problem Solving'],
      companies: ['Medtronic', 'Johnson & Johnson', 'Siemens Healthcare'],
      dayInLife: [
        'Design and test medical devices',
        'Collaborate with doctors and researchers',
        'Ensure safety and regulatory compliance',
        'Improve existing medical technologies'
      ],
      relatedSubjects: ['Biology', 'Physics', 'Mathematics', 'Chemistry'],
      icon: '🏥'
    },
    {
      id: 'environmental-scientist',
      title: 'Environmental Scientist',
      category: 'Environment',
      description: 'Study the environment and develop solutions to environmental problems',
      averageSalary: '₹6-15 LPA',
      growthRate: 'High',
      education: 'Bachelor\'s in Environmental Science or related field',
      skills: ['Research', 'Data Analysis', 'Field Work', 'Report Writing'],
      companies: ['TERI', 'WWF India', 'Government Agencies'],
      dayInLife: [
        'Conduct field research and collect samples',
        'Analyze environmental data',
        'Develop conservation strategies',
        'Write reports and recommendations'
      ],
      relatedSubjects: ['Biology', 'Chemistry', 'Geography', 'Mathematics'],
      icon: '🌍'
    },
    {
      id: 'robotics-engineer',
      title: 'Robotics Engineer',
      category: 'Technology',
      description: 'Design and build robots for various applications',
      averageSalary: '₹10-22 LPA',
      growthRate: 'Very High',
      education: 'Bachelor\'s in Robotics, Mechanical, or Electrical Engineering',
      skills: ['Programming', 'Mechanical Design', 'Electronics', 'AI'],
      companies: ['Tesla', 'Boston Dynamics', 'ISRO', 'Tata Motors'],
      dayInLife: [
        'Design robot systems and components',
        'Program robot behaviors',
        'Test and debug robotic systems',
        'Collaborate with multidisciplinary teams'
      ],
      relatedSubjects: ['Physics', 'Mathematics', 'Computer Science'],
      icon: '🤖'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Careers' },
    { key: 'Technology', label: 'Technology' },
    { key: 'Healthcare', label: 'Healthcare' },
    { key: 'Environment', label: 'Environment' },
    { key: 'Engineering', label: 'Engineering' }
  ];

  const filteredCareers = selectedCategory === 'all' 
    ? careers 
    : careers.filter(career => career.category === selectedCategory);

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'Very High': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">💼 STEM Career Explorer</h1>
        <p className="text-xl text-student-text-secondary">
          Discover exciting career paths in science, technology, engineering, and mathematics for {classInfo?.displayName || 'Class 6'} level
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="student-tab-container p-1 flex space-x-1 shadow-student-card">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 student-hover-lift ${
                selectedCategory === category.key
                  ? 'student-tab-active shadow-student-card'
                  : 'text-student-text-secondary hover:text-student-text hover:bg-student-background hover:shadow-student-card'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCareers.map((career, index) => (
          <div 
            key={career.id} 
            className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedCareer(career)}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{career.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-student-text">{career.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(career.category)}`}>
                  {career.category}
                </span>
              </div>
            </div>

            <p className="text-student-text-secondary mb-4">{career.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-student-text-secondary">Average Salary:</span>
                <span className="font-bold text-student-accent">{career.averageSalary}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-student-text-secondary">Growth Rate:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getGrowthColor(career.growthRate)}`}>
                  {career.growthRate}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-student-text mb-2">Key Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {career.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                    {skill}
                  </span>
                ))}
                {career.skills.length > 3 && (
                  <span className="px-2 py-1 bg-student-background-secondary text-student-text rounded-full text-xs">
                    +{career.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <Button 
              className="w-full btn-student-primary student-click-bounce"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCareer(career);
              }}
            >
              Explore Career
            </Button>
          </div>
        ))}
      </div>

      {/* Career Detail Modal */}
      <Modal 
        isOpen={!!selectedCareer} 
        onClose={() => setSelectedCareer(null)} 
        title={selectedCareer?.title}
        size="xl"
      >
        {selectedCareer && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedCareer.icon}</div>
              <h2 className="text-3xl font-bold text-student-text mb-2">{selectedCareer.title}</h2>
              <p className="text-xl text-student-text-secondary">{selectedCareer.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-student-text mb-2">💰 Salary Range</h4>
                  <p className="text-2xl font-bold text-student-accent">{selectedCareer.averageSalary}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-student-text mb-2">📈 Growth Outlook</h4>
                  <span className={`px-3 py-1 rounded-full font-bold ${getGrowthColor(selectedCareer.growthRate)}`}>
                    {selectedCareer.growthRate}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-student-text mb-2">🎓 Education Required</h4>
                  <p className="text-student-text-secondary">{selectedCareer.education}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-student-text mb-2">🛠️ Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-student-primary text-white rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-student-text mb-2">🏢 Top Companies</h4>
                  <div className="space-y-1">
                    {selectedCareer.companies.map((company: string) => (
                      <div key={company} className="flex items-center">
                        <div className="w-2 h-2 bg-student-accent rounded-full mr-2"></div>
                        <span className="text-student-text">{company}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">📅 A Day in the Life</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCareer.dayInLife.map((activity: string, index: number) => (
                  <div key={index} className="flex items-start p-3 bg-student-background-secondary rounded-lg">
                    <Clock className="w-4 h-4 text-student-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-student-text text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">📚 Related Subjects to Focus On</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCareer.relatedSubjects.map((subject: string) => (
                  <span key={subject} className="px-4 py-2 bg-student-secondary text-white rounded-lg font-medium">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button size="lg" className="btn-student-primary student-click-bounce">
                Add to My Career Goals
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                Find Learning Path
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};