import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useToast } from '../ToastContainer';
import { Users, Eye, MessageSquare, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const ClassroomManager: React.FC = () => {
  const { state, updateStudentStatus } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const students = Object.values(state.users).filter((user: any) => user.role === 'student');
  
  const statusOptions = [
    { value: 'On Track', label: 'On Track', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Needs Help', label: 'Needs Help', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
    { value: 'Struggling', label: 'Struggling', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  ];

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (studentId: string, newStatus: string) => {
    // Validate status change
    if (!studentId || !newStatus) {
      showToast({
        type: 'error',
        title: 'Invalid Status Change',
        message: 'Unable to update student status. Please try again.',
        duration: 3000
      });
      return;
    }
    
    // Log status change for audit trail
    console.log('Teacher updating student status:', studentId, 'to:', newStatus);
    
    updateStudentStatus(studentId, newStatus);
    setShowStatusModal(false);
    setSelectedStudent(null);
    
    showToast({
      type: 'success',
      title: 'Status Updated',
      message: `Student status has been updated to "${newStatus}"`,
      duration: 3000
    });
  };

  const getProgressForStudent = (studentId: string) => {
    const progress = state.studentProgress[studentId];
    if (!progress) return { overall: 0, subjects: [] };
    
    const subjects = Object.entries(progress.subjects || {}).map(([name, data]: [string, any]) => ({
      name,
      progress: data.progress
    }));
    
    const overall = subjects.length > 0 
      ? Math.round(subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length)
      : 0;
    
    return { overall, subjects };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Classroom Manager</h1>
        <p className="text-xl text-text-secondary">
          Monitor and manage your {classInfo?.displayName || 'Class 6'} students in real-time
        </p>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="teacher-card text-center p-6 animate-teacher-slide-up">
          <Users className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{students.length}</div>
          <div className="text-text-secondary">Total Students</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">
            {students.filter((s: any) => s.status === 'On Track').length}
          </div>
          <div className="text-text-secondary">On Track</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
          <AlertTriangle className="w-8 h-8 mx-auto text-teacher-accent mb-2" />
          <div className="text-2xl font-bold text-text">
            {students.filter((s: any) => s.status === 'Needs Help').length}
          </div>
          <div className="text-text-secondary">Needs Help</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.3s' }}>
          <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-2" />
          <div className="text-2xl font-bold text-text">
            {students.filter((s: any) => s.status === 'Struggling').length}
          </div>
          <div className="text-text-secondary">Struggling</div>
        </div>
      </div>

      {/* Student List */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Student Overview</h2>
          <Button variant="outline" size="sm" className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Export Data
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full teacher-table-zebra">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-text">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Level</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Progress</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Last Active</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: any) => {
                const { overall } = getProgressForStudent(student.id);
                return (
                  <tr key={student.id} className="border-b border-border">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-text">{student.name}</div>
                          <div className="text-sm text-text-secondary">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-teacher-primary">{student.level}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teacher-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${overall}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-text">{overall}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowStatusModal(true);
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors hover:opacity-80 ${getStatusColor(student.status)}`}
                      >
                        {student.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-text-secondary">
                      {new Date(student.lastActive).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" icon={Eye} className="text-teacher-primary hover:bg-teacher-primary hover:text-white">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon={MessageSquare} className="text-teacher-primary hover:bg-teacher-primary hover:text-white">
                          Message
                        </Button>
                        <Button variant="ghost" size="sm" icon={TrendingUp} className="text-teacher-primary hover:bg-teacher-primary hover:text-white">
                          Analytics
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      <Modal 
        isOpen={showStatusModal} 
        onClose={() => {
          setShowStatusModal(false);
          setSelectedStudent(null);
        }} 
        title="Update Student Status"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6 teacher-modal">
            <div className="text-center">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              />
              <h3 className="text-xl font-bold text-text">{selectedStudent.name}</h3>
              <p className="text-text-secondary">Current Status: {selectedStudent.status}</p>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-3">Select New Status:</h4>
              <div className="space-y-3">
                {statusOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(selectedStudent.id, option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedStudent.status === option.value
                          ? 'border-teacher-primary bg-teacher-primary/10'
                          : 'border-border hover:border-teacher-primary/50 hover:shadow-teacher-card'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-text" />
                        <div className="text-left">
                          <div className="font-medium text-text">{option.label}</div>
                          <div className="text-sm text-text-secondary">
                            {option.value === 'On Track' && 'Student is performing well'}
                            {option.value === 'Needs Help' && 'Student requires additional support'}
                            {option.value === 'Struggling' && 'Student needs immediate attention'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-teal-800 text-sm">
                <strong>Note:</strong> Changing a student's status will update their record across all panels 
                and notify relevant guardians and administrators.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};