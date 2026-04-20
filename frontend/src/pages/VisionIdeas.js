import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Search, Filter, ThumbsUp, Clock, CheckCircle, XCircle, Loader, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { visionService } from '../services/visionService';
import { authService } from '../services/authService';

const VisionIdeas = () => {
  const [visions, setVisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: 'approved'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState(null);

  const [newVision, setNewVision] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    priority_level: 'medium'
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchVisions();
    checkUserRole();
  }, [page, filters]);

  const checkUserRole = () => {
    const user = authService.getCurrentUser();
    setUserRole(user?.role || 'visitor');
  };

  const fetchVisions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await visionService.getVisions({
        search: searchTerm,
        page,
        limit: 20,
        ...filters
      });
      setVisions(data.visions || data);
      if (data.pagination) {
        setTotalPages(data.pagination.total_pages || 1);
      }
    } catch (err) {
      console.error('Error fetching visions:', err);
      setError('Failed to load vision ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVisions();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePostVision = async (e) => {
    e.preventDefault();
    try {
      setPosting(true);
      setError(null);
      await visionService.createVision(newVision);
      setShowPostForm(false);
      setNewVision({
        title: '',
        description: '',
        category: 'infrastructure',
        priority_level: 'medium'
      });
      await fetchVisions();
    } catch (err) {
      console.error('Error posting vision:', err);
      setError('Failed to post vision idea');
    } finally {
      setPosting(false);
    }
  };

  const handleSupport = async (visionId) => {
    try {
      setError(null);
      await visionService.voteVision(visionId, { vote_type: 'support' });
      await fetchVisions();
    } catch (err) {
      console.error('Error supporting vision:', err);
      setError('Failed to support vision idea');
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
                <h1 className="text-2xl font-bold text-gray-900">Vision & Ideas</h1>
                <p className="text-gray-600">Share your vision for Bilbilash Secondary School's future</p>
              </div>
              {(userRole === 'member' || userRole === 'admin' || userRole === 'authority') && (
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Idea
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Vision Form */}
      {showPostForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a New Vision Idea</h2>
            <form onSubmit={handlePostVision}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newVision.title}
                    onChange={(e) => setNewVision({...newVision, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newVision.description}
                    onChange={(e) => setNewVision({...newVision, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newVision.category}
                    onChange={(e) => setNewVision({...newVision, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="community">Community</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <select
                    value={newVision.priority_level}
                    onChange={(e) => setNewVision({...newVision, priority_level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                    'Submit Idea'
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
                  placeholder="Search vision ideas..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="community">Community</option>
                    <option value="other">Other</option>
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
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
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

      {/* Vision Ideas List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-purple-600 animate-spin mr-2" />
            <span className="text-gray-600">Loading vision ideas...</span>
          </div>
        ) : visions.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No vision ideas found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visions.map((vision) => (
                <div key={vision.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 capitalize">
                        {vision.category}
                      </span>
                    </div>
                    {vision.status === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {vision.status === 'pending' && (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    {vision.status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{vision.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{vision.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {vision.support_count || 0} supports
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(vision.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      vision.priority_level === 'high' ? 'bg-red-100 text-red-800' :
                      vision.priority_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {vision.priority_level} priority
                    </span>
                    {vision.status === 'approved' && (userRole === 'member' || userRole === 'admin' || userRole === 'authority') && (
                      <button
                        onClick={() => handleSupport(vision.id)}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
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

export default VisionIdeas;
