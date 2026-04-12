import React from 'react';
import { User, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening in your alumni community.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Job Applications</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events Attended</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Help Requests</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">You applied for <span className="font-medium">Senior Developer</span> position</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">You supported <span className="font-medium">Help Request: Medical Fund</span></p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">You registered for <span className="font-medium">Annual Reunion 2024</span></p>
                      <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Your profile was viewed by <span className="font-medium">5 alumni</span></p>
                      <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900">Browse Jobs</p>
                    <p className="text-sm text-gray-500">Find opportunities</p>
                  </button>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-900">Upcoming Events</p>
                    <p className="text-sm text-gray-500">Join events</p>
                  </button>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <Heart className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="font-medium text-gray-900">Help Requests</p>
                    <p className="text-sm text-gray-500">Support alumni</p>
                  </button>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <User className="w-6 h-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900">Find Alumni</p>
                    <p className="text-sm text-gray-500">Connect network</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">3 new job matches</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Event tomorrow</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Profile update needed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium text-gray-900">Annual Reunion</p>
                    <p className="text-sm text-gray-500">Dec 15, 2024</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium text-gray-900">Career Workshop</p>
                    <p className="text-sm text-gray-500">Dec 20, 2024</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-medium text-gray-900">Alumni Meetup</p>
                    <p className="text-sm text-gray-500">Jan 5, 2025</p>
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

export default Dashboard;
