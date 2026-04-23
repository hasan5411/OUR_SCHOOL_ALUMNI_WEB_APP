import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Calendar, Heart, TrendingUp, Bell, Settings, Loader } from 'lucide-react';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { helpRequestService } from '../services/helpRequestService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    profileViews: 0,
    jobApplications: 0,
    eventsAttended: 0,
    helpRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({}); // For debugging
  const [showDebug, setShowDebug] = useState(false); // Toggle debug panel

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh when window gains focus (after posting data)
    const handleFocus = () => {
      console.log('[Dashboard] Window focused, refreshing data...');
      fetchDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    console.log('[Dashboard] Manual refresh triggered');
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Dashboard] Fetching dashboard data...');

      // Fetch all data in parallel with individual error handling
      const [profileResult, jobAppsResult, helpRequestsResult] = await Promise.all([
        userService.getCurrentProfile()
          .then(data => ({ success: true, data }))
          .catch(err => {
            console.error('[Dashboard] Profile fetch error:', err);
            return { success: false, error: err.message, data: null };
          }),
        
        jobService.getUserApplications()
          .then(data => ({ success: true, data }))
          .catch(err => {
            console.error('[Dashboard] Job applications fetch error:', err);
            return { success: false, error: err.message, data: [] };
          }),
        
        helpRequestService.getUserHelpRequests()
          .then(data => {
            console.log('[Dashboard] Help requests response:', data);
            return { success: true, data };
          })
          .catch(err => {
            console.error('[Dashboard] Help requests fetch error:', err);
            return { success: false, error: err.message, data: { helpRequests: [] } };
          })
      ]);

      // Log debug info
      const debugData = {
        profile: profileResult,
        jobApps: jobAppsResult,
        helpRequests: helpRequestsResult,
        timestamp: new Date().toISOString()
      };
      setDebugInfo(debugData);
      console.log('[Dashboard] Debug info:', debugData);

      // Extract data safely
      const profileData = profileResult.data;
      const jobAppsData = jobAppsResult.data;
      const helpRequestsData = helpRequestsResult.data;

      // Handle different response structures for help requests
      const helpRequestsArray = helpRequestsData?.helpRequests 
        || helpRequestsData?.data?.helpRequests 
        || helpRequestsData?.data 
        || [];

      console.log('[Dashboard] Processed help requests:', helpRequestsArray);

      // Build errors array
      const errors = [];
      if (!profileResult.success) errors.push(`Profile: ${profileResult.error}`);
      if (!jobAppsResult.success) errors.push(`Jobs: ${jobAppsResult.error}`);
      if (!helpRequestsResult.success) errors.push(`Help Requests: ${helpRequestsResult.error}`);

      if (errors.length > 0) {
        setError(`Some data failed to load: ${errors.join(', ')}`);
      }

      // Update stats - preserve previous values if fetch failed
      setStats(prevStats => ({
        profileViews: profileData?.profile_views ?? prevStats.profileViews,
        jobApplications: jobAppsData?.applications?.length ?? jobAppsData?.length ?? prevStats.jobApplications,
        eventsAttended: 0, // Will be implemented when events feature is added
        helpRequests: Array.isArray(helpRequestsArray) ? helpRequestsArray.length : prevStats.helpRequests
      }));

    } catch (err) {
      console.error('[Dashboard] Unexpected error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Profile Views</p>
                <p className="text-2xl font-bold text-slate-900">{stats.profileViews}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Briefcase className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Job Applications</p>
                <p className="text-2xl font-bold text-slate-900">{stats.jobApplications}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full">
                <Calendar className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Events Attended</p>
                <p className="text-2xl font-bold text-slate-900">{stats.eventsAttended}</p>
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
