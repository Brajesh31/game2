import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, Users, Target, Clock, Download, Filter } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Analytics: React.FC = () => {
  const { state } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const students = Object.values(state.users).filter((user: any) => user.role === 'student');
  
  // Calculate student performance data
  const studentPerformanceData = {
    labels: students.map((student: any) => student.name),
    datasets: [
      {
        label: 'Overall Progress %',
        data: students.map((student: any) => {
          const progress = state.studentProgress[student.id];
          if (!progress) return 0;
          const subjects = Object.values(progress.subjects || {});
          return subjects.length > 0 
            ? Math.round(subjects.reduce((sum: number, subject: any) => sum + subject.progress, 0) / subjects.length)
            : 0;
        }),
        backgroundColor: 'rgba(0, 121, 107, 0.6)',
        borderColor: 'rgba(0, 121, 107, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Quest completion rates
  const questCompletionData = {
    labels: ['Daily Quests', 'Weekly Challenges', 'Project Quests'],
    datasets: [
      {
        data: [87, 64, 45],
        backgroundColor: [
          'rgba(0, 121, 107, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(77, 182, 172, 0.8)',
        ],
        borderColor: [
          'rgba(0, 121, 107, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(77, 182, 172, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Weekly engagement trend
  const engagementTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Students',
        data: [12, 15, 18, 16, 20, 8, 5],
        borderColor: 'rgb(0, 121, 107)',
        backgroundColor: 'rgba(0, 121, 107, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Quest Completions',
        data: [8, 12, 14, 11, 16, 6, 3],
        borderColor: 'rgb(255, 193, 7)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Subject performance breakdown
  const subjectPerformanceData = {
    labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    datasets: [
      {
        label: 'Average Score %',
        data: [78, 65, 71, 82],
        backgroundColor: [
          'rgba(0, 121, 107, 0.8)',
          'rgba(77, 182, 172, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(128, 203, 196, 0.8)',
        ],
        borderColor: [
          'rgba(0, 121, 107, 1)',
          'rgba(77, 182, 172, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(128, 203, 196, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const calculateAverageProgress = () => {
    const allProgress = students.map((student: any) => {
      const progress = state.studentProgress[student.id];
      if (!progress) return 0;
      const subjects = Object.values(progress.subjects || {});
      return subjects.length > 0 
        ? subjects.reduce((sum: number, subject: any) => sum + subject.progress, 0) / subjects.length
        : 0;
    });
    return Math.round(allProgress.reduce((sum, progress) => sum + progress, 0) / allProgress.length);
  };

  const getActiveStudentsCount = () => {
    return students.filter((student: any) => {
      const lastActive = new Date(student.lastActive);
      const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActive <= 7;
    }).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Analytics & Reports</h1>
          <p className="text-xl text-text-secondary">
            Track student progress and classroom performance for {classInfo?.displayName || 'All Classes'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Filter} className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Filters
          </Button>
          <Button variant="outline" icon={Download} className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {['week', 'month', 'semester'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'outline'}
            className={timeRange === range ? 'btn-teacher-primary' : 'border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="teacher-card text-center p-6 animate-teacher-slide-up">
          <Users className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{getActiveStudentsCount()}</div>
          <div className="text-text-secondary">Active Students</div>
          <div className="text-sm text-success mt-1">↑ 12% from last week</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
          <TrendingUp className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{calculateAverageProgress()}%</div>
          <div className="text-text-secondary">Avg Progress</div>
          <div className="text-sm text-success mt-1">↑ 5% from last week</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
          <Target className="w-8 h-8 mx-auto text-teacher-accent mb-2" />
          <div className="text-2xl font-bold text-text">87%</div>
          <div className="text-text-secondary">Quest Completion</div>
          <div className="text-sm text-success mt-1">↑ 8% from last week</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.3s' }}>
          <Clock className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">24m</div>
          <div className="text-text-secondary">Avg Session Time</div>
          <div className="text-sm text-red-500 mt-1">↓ 2m from last week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Performance Chart */}
        <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-bold text-text mb-4">Student Performance Overview</h2>
          <Bar 
            data={studentPerformanceData}
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

        {/* Quest Completion Rates */}
        <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-bold text-text mb-4">Quest Completion Rates</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={questCompletionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Engagement Trend */}
        <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-xl font-bold text-text mb-4">Weekly Engagement Trend</h2>
          <Line 
            data={engagementTrendData}
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
                },
              },
            }}
          />
        </div>

        {/* Subject Performance */}
        <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-xl font-bold text-text mb-4">Subject Performance Breakdown</h2>
          <Bar 
            data={subjectPerformanceData}
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
      </div>

      {/* Detailed Student Table */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.8s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Detailed Student Analytics</h2>
          <Button variant="outline" size="sm" className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Export Table
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full teacher-table-zebra">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-text">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Level</th>
                <th className="text-left py-3 px-4 font-semibold text-text">XP</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Progress</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Quests Completed</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: any) => {
                const progress = state.studentProgress[student.id];
                const overallProgress = progress ? 
                  Math.round(Object.values(progress.subjects || {}).reduce((sum: number, subject: any) => sum + subject.progress, 0) / Object.keys(progress.subjects || {}).length) : 0;
                const questsCompleted = progress?.currentQuests?.length || 0;
                
                return (
                  <tr key={student.id} className="border-b border-border">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-text">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-teacher-primary">{student.level}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-text">{student.xp.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teacher-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${overallProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-text">{overallProgress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-text">{questsCompleted}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        student.status === 'On Track' ? 'bg-green-100 text-green-800' :
                        student.status === 'Needs Help' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};