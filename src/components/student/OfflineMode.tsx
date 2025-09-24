import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { WifiOff, Download, CheckCircle, Clock, HardDrive, Wifi } from 'lucide-react';

export const OfflineMode: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadedContent, setDownloadedContent] = useState<string[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load downloaded content from localStorage
    const saved = localStorage.getItem('offline_content');
    if (saved) {
      setDownloadedContent(JSON.parse(saved));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const availableContent = [
    {
      id: 'math_grade_6',
      title: 'Mathematics - Grade 6',
      description: 'Complete math curriculum with interactive exercises',
      size: '45 MB',
      type: 'Subject Pack',
      chapters: 12,
      quests: 8,
      quizzes: 15
    },
    {
      id: 'science_grade_6',
      title: 'Science - Grade 6',
      description: 'Science fundamentals with virtual experiments',
      size: '78 MB',
      type: 'Subject Pack',
      chapters: 10,
      quests: 12,
      quizzes: 20
    },
    {
      id: 'english_grade_6',
      title: 'English - Grade 6',
      description: 'Language skills and literature study',
      size: '32 MB',
      type: 'Subject Pack',
      chapters: 8,
      quests: 6,
      quizzes: 12
    },
    {
      id: 'offline_games',
      title: 'Educational Games Pack',
      description: 'Fun learning games that work without internet',
      size: '125 MB',
      type: 'Games',
      chapters: 0,
      quests: 0,
      quizzes: 25
    }
  ];

  const handleDownload = (contentId: string) => {
    // Simulate download progress
    setDownloadProgress(prev => ({ ...prev, [contentId]: 0 }));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const current = prev[contentId] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setDownloadedContent(prevDownloaded => {
            const updated = [...prevDownloaded, contentId];
            localStorage.setItem('offline_content', JSON.stringify(updated));
            return updated;
          });
          return { ...prev, [contentId]: 100 };
        }
        return { ...prev, [contentId]: current + 10 };
      });
    }, 200);
  };

  const handleRemoveContent = (contentId: string) => {
    if (!contentId) return;
    
    setDownloadedContent(prev => {
      const updated = prev.filter(id => id !== contentId);
      localStorage.setItem('offline_content', JSON.stringify(updated));
      return updated;
    });
  };

  const getTotalSize = () => {
    return downloadedContent.reduce((total, contentId) => {
      const content = availableContent.find(c => c.id === contentId);
      return total + parseInt(content?.size || '0');
    }, 0);
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">📱 Offline Mode</h1>
        <p className="text-xl text-student-text-secondary">Download content to learn anywhere, anytime</p>
      </div>

      {/* Connection Status */}
      <div className={`student-card p-6 animate-student-slide-up ${
        isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-center space-x-4">
          {isOnline ? (
            <>
              <Wifi className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-green-800">Connected to Internet</h2>
                <p className="text-green-700">You can download new content and sync your progress</p>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-xl font-bold text-red-800">Offline Mode Active</h2>
                <p className="text-red-700">Using downloaded content. Progress will sync when online</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Storage Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <HardDrive className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{getTotalSize()} MB</div>
          <div className="text-student-text-secondary">Downloaded</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <Download className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">{downloadedContent.length}</div>
          <div className="text-student-text-secondary">Content Packs</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <CheckCircle className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">Available</div>
          <div className="text-student-text-secondary">Offline Learning</div>
        </div>
      </div>

      {/* Available Content */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold text-student-text mb-6">📦 Available Content Packs</h2>
        
        <div className="space-y-4">
          {availableContent.map((content) => {
            const isDownloaded = downloadedContent.includes(content.id);
            const progress = downloadProgress[content.id];
            const isDownloading = progress !== undefined && progress < 100;
            
            return (
              <div key={content.id} className="p-6 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200 student-hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-student-text">{content.title}</h3>
                      <span className="px-2 py-1 bg-student-primary text-white rounded-full text-xs font-bold">
                        {content.type}
                      </span>
                    </div>
                    <p className="text-student-text-secondary mb-3">{content.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-student-text-secondary">Size: </span>
                        <span className="font-medium text-student-text">{content.size}</span>
                      </div>
                      {content.chapters > 0 && (
                        <div>
                          <span className="text-student-text-secondary">Chapters: </span>
                          <span className="font-medium text-student-text">{content.chapters}</span>
                        </div>
                      )}
                      {content.quests > 0 && (
                        <div>
                          <span className="text-student-text-secondary">Quests: </span>
                          <span className="font-medium text-student-text">{content.quests}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-student-text-secondary">Quizzes: </span>
                        <span className="font-medium text-student-text">{content.quizzes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Progress */}
                {isDownloading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-student-text-secondary">Downloading...</span>
                      <span className="text-student-text">{progress}%</span>
                    </div>
                    <div className="student-progress-bar-enhanced h-3">
                      <div 
                        className="student-progress-fill-enhanced h-3"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isDownloaded ? (
                    <>
                      <Button 
                        className="flex-1 btn-student-accent"
                        icon={CheckCircle}
                        disabled
                      >
                        Downloaded
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveContent(content.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Remove
                      </Button>
                    </>
                  ) : isDownloading ? (
                    <Button 
                      className="flex-1"
                      disabled
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Downloading...
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 btn-student-primary student-click-bounce"
                      icon={Download}
                      onClick={() => handleDownload(content.id)}
                      disabled={!isOnline}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline Learning Tips */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">💡 Offline Learning Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-student-text mb-2">Download Before You Go</h3>
              <p className="text-student-text-secondary text-sm">Download content when you have good internet connection</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🔋</div>
              <h3 className="font-bold text-student-text mb-2">Save Battery</h3>
              <p className="text-student-text-secondary text-sm">Offline mode uses less battery than streaming content</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">☁️</div>
              <h3 className="font-bold text-student-text mb-2">Auto Sync</h3>
              <p className="text-student-text-secondary text-sm">Your progress automatically syncs when you're back online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};