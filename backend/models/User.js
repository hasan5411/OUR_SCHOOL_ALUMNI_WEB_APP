const { supabase } = require('../config/database');

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          password_hash,
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
        `)
        .eq('email', email)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          password_hash,
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
        `)
        .eq('id', id)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
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
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get role by name
  static async getRoleByName(roleName) {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .eq('name', roleName)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding role:', error);
      return null;
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Search alumni with role-based access
  static async searchAlumni(searchOptions, requestingUserRole, requestingUserId) {
    try {
      const { 
        search = '', 
        page = 1, 
        limit = 10,
        role,
        is_approved 
      } = searchOptions;
      
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

      // Apply search filter
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Apply role filter
      if (role) {
        query = query.eq('roles.name', role);
      }

      // Apply approval filter
      if (is_approved !== undefined) {
        query = query.eq('is_approved', is_approved);
      }

      // Non-admin users can only see approved and active users
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        query = query.eq('is_approved', true).eq('is_active', true);
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: users, error, count } = await query;

      if (error) throw error;

      // Remove sensitive information for non-admin users
      const filteredUsers = users.map(user => {
        if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
          // Regular users can't see email unless it's their own profile
          if (user.id !== requestingUserId) {
            const { email, ...userWithoutEmail } = user;
            return userWithoutEmail;
          }
        }
        return user;
      });

      return {
        users: filteredUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error searching alumni:', error);
      throw error;
    }
  }

  // Get user profile with student data if exists
  static async getProfile(userId, requestingUserRole, requestingUserId) {
    try {
      // Users can only access their own data unless admin/authority
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        if (userId !== requestingUserId) {
          throw new Error('Access denied: Cannot access other user profiles');
        }
      }

      const { data, error } = await supabase
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
          students(
            id,
            student_id,
            admission_number,
            date_of_birth,
            gender,
            address,
            city,
            state,
            country,
            graduation_year,
            stream,
            class,
            section,
            status,
            emergency_contact_name,
            emergency_contact_phone,
            parent_guardian_name,
            parent_guardian_phone
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Remove sensitive information for non-admin users
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        if (userId !== requestingUserId) {
          const { email, ...userWithoutEmail } = data;
          return userWithoutEmail;
        }
      }

      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData, requestingUserRole, requestingUserId) {
    try {
      // Users can only update their own profile unless admin/authority
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        if (userId !== requestingUserId) {
          throw new Error('Access denied: Cannot update other user profiles');
        }
      }

      // Regular users can only update specific fields
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        const allowedFields = ['first_name', 'last_name', 'phone'];
        const filteredData = {};
        
        allowedFields.forEach(field => {
          if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field];
          }
        });
        
        updateData = filteredData;
      }

      const { data, error } = await supabase
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Update profile image
  static async updateProfileImage(userId, imageUrl, requestingUserRole, requestingUserId) {
    try {
      // Users can only update their own profile image unless admin/authority
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        if (userId !== requestingUserId) {
          throw new Error('Access denied: Cannot update other user profile images');
        }
      }

      const { data, error } = await supabase
        .from('users')
        .update({ profile_image_url: imageUrl })
        .eq('id', userId)
        .select('id, profile_image_url')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  }
}

module.exports = User;
