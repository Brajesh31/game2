import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGlobalState } from '../../hooks/useGlobalState';
import { Users, BookOpen, TrendingUp, AlertTriangle, Clock, Trophy, PlusCircle, MessageSquare } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, getStudentsByStatus } = useGlobalState();

  const strugglingStudents = getStudentsByStatus('Struggling');
  const needsHelpStudents = getStudentsByStatus('Needs Help');
  const allStudentsNeedingAttention = [...strugglingStudents, ...needsHelpStudents];

  const totalStudents = Object.values(state.users).filter((user: any) => user.role === 'student').length;
  const activeQuests = state.quests.filter((quest: any) => quest.status === 'active').length;
  const totalClasses = Object.keys(state.classes).length;

  // Load synced data from StudentNet
  const [syncedData, setSyncedData] = useState<any[]>([]);

  useEffect(() => {
    const loadSyncedData = () => {
      const teacherSyncKey = 'teacher_sync_data';
      const data = JSON.parse(localStorage.getItem(teacherSyncKey) || '[]');
      setSyncedData(data);
    };

    loadSyncedData();

    // Listen for sync updates
    const interval = setInterval(loadSyncedData, 5000);
    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    {
      type: 'submission',
      message: 'Aria Patel completed Algebra Challenge',
      timestamp: '2 hours ago',
      student: 'student-001'
    },
    {
      type: 'concern',
      message: 'Rahul Sharma needs help with quadratic equations',
      timestamp: '4 hours ago',
      student: 'student-002'
    },
    {
      type: 'achievement',
      message: 'Priya Singh unlocked Mathematics Master',
      timestamp: '1 day ago',
      student: 'student-003'
    }
  ];

  return (
      <div className="space-y-8 bg-teacher-background text-teacher-text min-h-screen">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teacher-primary to-teacher-secondary rounded-xl text-white p-8 shadow-teacher-card animate-teacher-slide-up relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Welcome back, Dr. Kumar!</h1>
            <p className="text-xl opacity-90">Here's what's happening in your classroom today</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
            <Users className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
            <div className="text-2xl font-bold text-text">{totalStudents}</div>
            <div className="text-text-secondary">Total Students</div>
          </div>

          <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
            <BookOpen className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
            <div className="text-2xl font-bold text-text">{totalClasses}</div>
            <div className="text-text-secondary">Active Classes</div>
          </div>

          <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.3s' }}>
            <TrendingUp className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
            <div className="text-2xl font-bold text-text">{activeQuests}</div>
            <div className="text-text-secondary">Active Quests</div>
          </div>

          <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.4s' }}>
            <AlertTriangle className="w-8 h-8 mx-auto text-teacher-accent mb-2" />
            <div className="text-2xl font-bold text-text">{allStudentsNeedingAttention.length}</div>
            <div className="text-text-secondary">Need Attention</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Students Needing Attention */}
          <div className="teacher-card teacher-card-attention p-6 animate-teacher-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Students Needing Attention</h2>
              <AlertTriangle className="w-6 h-6 text-teacher-accent" />
            </div>

            {allStudentsNeedingAttention.length > 0 ? (
                <div className="space-y-4">
                  {allStudentsNeedingAttention.map((student: any) => (
                      <div key={student.id} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg transition-all duration-300 hover:shadow-teacher-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-bold text-text">{student.name}</h3>
                              <p className="text-sm text-text-secondary">Level {student.level}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              student.status === 'Struggling' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                      {student.status}
                    </span>
                        </div>
                        <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">
                      Last active: {new Date(student.lastActive).toLocaleDateString()}
                    </span>
                          <Button variant="outline" size="sm" className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
                            Send Message
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-center py-8 text-text-secondary">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-teacher-primary opacity-50" />
                  <p>All students are doing well!</p>
                </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Recent Activity</h2>
              <Clock className="w-6 h-6 text-teacher-primary" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const student = state.users[activity.student];
                return (
                    <div key={index} className="flex items-center p-3 bg-teacher-background-tertiary rounded-lg transition-all duration-300 hover:shadow-teacher-card hover:bg-teacher-background-secondary">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                          activity.type === 'submission' ? 'bg-teacher-primary' :
                              activity.type === 'concern' ? 'bg-teacher-accent' :
                                  'bg-teacher-primary'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-text">{activity.message}</p>
                        <p className="text-sm text-text-secondary">{activity.timestamp}</p>
                      </div>
                      {student && (
                          <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover"
                          />
                      )}
                    </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* StudentNet Sync Data */}
        {syncedData.length > 0 && (
            <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.8s' }}>
              <h2 className="text-2xl font-bold text-text mb-6">📡 StudentNet Synced Data</h2>
              <div className="space-y-3">
                {syncedData.slice(-5).map((item, index) => (
                    <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-text">
                            Student Progress Synced
                          </h3>
                          <p className="text-text-secondary text-sm">
                            Student ID: {item.studentId} • Quest: {item.questId} • Score: {item.score}%
                          </p>
                          <p className="text-xs text-text-secondary">
                            Synced: {new Date(item.syncedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                          Synced
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Demo Feature:</strong> This shows how student progress completed offline
                  gets synced to the teacher dashboard through StudentNet's store-and-forward system.
                </p>
              </div>
            </div>
        )}

        {/* Quick Actions */}
        <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold text-text mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2 btn-teacher-primary">
              <PlusCircle className="w-6 h-6" />
              <span>Create Quest</span>
            </Button>
            <Button
                variant="outline"
                className="h-20 flex-col space-y-2 border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white"
                onClick={() => navigate('/teacher/communication')}
            >
              <MessageSquare className="w-6 h-6" />
              <span>Send Message</span>
            </Button>
            <Button
                variant="outline"
                className="h-20 flex-col space-y-2 border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white"
                onClick={() => navigate('/teacher/analytics')}
            >
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
            <Button
                variant="outline"
                className="h-20 flex-col space-y-2 border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white"
                onClick={() => navigate('/teacher/classroom')}
            >
              <Users className="w-6 h-6" />
              <span>Manage Class</span>
            </Button>
          </div>
        </div>
      </div>
  );
};