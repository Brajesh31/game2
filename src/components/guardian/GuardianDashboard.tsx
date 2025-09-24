import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Guardian } from '../../types';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Heart, 
  Clock, 
  Trophy, 
  BookOpen, 
  Bell, 
  User, 
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const GuardianDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [selectedChild, setSelectedChild] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const guardian = userData as Guardian;

  if (!guardian || !guardian.user) {
    return <div>Loading...</div>;
  }

  // Simple, visual progress data for each child
  const getChildProgressData = (childData: any) => ({
    labels: childData.subjects.map((s: any) => s.name),
    datasets: [
      {
        data: childData.subjects.map((s: any) => s.progress),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  });

  const weeklyTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Learning Time (hours)',
        data: [1.5, 2.2, 1.8, 2.5, 2.0, 1.2, 0.8],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  const unreadNotifications = guardian.notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Welcome Header - Large, friendly text */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hello, {guardian.user.name}! 👋</h1>
            <p className="text-xl opacity-90">Here's how your children are doing</p>
          </div>
          <div className="text-right">
            <Button 
              variant="outline" 
              className="bg-white text-pink-600 hover:bg-gray-50"
              icon={Bell}
              onClick={() => setShowNotifications(true)}
            >
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
              Messages
            </Button>
          </div>
        </div>
      </div>

      {/* Children Overview - Large cards for easy reading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guardian.childrenProgress.map((child) => (
          <Card key={child.id} className="p-6" hover onClick={() => setSelectedChild(child)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {child.name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text">{child.name}</h3>
                  <p className="text-text-secondary">Level {child.currentLevel}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-success">{child.weeklyProgress}%</div>
                <div className="text-sm text-text-secondary">This week</div>
              </div>
            </div>

            {/* Key metrics in large, easy-to-read format */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-background-secondary rounded-lg">
                <Clock className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <div className="text-lg font-bold text-text">{child.timeSpent}</div>
                <div className="text-xs text-text-secondary">Time Spent</div>
              </div>
              
              <div className="text-center p-3 bg-background-secondary rounded-lg">
                <Trophy className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                <div className="text-lg font-bold text-text">{child.recentAchievements}</div>
                <div className="text-xs text-text-secondary">New Awards</div>
              </div>
              
              <div className="text-center p-3 bg-background-secondary rounded-lg">
                <BookOpen className="w-6 h-6 mx-auto text-green-500 mb-1" />
                <div className="text-lg font-bold text-text">{child.subjects.length}</div>
                <div className="text-xs text-text-secondary">Subjects</div>
              </div>
            </div>

            {/* Simple progress indicator */}
            <div className="space-y-2">
              {child.subjects.map((subject) => (
                <div key={subject.name} className="flex items-center justify-between">
                  <span className="text-text font-medium">{subject.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-text w-10 text-right">{subject.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Simple weekly overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Weekly Learning Time</h2>
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <Bar 
          data={weeklyTimeData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: { size: 14 }
                }
              },
              x: {
                ticks: {
                  font: { size: 14 }
                }
              }
            },
          }}
        />
      </Card>

      {/* Recent Activity - Simple list format */}
      <Card>
        <h2 className="text-2xl font-bold text-text mb-6">Recent Updates</h2>
        <div className="space-y-4">
          {[
            { child: 'Aria', message: 'Completed Math Quiz with 95% score!', time: '2 hours ago', type: 'success' },
            { child: 'Aarav', message: 'Started new Science chapter', time: '5 hours ago', type: 'info' },
            { child: 'Aria', message: 'Earned "Math Master" achievement', time: '1 day ago', type: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center p-4 bg-background-secondary rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mr-4 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-text font-medium">
                  <span className="font-bold">{activity.child}</span> {activity.message}
                </p>
                <p className="text-sm text-text-secondary mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Child Details Modal - Simplified for guardians */}
      <Modal 
        isOpen={!!selectedChild} 
        onClose={() => setSelectedChild(null)} 
        title={`${selectedChild?.name}'s Progress`}
        size="lg"
      >
        {selectedChild && (
          <div className="space-y-6">
            {/* Overall progress */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-text mb-2">{selectedChild.weeklyProgress}%</div>
              <div className="text-text-secondary mb-4">Weekly Progress</div>
              <div className="text-sm text-text-secondary">
                {selectedChild.name} is doing great! Keep up the good work!
              </div>
            </div>

            {/* Subject breakdown with simple chart */}
            <div>
              <h3 className="text-xl font-bold text-text mb-4">Subject Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <Doughnut 
                    data={getChildProgressData(selectedChild)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            font: { size: 12 },
                            usePointStyle: true,
                          }
                        },
                      },
                    }}
                  />
                </div>
                
                <div className="space-y-3">
                  {selectedChild.subjects.map((subject: any) => (
                    <div key={subject.name} className="p-3 bg-background-secondary rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-text">{subject.name}</span>
                        <span className="text-lg font-bold text-text">{subject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simple achievement showcase */}
            <div>
              <h3 className="text-xl font-bold text-text mb-4">Recent Achievements</h3>
              <div className="text-center p-8 bg-yellow-50 rounded-lg">
                <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-3" />
                <div className="text-2xl font-bold text-text">{selectedChild.recentAchievements}</div>
                <div className="text-text-secondary">New achievements this week!</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Send Encouragement
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notifications Modal - Simple list format */}
      <Modal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        title="Messages & Updates"
        size="lg"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {guardian.notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-lg border-l-4 ${
                notification.read 
                  ? 'bg-background-secondary border-gray-300' 
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-bold text-text text-lg">{notification.title}</h4>
                  <p className="text-text mt-1">{notification.message}</p>
                  <p className="text-sm text-text-secondary mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline">Mark All as Read</Button>
        </div>
      </Modal>
    </div>
  );
};