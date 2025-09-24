import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ToastContainer';
import { Server, Database, Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const SystemMonitoring: React.FC = () => {
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const systemComponents = [
    {
      name: 'Web Server',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      lastCheck: '2 minutes ago',
      icon: Server
    },
    {
      name: 'Database',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '12ms',
      lastCheck: '1 minute ago',
      icon: Database
    },
    {
      name: 'Content Delivery',
      status: 'warning',
      uptime: '98.5%',
      responseTime: '120ms',
      lastCheck: '5 minutes ago',
      icon: Activity
    },
    {
      name: 'Authentication Service',
      status: 'healthy',
      uptime: '100%',
      responseTime: '8ms',
      lastCheck: '30 seconds ago',
      icon: CheckCircle
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      showToast({
        type: 'success',
        title: 'System Status Updated',
        message: 'All system components have been checked',
        duration: 3000
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-admin-primary mb-4">System Monitoring</h1>
          <p className="text-xl text-text-secondary">Real-time system health and performance monitoring</p>
        </div>
        <Button 
          icon={RefreshCw} 
          onClick={handleRefresh}
          loading={refreshing}
          className="btn-admin-primary"
        >
          Refresh Status
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemComponents.map((component) => {
          const IconComponent = component.icon;
          const StatusIcon = getStatusIcon(component.status);
          
          return (
            <div key={component.name} className="admin-card p-6 animate-admin-slide-up">
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="w-8 h-8 text-admin-primary" />
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(component.status)}`}>
                  {component.status.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-text mb-2">{component.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Uptime:</span>
                  <span className="font-bold text-text">{component.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Response:</span>
                  <span className="font-bold text-text">{component.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Last Check:</span>
                  <span className="text-text">{component.lastCheck}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Alerts */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">System Alerts</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-bold text-yellow-800">CDN Performance Warning</h4>
                <p className="text-yellow-700 text-sm">Content delivery response time is higher than normal (120ms vs 50ms average)</p>
                <p className="text-yellow-600 text-xs mt-1">Detected 5 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-bold text-green-800">Database Optimization Complete</h4>
                <p className="text-green-700 text-sm">Database performance has been optimized, query response time improved by 25%</p>
                <p className="text-green-600 text-xs mt-1">Completed 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-admin-background-tertiary rounded-lg">
            <div className="text-3xl font-bold text-admin-primary mb-2">2.3s</div>
            <div className="text-text-secondary">Average Page Load</div>
            <div className="text-sm text-success mt-1">↓ 15% from last week</div>
          </div>
          
          <div className="text-center p-6 bg-admin-background-tertiary rounded-lg">
            <div className="text-3xl font-bold text-admin-primary mb-2">99.9%</div>
            <div className="text-text-secondary">System Uptime</div>
            <div className="text-sm text-success mt-1">↑ 0.1% from last month</div>
          </div>
          
          <div className="text-center p-6 bg-admin-background-tertiary rounded-lg">
            <div className="text-3xl font-bold text-admin-primary mb-2">1,247</div>
            <div className="text-text-secondary">Active Users</div>
            <div className="text-sm text-success mt-1">↑ 12% from yesterday</div>
          </div>
        </div>
      </div>
    </div>
  );
};