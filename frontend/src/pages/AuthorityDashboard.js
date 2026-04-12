import React from 'react';
import { Users, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings, Shield, Crown, CheckCircle, XCircle, AlertTriangle, Database, Key } from 'lucide-react';

const AuthorityDashboard = () => {
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
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Super Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">System Alerts</h3>
              <p className="text-sm text-red-700 mt-1">3 critical issues require attention</p>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">5,678</p>
                <p className="text-xs text-green-600">+18% growth</p>
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
                <p className="text-2xl font-bold text-gray-900">87/100</p>
                <p className="text-xs text-orange-600">87% capacity</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-green-600">Optimal</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Key className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
                <p className="text-xs text-green-600">All systems secure</p>
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
                    <span className="text-sm text-gray-500">87/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Admin User</p>
                        <p className="text-sm text-gray-500">admin@bilbilash.edu</p>
                        <p className="text-xs text-gray-400">Last active: 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn btn-outline px-3 py-1 text-sm text-red-600">
                        Demote
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">System Admin</p>
                        <p className="text-sm text-gray-500">system@bilbilash.edu</p>
                        <p className="text-xs text-gray-400">Last active: 1 day ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn btn-outline px-3 py-1 text-sm text-red-600">
                        Demote
                      </button>
                    </div>
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
                    <p className="text-sm text-gray-500">5,678 users</p>
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
                  <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">High memory usage</p>
                        <p className="text-sm text-red-700">Server memory at 92% capacity</p>
                      </div>
                      <button className="btn btn-primary px-3 py-1 text-sm">
                        Investigate
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-yellow-900">Pending user approvals</p>
                        <p className="text-sm text-yellow-700">47 users awaiting approval</p>
                      </div>
                      <button className="btn btn-primary px-3 py-1 text-sm">
                        Review
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-900">Admin capacity warning</p>
                        <p className="text-sm text-orange-700">87% of admin slots used</p>
                      </div>
                      <button className="btn btn-primary px-3 py-1 text-sm">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Authority Actions */}
            <div className="bg-white shadow rounded-lg border-l-4 border-purple-500">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Authority Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full btn btn-primary text-left">
                    <Crown className="w-4 h-4 inline mr-2" />
                    Promote to Admin
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Demote Admin
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Users className="w-4 h-4 inline mr-2" />
                    Bulk User Actions
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Database className="w-4 h-4 inline mr-2" />
                    System Maintenance
                  </button>
                  <button className="w-full btn btn-outline text-left text-red-600">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Emergency Controls
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">System Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Server</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">78% Full</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Security</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backups</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Current</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Authority Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Promoted user to admin</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">System backup completed</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Security audit passed</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Database optimization</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
