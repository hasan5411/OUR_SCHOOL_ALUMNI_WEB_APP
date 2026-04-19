const Role = require('../models/Role');

// Get all roles (public)
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Get all roles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get role statistics (admin and above)
const getRoleStats = async (req, res) => {
  try {
    const stats = await Role.getRoleStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Get role stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get pending users for approval (admin and above)
const getPendingUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pendingUsers = await Role.getPendingUsers(parseInt(page), parseInt(limit));
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all admins (admin and above)
const getAdmins = async (req, res) => {
  try {
    const admins = await Role.getAdmins();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve user (admin and above)
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Role.approveUser(userId, req.user.roles?.name);
    
    res.status(200).json({
      message: 'User approved successfully',
      user: result
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject user (admin and above)
const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const result = await Role.rejectUser(userId, req.user.roles?.name, reason);
    
    res.status(200).json({
      message: 'User rejected successfully',
      user: result
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Promote user to admin (authority only)
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const result = await Role.promoteToAdmin(userId, reason, req.user.id);
    
    res.status(200).json({
      message: 'User promoted to admin successfully',
      user: result
    });
  } catch (error) {
    console.error('Promote to admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Demote admin to member (authority only)
const demoteToMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const result = await Role.demoteToMember(userId, reason, req.user.id);
    
    res.status(200).json({
      message: 'Admin demoted to member successfully',
      user: result
    });
  } catch (error) {
    console.error('Demote to member error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change user role (authority only)
const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role_id, reason } = req.body;
    
    const result = await Role.changeUserRole(userId, role_id, reason, req.user.id);
    
    res.status(200).json({
      message: 'User role changed successfully',
      user: result
    });
  } catch (error) {
    console.error('Change user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check admin count limit (authority only)
const checkAdminLimit = async (req, res) => {
  try {
    const limitCheck = await Role.checkAdminLimit();
    res.status(200).json(limitCheck);
  } catch (error) {
    console.error('Check admin limit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bulk approve users (admin and above)
const bulkApproveUsers = async (req, res) => {
  try {
    const { userIds, role_id } = req.body;
    
    const result = await Role.bulkApproveUsers(userIds, role_id, req.user.id);
    
    res.status(200).json({
      message: 'Users approved successfully',
      result
    });
  } catch (error) {
    console.error('Bulk approve users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bulk reject users (admin and above)
const bulkRejectUsers = async (req, res) => {
  try {
    const { userIds, reason } = req.body;
    
    const result = await Role.bulkRejectUsers(userIds, reason, req.user.id);
    
    res.status(200).json({
      message: 'Users rejected successfully',
      result
    });
  } catch (error) {
    console.error('Bulk reject users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllRoles,
  getRoleStats,
  getPendingUsers,
  getAdmins,
  approveUser,
  rejectUser,
  promoteToAdmin,
  demoteToMember,
  changeUserRole,
  checkAdminLimit,
  bulkApproveUsers,
  bulkRejectUsers
};
