import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useCurrentClass } from '../../../hooks/useCurrentClass';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { ContentService } from '../../../services/ContentService';
import { Student, SkillNode } from '../../../types';
import { 
  Star, 
  Lock, 
  CheckCircle, 
  Target, 
  Zap,
  Crown,
  Shield,
  Sword,
  Book,
  Trophy,
  Compass,
  MapPin
} from 'lucide-react';

export const EnhancedSkillTree: React.FC = () => {
  const { userData } = useAuth();
  const { currentClass, classInfo } = useCurrentClass();
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [constellationTheme, setConstellationTheme] = useState('cosmic');

  const student = userData as Student | null;
  const studentId = student?.user?.id || 'student-001';
  const studentProgress = LocalStorageService.getStudentProgress(studentId);

  // Listen for class changes
  useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  useEffect(() => {
    const loadSkillTree = async () => {
      setLoading(true);
      try {
        // Generate skill tree based on completed quests and achievements
        const mathContent = await ContentService.getContent(currentClass, 'math');
        const scienceContent = await ContentService.getContent(currentClass, 'science');
        const englishContent = await ContentService.getContent(currentClass, 'english');
        
        const allQuests = [
          ...mathContent.quests || [],
          ...scienceContent.quests || [],
          ...englishContent.quests || []
        ];

        // Create skill nodes based on quest completion
        const nodes: SkillNode[] = [
          {
            id: 'foundation_explorer',
            title: 'Foundation Explorer',
            description: 'Master the basics of learning and exploration',
            status: studentProgress?.completedQuests.length > 0 ? 'mastered' : 'available',
            prerequisites: [],
            xpRequired: 0,
            position: { x: 50, y: 90 }
          },
          {
            id: 'knowledge_seeker',
            title: 'Knowledge Seeker',
            description: 'Develop curiosity and research skills',
            status: studentProgress?.completedQuests.length >= 2 ? 'mastered' : 
                    studentProgress?.completedQuests.length >= 1 ? 'available' : 'locked',
            prerequisites: ['foundation_explorer'],
            xpRequired: 200,
            position: { x: 30, y: 70 }
          },
          {
            id: 'problem_solver',
            title: 'Problem Solver',
            description: 'Excel at analytical thinking and problem-solving',
            status: studentProgress?.completedQuests.length >= 3 ? 'mastered' : 
                    studentProgress?.completedQuests.length >= 2 ? 'available' : 'locked',
            prerequisites: ['foundation_explorer'],
            xpRequired: 300,
            position: { x: 70, y: 70 }
          },
          {
            id: 'creative_thinker',
            title: 'Creative Thinker',
            description: 'Develop innovative and creative approaches',
            status: studentProgress?.achievements.length >= 2 ? 'mastered' : 
                    studentProgress?.achievements.length >= 1 ? 'available' : 'locked',
            prerequisites: ['knowledge_seeker'],
            xpRequired: 400,
            position: { x: 20, y: 50 }
          },
          {
            id: 'collaboration_master',
            title: 'Collaboration Master',
            description: 'Excel at teamwork and peer learning',
            status: studentProgress?.portfolioItems.length >= 1 ? 'mastered' : 
                    studentProgress?.completedQuests.length >= 3 ? 'available' : 'locked',
            prerequisites: ['problem_solver'],
            xpRequired: 500,
            position: { x: 80, y: 50 }
          },
          {
            id: 'wisdom_keeper',
            title: 'Wisdom Keeper',
            description: 'Achieve deep understanding and mastery',
            status: studentProgress?.level >= 10 ? 'mastered' : 
                    studentProgress?.level >= 5 ? 'available' : 'locked',
            prerequisites: ['creative_thinker', 'collaboration_master'],
            xpRequired: 800,
            position: { x: 50, y: 30 }
          },
          {
            id: 'legendary_scholar',
            title: 'Legendary Scholar',
            description: 'Reach the pinnacle of academic achievement',
            status: studentProgress?.level >= 20 ? 'mastered' : 
                    studentProgress?.level >= 15 ? 'available' : 'locked',
            prerequisites: ['wisdom_keeper'],
            xpRequired: 1500,
            position: { x: 50, y: 10 }
          }
        ];

        setSkillNodes(nodes);
      } catch (error) {
        console.error('Error loading skill tree:', error);
        setSkillNodes([]);
      } finally {
        setLoading(false);
      }
    };

    loadSkillTree();
  }, [currentClass, forceUpdate, studentProgress?.completedQuests.length, studentProgress?.achievements.length, studentProgress?.level]);

  const getSkillIcon = (skillId: string) => {
    switch (skillId) {
      case 'foundation_explorer': return Book;
      case 'knowledge_seeker': return Target;
      case 'problem_solver': return Zap;
      case 'creative_thinker': return Star;
      case 'collaboration_master': return Shield;
      case 'wisdom_keeper': return Crown;
      case 'legendary_scholar': return Trophy;
      default: return Star;
    }
  };

  const getSkillColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'from-yellow-400 to-yellow-600';
      case 'available': return 'from-student-primary to-student-secondary';
      case 'in-progress': return 'from-blue-500 to-blue-700';
      case 'locked': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleNodeClick = (node: SkillNode) => {
    if (node.status === 'locked') {
      return;
    }
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-student-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-student-primary mx-auto mb-4"></div>
          <p className="text-xl text-student-text-secondary">Loading skill constellation...</p>
        </div>
      </div>
    );
  }

  const masteredSkills = skillNodes.filter(node => node.status === 'mastered').length;
  const totalSkills = skillNodes.length;

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">
          ⭐ Skill Constellation
        </h1>
        <p className="text-xl text-student-text-secondary">
          Chart your path through the stars of knowledge for {classInfo?.displayName || 'Class 6'}
        </p>
      </div>

      {/* Progress Overview */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="student-card p-8 bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-student-text mb-4">Constellation Progress</h2>
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-student-accent">{masteredSkills}</div>
                <div className="text-student-text-secondary">Stars Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-student-primary">{totalSkills}</div>
                <div className="text-student-text-secondary">Total Stars</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-student-secondary">
                  {Math.round((masteredSkills / totalSkills) * 100)}%
                </div>
                <div className="text-student-text-secondary">Constellation Complete</div>
              </div>
            </div>
            
            <div className="w-64 mx-auto">
              <div className="student-progress-bar-enhanced h-4">
                <div 
                  className="student-progress-fill-enhanced h-4 transition-all duration-1000"
                  style={{ width: `${(masteredSkills / totalSkills) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Tree Map */}
      <div className="max-w-6xl mx-auto px-6">
        <div 
          className="relative w-full h-[600px] md:h-[700px] rounded-2xl shadow-student-hover overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)'
          }}
        >
          {/* Starfield Background */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          {/* Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {skillNodes.map((node) => {
              return node.prerequisites.map((prereqId) => {
                const prereqNode = skillNodes.find(n => n.id === prereqId);
                if (!prereqNode) return null;
                
                const isPathActive = prereqNode.status === 'mastered' && 
                  (node.status === 'available' || node.status === 'mastered');
                
                return (
                  <line
                    key={`${prereqId}-${node.id}`}
                    x1={prereqNode.position.x}
                    y1={prereqNode.position.y}
                    x2={node.position.x}
                    y2={node.position.y}
                    stroke={isPathActive ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.2)"}
                    strokeWidth={isPathActive ? "0.8" : "0.3"}
                    className={isPathActive ? "animate-pulse" : ""}
                  />
                );
              });
            })}
          </svg>

          {/* Skill Nodes */}
          {skillNodes.map((node, index) => {
            const IconComponent = getSkillIcon(node.id);
            
            return (
              <div
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                  node.status !== 'locked' ? 'hover:scale-110' : 'cursor-not-allowed'
                }`}
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
                onClick={() => handleNodeClick(node)}
              >
                {/* Node Glow Effect */}
                {node.status === 'mastered' && (
                  <div className="absolute inset-0 w-20 h-20 rounded-full animate-ping bg-yellow-400/30"></div>
                )}
                
                {/* Main Node */}
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-student-hover transition-all duration-300 ${
                  node.status === 'mastered' 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white student-achievement-glow' 
                    : node.status === 'available'
                    ? 'bg-gradient-to-br from-student-primary to-student-secondary text-white hover:shadow-student-glow'
                    : 'bg-gray-500 text-gray-300 opacity-50'
                }`}>
                  {node.status === 'mastered' ? (
                    <Trophy className="w-10 h-10" />
                  ) : (
                    <IconComponent className="w-10 h-10" />
                  )}
                </div>

                {/* Node Label */}
                <div className={`absolute top-24 left-1/2 transform -translate-x-1/2 text-center ${
                  node.status !== 'locked' ? 'opacity-100' : 'opacity-50'
                }`}>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-student-card border border-white/20">
                    <div className="text-sm font-bold text-gray-800 whitespace-nowrap">
                      {node.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {node.xpRequired > 0 ? `${node.xpRequired} XP Required` : 'Starting Point'}
                    </div>
                  </div>
                </div>

                {/* Lock Overlay for locked skills */}
                {node.status === 'locked' && (
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-gray-700/80 backdrop-blur-sm flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Constellation Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-student-card">
            <h4 className="font-bold text-gray-800 mb-2">Skill Types</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Foundation Skills</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Core Abilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Master Level</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-gray-700">Legendary</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-student-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {masteredSkills}/{totalSkills}
              </div>
              <div className="text-sm text-gray-600">Skills Mastered</div>
              <div className="mt-2 w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-student-primary to-student-accent transition-all duration-1000"
                  style={{ width: `${(masteredSkills / totalSkills) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Constellation Name */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-student-card">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-student-primary" />
                <h3 className="text-lg font-bold text-gray-800">
                  The Learning Constellation
                </h3>
              </div>
              <p className="text-sm text-gray-600">{classInfo?.displayName || 'Class 6'} Skills Map</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-student-background rounded-2xl shadow-student-hover max-w-lg w-full p-6 border border-student-primary/20">
            <div className="text-center mb-6">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-student-card ${
                selectedNode.status === 'mastered' 
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 student-achievement-glow' 
                  : selectedNode.status === 'available'
                  ? 'bg-gradient-to-br from-student-primary to-student-secondary'
                  : 'bg-gray-500'
              }`}>
                {selectedNode.status === 'mastered' ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  (() => {
                    const IconComponent = getSkillIcon(selectedNode.id);
                    return <IconComponent className="w-12 h-12 text-white" />;
                  })()
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-student-text mb-2">
                {selectedNode.status === 'mastered' ? '⭐ Skill Mastered!' : '🎯 Skill Details'}
              </h2>
              <h3 className="text-xl font-semibold text-student-primary mb-3">
                {selectedNode.title}
              </h3>
              <p className="text-student-text-secondary">
                {selectedNode.description}
              </p>
            </div>

            {/* Skill Requirements */}
            <div className="space-y-3 mb-6">
              {selectedNode.xpRequired > 0 && (
                <div className="flex justify-between items-center p-3 bg-student-background-secondary rounded-lg">
                  <span className="text-student-text-secondary">XP Required:</span>
                  <span className="font-bold text-student-accent">{selectedNode.xpRequired} XP</span>
                </div>
              )}
              
              {selectedNode.prerequisites.length > 0 && (
                <div className="p-3 bg-student-background-secondary rounded-lg">
                  <span className="text-student-text-secondary">Prerequisites:</span>
                  <div className="mt-2 space-y-1">
                    {selectedNode.prerequisites.map((prereqId) => {
                      const prereqNode = skillNodes.find(n => n.id === prereqId);
                      return (
                        <div key={prereqId} className="flex items-center space-x-2">
                          <CheckCircle className={`w-4 h-4 ${
                            prereqNode?.status === 'mastered' ? 'text-green-500' : 'text-gray-400'
                          }`} />
                          <span className="text-student-text text-sm">
                            {prereqNode?.title || prereqId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Status Display */}
            <div className="text-center mb-6">
              {selectedNode.status === 'mastered' && (
                <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full font-medium">
                  <Trophy className="w-5 h-5 mr-2" />
                  Skill Mastered!
                </div>
              )}
              
              {selectedNode.status === 'available' && (
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-medium">
                  <Target className="w-5 h-5 mr-2" />
                  Ready to Learn
                </div>
              )}
              
              {selectedNode.status === 'locked' && (
                <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-medium">
                  <Lock className="w-5 h-5 mr-2" />
                  Complete Prerequisites First
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 py-3 px-6 rounded-lg border border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-white transition-all duration-200"
              >
                Close
              </button>
              
              {selectedNode.status === 'available' && (
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    // Navigate to relevant quests or activities
                  }}
                  className="flex-1 py-3 px-6 rounded-lg font-medium btn-student-primary student-click-bounce transition-all duration-200"
                >
                  Work on Skill
                </button>
              )}
            </div>

            {/* Skill Lore */}
            <div className="mt-4 p-4 bg-student-primary/10 rounded-lg border border-student-primary/20">
              <p className="text-student-primary text-sm">
                <strong>Explorer's Note:</strong> Each skill in the constellation builds upon others. 
                Master the fundamentals to unlock advanced abilities and become a legendary scholar!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skill Stats */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="student-card text-center p-6">
            <MapPin className="w-8 h-8 mx-auto text-student-primary mb-2" />
            <div className="text-2xl font-bold text-student-text">{totalSkills}</div>
            <div className="text-student-text-secondary">Total Skills</div>
          </div>
          
          <div className="student-card text-center p-6">
            <Trophy className="w-8 h-8 mx-auto text-student-accent mb-2" />
            <div className="text-2xl font-bold text-student-text">{masteredSkills}</div>
            <div className="text-student-text-secondary">Mastered</div>
          </div>
          
          <div className="student-card text-center p-6">
            <Target className="w-8 h-8 mx-auto text-student-secondary mb-2" />
            <div className="text-2xl font-bold text-student-text">
              {skillNodes.filter(n => n.status === 'available').length}
            </div>
            <div className="text-student-text-secondary">Available</div>
          </div>
          
          <div className="student-card text-center p-6">
            <Star className="w-8 h-8 mx-auto text-student-primary mb-2" />
            <div className="text-2xl font-bold text-student-text">
              {studentProgress?.totalXP || 0}
            </div>
            <div className="text-student-text-secondary">Total XP</div>
          </div>
        </div>
      </div>

      {/* Guidance Section */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-student-text mb-4">🌟 Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-primary flex items-center justify-center shadow-student-card">
                  <Book className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-student-text mb-2">Foundation Building</h3>
                <p className="text-student-text-secondary text-sm">Start with basic skills and build a strong foundation</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-secondary flex items-center justify-center shadow-student-card">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-student-text mb-2">Skill Development</h3>
                <p className="text-student-text-secondary text-sm">Progress through connected skills to unlock new abilities</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-accent flex items-center justify-center shadow-student-card">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-student-text mb-2">Mastery Achievement</h3>
                <p className="text-student-text-secondary text-sm">Reach legendary status by mastering all constellation skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};