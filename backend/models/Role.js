const { supabase } = require('../config/database');

class Role {
  // Get all roles
  static async getAllRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting roles:', error);
      throw error;
    }
  }

  // Get role by name
  static async getRoleByName(roleName) {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('name', roleName)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting role by name:', error);
      throw error;
    }
  }

  // Get role by ID
  static async getRoleById(roleId) {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting role by ID:', error);
      throw error;
    }
  }

  // Check if user can perform role management action
  static async canManageRoles(requestingUserRole, targetUserRole, action) {
    try {
      // Authority can do anything except modify other authority accounts
      if (requestingUserRole === 'authority') {
        if (targetUserRole === 'authority' && action !== 'view') {
          return { allowed: false, reason: 'Authority accounts cannot be modified' };
        }
        return { allowed: true };
      }

      // Admin can manage visitors and members only
      if (requestingUserRole === 'admin') {
        if (targetUserRole === 'admin' && action !== 'view') {
          return { allowed: false, reason: 'Admins cannot modify other admin accounts' };
        }
        if (targetUserRole === 'authority') {
          return { allowed: false, reason: 'Admins cannot modify authority accounts' };
        }
        return { allowed: true };
      }

      // Members and visitors cannot manage roles
      return { allowed: false, reason: 'Insufficient permissions for role management' };
    } catch (error) {
      console.error('Error checking role management permissions:', error);
      throw error;
    }
  }

  // Check admin count limit
  static async checkAdminCountLimit() {
    try {
      const adminRole = await Role.getRoleByName('admin');
      if (!adminRole) {
        throw new Error('Admin role not found');
      }

      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('role_id', adminRole.id)
        .eq('is_active', true);

      if (error) throw error;

      const currentAdminCount = data?.length || 0;
      const maxAdmins = 100; // Maximum 100 admins as per requirements

      return {
        currentCount: currentAdminCount,
        maxCount: maxAdmins,
        canAddMore: currentAdminCount < maxAdmins,
        remainingSlots: maxAdmins - currentAdminCount
      };
    } catch (error) {
      console.error('Error checking admin count limit:', error);
      throw error;
    }
  }

  // Promote user to admin
  static async promoteToAdmin(userId, requestingUserRole) {
    try {
      // Check permissions
      const requestingUser = await supabase
        .from('users')
        .select('id, roles(name)')
        .eq('id', userId)
        .single();

      if (!requestingUser) {
        throw new Error('User not found');
      }

      const permissionCheck = await Role.canManageRoles(requestingUserRole, requestingUser.roles?.name, 'promote');
      if (!permissionCheck.allowed) {
        throw new Error(permissionCheck.reason);
      }

      // Check admin count limit
      const adminCount = await Role.checkAdminCountLimit();
      if (!adminCount.canAddMore) {
        throw new Error(`Cannot promote user: Admin limit reached (${adminCount.maxCount})`);
      }

      // Get admin role
      const adminRole = await Role.getRoleByName('admin');
      if (!adminRole) {
        throw new Error('Admin role not found');
      }

      // Update user role
      const { data, error } = await supabase
        .from('users')
        .update({
          role_id: adminRole.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          id,
          email,
          first_name,
          last_name,
          role_id,
          is_approved,
          is_active,
          updated_at,
          roles(name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      throw error;
    }
  }

  // Demote admin to member
  static async demoteToMember(userId, requestingUserRole) {
    try {
      // Get current user info
      const targetUser = await supabase
        .from('users')
        .select('id, roles(name)')
        .eq('id', userId)
        .single();

      if (!targetUser) {
        throw new Error('User not found');
      }

      // Check permissions
      const permissionCheck = await Role.canManageRoles(requestingUserRole, targetUser.roles?.name, 'demote');
      if (!permissionCheck.allowed) {
        throw new Error(permissionCheck.reason);
      }

      // Cannot demote authority
      if (targetUser.roles?.name === 'authority') {
        throw new Error('Cannot demote authority account');
      }

      // Get member role
      const memberRole = await Role.getRoleByName('member');
      if (!memberRole) {
        throw new Error('Member role not found');
      }

      // Update user role
      const { data, error } = await supabase
        .from('users')
        .update({
          role_id: memberRole.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          id,
          email,
          first_name,
          last_name,
          role_id,
          is_approved,
          is_active,
          updated_at,
          roles(name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error demoting user to member:', error);
      throw error;
    }
  }

  // Approve user (promote from visitor to member)
  static async approveUser(userId, requestingUserRole) {
    try {
      // Get current user info
      const targetUser = await supabase
        .from('users')
        .select('id, roles(name), is_approved')
        .eq('id', userId)
        .single();

      if (!targetUser) {
        throw new Error('User not found');
      }

      // Check if already approved
      if (targetUser.is_approved) {
        throw new Error('User is already approved');
      }

      // Check permissions
      const permissionCheck = await Role.canManageRoles(requestingUserRole, targetUser.roles?.name, 'approve');
      if (!permissionCheck.allowed) {
        throw new Error(permissionCheck.reason);
      }

      // Get member role
      const memberRole = await Role.getRoleByName('member');
      if (!memberRole) {
        throw new Error('Member role not found');
      }

      // Update user
      const { data, error } = await supabase
        .from('users')
        .update({
          role_id: memberRole.id,
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          id,
          email,
          first_name,
          last_name,
          role_id,
          is_approved,
          is_active,
          updated_at,
          roles(name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }

  // Reject user (delete or deactivate)
  static async rejectUser(userId, requestingUserRole, reason = null) {
    try {
      // Get current user info
      const targetUser = await supabase
        .from('users')
        .select('id, roles(name)')
        .eq('id', userId)
        .single();

      if (!targetUser) {
        throw new Error('User not found');
      }

      // Check permissions
      const permissionCheck = await Role.canManageRoles(requestingUserRole, targetUser.roles?.name, 'reject');
      if (!permissionCheck.allowed) {
        throw new Error(permissionCheck.reason);
      }

      // Cannot reject authority
      if (targetUser.roles?.name === 'authority') {
        throw new Error('Cannot reject authority account');
      }

      // Deactivate user instead of deleting
      const { data, error } = await supabase
        .from('users')
        .update({
          is_active: false,
          is_approved: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          id,
          email,
          first_name,
          last_name,
          is_active,
          is_approved,
          updated_at,
          roles(name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }

  // Change user role (with restrictions)
  static async changeUserRole(userId, newRoleName, requestingUserRole) {
    try {
      // Get current user info
      const targetUser = await supabase
        .from('users')
        .select('id, roles(name)')
        .eq('id', userId)
        .single();

      if (!targetUser) {
        throw new Error('User not found');
      }

      // Check if trying to change to same role
      if (targetUser.roles?.name === newRoleName) {
        throw new Error('User already has this role');
      }

      // Check permissions for target role
      const permissionCheck = await Role.canManageRoles(requestingUserRole, targetUser.roles?.name, 'change_role');
      if (!permissionCheck.allowed) {
        throw new Error(permissionCheck.reason);
      }

      // Additional checks for specific role changes
      if (newRoleName === 'authority') {
        throw new Error('Cannot assign authority role');
      }

      if (newRoleName === 'admin') {
        const adminCount = await Role.checkAdminCountLimit();
        if (!adminCount.canAddMore) {
          throw new Error(`Cannot promote to admin: Limit reached (${adminCount.maxCount})`);
        }
      }

      // Get new role
      const newRole = await Role.getRoleByName(newRoleName);
      if (!newRole) {
        throw new Error('Role not found');
      }

      // Update user role
      const { data, error } = await supabase
        .from('users')
        .update({
          role_id: newRole.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          id,
          email,
          first_name,
          last_name,
          role_id,
          is_approved,
          is_active,
          updated_at,
          roles(name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  }

  // Get role statistics
  static async getRoleStats() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          roles(name),
          is_active,
          is_approved
        `);

      if (error) throw error;

      const stats = {
        total_users: data?.length || 0,
        active_users: data?.filter(u => u.is_active).length || 0,
        approved_users: data?.filter(u => u.is_approved).length || 0,
        roles: {}
      };

      // Count by role
      data?.forEach(user => {
        const roleName = user.roles?.name || 'unknown';
        if (!stats.roles[roleName]) {
          stats.roles[roleName] = {
            total: 0,
            active: 0,
            approved: 0
          };
        }
        stats.roles[roleName].total++;
        if (user.is_active) stats.roles[roleName].active++;
        if (user.is_approved) stats.roles[roleName].approved++;
      });

      // Add admin limit info
      const adminCount = await Role.checkAdminCountLimit();
      stats.admin_limit = {
        current: adminCount.currentCount,
        max: adminCount.maxCount,
        remaining: adminCount.remainingSlots
      };

      return stats;
    } catch (error) {
      console.error('Error getting role statistics:', error);
      throw error;
    }
  }

  // Get pending users for approval
  static async getPendingUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          is_approved,
          is_active,
          created_at,
          roles(name)
        `)
        .eq('is_approved', false)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting pending users:', error);
      throw error;
    }
  }

  // Get all admins with their info
  static async getAdmins() {
    try {
      const adminRole = await Role.getRoleByName('admin');
      if (!adminRole) {
        throw new Error('Admin role not found');
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          is_approved,
          is_active,
          created_at,
          updated_at
        `)
        .eq('role_id', adminRole.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting admins:', error);
      throw error;
    }
  }
}

module.exports = Role;
