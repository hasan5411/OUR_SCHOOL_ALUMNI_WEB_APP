import api from './api';

export const helpRequestService = {
  // Get help requests
  getHelpRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.help_type) params.append('help_type', filters.help_type);
    if (filters.urgency_level) params.append('urgency_level', filters.urgency_level);
    if (filters.status) params.append('status', filters.status);
    if (filters.verification_status) params.append('verification_status', filters.verification_status);
    if (filters.show_closed) params.append('show_closed', filters.show_closed);
    
    const response = await api.get(`/help-requests?${params}`);
    return response.data;
  },

  // Get single help request
  getHelpRequestById: async (helpRequestId) => {
    const response = await api.get(`/help-requests/${helpRequestId}`);
    return response.data;
  },

  // Create help request
  createHelpRequest: async (helpRequestData) => {
    const response = await api.post('/help-requests', helpRequestData);
    return response.data;
  },

  // Update help request
  updateHelpRequest: async (helpRequestId, helpRequestData) => {
    const response = await api.put(`/help-requests/${helpRequestId}`, helpRequestData);
    return response.data;
  },

  // Delete help request
  deleteHelpRequest: async (helpRequestId) => {
    const response = await api.delete(`/help-requests/${helpRequestId}`);
    return response.data;
  },

  // Verify help request (admin only)
  verifyHelpRequest: async (helpRequestId, verificationData) => {
    const response = await api.put(`/help-requests/${helpRequestId}/verify`, verificationData);
    return response.data;
  },

  // Approve help request (admin only)
  approveHelpRequest: async (helpRequestId, approvalData) => {
    const response = await api.put(`/help-requests/${helpRequestId}/approve`, approvalData);
    return response.data;
  },

  // Resolve help request
  resolveHelpRequest: async (helpRequestId, resolutionData) => {
    const response = await api.put(`/help-requests/${helpRequestId}/resolve`, resolutionData);
    return response.data;
  },

  // Update amount raised
  updateAmountRaised: async (helpRequestId, amountData) => {
    const response = await api.put(`/help-requests/${helpRequestId}/amount`, amountData);
    return response.data;
  },

  // Support help request
  supportHelpRequest: async (helpRequestId) => {
    const response = await api.post(`/help-requests/${helpRequestId}/support`);
    return response.data;
  },

  // Get user's help requests
  getUserHelpRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);
    if (filters.help_type) params.append('help_type', filters.help_type);
    
    const response = await api.get(`/help-requests/my-requests?${params}`);
    return response.data;
  },

  // Get help request statistics (admin only)
  getHelpRequestStats: async () => {
    const response = await api.get('/help-requests/stats');
    return response.data;
  }
};
