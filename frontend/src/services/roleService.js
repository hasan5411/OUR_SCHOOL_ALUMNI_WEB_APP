import api from './api';

export const roleService = {
  // Get all roles
  getAllRoles: async () => {
    const response = await api.get('/roles/roles');
    return response.data;
  },

  // Get role statistics
  getRoleStats: async () => {
    const response = await api.get('/roles/stats');
    return response.data;
  },

  // Get pending users for approval
  getPendingUsers: async () => {
    const response = await api.get('/roles/pending');
    return response.data;
  },

  // Get all admins
  getAdmins: async () => {
    const response = await api.get('/roles/admins');
    return response.data;
  },

  // Approve user (admin and above)
  approveUser: async (userId, approvalData) => {
    const response = await api.post(`/roles/users/${userId}/approve`, approvalData);
    return response.data;
  },

  // Reject user (admin and above)
  rejectUser: async (userId, rejectionData) => {
    const response = await api.post(`/roles/users/${userId}/reject`, rejectionData);
    return response.data;
  },

  // Promote user to admin (authority only)
  promoteToAdmin: async (userId, promotionData) => {
    const response = await api.post(`/roles/users/${userId}/promote-admin`, promotionData);
    return response.data;
  },

  // Demote admin to member (authority only)
  demoteToMember: async (userId, demotionData) => {
    const response = await api.post(`/roles/users/${userId}/demote-member`, demotionData);
    return response.data;
  },

  // Change user role (authority only)
  changeUserRole: async (userId, roleData) => {
    const response = await api.put(`/roles/users/${userId}/role`, roleData);
    return response.data;
  },

  // Check admin count limit
  checkAdminLimit: async () => {
    const response = await api.get('/roles/admin-limit');
    return response.data;
  },

  // Bulk approve users (admin and above)
  bulkApproveUsers: async (userIds) => {
    const response = await api.post('/roles/bulk-approve', { userIds });
    return response.data;
  },

  // Bulk reject users (admin and above)
  bulkRejectUsers: async (userIds, reason) => {
    const response = await api.post('/roles/bulk-reject', { userIds, reason });
    return response.data;
  }
};
