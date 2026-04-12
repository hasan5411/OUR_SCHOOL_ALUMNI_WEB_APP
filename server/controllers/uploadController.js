const { supabase } = require('../config/database');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images and documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter
});

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `profile-${userId}-${Date.now()}${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('alumni-images')
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
      .from('alumni-images')
      .getPublicUrl(filePath);

    // Update user's profile_image_url in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Update profile image URL error:', updateError);
      return res.status(500).json({ message: 'Error updating profile image URL' });
    }

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: publicUrl
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload event image (admin/authority only)
const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `event-${Date.now()}${fileExt}`;
    const filePath = `event-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('alumni-images')
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
      .from('alumni-images')
      .getPublicUrl(filePath);

    res.json({
      message: 'Event image uploaded successfully',
      imageUrl: publicUrl
    });
  } catch (error) {
    console.error('Upload event image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload announcement image (admin/authority only)
const uploadAnnouncementImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `announcement-${Date.now()}${fileExt}`;
    const filePath = `announcement-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('alumni-images')
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
      .from('alumni-images')
      .getPublicUrl(filePath);

    res.json({
      message: 'Announcement image uploaded successfully',
      imageUrl: publicUrl
    });
  } catch (error) {
    console.error('Upload announcement image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload document (PDF for job postings, etc.)
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body;
    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${documentType}-${Date.now()}${fileExt}`;
    const filePath = `documents/${documentType}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('alumni-documents')
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
      .from('alumni-documents')
      .getPublicUrl(filePath);

    res.json({
      message: 'Document uploaded successfully',
      documentUrl: publicUrl
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete file from storage
const deleteFile = async (req, res) => {
  try {
    const { filePath, bucket } = req.body;

    if (!filePath || !bucket) {
      return res.status(400).json({ message: 'File path and bucket are required' });
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete file error:', error);
      return res.status(500).json({ message: 'Error deleting file' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  upload,
  uploadProfileImage,
  uploadEventImage,
  uploadAnnouncementImage,
  uploadDocument,
  deleteFile
};
