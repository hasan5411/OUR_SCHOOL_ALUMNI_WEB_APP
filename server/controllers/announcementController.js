const { supabase } = require('../config/database');

// Get all announcements (with role-based access)
const getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        image_url,
        is_public,
        created_at,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `, { count: 'exact' });

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_public', true);
    }

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: announcements, error, count } = await query;

    if (error) {
      console.error('Get announcements error:', error);
      return res.status(500).json({ message: 'Error fetching announcements' });
    }

    res.json({
      announcements: announcements || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { announcementId } = req.params;

    let query = supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        image_url,
        is_public,
        created_at,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .eq('id', announcementId)
      .single();

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_public', true);
    }

    const { data: announcement, error } = await query;

    if (error || !announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ announcement });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create announcement (admin/authority only)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, image_url, is_public } = req.body;

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        image_url,
        is_public,
        created_by: req.user.id
      })
      .select(`
        id,
        title,
        content,
        image_url,
        is_public,
        created_at,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .single();

    if (error || !announcement) {
      console.error('Create announcement error:', error);
      return res.status(400).json({ message: 'Error creating announcement' });
    }

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update announcement (admin/authority only)
const updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, content, image_url, is_public } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data: announcement, error } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', announcementId)
      .select(`
        id,
        title,
        content,
        image_url,
        is_public,
        updated_at,
        created_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .single();

    if (error || !announcement) {
      return res.status(400).json({ message: 'Error updating announcement' });
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete announcement (authority only)
const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId);

    if (error) {
      console.error('Delete announcement error:', error);
      return res.status(400).json({ message: 'Error deleting announcement' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
