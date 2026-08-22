import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumesPage from './pages/ResumesPage';
import UploadResumePage from './pages/UploadResumePage';
import JobMatchingPage from './pages/JobMatchingPage';
import SkillGapPage from './pages/SkillGapPage';
import InterviewPage from './pages/InterviewPage';
import TrackerPage from './pages/TrackerPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import DesignSystemPage from './pages/DesignSystemPage';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/resumes/upload" element={<UploadResumePage />} />
            <Route path="/jobs" element={<JobMatchingPage />} />
            <Route path="/skills" element={<SkillGapPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/applications" element={<TrackerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
