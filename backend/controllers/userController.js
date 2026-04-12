const User = require('../models/User');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for file uploads
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    const user = await User.getProfile(
      userId, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const requestingUser = req.user;

    const user = await User.updateProfile(
      userId, 
      updateData, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    // Check if user can update this profile image
    if (requestingUser.roles?.name !== 'admin' && requestingUser.roles?.name !== 'authority') {
      if (userId !== requestingUser.id) {
        return res.status(403).json({ message: 'Access denied: Cannot update other user profile images' });
      }
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check file size (100KB limit)
    if (req.file.size > 100 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 100KB' });
    }

    // Check file type (images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only JPEG, PNG, and GIF images are allowed' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Error uploading file' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    // Update user's profile_image_url in database
    const user = await User.updateProfileImage(
      userId, 
      publicUrl, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: publicUrl,
      user
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search alumni
const searchAlumni = async (req, res) => {
  try {
    const searchOptions = {
      search: req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      role: req.query.role,
      is_approved: req.query.is_approved === 'true' ? true : req.query.is_approved === 'false' ? false : undefined
    };

    const requestingUser = req.user;
    
    const result = await User.searchAlumni(
      searchOptions, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Alumni search completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Search alumni error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user profile (authenticated user)
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestingUser = req.user;

    const user = await User.getProfile(
      userId, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get current profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update current user profile (authenticated user)
const updateCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const requestingUser = req.user;

    const user = await User.updateProfile(
      userId, 
      updateData, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update current profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload current user profile image
const uploadCurrentUserProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestingUser = req.user;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check file size (100KB limit)
    if (req.file.size > 100 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 100KB' });
    }

    // Check file type (images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only JPEG, PNG, and GIF images are allowed' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Error uploading file' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    // Update user's profile_image_url in database
    const user = await User.updateProfileImage(
      userId, 
      publicUrl, 
      requestingUser.roles?.name, 
      requestingUser.id
    );

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: publicUrl,
      user
    });
  } catch (error) {
    console.error('Upload current profile image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  searchAlumni,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  uploadCurrentUserProfileImage
};
