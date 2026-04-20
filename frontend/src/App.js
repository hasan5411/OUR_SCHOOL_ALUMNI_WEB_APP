import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AlumniDirectory from './pages/AlumniDirectory';
import JobBoard from './pages/JobBoard';
import HelpRequests from './pages/HelpRequests';
import VisionIdeas from './pages/VisionIdeas';
import Profile from './pages/Profile';
import Donations from './pages/Donations';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected dashboard routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/authority" 
              element={
                <ProtectedRoute requireApproved={false}>
                  <Layout><AuthorityDashboard /></Layout>
                </ProtectedRoute>
              } 
            />

            {/* Additional protected routes */}
            <Route 
              path="/alumni-directory" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><AlumniDirectory /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><JobBoard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/help-requests" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><HelpRequests /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vision-ideas" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><VisionIdeas /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donations" 
              element={
                <ProtectedRoute requireApproved={true}>
                  <Layout><Donations /></Layout>
                </ProtectedRoute>
              } 
            />

            {/* 404 route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
