import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useToast } from '../ToastContainer';
import { GraduationCap, BookOpen, Video, Users, Award, Clock, CheckCircle, Play } from 'lucide-react';

export const ProfessionalDevelopment: React.FC = () => {
  const { state, updateTeacherProgress } = useGlobalState();
  const { showToast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const teacher = state.users['teacher-001'];
  const teacherProgress = teacher?.professionalDevelopment || {
    completedModules: 0,
    totalModules: 12,
    currentCourse: 'Getting Started'
  };

  const courses = [
    {
      id: 'advanced-teaching',
      title: 'Advanced Teaching Techniques',
      description: 'Master modern pedagogical approaches and classroom management strategies',
      duration: '6 weeks',
      modules: 8,
      difficulty: 'Advanced',
      category: 'Pedagogy',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      enrolled: 1247,
      progress: teacherProgress.currentCourse === 'Advanced Teaching Techniques' ? 75 : 0,
      status: teacherProgress.currentCourse === 'Advanced Teaching Techniques' ? 'in-progress' : 'available'
    },
    {
      id: 'ar-vr-education',
      title: 'AR/VR in Education',
      description: 'Learn to integrate augmented and virtual reality technologies in your classroom',
      duration: '4 weeks',
      modules: 6,
      difficulty: 'Intermediate',
      category: 'Technology',
      instructor: 'Prof. Michael Rodriguez',
      rating: 4.9,
      enrolled: 892,
      progress: 0,
      status: 'available'
    },
    {
      id: 'gamification',
      title: 'Gamification Strategies',
      description: 'Transform learning through game-based educational approaches',
      duration: '3 weeks',
      modules: 5,
      difficulty: 'Beginner',
      category: 'Innovation',
      instructor: 'Dr. Lisa Park',
      rating: 4.7,
      enrolled: 1456,
      progress: 100,
      status: 'completed'
    },
    {
      id: 'data-driven-teaching',
      title: 'Data-Driven Teaching',
      description: 'Use analytics and data to improve student outcomes and teaching effectiveness',
      duration: '5 weeks',
      modules: 7,
      difficulty: 'Intermediate',
      category: 'Analytics',
      instructor: 'Dr. James Wilson',
      rating: 4.6,
      enrolled: 734,
      progress: 0,
      status: 'available'
    },
    {
      id: 'inclusive-education',
      title: 'Inclusive Education Practices',
      description: 'Create accessible and inclusive learning environments for all students',
      duration: '4 weeks',
      modules: 6,
      difficulty: 'Intermediate',
      category: 'Inclusion',
      instructor: 'Dr. Maria Garcia',
      rating: 4.9,
      enrolled: 1123,
      progress: 0,
      status: 'available'
    },
    {
      id: 'multilingual-teaching',
      title: 'Multilingual Classroom Management',
      description: 'Effective strategies for teaching in diverse linguistic environments',
      duration: '3 weeks',
      modules: 4,
      difficulty: 'Beginner',
      category: 'Language',
      instructor: 'Prof. Raj Patel',
      rating: 4.8,
      enrolled: 567,
      progress: 0,
      status: 'available'
    }
  ];

  const achievements = [
    {
      id: 'first-course',
      title: 'Learning Pioneer',
      description: 'Completed your first professional development course',
      icon: GraduationCap,
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 'tech-innovator',
      title: 'Tech Innovator',
      description: 'Completed 3 technology-focused courses',
      icon: Award,
      earned: false
    },
    {
      id: 'master-educator',
      title: 'Master Educator',
      description: 'Completed 10 professional development courses',
      icon: BookOpen,
      earned: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCompleteModule = (courseId: string) => {
    updateTeacherProgress('teacher-001', courseId);
    
    showToast({
      type: 'success',
      title: 'Module Completed!',
      message: 'You have successfully completed a learning module',
      duration: 3000
    });
  };

  const completedCourses = courses.filter(course => course.status === 'completed').length;
  const inProgressCourses = courses.filter(course => course.status === 'in-progress').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Professional Development</h1>
        <p className="text-xl text-text-secondary">Enhance your teaching skills and stay current with educational trends</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="teacher-card text-center p-6 animate-teacher-slide-up">
          <GraduationCap className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{completedCourses}</div>
          <div className="text-text-secondary">Courses Completed</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
          <BookOpen className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{teacherProgress.completedModules}</div>
          <div className="text-text-secondary">Modules Completed</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
          <Clock className="w-8 h-8 mx-auto text-teacher-accent mb-2" />
          <div className="text-2xl font-bold text-text">{inProgressCourses}</div>
          <div className="text-text-secondary">In Progress</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.3s' }}>
          <Award className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{achievements.filter(a => a.earned).length}</div>
          <div className="text-text-secondary">Achievements</div>
        </div>
      </div>

      {/* Current Progress */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">Your Learning Journey</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text">Overall Progress</span>
            <span className="font-bold text-text">
              {Math.round((teacherProgress.completedModules / teacherProgress.totalModules) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-teal-600 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(teacherProgress.completedModules / teacherProgress.totalModules) * 100}%` }}
            ></div>
          </div>
          <p className="text-text-secondary">
            {teacherProgress.completedModules} of {teacherProgress.totalModules} modules completed
          </p>
        </div>
      </div>

      {/* Available Courses */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Available Courses</h2>
          <Button variant="outline" size="sm" className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Browse All Categories
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="teacher-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(course.status)}`}>
                  {course.status === 'in-progress' ? 'In Progress' : 
                   course.status === 'completed' ? 'Completed' : 'Available'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-text mb-2">{course.title}</h3>
              <p className="text-text-secondary text-sm mb-4">{course.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="text-text">{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Modules:</span>
                  <span className="text-text">{course.modules}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Instructor:</span>
                  <span className="text-text">{course.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Rating:</span>
                  <span className="text-text">⭐ {course.rating} ({course.enrolled} enrolled)</span>
                </div>
              </div>
              
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Progress</span>
                    <span className="text-text">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teacher-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                {course.status === 'completed' ? (
                  <Button variant="outline" className="flex-1" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                ) : course.status === 'in-progress' ? (
                  <Button className="flex-1 btn-teacher-primary" onClick={() => handleCompleteModule(course.id)}>
                    Continue Learning
                  </Button>
                ) : (
                  <Button 
                    className="flex-1 btn-teacher-primary" 
                    icon={Play}
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCourseModal(true);
                    }}
                  >
                    Start Course
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-teacher-primary hover:bg-teacher-primary hover:text-white" onClick={() => {
                  setSelectedCourse(course);
                  setShowCourseModal(true);
                }}>
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">Your Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div 
                key={achievement.id} 
                className={`p-6 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 shadow-teacher-card' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teacher-card' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className={`text-lg font-bold text-center mb-2 ${
                  achievement.earned ? 'text-text' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm text-center ${
                  achievement.earned ? 'text-text-secondary' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && achievement.earnedDate && (
                  <p className="text-xs text-center text-teacher-primary mt-2">
                    Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Detail Modal */}
      <Modal 
        isOpen={showCourseModal} 
        onClose={() => {
          setShowCourseModal(false);
          setSelectedCourse(null);
        }} 
        title={selectedCourse?.title}
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(selectedCourse.difficulty)}`}>
                  {selectedCourse.difficulty}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                  {selectedCourse.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">⭐ {selectedCourse.rating}</div>
                <div className="text-xs text-text-secondary">{selectedCourse.enrolled} enrolled</div>
              </div>
            </div>

            <p className="text-text-secondary">{selectedCourse.description}</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text mb-2">Course Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Duration:</strong> {selectedCourse.duration}</p>
                  <p><strong>Modules:</strong> {selectedCourse.modules}</p>
                  <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-text mb-2">What You'll Learn</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Modern teaching methodologies</li>
                  <li>• Student engagement strategies</li>
                  <li>• Assessment and feedback techniques</li>
                  <li>• Technology integration</li>
                </ul>
              </div>
            </div>

            {selectedCourse.progress > 0 && (
              <div>
                <h4 className="font-semibold text-text mb-2">Your Progress</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-teacher-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedCourse.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-text">{selectedCourse.progress}%</span>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              {selectedCourse.status === 'completed' ? (
                <Button size="lg" disabled>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Course Completed
                </Button>
              ) : selectedCourse.status === 'in-progress' ? (
                <Button size="lg" className="btn-teacher-primary" onClick={() => handleCompleteModule(selectedCourse.id)}>
                  Complete Next Module
                </Button>
              ) : (
                <Button size="lg" icon={Play} className="btn-teacher-primary">
                  Enroll in Course
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};