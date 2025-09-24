import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GuardianHome } from './GuardianHome';
import { ChildProgress } from './ChildProgress';
import { GuardianAchievements } from './GuardianAchievements';
import { GuardianMessages } from './GuardianMessages';
import { ParentingResources } from './ParentingResources';
import { CommunityHub } from './CommunityHub';

export const GuardianRoutes: React.FC = () => {
  return (
    <div className="guardian-content-wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/guardian/home" replace />} />
        <Route path="/home" element={<GuardianHome />} />
        <Route path="/progress" element={<ChildProgress />} />
        <Route path="/achievements" element={<GuardianAchievements />} />
        <Route path="/messages" element={<GuardianMessages />} />
        <Route path="/resources" element={<ParentingResources />} />
        <Route path="/resources" element={<ParentingResources />} />
        <Route path="/community" element={<CommunityHub />} />
      </Routes>
    </div>
  );
};