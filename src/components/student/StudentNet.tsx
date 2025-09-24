import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ToastContainer';
import { Wifi, WifiOff, Share, Download, Upload, FolderSync as Sync, Users, Video, FileText, Image } from 'lucide-react';

interface SharedContent {
  id: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'quiz';
  size: string;
  sharedBy: string;
  sharedAt: string;
  description: string;
  url?: string;
}

interface SyncQueueItem {
  id: string;
  type: 'quest_progress' | 'achievement' | 'content_share';
  studentId: string;
  data: any;
  timestamp: string;
  synced: boolean;
}

export const StudentNet: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [myContent, setMyContent] = useState<SharedContent[]>([]);
  const [sharedContent, setSharedContent] = useState<SharedContent[]>([]);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SharedContent | null>(null);
  const [nearbyPeers, setNearbyPeers] = useState<any[]>([]);

  const studentId = user?.id || 'student-001';

  // Initialize demo content based on student
  useEffect(() => {
    loadStudentContent();
    loadSyncQueue();
    loadNearbyPeers();
  }, [studentId]);

  const loadStudentContent = () => {
    const contentKey = `studentnet_content_${studentId}`;
    const stored = localStorage.getItem(contentKey);
    
    if (stored) {
      setMyContent(JSON.parse(stored));
    } else {
      // Initialize with demo content for Student A
      if (studentId === 'student-001') {
        const initialContent: SharedContent[] = [
          {
            id: 'video_math_fractions',
            title: 'Fractions Made Easy',
            type: 'video',
            size: '15.2 MB',
            sharedBy: 'Aria Patel',
            sharedAt: new Date().toISOString(),
            description: 'A helpful video explaining fraction concepts with visual examples',
            url: 'https://example.com/fractions-video'
          },
          {
            id: 'doc_science_notes',
            title: 'Science Chapter 3 Notes',
            type: 'document',
            size: '2.1 MB',
            sharedBy: 'Aria Patel',
            sharedAt: new Date().toISOString(),
            description: 'Comprehensive notes on Matter and Energy'
          }
        ];
        setMyContent(initialContent);
        localStorage.setItem(contentKey, JSON.stringify(initialContent));
      }
    }

    // Load shared content from other students
    const sharedKey = `studentnet_shared_${studentId}`;
    const sharedStored = localStorage.getItem(sharedKey);
    if (sharedStored) {
      setSharedContent(JSON.parse(sharedStored));
    }
  };

  const loadSyncQueue = () => {
    const queueKey = `studentnet_sync_queue_${studentId}`;
    const stored = localStorage.getItem(queueKey);
    if (stored) {
      setSyncQueue(JSON.parse(stored));
    }
  };

  const loadNearbyPeers = () => {
    // Mock nearby peers for demo
    const peers = [
      {
        id: 'student-002',
        name: 'Rahul Sharma',
        distance: '12m',
        status: 'online',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        id: 'student-003',
        name: 'Priya Singh',
        distance: '8m',
        status: 'online',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ];
    setNearbyPeers(peers);
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      showToast({
        type: 'success',
        title: 'Connected to StudentNet',
        message: 'You can now share content with nearby students',
        duration: 3000
      });
    } else {
      showToast({
        type: 'info',
        title: 'Disconnected from StudentNet',
        message: 'Content sharing is now disabled',
        duration: 3000
      });
    }
  };

  const shareContent = (content: SharedContent, targetStudentId: string) => {
    if (!isConnected) {
      showToast({
        type: 'error',
        title: 'Not Connected',
        message: 'Connect to StudentNet first to share content',
        duration: 3000
      });
      return;
    }

    // Add to target student's shared content
    const targetSharedKey = `studentnet_shared_${targetStudentId}`;
    const targetShared = JSON.parse(localStorage.getItem(targetSharedKey) || '[]');
    
    const sharedItem = {
      ...content,
      id: `shared_${content.id}_${Date.now()}`,
      sharedBy: user?.name || 'Student A',
      sharedAt: new Date().toISOString()
    };
    
    targetShared.push(sharedItem);
    localStorage.setItem(targetSharedKey, JSON.stringify(targetShared));

    showToast({
      type: 'success',
      title: 'Content Shared!',
      message: `"${content.title}" has been shared with ${nearbyPeers.find(p => p.id === targetStudentId)?.name}`,
      duration: 3000
    });

    setShowShareModal(false);
    setSelectedContent(null);
  };

  const addToSyncQueue = (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'synced'>) => {
    const newItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}`,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const updatedQueue = [...syncQueue, newItem];
    setSyncQueue(updatedQueue);
    
    const queueKey = `studentnet_sync_queue_${studentId}`;
    localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
  };

  const simulateOfflineQuestCompletion = () => {
    // Simulate Student B completing a quest while offline
    if (studentId === 'student-002') {
      addToSyncQueue({
        type: 'quest_progress',
        studentId: 'student-002',
        data: {
          questId: 'algebra_challenge',
          completed: true,
          score: 85,
          completedAt: new Date().toISOString()
        }
      });

      showToast({
        type: 'info',
        title: 'Quest Completed Offline',
        message: 'Progress saved to sync queue. Will sync when online.',
        duration: 3000
      });
    }
  };

  const syncAllData = () => {
    if (!isOnline) {
      showToast({
        type: 'error',
        title: 'No Internet Connection',
        message: 'Connect to internet first to sync data',
        duration: 3000
      });
      return;
    }

    // Mark all items as synced
    const updatedQueue = syncQueue.map(item => ({ ...item, synced: true }));
    setSyncQueue(updatedQueue);
    
    const queueKey = `studentnet_sync_queue_${studentId}`;
    localStorage.setItem(queueKey, JSON.stringify(updatedQueue));

    // Simulate syncing to teacher dashboard
    const teacherSyncKey = 'teacher_sync_data';
    const teacherData = JSON.parse(localStorage.getItem(teacherSyncKey) || '[]');
    
    syncQueue.forEach(item => {
      if (item.type === 'quest_progress') {
        teacherData.push({
          studentId: item.studentId,
          questId: item.data.questId,
          completed: item.data.completed,
          score: item.data.score,
          syncedAt: new Date().toISOString()
        });
      }
    });
    
    localStorage.setItem(teacherSyncKey, JSON.stringify(teacherData));

    showToast({
      type: 'success',
      title: 'Sync Complete!',
      message: `${syncQueue.filter(item => !item.synced).length} items synced to server`,
      duration: 3000
    });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'image': return Image;
      default: return FileText;
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-600 bg-red-100';
      case 'document': return 'text-blue-600 bg-blue-100';
      case 'image': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">📡 StudentNet Hub</h1>
        <p className="text-xl text-student-text-secondary">
          Peer-to-peer content sharing and offline sync demonstration
        </p>
      </div>

      {/* Connection Status */}
      <div className={`student-card p-6 animate-student-slide-up ${
        isConnected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              {isConnected ? <Wifi className="w-6 h-6 text-white" /> : <WifiOff className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isConnected ? 'text-green-800' : 'text-gray-800'}`}>
                {isConnected ? 'Connected to StudentNet' : 'Not Connected'}
              </h2>
              <p className={isConnected ? 'text-green-700' : 'text-gray-700'}>
                {isConnected ? `${nearbyPeers.length} peers nearby` : 'Enable to discover nearby students'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={toggleConnection}
              className={isConnected ? 'bg-red-500 hover:bg-red-600' : 'btn-student-primary'}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
            
            <Button
              onClick={() => setIsOnline(!isOnline)}
              variant="outline"
              className={`${isOnline ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="student-card p-6 bg-blue-50 border border-blue-200 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xl font-bold text-blue-800 mb-4">🎯 Demo Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Content Relay Demo:</h4>
            <ol className="text-blue-600 text-sm space-y-1">
              <li>1. Login as Student A (student/pass123)</li>
              <li>2. Share content with Student B</li>
              <li>3. Logout and login as Student B (student2/pass123)</li>
              <li>4. See shared content in your list</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Store-and-Forward Demo:</h4>
            <ol className="text-blue-600 text-sm space-y-1">
              <li>1. As Student B, complete quest offline</li>
              <li>2. Login as Student A, sync data</li>
              <li>3. Login as Teacher to see synced progress</li>
            </ol>
          </div>
        </div>
      </div>

      {isConnected && (
        <>
          {/* Nearby Peers */}
          <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-student-text mb-6">👥 Nearby Students</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyPeers.map((peer) => (
                <div key={peer.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={peer.avatar} 
                        alt={peer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-student-text">{peer.name}</h3>
                        <p className="text-student-text-secondary text-sm">{peer.distance} away</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      peer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Sharable Content */}
          <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-student-text">📂 My Sharable Content</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="border-student-primary text-student-primary hover:bg-student-primary hover:text-student-on-primary"
              >
                Add Content
              </Button>
            </div>
            
            <div className="space-y-4">
              {myContent.map((content) => {
                const IconComponent = getContentIcon(content.type);
                
                return (
                  <div key={content.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getContentColor(content.type)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-student-text">{content.title}</h3>
                          <p className="text-student-text-secondary text-sm">
                            {content.type.toUpperCase()} • {content.size}
                          </p>
                          <p className="text-student-text-secondary text-xs">{content.description}</p>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        icon={Share}
                        onClick={() => {
                          setSelectedContent(content);
                          setShowShareModal(true);
                        }}
                        className="btn-student-primary"
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shared Content from Peers */}
          <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-student-text mb-6">📥 Content Shared with Me</h2>
            
            {sharedContent.length > 0 ? (
              <div className="space-y-4">
                {sharedContent.map((content) => {
                  const IconComponent = getContentIcon(content.type);
                  
                  return (
                    <div key={content.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getContentColor(content.type)}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-student-text">{content.title}</h3>
                            <p className="text-student-text-secondary text-sm">
                              Shared by {content.sharedBy} • {content.type.toUpperCase()} • {content.size}
                            </p>
                            <p className="text-student-text-secondary text-xs">{content.description}</p>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          icon={Download}
                          className="btn-student-accent"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Share className="w-12 h-12 mx-auto text-student-text-muted mb-3" />
                <p className="text-student-text-secondary">No content shared with you yet</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Sync Queue */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-student-text">⏳ Sync Queue</h2>
          <div className="flex space-x-3">
            <Button 
              onClick={simulateOfflineQuestCompletion}
              variant="outline"
              size="sm"
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Simulate Offline Quest
            </Button>
            <Button 
              onClick={syncAllData}
              disabled={!isOnline || syncQueue.filter(item => !item.synced).length === 0}
              icon={Sync}
              className="btn-student-primary"
            >
              Connect to Internet & Sync All
            </Button>
          </div>
        </div>
        
        {syncQueue.length > 0 ? (
          <div className="space-y-3">
            {syncQueue.map((item) => (
              <div key={item.id} className={`p-4 rounded-lg border ${
                item.synced ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-student-text">
                      {item.type === 'quest_progress' ? 'Quest Progress' : 
                       item.type === 'achievement' ? 'Achievement Earned' : 'Content Shared'}
                    </h3>
                    <p className="text-student-text-secondary text-sm">
                      {item.type === 'quest_progress' && `Quest: ${item.data.questId} - Score: ${item.data.score}%`}
                      {item.type === 'achievement' && `Achievement: ${item.data.title}`}
                      {item.type === 'content_share' && `Shared: ${item.data.title}`}
                    </p>
                    <p className="text-xs text-student-text-secondary">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.synced ? 'Synced' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sync className="w-12 h-12 mx-auto text-student-text-muted mb-3" />
            <p className="text-student-text-secondary">No items in sync queue</p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Modal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        title="Share Content"
        size="md"
      >
        {selectedContent && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${getContentColor(selectedContent.type)}`}>
                {(() => {
                  const IconComponent = getContentIcon(selectedContent.type);
                  return <IconComponent className="w-8 h-8" />;
                })()}
              </div>
              <h3 className="text-xl font-bold text-student-text">{selectedContent.title}</h3>
              <p className="text-student-text-secondary">{selectedContent.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-student-text mb-3">Share with:</h4>
              <div className="space-y-2">
                {nearbyPeers.map((peer) => (
                  <button
                    key={peer.id}
                    onClick={() => shareContent(selectedContent, peer.id)}
                    className="w-full p-3 text-left rounded-lg border border-border hover:border-student-primary hover:bg-student-primary/10 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={peer.avatar} 
                        alt={peer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-student-text">{peer.name}</div>
                        <div className="text-sm text-student-text-secondary">{peer.distance} away</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowShareModal(false)}
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Demo Information */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🚀 Interconnectivity Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-bold text-student-text mb-2">Content Relay</h3>
              <p className="text-student-text-secondary text-sm">
                Share content between students instantly. Switch roles to see content appear in different accounts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">📡</div>
              <h3 className="font-bold text-student-text mb-2">Store-and-Forward</h3>
              <p className="text-student-text-secondary text-sm">
                Complete activities offline, then sync when connected. Progress appears in teacher dashboard.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-student-primary/10 rounded-lg border border-student-primary/20">
            <p className="text-student-primary text-sm">
              <strong>Current User:</strong> {user?.name} ({user?.username}) - 
              <strong> Role:</strong> {user?.role} - 
              <strong> Status:</strong> {isOnline ? 'Online' : 'Offline'} - 
              <strong> StudentNet:</strong> {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};