import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useAuth } from '../../hooks/useAuth';
import { ContentService } from '../../services/ContentService';
import { FlaskConical, Play, Eye, Atom, Zap, Microscope, Beaker, Dna } from 'lucide-react';

export const Labs: React.FC = () => {
  const { user } = useAuth();
  const { classInfo } = useCurrentClass();
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);
  const [showARSimulation, setShowARSimulation] = useState(false);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadLabContent = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Load science content which includes lab experiments
        const scienceContent = await ContentService.getContentForCurrentUser(user.id, 'science');
        
        // Transform quests into lab experiments
        const labExperiments = scienceContent.quests.map((quest: any) => ({
          id: quest.id,
          title: quest.title,
          subject: 'Science',
          difficulty: quest.difficulty || 'Medium',
          duration: quest.estimatedTime || '30 min',
          description: quest.description,
          icon: Beaker,
          color: 'from-green-500 to-teal-600',
          equipment: ['Virtual Lab Setup', 'Digital Sensors', 'Data Logger'],
          objectives: [
            'Understand scientific concepts',
            'Practice experimental methods',
            'Analyze data and results'
          ]
        }));
        
        setExperiments(labExperiments);
      } catch (error) {
        console.error('Error loading lab content:', error);
        setExperiments([]);
      } finally {
        setLoading(false);
      }
    };

    loadLabContent();
    
    // Listen for class changes
    const handleClassChange = () => {
      ContentService.clearCache();
      loadLabContent();
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-student-text-secondary">Loading lab experiments...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const startARExperiment = (experiment: any) => {
    if (!experiment) return;
    
    setSelectedExperiment(experiment);
    setShowARSimulation(true);
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🧪 Virtual Labs</h1>
        <p className="text-xl text-student-text-secondary">
          Hands-on experiments in a safe, virtual environment for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <FlaskConical className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{experiments.length}</div>
          <div className="text-student-text-secondary">Available Labs</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <Atom className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">3</div>
          <div className="text-student-text-secondary">Subjects</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Zap className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">AR/VR</div>
          <div className="text-student-text-secondary">Technology</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <Eye className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">Safe</div>
          <div className="text-student-text-secondary">Environment</div>
        </div>
      </div>

      {/* Experiment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => {
          const IconComponent = experiment.icon;
          
          return (
            <div key={experiment.id} className="student-card p-6 group hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${experiment.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-student-card`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-student-text mb-2">{experiment.title}</h3>
                <p className="text-student-text-secondary text-sm mb-3">{experiment.description}</p>
                
                <div className="flex justify-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(experiment.difficulty)}`}>
                    {experiment.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-student-primary text-white rounded-full text-xs font-bold">
                    {experiment.subject}
                  </span>
                </div>
                
                <div className="text-sm text-student-text-secondary mb-4">
                  ⏱️ {experiment.duration}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full btn-student-primary student-click-bounce" 
                  icon={Play}
                  onClick={() => startARExperiment(experiment)}
                >
                  Begin Experiment
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                  size="sm" 
                  onClick={() => setSelectedExperiment(experiment)}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Experiment Details Modal */}
      <Modal 
        isOpen={!!selectedExperiment && !showARSimulation} 
        onClose={() => setSelectedExperiment(null)} 
        title={selectedExperiment?.title}
        size="lg"
      >
        {selectedExperiment && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedExperiment.color} flex items-center justify-center shadow-student-card student-achievement-glow`}>
                <selectedExperiment.icon className="w-10 h-10 text-white" />
              </div>
              <p className="text-student-text-secondary text-lg">{selectedExperiment.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-student-text mb-2">Subject</h4>
                <p className="text-student-text-secondary">{selectedExperiment.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold text-student-text mb-2">Duration</h4>
                <p className="text-student-text-secondary">{selectedExperiment.duration}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">🔬 Virtual Equipment</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedExperiment.equipment.map((item: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-student-background-secondary rounded-lg shadow-student-card">
                    <FlaskConical className="w-4 h-4 text-student-primary mr-2" />
                    <span className="text-student-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">🎯 Learning Objectives</h4>
              <div className="space-y-2">
                {selectedExperiment.objectives.map((objective: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-student-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-student-text-secondary">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                size="lg"
                className="btn-student-primary student-click-bounce"
                icon={Play}
                onClick={() => startARExperiment(selectedExperiment)}
              >
                Start AR Experiment
              </Button>
              <Button variant="outline" size="lg" className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary">
                Save for Later
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* AR Simulation Modal */}
      <Modal 
        isOpen={showARSimulation} 
        onClose={() => {
          setShowARSimulation(false);
          setSelectedExperiment(null);
        }} 
        title={`AR Lab: ${selectedExperiment?.title}`}
        size="xl"
      >
        {selectedExperiment && (
          <div className="space-y-6">
            {/* AR Simulation Area */}
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-lg overflow-hidden">
              {/* Simulated AR Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              
              {/* Mock AR Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${selectedExperiment.color} flex items-center justify-center animate-pulse shadow-student-glow`}>
                    <selectedExperiment.icon className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">AR Simulation Active</h3>
                  <p className="text-blue-200 mb-4">Interactive {selectedExperiment.subject} experiment in progress</p>
                  <div className="flex justify-center space-x-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Mock Interactive Elements */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                🥽 AR Mode Active
              </div>
              
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                ⏱️ 00:05:23
              </div>
              
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                📊 Data Recording...
              </div>
            </div>

            {/* AR Controls */}
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center">
                🔄 Reset Experiment
              </Button>
              <Button className="flex items-center justify-center btn-student-secondary">
                📸 Capture Data
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                📝 Take Notes
              </Button>
            </div>

            {/* Simulation Info */}
            <div className="bg-student-primary/10 p-4 rounded-lg shadow-student-card">
              <h4 className="font-semibold text-student-primary mb-2">🚀 AR Simulation Demo</h4>
              <p className="text-student-primary text-sm">
                This is a prototype demonstration of our AR learning environment. 
                In the full version, students would interact with 3D objects, manipulate variables, 
                and see real-time physics simulations overlaid on their physical environment.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button size="lg" className="btn-student-accent student-click-bounce">
                ✓ Complete Experiment
              </Button>
              <Button 
                variant="outline"
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
                size="lg"
                onClick={() => {
                  setShowARSimulation(false);
                  setSelectedExperiment(null);
                }}
              >
                Exit AR Mode
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};