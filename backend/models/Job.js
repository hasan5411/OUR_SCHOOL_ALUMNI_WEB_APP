const { supabase } = require('../config/database');

class Job {
  // Create new job post
  static async createJob(jobData) {
    try {
      // Set is_active = false by default (requires admin approval)
      const jobDataWithDefaults = {
        ...jobData,
        is_active: false,
        is_featured: false
      };

      const { data, error } = await supabase
        .from('job_posts')
        .insert(jobDataWithDefaults)
        .select(`
          id,
          title,
          company,
          description,
          requirements,
          responsibilities,
          location,
          job_type,
          experience_level,
          salary_range,
          salary_currency,
          application_deadline,
          contact_email,
          contact_phone,
          application_url,
          is_active,
          is_featured,
          posted_by,
          approved_by,
          approved_at,
          expires_at,
          view_count,
          application_count,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating job post:', error);
      throw error;
    }
  }

  // Get job posts with filtering and pagination
  static async getJobPosts(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        job_type,
        experience_level,
        location,
        is_active = true,
        is_approved,
        posted_by
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('job_posts')
        .select(`
          id,
          title,
          company,
          description,
          requirements,
          responsibilities,
          location,
          job_type,
          experience_level,
          salary_range,
          salary_currency,
          application_deadline,
          contact_email,
          contact_phone,
          application_url,
          is_active,
          is_featured,
          posted_by,
          approved_by,
          approved_at,
          expires_at,
          view_count,
          application_count,
          created_at,
          updated_at
        `, { count: 'exact' });

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
      }

      // Apply filters
      if (job_type) query = query.eq('job_type', job_type);
      if (experience_level) query = query.eq('experience_level', experience_level);
      if (location) query = query.ilike('location', `%${location}%`);
      if (is_active !== undefined) query = query.eq('is_active', is_active);
      if (posted_by) query = query.eq('posted_by', posted_by);

      // Filter by approval status
      if (is_approved !== undefined) {
        if (is_approved === true) {
          query = query.not('approved_by', 'is', null);
        } else {
          query = query.eq('approved_by', null);
        }
      }

      // Don't show expired jobs
      query = query.or('expires_at.is.null,expires_at.gt.now()');

      // Apply pagination and ordering
      query = query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: jobPosts, error, count } = await query;

      if (error) throw error;

      return {
        jobPosts: jobPosts || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting job posts:', error);
      throw error;
    }
  }

  // Get single job post by ID
  static async getJobById(jobId) {
    try {
      const { data, error } = await supabase
        .from('job_posts')
        .select(`
          id,
          title,
          company,
          description,
          requirements,
          responsibilities,
          location,
          job_type,
          experience_level,
          salary_range,
          salary_currency,
          application_deadline,
          contact_email,
          contact_phone,
          application_url,
          is_active,
          is_featured,
          posted_by,
          approved_by,
          approved_at,
          expires_at,
          view_count,
          application_count,
          created_at,
          updated_at
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting job by ID:', error);
      throw error;
    }
  }

  // Update job post
  static async updateJob(jobId, updateData) {
    try {
      const { data, error } = await supabase
        .from('job_posts')
        .update(updateData)
        .eq('id', jobId)
        .select(`
          id,
          title,
          company,
          description,
          requirements,
          responsibilities,
          location,
          job_type,
          experience_level,
          salary_range,
          salary_currency,
          application_deadline,
          contact_email,
          contact_phone,
          application_url,
          is_active,
          is_featured,
          posted_by,
          approved_by,
          approved_at,
          expires_at,
          view_count,
          application_count,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating job post:', error);
      throw error;
    }
  }

  // Delete job post
  static async deleteJob(jobId) {
    try {
      const { error } = await supabase
        .from('job_posts')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting job post:', error);
      throw error;
    }
  }

  // Approve job post (admin only)
  static async approveJob(jobId, adminId) {
    try {
      const { data, error } = await supabase
        .from('job_posts')
        .update({
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .select(`
          id,
          title,
          company,
          approved_by,
          approved_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving job post:', error);
      throw error;
    }
  }

  // Increment view count
  static async incrementViewCount(jobId) {
    try {
      const { data, error } = await supabase.rpc('increment_job_view_count', { job_id: jobId });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }

  // Create job application
  static async createApplication(applicationData) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert(applicationData)
        .select(`
          id,
          job_post_id,
          applicant_id,
          student_id,
          full_name,
          email,
          phone,
          cover_letter,
          resume_url,
          portfolio_url,
          linkedin_url,
          current_occupation,
          current_company,
          experience_years,
          expected_salary,
          availability_date,
          application_status,
          notes,
          reviewed_by,
          reviewed_at,
          interview_date,
          interview_notes,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;

      // Update application count on job post
      await supabase.rpc('increment_job_application_count', { job_post_id: applicationData.job_post_id });

      return data;
    } catch (error) {
      console.error('Error creating job application:', error);
      throw error;
    }
  }

  // Get job applications for a specific job
  static async getJobApplications(jobId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        application_status
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('job_applications')
        .select(`
          id,
          job_post_id,
          applicant_id,
          student_id,
          full_name,
          email,
          phone,
          cover_letter,
          resume_url,
          portfolio_url,
          linkedin_url,
          current_occupation,
          current_company,
          experience_years,
          expected_salary,
          availability_date,
          application_status,
          notes,
          reviewed_by,
          reviewed_at,
          interview_date,
          interview_notes,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('job_post_id', jobId);

      // Apply status filter
      if (application_status) {
        query = query.eq('application_status', application_status);
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: applications, error, count } = await query;

      if (error) throw error;

      return {
        applications: applications || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting job applications:', error);
      throw error;
    }
  }

  // Get user's job applications
  static async getUserApplications(userId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        application_status
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('job_applications')
        .select(`
          id,
          job_post_id,
          applicant_id,
          student_id,
          full_name,
          email,
          phone,
          cover_letter,
          resume_url,
          portfolio_url,
          linkedin_url,
          current_occupation,
          current_company,
          experience_years,
          expected_salary,
          availability_date,
          application_status,
          notes,
          reviewed_by,
          reviewed_at,
          interview_date,
          interview_notes,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('applicant_id', userId);

      // Apply status filter
      if (application_status) {
        query = query.eq('application_status', application_status);
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: applications, error, count } = await query;

      if (error) throw error;

      return {
        applications: applications || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user applications:', error);
      throw error;
    }
  }

  // Update job application status
  static async updateApplicationStatus(applicationId, status, reviewerId, notes = null) {
    try {
      const updateData = {
        application_status: status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString()
      };

      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .update(updateData)
        .eq('id', applicationId)
        .select(`
          id,
          application_status,
          reviewed_by,
          reviewed_at,
          notes,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Get job statistics
  static async getJobStats() {
    try {
      const { data: stats, error } = await supabase
        .from('job_posts')
        .select(`
          id,
          job_type,
          experience_level,
          is_active,
          approved_by,
          application_count,
          view_count
        `);

      if (error) throw error;

      // Calculate statistics
      const totalJobs = stats?.length || 0;
      const activeJobs = stats?.filter(job => job.is_active).length || 0;
      const approvedJobs = stats?.filter(job => job.approved_by).length || 0;
      const pendingJobs = stats?.filter(job => !job.approved_by).length || 0;

      const jobTypeStats = {};
      const experienceLevelStats = {};
      let totalViews = 0;
      let totalApplications = 0;

      stats?.forEach(job => {
        // Job type statistics
        jobTypeStats[job.job_type] = (jobTypeStats[job.job_type] || 0) + 1;
        
        // Experience level statistics
        experienceLevelStats[job.experience_level] = (experienceLevelStats[job.experience_level] || 0) + 1;
        
        // Aggregate counts
        totalViews += job.view_count || 0;
        totalApplications += job.application_count || 0;
      });

      return {
        totalJobs,
        activeJobs,
        approvedJobs,
        pendingJobs,
        jobTypeStats,
        experienceLevelStats,
        totalViews,
        totalApplications
      };
    } catch (error) {
      console.error('Error getting job statistics:', error);
      throw error;
    }
  }
}

module.exports = Job;
