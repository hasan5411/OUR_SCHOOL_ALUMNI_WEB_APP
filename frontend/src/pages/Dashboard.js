import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings, Loader } from 'lucide-react';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { helpRequestService } from '../services/helpRequestService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    jobPosts: 0,
    helpRequests: 0,
    visionIdeas: 0,
    applications: 0,
    eventsAttended: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({}); // For debugging
  const [showDebug, setShowDebug] = useState(false); // Toggle debug panel

  // Wrap fetchDashboardData in useCallback to avoid re-creation on every render
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Dashboard] Fetching dashboard data...');

      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      // Fetch all data in parallel
      const [statsRes, jobsRes, helpRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/jobs/my-applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/help-requests/my-requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        userService.getCurrentProfile().catch(() => null)
      ]);

      // Parse stats response
      const statsData = await statsRes.json();
      console.log('[Dashboard] Stats response:', statsData);

      // Parse jobs applications response
      const jobsData = await jobsRes.json();
      console.log('[Dashboard] Jobs applications response:', jobsData);
      const applicationsCount = jobsData?.applications?.length || jobsData?.data?.applications?.length || jobsData?.data?.length || 0;

      // Parse help requests response
      const helpData = await helpRes.json();
      console.log('[Dashboard] Help requests response:', helpData);
      console.log('[Dashboard] Help requests data structure:', {
        hasData: !!helpData,
        hasDataData: !!helpData?.data,
        hasHelpRequests: !!helpData?.data?.helpRequests,
        isArray: Array.isArray(helpData?.data?.helpRequests),
        arrayLength: Array.isArray(helpData?.data?.helpRequests) ? helpData.data.helpRequests.length : 'N/A'
      });
      const helpRequestsArray = helpData?.data?.helpRequests || helpData?.data || [];
      const helpRequestsCount = Array.isArray(helpRequestsArray) ? helpRequestsArray.length : 0;

      // Update stats with real data
      if (statsData.success) {
        setStats({
          jobPosts: statsData.data.jobPosts || 0,
          helpRequests: statsData.data.helpRequests || 0,
          visionIdeas: statsData.data.visionIdeas || 0,
          applications: applicationsCount,
          eventsAttended: 0 // Will be implemented when events feature is ready
        });
      } else {
        setError(statsData.message || 'Failed to load dashboard stats');
      }

      // Update debug info
      setDebugInfo({
        stats: statsData,
        jobs: jobsData,
        help: helpData,
        profile: profileRes,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('[Dashboard] Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    console.log('[Dashboard] Manual refresh triggered');
    fetchDashboardData();
  };

  // fetchDashboardData is now wrapped in useCallback above

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Member Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's what's happening in your alumni community.</p>
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn btn-secondary px-4 py-2 flex items-center gap-2"
              >
                <Loader className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></div>
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <p className="text-xs text-red-600 mt-1">Check browser console (F12) for detailed error logs.</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
        {showDebug && (
          <div className="mt-2 p-4 bg-slate-800 rounded-xl text-xs font-mono text-green-400 overflow-auto max-h-96">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Job Posts</p>
                <p className="text-2xl font-bold text-slate-900">{stats.jobPosts}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Applications</p>
                <p className="text-2xl font-bold text-slate-900">{stats.applications}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full">
                <Heart className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Help Requests</p>
                <p className="text-2xl font-bold text-slate-900">{stats.helpRequests}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Vision Ideas</p>
                <p className="text-2xl font-bold text-slate-900">{stats.visionIdeas}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Events Attended</p>
                <p className="text-2xl font-bold text-slate-900">{stats.eventsAttended}</p>
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
                  {/* TODO: Replace with real recent activity from API if available */}
                  <div className="text-sm text-gray-500">No recent activity to display.</div>
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
                  <Link to="/jobs" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900">Browse Jobs</p>
                    <p className="text-sm text-gray-500">Find opportunities</p>
                  </Link>
                  
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-900">Upcoming Events</p>
                    <p className="text-sm text-gray-500">Join events</p>
                  </button>
                  
                  <Link to="/help-requests" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <Heart className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="font-medium text-gray-900">Help Requests</p>
                    <p className="text-sm text-gray-500">Support alumni</p>
                  </Link>
                  
                  <Link to="/alumni-directory" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                    <User className="w-6 h-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900">Find Alumni</p>
                    <p className="text-sm text-gray-500">Connect network</p>
                  </Link>
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
