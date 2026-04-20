import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, Filter, AlertTriangle, Clock, CheckCircle, XCircle, Loader, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { helpRequestService } from '../services/helpRequestService';
import { authService } from '../services/authService';

const HelpRequests = () => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    help_type: '',
    urgency_level: '',
    status: 'verified'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState(null);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    help_type: 'medical',
    urgency_level: 'medium',
    amount_needed: ''
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchHelpRequests();
    checkUserRole();
  }, [page, filters]);

  const checkUserRole = () => {
    const user = authService.getCurrentUser();
    setUserRole(user?.role || 'visitor');
  };

  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await helpRequestService.getHelpRequests({
        search: searchTerm,
        page,
        limit: 20,
        ...filters
      });
      setHelpRequests(data.help_requests || data);
      if (data.pagination) {
        setTotalPages(data.pagination.total_pages || 1);
      }
    } catch (err) {
      console.error('Error fetching help requests:', err);
      setError('Failed to load help requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHelpRequests();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();
    try {
      setPosting(true);
      setError(null);
      await helpRequestService.createHelpRequest(newRequest);
      setShowPostForm(false);
      setNewRequest({
        title: '',
        description: '',
        help_type: 'medical',
        urgency_level: 'medium',
        amount_needed: ''
      });
      await fetchHelpRequests();
    } catch (err) {
      console.error('Error posting help request:', err);
      setError('Failed to post help request');
    } finally {
      setPosting(false);
    }
  };

  const handleSupport = async (helpRequestId) => {
    try {
      setError(null);
      await helpRequestService.supportHelpRequest(helpRequestId);
      await fetchHelpRequests();
    } catch (err) {
      console.error('Error supporting help request:', err);
      setError('Failed to support help request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help Requests</h1>
                <p className="text-gray-600">Support fellow alumni in times of need</p>
              </div>
              {(userRole === 'member' || userRole === 'admin' || userRole === 'authority') && (
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request Help
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Help Request Form */}
      {showPostForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Help Request</h2>
            <form onSubmit={handlePostRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Help Type</label>
                  <select
                    value={newRequest.help_type}
                    onChange={(e) => setNewRequest({...newRequest, help_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="medical">Medical</option>
                    <option value="financial">Financial</option>
                    <option value="educational">Educational</option>
                    <option value="family">Family Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    value={newRequest.urgency_level}
                    onChange={(e) => setNewRequest({...newRequest, urgency_level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Needed (BDT)</label>
                  <input
                    type="number"
                    value={newRequest.amount_needed}
                    onChange={(e) => setNewRequest({...newRequest, amount_needed: e.target.value})}
                    placeholder="e.g., 50000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={posting}
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {posting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search help requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={toggleFilters}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Help Type</label>
                  <select
                    value={filters.help_type}
                    onChange={(e) => handleFilterChange('help_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="medical">Medical</option>
                    <option value="financial">Financial</option>
                    <option value="educational">Educational</option>
                    <option value="family">Family Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    value={filters.urgency_level}
                    onChange={(e) => handleFilterChange('urgency_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Help Requests List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-purple-600 animate-spin mr-2" />
            <span className="text-gray-600">Loading help requests...</span>
          </div>
        ) : helpRequests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No help requests found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpRequests.map((request) => (
                <div key={request.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 capitalize">
                        {request.help_type}
                      </span>
                    </div>
                    {request.verification_status === 'verified' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {request.verification_status === 'pending' && (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    {request.verification_status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{request.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <AlertTriangle className={`w-4 h-4 mr-1 ${
                        request.urgency_level === 'critical' ? 'text-red-600' :
                        request.urgency_level === 'high' ? 'text-orange-600' :
                        request.urgency_level === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                      <span className="capitalize">{request.urgency_level}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {request.amount_needed && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-gray-600">Needed: {request.amount_needed}</span>
                      </div>
                      {request.amount_raised && (
                        <div className="flex items-center text-sm">
                          <span className="text-green-600">Raised: {request.amount_raised}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      request.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                    {request.verification_status === 'verified' && request.status === 'active' && (userRole === 'member' || userRole === 'admin' || userRole === 'authority') && (
                      <button
                        onClick={() => handleSupport(request.id)}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Support
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 border rounded-lg ${
                      page === pageNum
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HelpRequests;
