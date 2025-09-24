import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Server, 
  Database, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Download,
  Activity,
  Users,
  Target,
  BookOpen
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const SystemAnalytics: React.FC = () => {
  const { state } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Calculate analytics from global state
  const students = Object.values(state.users).filter((user: any) => user.role === 'student');
  const strugglingStudents = students.filter((student: any) => 
    student.status === 'Struggling' || student.status === 'Needs Help'
  );

  // Mock infrastructure data
  const infrastructureStatus = {
    servers: { online: 12, total: 12, load: 'Normal' },
    database: { status: 'Healthy', connections: 245, maxConnections: 1000 },
    cdn: { status: 'Online', hitRate: 94.2 },
    storage: { used: 2.4, total: 10, unit: 'TB' }
  };

  // Community Learning Centers (mock data for India map)
  const learningCenters = [
    { id: 'delhi', name: 'Delhi Center', status: 'online', students: 156, lat: 28.6139, lng: 77.2090 },
    { id: 'mumbai', name: 'Mumbai Center', status: 'online', students: 203, lat: 19.0760, lng: 72.8777 },
    { id: 'bangalore', name: 'Bangalore Center', status: 'online', students: 178, lat: 12.9716, lng: 77.5946 },
    { id: 'chennai', name: 'Chennai Center', status: 'maintenance', students: 134, lat: 13.0827, lng: 80.2707 },
    { id: 'kolkata', name: 'Kolkata Center', status: 'online', students: 145, lat: 22.5726, lng: 88.3639 },
    { id: 'hyderabad', name: 'Hyderabad Center', status: 'online', students: 167, lat: 17.3850, lng: 78.4867 }
  ];

  // Content effectiveness data
  const contentEffectivenessData = {
    labels: ['Algebra Basics', 'Physics Lab', 'Chemistry Intro', 'Biology Cells', 'Math Advanced'],
    datasets: [
      {
        label: 'Completion Rate %',
        data: [92, 78, 85, 88, 65],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // System performance over time
  const systemPerformanceData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'CPU Usage %',
        data: [25, 20, 45, 65, 70, 55, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Memory Usage %',
        data: [30, 28, 35, 42, 48, 45, 35],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Dropout prediction model (mock AI analysis)
  const highRiskStudents = students
    .filter((student: any) => {
      const progress = state.studentProgress[student.id];
      const overallProgress = progress ? 
        Math.round(Object.values(progress.subjects || {}).reduce((sum: number, subject: any) => sum + subject.progress, 0) / Object.keys(progress.subjects || {}).length) : 0;
      
      return overallProgress < 50 || student.status === 'Struggling';
    })
    .slice(0, 5); // Top 5 at-risk students

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-admin-primary mb-4">System Analytics</h1>
        <p className="text-xl text-text-secondary">
          Deep insights into platform performance and educational effectiveness - Focus: {classInfo?.displayName || 'All Classes'}
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2">
        {['24h', '7d', '30d', '90d'].map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'primary' : 'outline'}
            className={selectedTimeRange === range ? 'btn-admin-primary' : 'border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white'}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Infrastructure Monitoring */}
      <div className="admin-card p-6 animate-admin-slide-up">
        <h2 className="text-2xl font-bold text-text mb-6">Infrastructure Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-green-50 rounded-lg shadow-admin-card">
            <Server className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-lg font-bold text-text">
              {infrastructureStatus.servers.online}/{infrastructureStatus.servers.total}
            </div>
            <div className="text-text-secondary">Servers Online</div>
            <div className="text-sm text-green-600 mt-1">● {infrastructureStatus.servers.load} Load</div>
          </div>
          
          <div className="text-center p-4 bg-admin-primary/10 rounded-lg shadow-admin-card">
            <Database className="w-8 h-8 mx-auto text-admin-primary mb-2" />
            <div className="text-lg font-bold text-text">{infrastructureStatus.database.status}</div>
            <div className="text-text-secondary">Database</div>
            <div className="text-sm text-admin-primary mt-1">
              {infrastructureStatus.database.connections}/{infrastructureStatus.database.maxConnections} connections
            </div>
          </div>
          
          <div className="text-center p-4 bg-admin-accent/10 rounded-lg shadow-admin-card">
            <Activity className="w-8 h-8 mx-auto text-admin-accent mb-2" />
            <div className="text-lg font-bold text-text">{infrastructureStatus.cdn.hitRate}%</div>
            <div className="text-text-secondary">CDN Hit Rate</div>
            <div className="text-sm text-admin-accent mt-1">● Online</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Database className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <div className="text-lg font-bold text-text">
              {infrastructureStatus.storage.used}/{infrastructureStatus.storage.total} {infrastructureStatus.storage.unit}
            </div>
            <div className="text-text-secondary">Storage Used</div>
            <div className="text-sm text-orange-600 mt-1">24% capacity</div>
          </div>
        </div>

        {/* System Performance Chart */}
        <div>
          <h3 className="text-xl font-bold text-text mb-4">System Performance (24h)</h3>
          <Line 
            data={systemPerformanceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Community Learning Centers Map */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Community Learning Centers</h2>
          <MapPin className="w-6 h-6 text-admin-primary" />
        </div>
        
        {/* Mock India Map with Centers */}
        <div className="relative bg-gradient-to-br from-admin-primary/5 to-admin-accent/5 rounded-lg p-8 h-96 shadow-admin-card">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-text mb-4">India Learning Network</h3>
              <p className="text-text-secondary mb-6">Real-time status of community centers across India</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
                {learningCenters.map((center) => (
                  <div key={center.id} className="bg-white p-3 rounded-lg shadow-admin-card">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-text text-sm">{center.name}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        center.status === 'online' ? 'bg-green-500' : 
                        center.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="text-xs text-text-secondary">
                      {center.students} active students
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Effectiveness */}
        <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-text mb-4">Content Effectiveness</h2>
          <p className="text-text-secondary mb-6">Quest completion rates by subject</p>
          <Bar 
            data={contentEffectivenessData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>

        {/* Dropout Prediction Model */}
        <div className="admin-card admin-card-attention p-6 animate-admin-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text">AI Risk Assessment</h2>
            <AlertTriangle className="w-6 h-6 text-admin-accent" />
          </div>
          <p className="text-text-secondary mb-6">Students flagged by predictive model as high-risk</p>
          
          <div className="space-y-4">
            {highRiskStudents.map((student: any) => {
              const progress = state.studentProgress[student.id];
              const overallProgress = progress ? 
                Math.round(Object.values(progress.subjects || {}).reduce((sum: number, subject: any) => sum + subject.progress, 0) / Object.keys(progress.subjects || {}).length) : 0;
              
              return (
                <div key={student.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg hover:shadow-admin-card transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-text">{student.name}</h4>
                        <p className="text-sm text-text-secondary">Level {student.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{overallProgress}%</div>
                      <div className="text-xs text-text-secondary">Progress</div>
                    </div>
                  </div>
                  <div className="text-sm text-red-700">
                    Risk factors: Low engagement, declining performance, missed deadlines
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Export Section */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">Data Export & Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-admin-primary/10 rounded-lg shadow-admin-card">
            <Users className="w-8 h-8 mx-auto text-admin-primary mb-3" />
            <h3 className="font-bold text-text mb-2">User Data Export</h3>
            <p className="text-sm text-text-secondary mb-4">Export comprehensive user analytics and engagement metrics</p>
            <Button variant="outline" icon={Download} className="w-full border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white">
              Export CSV
            </Button>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-3" />
            <h3 className="font-bold text-text mb-2">Performance Report</h3>
            <p className="text-sm text-text-secondary mb-4">Detailed performance analysis and recommendations</p>
            <Button variant="outline" icon={Download} className="w-full border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white">
              Export PDF
            </Button>
          </div>
          
          <div className="text-center p-6 bg-admin-accent/10 rounded-lg shadow-admin-card">
            <BookOpen className="w-8 h-8 mx-auto text-admin-accent mb-3" />
            <h3 className="font-bold text-text mb-2">Content Analytics</h3>
            <p className="text-sm text-text-secondary mb-4">Content effectiveness and engagement statistics</p>
            <Button variant="outline" icon={Download} className="w-full border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white">
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {/* System Health Summary */}
      <div className="admin-card bg-gradient-to-r from-green-50 to-admin-primary/10 p-6 animate-admin-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text mb-4">System Health: Excellent</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-success">99.9%</div>
              <div className="text-text-secondary">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-admin-primary">{Object.keys(state.users).length}</div>
              <div className="text-text-secondary">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-admin-accent">87%</div>
              <div className="text-text-secondary">Avg Engagement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">4.8/5</div>
              <div className="text-text-secondary">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};