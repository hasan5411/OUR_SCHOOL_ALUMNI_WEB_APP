import api from './api';

export const paymentService = {
  // Create payment transaction
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Create bKash payment
  createBkashPayment: async (paymentData) => {
    const response = await api.post('/payments/bkash', paymentData);
    return response.data;
  },

  // Create Nagad payment
  createNagadPayment: async (paymentData) => {
    const response = await api.post('/payments/nagad', paymentData);
    return response.data;
  },

  // Get payments (role-based access)
  getPayments: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.payment_type) params.append('payment_type', filters.payment_type);
    if (filters.payment_method) params.append('payment_method', filters.payment_method);
    if (filters.payment_status) params.append('payment_status', filters.payment_status);
    if (filters.student_id) params.append('student_id', filters.student_id);
    if (filters.from_date) params.append('from_date', filters.from_date);
    if (filters.to_date) params.append('to_date', filters.to_date);
    if (filters.min_amount) params.append('min_amount', filters.min_amount);
    if (filters.max_amount) params.append('max_amount', filters.max_amount);
    
    const response = await api.get(`/payments?${params}`);
    return response.data;
  },

  // Get single payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Update payment (owner or admin)
  updatePayment: async (paymentId, paymentData) => {
    const response = await api.put(`/payments/${paymentId}`, paymentData);
    return response.data;
  },

  // Delete payment (owner or admin)
  deletePayment: async (paymentId) => {
    const response = await api.delete(`/payments/${paymentId}`);
    return response.data;
  },

  // Verify payment (admin only)
  verifyPayment: async (paymentId, verificationData) => {
    const response = await api.put(`/payments/${paymentId}/verify`, verificationData);
    return response.data;
  },

  // Get user's payment history
  getUserPayments: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.payment_type) params.append('payment_type', filters.payment_type);
    if (filters.payment_method) params.append('payment_method', filters.payment_method);
    if (filters.payment_status) params.append('payment_status', filters.payment_status);
    if (filters.from_date) params.append('from_date', filters.from_date);
    if (filters.to_date) params.append('to_date', filters.to_date);
    
    const response = await api.get(`/payments/my-payments?${params}`);
    return response.data;
  },

  // Get payment statistics (role-based access)
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  // Search payments by reference or transaction ID
  searchPayments: async (searchData, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.payment_method) params.append('payment_method', filters.payment_method);
    if (filters.payment_status) params.append('payment_status', filters.payment_status);
    
    const response = await api.post(`/payments/search?${params}`, searchData);
    return response.data;
  }
};
