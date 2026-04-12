const { supabase } = require('../config/database');

// Get all job postings (with role-based access)
const getAllJobPostings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, location, job_type, active_only } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        company,
        description,
        requirements,
        location,
        job_type,
        salary_range,
        application_url,
        is_active,
        expires_at,
        created_at,
        updated_at,
        posted_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `, { count: 'exact' });

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_active', true);
    }

    // Active only filter
    if (active_only === 'true') {
      query = query.eq('is_active', true).or('expires_at.is.null,expires_at.gt.now()');
    }

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Location filter
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Job type filter
    if (job_type) {
      query = query.eq('job_type', job_type);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: jobPostings, error, count } = await query;

    if (error) {
      console.error('Get job postings error:', error);
      return res.status(500).json({ message: 'Error fetching job postings' });
    }

    res.json({
      jobPostings: jobPostings || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get job postings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get job posting by ID
const getJobPostingById = async (req, res) => {
  try {
    const { jobPostingId } = req.params;

    let query = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        company,
        description,
        requirements,
        location,
        job_type,
        salary_range,
        application_url,
        is_active,
        expires_at,
        created_at,
        updated_at,
        posted_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .eq('id', jobPostingId)
      .single();

    // Apply visibility rules for non-admin users
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
        query = query.eq('is_active', true);
      }
    }

    const { data: jobPosting, error } = await query;

    if (error || !jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Check if job posting is expired
    if (jobPosting.expires_at && new Date(jobPosting.expires_at) < new Date() && req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      return res.status(404).json({ message: 'Job posting has expired' });
    }

    res.json({ jobPosting });
  } catch (error) {
    console.error('Get job posting error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create job posting (approved users only)
const createJobPosting = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      location,
      job_type,
      salary_range,
      application_url,
      expires_at
    } = req.body;

    const { data: jobPosting, error } = await supabase
      .from('job_postings')
      .insert({
        title,
        company,
        description,
        requirements,
        location,
        job_type,
        salary_range,
        application_url,
        expires_at,
        posted_by: req.user.id
      })
      .select(`
        id,
        title,
        company,
        description,
        requirements,
        location,
        job_type,
        salary_range,
        application_url,
        is_active,
        expires_at,
        created_at,
        updated_at,
        posted_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .single();

    if (error || !jobPosting) {
      console.error('Create job posting error:', error);
      return res.status(400).json({ message: 'Error creating job posting' });
    }

    res.status(201).json({
      message: 'Job posting created successfully',
      jobPosting
    });
  } catch (error) {
    console.error('Create job posting error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update job posting
const updateJobPosting = async (req, res) => {
  try {
    const { jobPostingId } = req.params;
    const {
      title,
      company,
      description,
      requirements,
      location,
      job_type,
      salary_range,
      application_url,
      is_active,
      expires_at
    } = req.body;

    // Check if user can update this posting
    const { data: existingPosting, error: checkError } = await supabase
      .from('job_postings')
      .select('posted_by')
      .eq('id', jobPostingId)
      .single();

    if (checkError || !existingPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Only admin, authority, or the original poster can update
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority' && existingPosting.posted_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (location !== undefined) updateData.location = location;
    if (job_type !== undefined) updateData.job_type = job_type;
    if (salary_range !== undefined) updateData.salary_range = salary_range;
    if (application_url !== undefined) updateData.application_url = application_url;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (expires_at !== undefined) updateData.expires_at = expires_at;

    const { data: jobPosting, error } = await supabase
      .from('job_postings')
      .update(updateData)
      .eq('id', jobPostingId)
      .select(`
        id,
        title,
        company,
        description,
        requirements,
        location,
        job_type,
        salary_range,
        application_url,
        is_active,
        expires_at,
        updated_at,
        posted_by,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .single();

    if (error || !jobPosting) {
      return res.status(400).json({ message: 'Error updating job posting' });
    }

    res.json({
      message: 'Job posting updated successfully',
      jobPosting
    });
  } catch (error) {
    console.error('Update job posting error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete job posting
const deleteJobPosting = async (req, res) => {
  try {
    const { jobPostingId } = req.params;

    // Check if user can delete this posting
    const { data: existingPosting, error: checkError } = await supabase
      .from('job_postings')
      .select('posted_by')
      .eq('id', jobPostingId)
      .single();

    if (checkError || !existingPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Only admin, authority, or the original poster can delete
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority' && existingPosting.posted_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', jobPostingId);

    if (error) {
      console.error('Delete job posting error:', error);
      return res.status(400).json({ message: 'Error deleting job posting' });
    }

    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Delete job posting error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get job posting statistics
const getJobPostingStats = async (req, res) => {
  try {
    // Get job type distribution
    const { data: typeStats } = await supabase
      .from('job_postings')
      .select('job_type')
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gt.now()');

    const typeCounts = {};
    typeStats?.forEach(job => {
      const type = job.job_type || 'other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Get location distribution
    const { data: locationStats } = await supabase
      .from('job_postings')
      .select('location')
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gt.now()')
      .not('location', 'is', null);

    const locationCounts = {};
    locationStats?.forEach(job => {
      const location = job.location || 'Remote';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    // Get recent postings
    const { data: recentPostings } = await supabase
      .from('job_postings')
      .select(`
        id,
        title,
        company,
        location,
        created_at,
        users(first_name, last_name)
      `)
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      typeDistribution: typeCounts,
      locationDistribution: locationCounts,
      totalActive: typeStats?.length || 0,
      recentPostings: recentPostings || []
    });
  } catch (error) {
    console.error('Get job posting stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingStats
};
