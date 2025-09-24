import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wifi, Users, Download, Share, Signal, Smartphone } from 'lucide-react';

export const MeshNetwork: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState([
    { id: 'device-1', name: 'Aria\'s Phone', distance: '5m', content: ['Math Notes', 'Physics Videos'], battery: 85 },
    { id: 'device-2', name: 'Rahul\'s Tablet', distance: '12m', content: ['Chemistry Lab', 'Biology Quiz'], battery: 67 },
    { id: 'device-3', name: 'Priya\'s Laptop', distance: '8m', content: ['English Essays', 'History Timeline'], battery: 92 }
  ]);

  const sharedContent = [
    { id: 'content-1', title: 'Quadratic Equations Notes', type: 'PDF', size: '2.3 MB', sharedBy: 'Aria' },
    { id: 'content-2', title: 'Physics Experiment Video', type: 'MP4', size: '15.7 MB', sharedBy: 'Rahul' },
    { id: 'content-3', title: 'Chemistry Formula Sheet', type: 'PDF', size: '1.8 MB', sharedBy: 'Priya' }
  ];

  const toggleConnection = () => {
    if (typeof isConnected === 'undefined') return;
    
    setIsConnected(!isConnected);
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">📡 StudentNet</h1>
        <p className="text-xl text-student-text-secondary">Peer-to-peer content sharing without internet</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="student-card p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 animate-student-slide-up">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-student-text mb-4">Revolutionary Technology Coming Soon!</h2>
          <p className="text-xl text-student-text-secondary mb-6">
            Direct device-to-device learning content sharing using mesh networking
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-student-card">
            <Wifi className="w-5 h-5 mr-2" />
            Beta Testing Q2 2024
          </div>
        </div>
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
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isConnected ? 'text-green-800' : 'text-gray-800'}`}>
                {isConnected ? 'Connected to StudentNet' : 'Not Connected'}
              </h2>
              <p className={isConnected ? 'text-green-700' : 'text-gray-700'}>
                {isConnected ? `${nearbyDevices.length} devices nearby` : 'Enable to discover nearby students'}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={toggleConnection}
            className={isConnected ? 'bg-red-500 hover:bg-red-600' : 'btn-student-primary'}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>

      {isConnected && (
        <>
          {/* Nearby Devices */}
          <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-student-text mb-6">📱 Nearby Devices</h2>
            
            <div className="space-y-4">
              {nearbyDevices.map((device) => (
                <div key={device.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card hover:shadow-student-hover transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-6 h-6 text-student-primary" />
                      <div>
                        <h3 className="font-bold text-student-text">{device.name}</h3>
                        <p className="text-student-text-secondary text-sm">{device.distance} away</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        device.battery > 80 ? 'bg-green-500' :
                        device.battery > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-student-text">{device.battery}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-semibold text-student-text mb-2">Available Content:</h4>
                    <div className="flex flex-wrap gap-2">
                      {device.content.map((item) => (
                        <span key={item} className="px-2 py-1 bg-student-primary text-white rounded-full text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full btn-student-secondary">
                    Request Content
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Content */}
          <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-student-text mb-6">📂 Shared Content</h2>
            
            <div className="space-y-4">
              {sharedContent.map((content) => (
                <div key={content.id} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-student-primary rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-student-text">{content.title}</h3>
                        <p className="text-student-text-secondary text-sm">
                          {content.type} • {content.size} • Shared by {content.sharedBy}
                        </p>
                      </div>
                    </div>
                    
                    <Button size="sm" icon={Download} className="btn-student-primary">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* How It Works */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🔗 How StudentNet Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-primary flex items-center justify-center shadow-student-card">
                <Signal className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">Discover</h3>
              <p className="text-student-text-secondary text-sm">Find nearby students with learning content</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-secondary flex items-center justify-center shadow-student-card">
                <Share className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">Share</h3>
              <p className="text-student-text-secondary text-sm">Exchange notes, videos, and study materials</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-student-accent flex items-center justify-center shadow-student-card">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-student-text mb-2">Learn Together</h3>
              <p className="text-student-text-secondary text-sm">Collaborate even without internet connection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};