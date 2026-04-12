import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlumniDirectory from './pages/AlumniDirectory';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import NotFound from './pages/NotFound';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/alumni" element={<Layout><AlumniDirectory /></Layout>} />
                <Route path="/events" element={<Layout><Events /></Layout>} />
                <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
                <Route path="/jobs" element={<Layout><Jobs /></Layout>} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout><Profile /></Layout>
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout><AdminDashboard /></Layout>
                  </ProtectedRoute>
                } />

                {/* Authority routes */}
                <Route path="/authority/*" element={
                  <ProtectedRoute requiredRole="authority">
                    <Layout><AuthorityDashboard /></Layout>
                  </ProtectedRoute>
                } />

                {/* 404 route */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
