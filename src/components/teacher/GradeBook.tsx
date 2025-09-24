import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useToast } from '../ToastContainer';
import { BookOpen, Edit, Save, Eye, Filter, Download } from 'lucide-react';

export const GradeBook: React.FC = () => {
  const { state } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [grades, setGrades] = useState<Record<string, any>>({});
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  const students = Object.values(state.users).filter((user: any) => user.role === 'student');
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

  // Mock grade data
  const mockGrades = {
    'student-001': {
      'Mathematics': { quiz1: 85, quiz2: 92, assignment1: 88, midterm: 90 },
      'Physics': { quiz1: 78, quiz2: 85, assignment1: 82, midterm: 87 },
      'Chemistry': { quiz1: 91, quiz2: 89, assignment1: 93, midterm: 92 }
    },
    'student-002': {
      'Mathematics': { quiz1: 65, quiz2: 70, assignment1: 68, midterm: 72 },
      'Physics': { quiz1: 60, quiz2: 65, assignment1: 63, midterm: 68 },
      'Chemistry': { quiz1: 75, quiz2: 78, assignment1: 76, midterm: 80 }
    }
  };

  const getStudentGrades = (studentId: string, subject: string) => {
    return mockGrades[studentId as keyof typeof mockGrades]?.[subject] || {};
  };

  const calculateAverage = (grades: Record<string, number>) => {
    const values = Object.values(grades);
    return values.length > 0 ? Math.round(values.reduce((sum, grade) => sum + grade, 0) / values.length) : 0;
  };

  const handleUpdateGrade = (studentId: string, assessment: string, grade: number) => {
    setGrades(prev => ({
      ...prev,
      [`${studentId}_${selectedSubject}_${assessment}`]: grade
    }));

    showToast({
      type: 'success',
      title: 'Grade Updated',
      message: 'Student grade has been successfully updated',
      duration: 3000
    });
  };

  const exportGrades = () => {
    showToast({
      type: 'info',
      title: 'Export Started',
      message: 'Grade book export is being prepared',
      duration: 3000
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Grade Book</h1>
        <p className="text-xl text-text-secondary">
          Manage student grades and assessments for {classInfo?.displayName || 'All Classes'}
        </p>
      </div>

      {/* Controls */}
      <div className="teacher-card p-6 animate-teacher-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-teacher focus:ring-teacher-primary focus:border-teacher-primary"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" icon={Filter} className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
              Filter
            </Button>
          </div>
          <Button variant="outline" icon={Download} onClick={exportGrades} className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Export Grades
          </Button>
        </div>
      </div>

      {/* Grade Table */}
      <div className="teacher-card animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto">
          <table className="w-full teacher-table-zebra">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 font-semibold text-text">Student</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Quiz 1</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Quiz 2</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Assignment 1</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Midterm</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Average</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: any) => {
                const studentGrades = getStudentGrades(student.id, selectedSubject);
                const average = calculateAverage(studentGrades);
                
                return (
                  <tr key={student.id} className="border-b border-border">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-text">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        (studentGrades.quiz1 || 0) >= 80 ? 'text-green-600' :
                        (studentGrades.quiz1 || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {studentGrades.quiz1 || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        (studentGrades.quiz2 || 0) >= 80 ? 'text-green-600' :
                        (studentGrades.quiz2 || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {studentGrades.quiz2 || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        (studentGrades.assignment1 || 0) >= 80 ? 'text-green-600' :
                        (studentGrades.assignment1 || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {studentGrades.assignment1 || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${
                        (studentGrades.midterm || 0) >= 80 ? 'text-green-600' :
                        (studentGrades.midterm || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {studentGrades.midterm || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-lg font-bold ${
                        average >= 80 ? 'text-green-600' :
                        average >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {average > 0 ? `${average}%` : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Edit}
                          className="text-teacher-primary hover:bg-teacher-primary hover:text-white"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowGradeModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Eye}
                          className="text-teacher-primary hover:bg-teacher-primary hover:text-white"
                        >
                          View
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

      {/* Grade Entry Modal */}
      <Modal 
        isOpen={showGradeModal} 
        onClose={() => setShowGradeModal(false)} 
        title={`Edit Grades - ${selectedStudent?.name}`}
        size="lg"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="text-center">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              />
              <h3 className="text-xl font-bold text-text">{selectedStudent.name}</h3>
              <p className="text-text-secondary">{selectedSubject} Grades</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['quiz1', 'quiz2', 'assignment1', 'midterm'].map((assessment) => {
                const currentGrade = getStudentGrades(selectedStudent.id, selectedSubject)[assessment] || '';
                
                return (
                  <div key={assessment}>
                    <label className="block text-sm font-medium text-text mb-2 capitalize">
                      {assessment.replace(/(\d+)/, ' $1')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={currentGrade}
                      onChange={(e) => handleUpdateGrade(selectedStudent.id, assessment, parseInt(e.target.value))}
                      className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
                      placeholder="Enter grade (0-100)"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowGradeModal(false)}>
                Cancel
              </Button>
              <Button icon={Save} onClick={() => setShowGradeModal(false)} className="btn-teacher-primary">
                Save Grades
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};