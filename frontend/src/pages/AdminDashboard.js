import React from 'react';
import { Users, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
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
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-xs text-green-600">+12% from last month</p>
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
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-xs text-gray-500">Awaiting review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-xs text-green-600">+5 this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Help Requests</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-xs text-orange-600">3 urgent</p>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">JD</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="text-sm text-gray-500">john.doe@email.com</p>
                        <p className="text-xs text-gray-400">Applied 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn btn-primary px-3 py-1 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button className="btn btn-outline px-3 py-1 text-sm text-red-600">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">SA</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Sarah Anderson</p>
                        <p className="text-sm text-gray-500">sarah.a@email.com</p>
                        <p className="text-xs text-gray-400">Applied 3 days ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn btn-primary px-3 py-1 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button className="btn btn-outline px-3 py-1 text-sm text-red-600">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">MJ</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Michael Johnson</p>
                        <p className="text-sm text-gray-500">michael.j@email.com</p>
                        <p className="text-xs text-gray-400">Applied 1 week ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn btn-primary px-3 py-1 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button className="btn btn-outline px-3 py-1 text-sm text-red-600">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="bg-white shadow rounded-lg mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">System Overview</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">User Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Users</span>
                        <span className="text-sm font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="text-sm font-medium text-green-600">892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Approval</span>
                        <span className="text-sm font-medium text-yellow-600">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admins</span>
                        <span className="text-sm font-medium">5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Content Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Job Posts</span>
                        <span className="text-sm font-medium">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Events</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Help Requests</span>
                        <span className="text-sm font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Vision Ideas</span>
                        <span className="text-sm font-medium">15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full btn btn-primary text-left">
                    <Users className="w-4 h-4 inline mr-2" />
                    Manage Users
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Review Jobs
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Create Event
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Help Requests
                  </button>
                  <button className="w-full btn btn-outline text-left">
                    <Settings className="w-4 h-4 inline mr-2" />
                    System Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">New user registration</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Job posted by Tech Corp</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Help request created</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Vision idea submitted</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
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

export default AdminDashboard;
