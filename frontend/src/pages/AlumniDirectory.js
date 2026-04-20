import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { userService } from '../services/userService';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    is_approved: true
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAlumni();
  }, [page, filters]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.searchAlumni({
        search: searchTerm,
        page,
        limit: 20,
        ...filters
      });
      setAlumni(data.users || data);
      if (data.pagination) {
        setTotalPages(data.pagination.total_pages || 1);
      }
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError('Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAlumni();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Alumni Directory</h1>
            <p className="text-gray-600">Connect with fellow alumni from Bilbilash Secondary School</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, profession, institute..."
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

          {/* Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="authority">Authority</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>

                {/* Approval Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status
                  </label>
                  <select
                    value={filters.is_approved}
                    onChange={(e) => handleFilterChange('is_approved', e.target.value === 'true' ? true : e.target.value === 'false' ? false : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                  </select>
                </div>

                {/* Blood Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={filters.blood_group}
                    onChange={(e) => handleFilterChange('blood_group', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Blood Groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* SSC Batch Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSC Batch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2010"
                    value={filters.ssc_batch}
                    onChange={(e) => handleFilterChange('ssc_batch', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({ role: '', is_approved: true });
                    setSearchTerm('');
                    setPage(1);
                    fetchAlumni();
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
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

      {/* Alumni List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-purple-600 animate-spin mr-2" />
            <span className="text-gray-600">Loading alumni...</span>
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No alumni found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((alumnus) => (
                <div key={alumnus.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {alumnus.profile_image_url ? (
                        <img
                          src={alumnus.profile_image_url}
                          alt={alumnus.first_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {alumnus.first_name} {alumnus.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{alumnus.email}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alumnus.is_approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alumnus.is_approved ? 'Approved' : 'Pending'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {alumnus.roles?.name || 'Visitor'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {alumnus.profession && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        {alumnus.profession}
                      </div>
                    )}
                    {alumnus.institute && (
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                        {alumnus.institute}
                      </div>
                    )}
                    {alumnus.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {alumnus.phone}
                      </div>
                    )}
                    {alumnus.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {alumnus.address}
                      </div>
                    )}
                    {alumnus.blood_group && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          {alumnus.blood_group}
                        </span>
                      </div>
                    )}
                    {alumnus.ssc_batch && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-gray-400">SSC Batch:</span>
                        <span className="ml-1 font-medium">{alumnus.ssc_batch}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Joined {new Date(alumnus.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => window.location.href = `/alumni/${alumnus.id}`}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      View Profile
                    </button>
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

export default AlumniDirectory;
