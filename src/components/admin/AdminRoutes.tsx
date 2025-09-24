import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { ContentManagement } from './ContentManagement';
import { SystemMonitoring } from './SystemMonitoring';
import { SystemAnalytics } from './SystemAnalytics';
import { AdminSettings } from './AdminSettings';

export const AdminRoutes: React.FC = () => {
  return (
    <div className="admin-content-wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/monitoring" element={<SystemMonitoring />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
};