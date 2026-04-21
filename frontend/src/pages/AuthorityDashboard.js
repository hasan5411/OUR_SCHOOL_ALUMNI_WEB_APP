import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings, Shield, Crown, CheckCircle, XCircle, AlertTriangle, Database, Key, Loader, RefreshCw } from 'lucide-react';
import { roleService } from '../services/roleService';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { visionService } from '../services/visionService';
import { helpRequestService } from '../services/helpRequestService';

const AuthorityDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalAdmins: 0,
    activeMembers: 0,
    totalJobs: 0,
    totalVisions: 0,
    totalHelpRequests: 0,
    totalPayments: 0
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [roleStats, pendingData, adminsData, jobStats, visionStats, helpStats] = await Promise.all([
        roleService.getRoleStats().catch(() => ({ total_users: 0, pending_users: 0, total_admins: 0, active_members: 0 })),
        roleService.getPendingUsers().catch(() => []),
        roleService.getAdmins().catch(() => []),
        jobService.getJobStats().catch(() => ({ totalJobs: 0, pendingJobs: 0 })),
        visionService.getVisionStats().catch(() => ({ totalVisions: 0, pendingVisions: 0 })),
        helpRequestService.getHelpRequestStats().catch(() => ({ totalRequests: 0, pendingRequests: 0 }))
      ]);

      setStats({
        totalUsers: roleStats.total_users || 0,
        pendingUsers: roleStats.pending_users || 0,
        totalAdmins: roleStats.total_admins || 0,
        activeMembers: roleStats.active_members || 0,
        totalJobs: jobStats.totalJobs || 0,
        totalVisions: visionStats.totalVisions || 0,
        totalHelpRequests: helpStats.totalRequests || 0
      });
      setPendingUsers(pendingData);
      setAdmins(adminsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      setActionLoading(userId);
      await roleService.approveUser(userId, { role_id: null });
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      await fetchDashboardData();
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      setActionLoading(userId);
      await roleService.rejectUser(userId, { reason: 'Rejected by authority' });
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      await fetchDashboardData();
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      setActionLoading(userId);
      await roleService.promoteToAdmin(userId, { reason: 'Promoted by authority' });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error promoting user:', err);
      setError('Failed to promote user to admin');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteToMember = async (userId) => {
    try {
      setActionLoading(userId);
      await roleService.demoteToMember(userId, { reason: 'Demoted by authority' });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error demoting user:', err);
      setError('Failed to demote admin');
    } finally {
      setActionLoading(null);
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
                <h1 className="text-2xl font-bold text-gray-900">Authority Dashboard</h1>
                <p className="text-gray-600">System administration and super admin controls</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchDashboardData}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Super Administrator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* System Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Count</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}/100</p>
                <p className="text-xs text-orange-600">{Math.round((stats.totalAdmins / 100) * 100)}% capacity</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
                <p className="text-xs text-green-600">Approved users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Key className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingUsers}</p>
                <p className="text-xs text-orange-600">Awaiting approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Admin Management */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Administrator Management</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Admin Capacity</span>
                    <span className="text-sm text-gray-500">{stats.totalAdmins}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(stats.totalAdmins / 100) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {admins.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No administrators found</p>
                  ) : (
                    admins.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{admin.first_name} {admin.last_name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                            <p className="text-xs text-gray-400">Role: {admin.roles?.name}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {actionLoading === admin.id ? (
                            <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                          ) : (
                            <button
                              onClick={() => handleDemoteToMember(admin.id)}
                              className="btn btn-outline px-3 py-1 text-sm text-red-600"
                            >
                              Demote
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Users Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Pending Users</h2>
                <p className="text-sm text-gray-500">Users awaiting approval</p>
              </div>
              <div className="p-6">
                {pendingUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No pending users</p>
                ) : (
                  <div className="space-y-3">
                    {pendingUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-1">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2 ml-2">
                            {actionLoading === user.id ? (
                              <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                            ) : (
                              <>
                                <button
                                  onClick={() => handleApproveUser(user.id)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectUser(user.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingUsers.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{pendingUsers.length - 5} more pending users
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Controls */}
        <div className="bg-white shadow rounded-lg mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Controls</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Database className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Database Backup</p>
                <p className="text-sm text-gray-500">Last: 2 hours ago</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Shield className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Security Audit</p>
                <p className="text-sm text-gray-500">Run scan</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">User Management</p>
                <p className="text-sm text-gray-500">{stats.totalUsers} users</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Key className="w-6 h-6 text-orange-600 mb-2" />
                <p className="font-medium text-gray-900">API Keys</p>
                <p className="text-sm text-gray-500">Manage access</p>
              </button>
            </div>
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white shadow rounded-lg mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Critical Issues</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.pendingUsers > 0 && (
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-900">Pending user approvals</p>
                      <p className="text-sm text-yellow-700">{stats.pendingUsers} users awaiting approval</p>
                    </div>
                    <button className="btn btn-primary px-3 py-1 text-sm">
                      Review
                    </button>
                  </div>
                </div>
              )}
              
              {stats.totalAdmins >= 100 && (
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-900">Admin capacity warning</p>
                      <p className="text-sm text-orange-700">100% of admin slots used</p>
                    </div>
                    <button className="btn btn-primary px-3 py-1 text-sm">
                      Manage
                    </button>
                  </div>
                </div>
              )}

              {stats.pendingUsers === 0 && stats.totalAdmins < 3 && (
                <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">System healthy</p>
                      <p className="text-sm text-green-700">All systems operating normally</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
