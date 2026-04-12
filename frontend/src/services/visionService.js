import api from './api';

export const visionService = {
  // Get vision ideas
  getVisions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority_level) params.append('priority_level', filters.priority_level);
    if (filters.status) params.append('status', filters.status);
    
    const response = await api.get(`/visions?${params}`);
    return response.data;
  },

  // Get single vision idea
  getVisionById: async (visionId) => {
    const response = await api.get(`/visions/${visionId}`);
    return response.data;
  },

  // Create vision idea
  createVision: async (visionData) => {
    const response = await api.post('/visions', visionData);
    return response.data;
  },

  // Update vision idea
  updateVision: async (visionId, visionData) => {
    const response = await api.put(`/visions/${visionId}`, visionData);
    return response.data;
  },

  // Delete vision idea
  deleteVision: async (visionId) => {
    const response = await api.delete(`/visions/${visionId}`);
    return response.data;
  },

  // Approve vision idea (admin only)
  approveVision: async (visionId, approvalData) => {
    const response = await api.put(`/visions/${visionId}/approve`, approvalData);
    return response.data;
  },

  // Reject vision idea (admin only)
  rejectVision: async (visionId, rejectionData) => {
    const response = await api.put(`/visions/${visionId}/reject`, rejectionData);
    return response.data;
  },

  // Update vision progress
  updateProgress: async (visionId, progressData) => {
    const response = await api.put(`/visions/${visionId}/progress`, progressData);
    return response.data;
  },

  // Vote on vision idea (support/oppose)
  voteVision: async (visionId, voteData) => {
    const response = await api.post(`/visions/${visionId}/vote`, voteData);
    return response.data;
  },

  // Get user's vision ideas
  getUserVisions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    
    const response = await api.get(`/visions/my-visions?${params}`);
    return response.data;
  },

  // Get vision statistics (admin only)
  getVisionStats: async () => {
    const response = await api.get('/visions/stats');
    return response.data;
  }
};
