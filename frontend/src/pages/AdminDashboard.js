import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings, Shield, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { roleService } from '../services/roleService';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalMembers: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [users, roleStats] = await Promise.all([
        roleService.getPendingUsers().catch(() => []),
        roleService.getRoleStats().catch(() => ({ total_users: 0, pending_users: 0, total_admins: 0, active_members: 0 }))
      ]);

      setPendingUsers(users);
      setStats({
        totalUsers: roleStats.total_users || 0,
        pendingApprovals: roleStats.pending_users || 0,
        totalMembers: roleStats.active_members || 0,
        totalJobs: 0 // Will be updated when job stats are implemented
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      setApproving(userId);
      await roleService.approveUser(userId, { role_id: null });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user');
    } finally {
      setApproving(null);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      setApproving(userId);
      await roleService.rejectUser(userId, { reason: 'Rejected by admin' });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user');
    } finally {
      setApproving(null);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage alumni association and system administration</p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600">Registered users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                <p className="text-xs text-orange-600">Awaiting review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                <p className="text-xs text-green-600">Approved users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Job Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-xs text-gray-500">Total opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Pending User Approvals</h2>
              </div>
              <div className="p-6">
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No pending approvals</p>
                    <p className="text-sm">All users have been reviewed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">
                              Applied {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveUser(user.id)}
                            disabled={approving === user.id}
                            className="btn btn-primary px-3 py-1 text-sm disabled:opacity-50"
                          >
                            {approving === user.id ? (
                              <Loader className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectUser(user.id)}
                            disabled={approving === user.id}
                            className="btn btn-outline px-3 py-1 text-sm text-red-600 disabled:opacity-50"
                          >
                            {approving === user.id ? (
                              <Loader className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
