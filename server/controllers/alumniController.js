const { supabase } = require('../config/database');

// Get all alumni profiles (with role-based access)
const getAllAlumni = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, graduation_year, stream, location } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('alumni_profiles')
      .select(`
        id,
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
        is_public,
        created_at,
        updated_at,
        users(
          id,
          first_name,
          last_name,
          email,
          profile_image_url,
          is_approved,
          is_active
        )
      `, { count: 'exact' });

    // Apply filters based on user role
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_public', true);
    }

    // Search filters
    if (search) {
      query = query.or(`
        users.first_name.ilike.%${search}%,
        users.last_name.ilike.%${search}%,
        current_occupation.ilike.%${search}%,
        company.ilike.%${search}%,
        location.ilike.%${search}%
      `);
    }

    if (graduation_year) {
      query = query.eq('graduation_year', parseInt(graduation_year));
    }

    if (stream) {
      query = query.eq('stream', stream);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Only show active, approved users
    query = query
      .eq('users.is_active', true)
      .eq('users.is_approved', true)
      .order('graduation_year', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: alumni, error, count } = await query;

    if (error) {
      console.error('Get alumni error:', error);
      return res.status(500).json({ message: 'Error fetching alumni profiles' });
    }

    res.json({
      alumni: alumni || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get alumni profile by ID
const getAlumniById = async (req, res) => {
  try {
    const { alumniId } = req.params;

    let query = supabase
      .from('alumni_profiles')
      .select(`
        id,
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
        is_public,
        created_at,
        updated_at,
        users(
          id,
          first_name,
          last_name,
          email,
          profile_image_url,
          is_approved,
          is_active,
          roles(name)
        )
      `)
      .eq('id', alumniId)
      .single();

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      query = query.eq('is_public', true);
    }

    // Users can only see their own profile if not public
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (req.user.id !== alumniId && !req.user.is_approved) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const { data: alumni, error } = await query;

    if (error || !alumni) {
      return res.status(404).json({ message: 'Alumni profile not found' });
    }

    // Hide sensitive information for non-admin users
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (req.user.id !== alumni.users.id) {
        delete alumni.users.email;
      }
    }

    res.json({ alumni });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create or update alumni profile
const createOrUpdateAlumniProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
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
    } = req.body;

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('alumni_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({ message: 'Error checking existing profile' });
    }

    const profileData = {
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
      is_public,
      updated_at: new Date().toISOString()
    };

    let result;
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('alumni_profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select(`
          id,
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
          is_public,
          updated_at
        `)
        .single();

      if (error) {
        console.error('Update alumni profile error:', error);
        return res.status(400).json({ message: 'Error updating alumni profile' });
      }
      result = data;
    } else {
      // Create new profile
      profileData.user_id = userId;
      profileData.created_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('alumni_profiles')
        .insert(profileData)
        .select(`
          id,
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
          is_public,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        console.error('Create alumni profile error:', error);
        return res.status(400).json({ message: 'Error creating alumni profile' });
      }
      result = data;
    }

    res.json({
      message: existingProfile ? 'Alumni profile updated successfully' : 'Alumni profile created successfully',
      profile: result
    });
  } catch (error) {
    console.error('Create/Update alumni profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get alumni statistics
const getAlumniStats = async (req, res) => {
  try {
    // Get graduation year distribution
    const { data: yearStats, error: yearError } = await supabase
      .from('alumni_profiles')
      .select('graduation_year')
      .eq('is_public', true)
      .eq('users.is_active', true)
      .eq('users.is_approved', true);

    if (yearError) {
      return res.status(500).json({ message: 'Error fetching alumni statistics' });
    }

    const yearCounts = {};
    yearStats?.forEach(profile => {
      const year = profile.graduation_year;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    // Get stream distribution
    const { data: streamStats } = await supabase
      .from('alumni_profiles')
      .select('stream')
      .eq('is_public', true)
      .eq('users.is_active', true)
      .eq('users.is_approved', true)
      .not('stream', 'is', null);

    const streamCounts = {};
    streamStats?.forEach(profile => {
      const stream = profile.stream || 'Other';
      streamCounts[stream] = (streamCounts[stream] || 0) + 1;
    });

    // Get location distribution
    const { data: locationStats } = await supabase
      .from('alumni_profiles')
      .select('location')
      .eq('is_public', true)
      .eq('users.is_active', true)
      .eq('users.is_approved', true)
      .not('location', 'is', null);

    const locationCounts = {};
    locationStats?.forEach(profile => {
      const location = profile.location || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    res.json({
      yearDistribution: yearCounts,
      streamDistribution: streamCounts,
      locationDistribution: locationCounts,
      totalAlumni: yearStats?.length || 0
    });
  } catch (error) {
    console.error('Get alumni stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search alumni (advanced search)
const searchAlumni = async (req, res) => {
  try {
    const { query: searchQuery, filters } = req.body;
    
    let dbQuery = supabase
      .from('alumni_profiles')
      .select(`
        id,
        graduation_year,
        stream,
        current_occupation,
        company,
        location,
        bio,
        linkedin_url,
        skills,
        is_public,
        users(
          id,
          first_name,
          last_name,
          profile_image_url
        )
      `);

    // Apply visibility rules
    if (req.user.roles?.name === 'visitor' || !req.user.is_approved) {
      dbQuery = dbQuery.eq('is_public', true);
    }

    dbQuery = dbQuery
      .eq('users.is_active', true)
      .eq('users.is_approved', true);

    // Apply search query
    if (searchQuery) {
      dbQuery = dbQuery.or(`
        users.first_name.ilike.%${searchQuery}%,users.last_name.ilike.%${searchQuery}%,
        current_occupation.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,
        location.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,skills.cs.{${searchQuery}}
      `);
    }

    // Apply filters
    if (filters) {
      if (filters.graduation_year) {
        dbQuery = dbQuery.eq('graduation_year', filters.graduation_year);
      }
      if (filters.stream) {
        dbQuery = dbQuery.eq('stream', filters.stream);
      }
      if (filters.location) {
        dbQuery = dbQuery.ilike('location', `%${filters.location}%`);
      }
      if (filters.skills && filters.skills.length > 0) {
        dbQuery = dbQuery.contains('skills', filters.skills);
      }
    }

    const { data: alumni, error } = await dbQuery
      .order('graduation_year', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Search alumni error:', error);
      return res.status(500).json({ message: 'Error searching alumni' });
    }

    res.json({ alumni: alumni || [] });
  } catch (error) {
    console.error('Search alumni error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  createOrUpdateAlumniProfile,
  getAlumniStats,
  searchAlumni
};
