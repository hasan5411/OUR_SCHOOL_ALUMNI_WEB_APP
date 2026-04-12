const Role = require('../models/Role');

// Middleware to validate role management permissions
const validateRoleManagement = (action) => {
  return async (req, res, next) => {
    try {
      const requestingUserRole = req.user.roles?.name;
      
      // Get target user if userId is provided
      let targetUserRole = null;
      if (req.params.userId) {
        const { data: targetUser } = await req.supabase
          .from('users')
          .select('roles(name)')
          .eq('id', req.params.userId)
          .single();
        
        targetUserRole = targetUser?.roles?.name;
      }

      // Check permissions
      const permissionCheck = await Role.canManageRoles(requestingUserRole, targetUserRole, action);
      
      if (!permissionCheck.allowed) {
        return res.status(403).json({ 
          message: 'Access denied',
          reason: permissionCheck.reason 
        });
      }

      next();
    } catch (error) {
      console.error('Role validation error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check admin count limit before promotion
const checkAdminLimit = async (req, res, next) => {
  try {
    const adminCount = await Role.checkAdminCountLimit();
    
    if (!adminCount.canAddMore) {
      return res.status(400).json({ 
        message: 'Admin limit reached',
        current: adminCount.currentCount,
        max: adminCount.maxCount
      });
    }

    req.adminLimit = adminCount;
    next();
  } catch (error) {
    console.error('Admin limit check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to prevent authority account modification
const protectAuthorityAccounts = async (req, res, next) => {
  try {
    if (req.params.userId) {
      const { data: targetUser } = await req.supabase
        .from('users')
        .select('roles(name)')
        .eq('id', req.params.userId)
        .single();
      
      if (targetUser?.roles?.name === 'authority') {
        return res.status(403).json({ 
          message: 'Authority accounts cannot be modified' 
        });
      }
    }

    next();
  } catch (error) {
    console.error('Authority protection error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to validate role assignment
const validateRoleAssignment = (req, res, next) => {
  try {
    const { newRole } = req.body;
    const requestingUserRole = req.user.roles?.name;

    // Only authority can assign roles
    if (requestingUserRole !== 'authority') {
      return res.status(403).json({ 
        message: 'Only authority can assign roles' 
      });
    }

    // Cannot assign authority role
    if (newRole === 'authority') {
      return res.status(400).json({ 
        message: 'Cannot assign authority role' 
      });
    }

    const validRoles = ['visitor', 'member', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be visitor, member, or admin' 
      });
    }

    next();
  } catch (error) {
    console.error('Role validation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  validateRoleManagement,
  checkAdminLimit,
  protectAuthorityAccounts,
  validateRoleAssignment
};
