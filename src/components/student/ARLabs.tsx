import React, { useState, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { ContentService } from '../../services/ContentService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { Camera, Play, Eye, Atom, Microscope, Beaker, Zap, CheckCircle } from 'lucide-react';

export const ARLabs: React.FC = () => {
  const { user } = useAuth();
  const { classInfo } = useCurrentClass();
  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [showARModal, setShowARModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [labCompleted, setLabCompleted] = useState(false);
  const [arLabs, setArLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const studentId = user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  React.useEffect(() => {
    const loadARLabs = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load science content for AR labs
        const scienceContent = await ContentService.getContentForCurrentUser(user.id, 'science');
        
        // Transform science quests into AR lab experiences
        const labs = scienceContent.quests.map((quest: any) => ({
          id: quest.id,
          title: `AR ${quest.title}`,
          description: quest.description,
          subject: 'Science',
          difficulty: quest.difficulty || 'Easy',
          duration: quest.estimatedTime || '20 min',
          icon: Atom,
          color: 'from-blue-500 to-purple-600',
          equipment: ['AR Markers', '3D Models', 'Interactive Simulator'],
          objectives: [
            'Explore concepts in 3D space',
            'Interact with virtual objects',
            'Complete hands-on experiments'
          ]
        }));
        
        setArLabs(labs);
      } catch (error) {
        console.error('Error loading AR labs:', error);
        setArLabs([]);
      } finally {
        setLoading(false);
      }
    };

    loadARLabs();
    
    // Listen for class changes
    const handleClassChange = () => {
      ContentService.clearCache();
      loadARLabs();
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading AR labs...</p>
        </div>
      </div>
    );
  }

  const startARLab = async (lab: any) => {
    setSelectedLab(lab);
    setShowARModal(true);
    setLabCompleted(false);
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      // Fallback to demo mode
      setCameraActive(false);
    }
  };

  const completeLab = () => {
    if (!selectedLab || !user?.id) return;

    const progress = LocalStorageService.getStudentProgress(studentId);
    if (progress && !progress.arLabsCompleted.includes(selectedLab.id)) {
      progress.arLabsCompleted.push(selectedLab.id);
      progress.totalXP += 100; // XP for completing AR lab
      LocalStorageService.saveStudentProgress(progress);

      // Award AR achievement
      if (progress.arLabsCompleted.length === 1) {
        LocalStorageService.awardAchievement(studentId, {
          id: 'ar_pioneer',
          title: 'AR Pioneer',
          description: 'Completed your first AR lab experiment!',
          icon: 'atom'
        });
      }
    }

    setLabCompleted(true);
  };

  const closeARModal = () => {
    setShowARModal(false);
    setSelectedLab(null);
    setCameraActive(false);
    
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const isLabCompleted = (labId: string) => {
    return studentProgress?.arLabsCompleted.includes(labId) || false;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🥽 AR Learning Labs</h1>
        <p className="text-xl text-student-text-secondary">
          Experience science through augmented reality for {classInfo?.displayName || 'Class 6'}!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <Camera className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{arLabs.length}</div>
          <div className="text-student-text-secondary">Available Labs</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">
            {studentProgress?.arLabsCompleted.length || 0}
          </div>
          <div className="text-student-text-secondary">Completed</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Atom className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">4</div>
          <div className="text-student-text-secondary">Subjects</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Eye className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">3D</div>
          <div className="text-student-text-secondary">Immersive</div>
        </div>
      </div>

      {/* AR Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {arLabs.map((lab, index) => {
          const IconComponent = lab.icon;
          const completed = isLabCompleted(lab.id);
          
          return (
            <div 
              key={lab.id} 
              className={`student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift ${
                completed ? 'border-2 border-student-accent bg-gradient-to-br from-student-accent/5 to-student-secondary/5' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(lab.difficulty)}`}>
                  {lab.difficulty}
                </span>
                {completed && (
                  <div className="flex items-center space-x-1 text-student-accent">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-bold">Completed</span>
                  </div>
                )}
              </div>

              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${lab.color} flex items-center justify-center shadow-student-card hover:shadow-student-hover transition-all duration-200 hover:scale-110`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-student-text mb-3 text-center">{lab.title}</h3>
              <p className="text-student-text-secondary text-center mb-4">{lab.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-student-text-secondary">Subject:</span>
                  <span className="text-student-text font-medium">{lab.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-student-text-secondary">Duration:</span>
                  <span className="text-student-text">{lab.duration}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className={`w-full ${completed ? 'btn-student-accent' : 'btn-student-primary'} student-click-bounce`}
                  icon={completed ? CheckCircle : Play}
                  onClick={() => startARLab(lab)}
                >
                  {completed ? 'View Again' : 'Start AR Lab'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                  size="sm" 
                  onClick={() => setSelectedLab(lab)}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AR Lab Modal */}
      <Modal 
        isOpen={showARModal} 
        onClose={closeARModal} 
        title={`AR Lab: ${selectedLab?.title}`}
        size="xl"
      >
        {selectedLab && (
          <div className="space-y-6">
            {/* AR Camera View */}
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-lg overflow-hidden">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">AR Demo Mode</h3>
                    <p className="text-blue-200 mb-4">Camera access not available - showing simulation</p>
                  </div>
                </div>
              )}
              
              {/* AR Overlay Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Mock AR Elements */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  🎯 Point camera at marker
                </div>
                
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  📱 AR Active
                </div>
                
                {/* Simulated 3D Object */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${selectedLab.color} flex items-center justify-center animate-pulse shadow-student-glow`}>
                    <selectedLab.icon className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  📊 Collecting data...
                </div>
              </div>
            </div>

            {/* AR Controls */}
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary"
              >
                🔄 Reset View
              </Button>
              <Button 
                className="flex items-center justify-center btn-student-secondary"
                onClick={completeLab}
                disabled={labCompleted}
              >
                {labCompleted ? '✓ Completed' : '📸 Capture Data'}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center border-student-accent text-student-accent hover:bg-student-accent hover:text-student-on-primary"
              >
                📝 Take Notes
              </Button>
            </div>

            {/* Lab Information */}
            <div className="student-card p-4 bg-student-primary/10 border border-student-primary/20">
              <h4 className="font-semibold text-student-primary mb-3">🎯 Learning Objectives</h4>
              <ul className="space-y-2">
                {selectedLab.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-student-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-student-text">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment List */}
            <div className="student-card p-4 bg-student-secondary/10 border border-student-secondary/20">
              <h4 className="font-semibold text-student-secondary mb-3">🔬 Virtual Equipment</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedLab.equipment.map((item: string, index: number) => (
                  <div key={index} className="flex items-center p-2 bg-student-background-secondary rounded-lg">
                    <Beaker className="w-4 h-4 text-student-secondary mr-2" />
                    <span className="text-student-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {labCompleted && (
              <div className="student-card p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Lab Completed!</h3>
                  <p className="text-green-700 mb-4">
                    Great work exploring {selectedLab.title}! You've earned 100 XP.
                  </p>
                  <Button 
                    onClick={closeARModal}
                    className="btn-student-accent student-click-bounce"
                  >
                    Continue Learning
                  </Button>
                </div>
              </div>
            )}

            {/* Demo Note */}
            <div className="bg-student-primary/10 p-4 rounded-lg border border-student-primary/20">
              <p className="text-student-primary text-sm">
                🚀 <strong>AR Technology Demo:</strong> This simulates our AR learning environment. 
                In the full version, students would see 3D models overlaid on real-world markers, 
                interact with virtual objects, and conduct immersive experiments.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};