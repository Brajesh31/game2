import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Users, 
  Activity, 
  TrendingUp, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Target,
  Clock,
  MessageSquare
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

export const AdminDashboard: React.FC = () => {
  const { state } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const navigate = useNavigate();
  
  // Calculate real-time metrics from global state
  const totalUsers = Object.keys(state.users).length;
  const students = Object.values(state.users).filter((user: any) => user.role === 'student');
  const teachers = Object.values(state.users).filter((user: any) => user.role === 'teacher');
  const guardians = Object.values(state.users).filter((user: any) => user.role === 'guardian');
  
  // Students at risk - key interconnectivity feature
  const studentsAtRisk = students.filter((student: any) => 
    student.status === 'Struggling' || student.status === 'Needs Help'
  );
  
  // Active quests and completion metrics
  const activeQuests = state.quests?.filter((quest: any) => quest.status === 'active').length || 0;
  const completedQuestsToday = 15; // Mock data for demo
  
  // Daily active users (mock data based on realistic patterns)
  const dailyActiveUsers = [85, 92, 78, 88, 94, 87, 91];

  // User growth data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Users',
        data: [456, 523, 612, 698, 789, totalUsers],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Weekly engagement data
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: dailyActiveUsers,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Recent platform activity
  const recentActivity = [
    {
      type: 'quest_created',
      message: 'Dr. Kumar created new quest: "Advanced Physics Concepts"',
      timestamp: '2 hours ago',
      icon: Target
    },
    {
      type: 'user_registered',
      message: '5 new students registered today',
      timestamp: '4 hours ago',
      icon: Users
    },
    {
      type: 'message_sent',
      message: 'Guardian Priya Sharma sent message to teacher',
      timestamp: '6 hours ago',
      icon: MessageSquare
    },
    {
      type: 'achievement_unlocked',
      message: 'Aria Patel unlocked "Mathematics Master" achievement',
      timestamp: '8 hours ago',
      icon: CheckCircle
    }
  ];
  
  const handleViewStudentAtRisk = (studentId: string) => {
    navigate(`/admin/users?tab=students&highlight=${studentId}`);
  };

  return (
    <div className="space-y-8 bg-admin-background text-admin-text min-h-screen">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-admin-primary mb-4">Admin Command Center</h1>
        <p className="text-xl text-text-secondary">
          Real-time platform monitoring and management - Focus: {classInfo?.displayName || 'All Classes'}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card text-center p-6 animate-admin-slide-up">
          <Users className="w-8 h-8 mx-auto text-admin-primary mb-2" />
          <div className="text-3xl font-bold text-text">{totalUsers}</div>
          <div className="text-text-secondary">Total Users</div>
          <div className="text-sm text-success mt-1">↑ 12% this month</div>
        </div>
        
        <div className="admin-card text-center p-6 animate-admin-slide-up" style={{ animationDelay: '0.1s' }}>
          <Activity className="w-8 h-8 mx-auto text-admin-primary mb-2" />
          <div className="text-3xl font-bold text-text">{dailyActiveUsers[dailyActiveUsers.length - 1]}</div>
          <div className="text-text-secondary">Daily Active Students</div>
          <div className="text-sm text-success mt-1">↑ 5% from yesterday</div>
        </div>
        
        <div className="admin-card text-center p-6 animate-admin-slide-up" style={{ animationDelay: '0.2s' }}>
          <Target className="w-8 h-8 mx-auto text-admin-accent mb-2" />
          <div className="text-3xl font-bold text-text">{completedQuestsToday}</div>
          <div className="text-text-secondary">Quests Completed Today</div>
          <div className="text-sm text-success mt-1">↑ 8% from yesterday</div>
        </div>
        
        <div className="admin-card text-center p-6 animate-admin-slide-up" style={{ animationDelay: '0.3s' }}>
          <Server className="w-8 h-8 mx-auto text-green-500 mb-2" />
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-lg font-bold text-text">Healthy</span>
          </div>
          <div className="text-text-secondary">System Status</div>
          <div className="text-sm text-success mt-1">99.9% uptime</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Engagement Chart */}
        <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-text mb-4">User Engagement (7 Days)</h2>
          <Line 
            data={engagementData}
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

        {/* Students At Risk - Key Interconnectivity Feature */}
        <div className="admin-card admin-card-attention p-6 animate-admin-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text">Students At Risk</h2>
            <AlertTriangle className="w-6 h-6 text-admin-accent" />
          </div>
          
          {studentsAtRisk.length > 0 ? (
            <div className="space-y-3">
              {studentsAtRisk.map((student: any) => {
                // Find the teacher for this student
                const teacher = Object.values(state.users).find((user: any) => 
                  user.role === 'teacher'
                ) as any;
                
                return (
                  <div 
                    key={student.id} 
                    className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg cursor-pointer hover:shadow-admin-card transition-all duration-300"
                    onClick={() => handleViewStudentAtRisk(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-text">{student.name}</h3>
                          <p className="text-sm text-text-secondary">
                            Teacher: {teacher?.name || 'Dr. Kumar'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.status === 'Struggling' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      Click to view full profile and intervention options
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
              <p className="text-text">All students are performing well!</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Growth */}
        <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold text-text mb-4">Platform Growth</h2>
          <Line 
            data={userGrowthData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        {/* Recent Platform Activity */}
        <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text">Recent Activity</h2>
            <Clock className="w-6 h-6 text-admin-primary" />
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start p-3 bg-admin-background-tertiary rounded-lg hover:shadow-admin-card transition-all duration-300">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    activity.type === 'quest_created' ? 'bg-admin-primary/10' :
                    activity.type === 'user_registered' ? 'bg-green-100' :
                    activity.type === 'message_sent' ? 'bg-purple-100' :
                    'bg-yellow-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      activity.type === 'quest_created' ? 'text-admin-primary' :
                      activity.type === 'user_registered' ? 'text-green-600' :
                      activity.type === 'message_sent' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-text font-medium">{activity.message}</p>
                    <p className="text-sm text-text-secondary">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">System Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-admin-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-text">{students.length}</div>
            <div className="text-text-secondary">Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-text">{teachers.length}</div>
            <div className="text-text-secondary">Teachers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-text">{guardians.length}</div>
            <div className="text-text-secondary">Guardians</div>
          </div>
          <div className="text-center p-4 bg-admin-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-text">{activeQuests}</div>
            <div className="text-text-secondary">Active Quests</div>
          </div>
        </div>
      </div>
    </div>
  );
};