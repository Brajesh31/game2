import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useToast } from '../ToastContainer';
import { Calendar, CheckCircle, XCircle, Clock, Users, Download } from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { state } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const students = Object.values(state.users).filter((user: any) => user.role === 'student');

  // Mock attendance data
  const mockAttendance = {
    'student-001': 'present',
    'student-002': 'late',
    'student-003': 'present'
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    // Save attendance data
    const attendanceData = {
      date: selectedDate,
      classId: classInfo?.id,
      attendance: { ...mockAttendance, ...attendance }
    };

    showToast({
      type: 'success',
      title: 'Attendance Saved',
      message: `Attendance for ${new Date(selectedDate).toLocaleDateString()} has been saved`,
      duration: 3000
    });
  };

  const getAttendanceStats = () => {
    const totalStudents = students.length;
    const presentCount = Object.values({ ...mockAttendance, ...attendance }).filter(status => status === 'present').length;
    const absentCount = Object.values({ ...mockAttendance, ...attendance }).filter(status => status === 'absent').length;
    const lateCount = Object.values({ ...mockAttendance, ...attendance }).filter(status => status === 'late').length;

    return { totalStudents, presentCount, absentCount, lateCount };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Attendance Tracker</h1>
        <p className="text-xl text-text-secondary">
          Track daily attendance for {classInfo?.displayName || 'All Classes'}
        </p>
      </div>

      {/* Date Selector and Stats */}
      <div className="teacher-card p-6 animate-teacher-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-teacher-primary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-teacher focus:ring-teacher-primary focus:border-teacher-primary"
            />
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" icon={Download} className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
              Export Report
            </Button>
            <Button icon={CheckCircle} onClick={saveAttendance} className="btn-teacher-primary">
              Save Attendance
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-teacher-background-tertiary rounded-lg">
            <Users className="w-6 h-6 mx-auto text-teacher-primary mb-2" />
            <div className="text-2xl font-bold text-text">{stats.totalStudents}</div>
            <div className="text-text-secondary">Total Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-text">{stats.presentCount}</div>
            <div className="text-text-secondary">Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="w-6 h-6 mx-auto text-red-600 mb-2" />
            <div className="text-2xl font-bold text-text">{stats.absentCount}</div>
            <div className="text-text-secondary">Absent</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-text">{stats.lateCount}</div>
            <div className="text-text-secondary">Late</div>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold text-text mb-6">Mark Attendance - {new Date(selectedDate).toLocaleDateString()}</h2>
        
        <div className="space-y-4">
          {students.map((student: any) => {
            const currentStatus = attendance[student.id] || mockAttendance[student.id as keyof typeof mockAttendance] || 'present';
            
            return (
              <div key={student.id} className="flex items-center justify-between p-4 bg-teacher-background-tertiary rounded-lg hover:shadow-teacher-card transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-text">{student.name}</h3>
                    <p className="text-sm text-text-secondary">Level {student.level}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={currentStatus === 'present' ? 'primary' : 'outline'}
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => markAttendance(student.id, 'present')}
                    className={currentStatus === 'present' ? 'bg-green-500 hover:bg-green-600' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}
                  >
                    Present
                  </Button>
                  <Button
                    variant={currentStatus === 'late' ? 'primary' : 'outline'}
                    size="sm"
                    icon={Clock}
                    onClick={() => markAttendance(student.id, 'late')}
                    className={currentStatus === 'late' ? 'bg-yellow-500 hover:bg-yellow-600' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white'}
                  >
                    Late
                  </Button>
                  <Button
                    variant={currentStatus === 'absent' ? 'primary' : 'outline'}
                    size="sm"
                    icon={XCircle}
                    onClick={() => markAttendance(student.id, 'absent')}
                    className={currentStatus === 'absent' ? 'bg-red-500 hover:bg-red-600' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="teacher-card p-6 bg-gradient-to-r from-teacher-background-tertiary to-teacher-background-secondary animate-teacher-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">Attendance Summary</h2>
          <div className="text-4xl font-bold text-teacher-primary mb-2">
            {Math.round((stats.presentCount / stats.totalStudents) * 100)}%
          </div>
          <p className="text-text-secondary">Overall Attendance Rate</p>
        </div>
      </div>
    </div>
  );
};