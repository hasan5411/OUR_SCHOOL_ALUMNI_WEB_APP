import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole, requireApproval = true }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user approval is required
  if (requireApproval && !user?.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Account Pending Approval
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Your account is currently pending approval from an administrator. 
            You will receive an email once your account has been approved.
          </p>
          <p className="text-sm text-gray-500 text-center">
            Please contact the alumni association if you have any questions.
          </p>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRole) {
    if (requiredRole === 'admin' && user?.role !== 'admin' && user?.role !== 'authority') {
      return <Navigate to="/dashboard" replace />;
    }
    
    if (requiredRole === 'authority' && user?.role !== 'authority') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
