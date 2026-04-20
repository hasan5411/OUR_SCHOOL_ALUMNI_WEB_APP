import api from './api';

export const userService = {
  // Get current user profile
  getCurrentProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Search alumni
  searchAlumni: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.role) params.append('role', filters.role);
    if (filters.is_approved !== undefined) params.append('is_approved', filters.is_approved);
    
    const response = await api.get(`/users/search?${params}`);
    return response.data;
  },

  // Get user by ID (admin/authority only)
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  // Update user by ID (admin/authority only)
  updateUserById: async (userId, userData) => {
    const response = await api.put(`/users/${userId}/profile`, userData);
    return response.data;
  }
};
