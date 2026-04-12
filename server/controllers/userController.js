const { supabase } = require('../config/database');

// Get all users (admin/authority only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, is_approved, is_active } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select(`
        id, 
        email, 
        first_name, 
        last_name, 
        phone,
        role_id,
        is_approved,
        is_active,
        profile_image_url,
        created_at,
        updated_at,
        roles(name)
      `, { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('roles.name', role);
    }

    if (is_approved !== undefined) {
      query = query.eq('is_approved', is_approved === 'true');
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }

    res.json({
      users: users || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID (admin/authority only)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id, 
        email, 
        first_name, 
        last_name, 
        phone,
        role_id,
        is_approved,
        is_active,
        profile_image_url,
        created_at,
        updated_at,
        roles(name),
        alumni_profiles(
          graduation_year,
          stream,
          current_occupation,
          company,
          location,
          bio,
          linkedin_url,
          social_media,
          skills,
          achievements,
          is_public
        )
      `)
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user (admin/authority only)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, phone, role_id, is_approved, is_active } = req.body;

    // Check if trying to update authority role (only authority can modify authority)
    if (req.user.roles?.name !== 'authority') {
      const { data: targetUser } = await supabase
        .from('users')
        .select('roles(name)')
        .eq('id', userId)
        .single();

      if (targetUser?.roles?.name === 'authority') {
        return res.status(403).json({ message: 'Cannot modify authority account' });
      }

      if (role_id) {
        const { data: roleData } = await supabase
          .from('roles')
          .select('name')
          .eq('id', role_id)
          .single();

        if (roleData?.name === 'authority') {
          return res.status(403).json({ message: 'Cannot assign authority role' });
        }
      }
    }

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;
    if (role_id !== undefined) updateData.role_id = role_id;
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select(`
        id, 
        email, 
        first_name, 
        last_name, 
        phone,
        role_id,
        is_approved,
        is_active,
        profile_image_url,
        updated_at,
        roles(name)
      `)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Error updating user' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user (authority only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting authority account
    const { data: targetUser } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', userId)
      .single();

    if (targetUser?.roles?.name === 'authority') {
      return res.status(403).json({ message: 'Cannot delete authority account' });
    }

    // Delete user (cascades to related records)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Delete user error:', error);
      return res.status(400).json({ message: 'Error deleting user' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user statistics (admin/authority only)
const getUserStats = async (req, res) => {
  try {
    // Get total users by role
    const { data: roleStats, error: roleError } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('is_active', true);

    if (roleError) {
      return res.status(500).json({ message: 'Error fetching user statistics' });
    }

    const roleCounts = {};
    roleStats?.forEach(user => {
      const roleName = user.roles?.name || 'unknown';
      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });

    // Get approval statistics
    const { data: approvalStats } = await supabase
      .from('users')
      .select('is_approved')
      .eq('is_active', true);

    const approvedCount = approvalStats?.filter(u => u.is_approved).length || 0;
    const pendingCount = approvalStats?.filter(u => !u.is_approved).length || 0;

    // Get recent registrations
    const { data: recentUsers } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      roleCounts,
      approvalStats: {
        approved: approvedCount,
        pending: pendingCount,
        total: approvedCount + pendingCount
      },
      recentUsers: recentUsers || []
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve user (admin/authority only)
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent approving authority account (should already be approved)
    const { data: targetUser } = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', userId)
      .single();

    if (targetUser?.roles?.name === 'authority') {
      return res.status(403).json({ message: 'Authority account is already approved' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({
        is_approved: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select(`
        id, 
        email, 
        first_name, 
        last_name,
        is_approved,
        updated_at,
        roles(name)
      `)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Error approving user' });
    }

    res.json({
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  approveUser
};
