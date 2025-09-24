import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TeacherDashboard } from './TeacherDashboard';
import { ClassroomManager } from './ClassroomManager';
import { ContentCreator } from './ContentCreator';
import { GradeBook } from './GradeBook';
import { AttendanceTracker } from './AttendanceTracker';
import { Analytics } from './Analytics';
import { ParentCommunication } from './ParentCommunication';
import { ProfessionalDevelopment } from './ProfessionalDevelopment';

export const TeacherRoutes: React.FC = () => {
  return (
    <div className="teacher-content-wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/classroom" element={<ClassroomManager />} />
        <Route path="/content" element={<ContentCreator />} />
        <Route path="/gradebook" element={<GradeBook />} />
        <Route path="/attendance" element={<AttendanceTracker />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/communication" element={<ParentCommunication />} />
        <Route path="/development" element={<ProfessionalDevelopment />} />
      </Routes>
    </div>
  );
};