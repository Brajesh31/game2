import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EnhancedStudentDashboard } from './enhanced/StudentDashboard';
import { EnhancedMyQuests } from './enhanced/MyQuests';
import { QuestInterface } from './QuestInterface';
import { Achievements } from './Achievements';
import { EnhancedLabs } from './enhanced/Labs';
import { Collaborate } from './Collaborate';
import { AITutor } from './AITutor';
import { EnhancedSubjects } from './enhanced/Subjects';
import { EnhancedSubjectDetail } from './enhanced/SubjectDetail';
import { AdventurerProfile } from './AdventurerProfile';
import { GamefiedQuestInterface } from './GamefiedQuestInterface';
import { AILearningPath } from './AILearningPath';
import { WorldChallenges } from './WorldChallenges';
import { HallOfFame } from './HallOfFame';
import { JugaadStudio } from './JugaadStudio';
import { AdventureLog } from './AdventureLog';
import { ScienceFair } from './ScienceFair';
import { LearningMetaverse } from './LearningMetaverse';
import { OfflineMode } from './OfflineMode';
import { StudentSettings } from './StudentSettings';
import { StudentClubs } from './StudentClubs';
import { PeerMentorship } from './PeerMentorship';
import { DoubtForum } from './DoubtForum';
import { CommunityShowcase } from './CommunityShowcase';
import { CareerExplorer } from './CareerExplorer';
import { ScholarshipBoard } from './ScholarshipBoard';
import { WellbeingMode } from './WellbeingMode';
import { MeshNetwork } from './MeshNetwork';
import { StudentNet } from './StudentNet';
import WisdomBank from './WisdomBank';
import { ScenarioSimulator } from './ScenarioSimulator';
import { AvatarBuilder } from './AvatarBuilder';
import { GameZone } from './GameZone';
import { SubjectGames } from './SubjectGames';

export const StudentRoutes: React.FC = () => {
  return (
      <div
          className="student-content-wrapper"
          style={{
            backgroundColor: 'var(--student-app-bg)',
            color: 'var(--student-body-text)',
            minHeight: '100vh',
            transition: 'all 0.3s ease'
          }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/dashboard" element={<EnhancedStudentDashboard />} />
          <Route path="/my-quests" element={<EnhancedMyQuests />} />
          <Route path="/quests" element={<QuestInterface />} />
          <Route path="/epic-quests" element={<GamefiedQuestInterface />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/labs" element={<EnhancedLabs />} />
          <Route path="/collaborate" element={<Collaborate />} />
          <Route path="/subjects" element={<EnhancedSubjects />} />
          <Route path="/subjects/:subject" element={<EnhancedSubjectDetail />} />
          <Route path="/clubs" element={<StudentClubs />} />
          <Route path="/mentorship" element={<PeerMentorship />} />
          <Route path="/forum" element={<DoubtForum />} />
          <Route path="/showcase" element={<CommunityShowcase />} />
          <Route path="/profile" element={<AdventurerProfile />} />
          <Route path="/ai-path" element={<AILearningPath />} />
          <Route path="/world-challenges" element={<WorldChallenges />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/jugaad-studio" element={<JugaadStudio />} />
          <Route path="/adventure-log" element={<AdventureLog />} />
          <Route path="/science-fair" element={<ScienceFair />} />
          <Route path="/career-explorer" element={<CareerExplorer />} />
          <Route path="/scholarships" element={<ScholarshipBoard />} />
          <Route path="/wellbeing" element={<WellbeingMode />} />
          <Route path="/mesh-network" element={<MeshNetwork />} />
          <Route path="/studentnet" element={<StudentNet />} />
          <Route path="/wisdom-bank" element={<WisdomBank />} />
          <Route path="/scenario-sim" element={<ScenarioSimulator />} />
          <Route path="/avatar-builder" element={<AvatarBuilder />} />
          <Route path="/game-zone" element={<GameZone />} />
          <Route path="/game-zone/:subject" element={<SubjectGames />} />
          <Route path="/metaverse" element={<LearningMetaverse />} />
          <Route path="/offline" element={<OfflineMode />} />
          <Route path="/settings" element={<StudentSettings />} />
        </Routes>

        {/* AI Tutor - Available on all student pages */}
        <AITutor />
      </div>
  );
};