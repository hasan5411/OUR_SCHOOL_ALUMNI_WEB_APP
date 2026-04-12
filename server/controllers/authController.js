const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// User registration
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Get visitor role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'visitor')
      .single();

    if (roleError || !roleData) {
      return res.status(500).json({ message: 'Error setting up user role' });
    }

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        role_id: roleData.id,
        is_approved: false
      })
      .select(`
        id, 
        email, 
        first_name, 
        last_name, 
        role_id,
        is_approved,
        is_active,
        roles(name)
      `)
      .single();

    if (insertError) {
      console.error('Registration error:', insertError);
      return res.status(500).json({ message: 'Error creating user account' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully. Please wait for admin approval.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.roles?.name,
        is_approved: user.is_approved
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user with role
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id, 
        email, 
        password_hash,
        first_name, 
        last_name, 
        role_id,
        is_approved,
        is_active,
        roles(name)
      `)
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        first_name: userWithoutPassword.first_name,
        last_name: userWithoutPassword.last_name,
        role: userWithoutPassword.roles?.name,
        is_approved: userWithoutPassword.is_approved,
        is_active: userWithoutPassword.is_active
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

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

    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.roles?.name,
        is_approved: user.is_approved,
        is_active: user.is_active,
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
        alumni_profile: user.alumni_profiles?.[0] || null
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        phone,
        updated_at: new Date().toISOString()
      })
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
      return res.status(400).json({ message: 'Error updating profile' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.roles?.name,
        is_approved: user.is_approved,
        is_active: user.is_active,
        profile_image_url: user.profile_image_url,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // Get current user with password
    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const new_password_hash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: new_password_hash,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return res.status(400).json({ message: 'Error updating password' });
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
