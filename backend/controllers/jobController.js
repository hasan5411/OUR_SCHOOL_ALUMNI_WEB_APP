const Job = require('../models/Job');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for file uploads
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create job post (member and above)
const createJobPost = async (req, res) => {
  try {
    const jobData = {
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      location: req.body.location,
      job_type: req.body.job_type,
      experience_level: req.body.experience_level,
      salary_range: req.body.salary_range,
      salary_currency: req.body.salary_currency || 'NGN',
      application_deadline: req.body.application_deadline,
      contact_email: req.body.contact_email,
      contact_phone: req.body.contact_phone,
      application_url: req.body.application_url,
      posted_by: req.user.id
    };

    const job = await Job.createJob(jobData);

    res.status(201).json({
      message: 'Job post created successfully. It will be visible after admin approval.',
      job
    });
  } catch (error) {
    console.error('Create job post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get job posts (public access)
const getJobPosts = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      job_type: req.query.job_type,
      experience_level: req.query.experience_level,
      location: req.query.location,
      is_active: req.query.is_active !== 'false' ? true : false
    };

    // Non-admin users can only see approved jobs
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      filters.is_approved = true;
    }

    const result = await Job.getJobPosts(filters);

    res.json({
      message: 'Job posts retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get job posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single job post
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.getJobById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Check if user can view this job
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (!job.approved_by || !job.is_active) {
        return res.status(404).json({ message: 'Job post not found' });
      }
    }

    // Increment view count
    await Job.incrementViewCount(jobId);

    res.json({
      message: 'Job post retrieved successfully',
      job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update job post (owner or admin)
const updateJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    // Check if user can update this job
    const existingJob = await Job.getJobById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingJob.posted_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update your own job posts' });
      }
    }

    const job = await Job.updateJob(jobId, updateData);

    res.json({
      message: 'Job post updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete job post (owner or admin)
const deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if user can delete this job
    const existingJob = await Job.getJobById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingJob.posted_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only delete your own job posts' });
      }
    }

    await Job.deleteJob(jobId);

    res.json({
      message: 'Job post deleted successfully'
    });
  } catch (error) {
    console.error('Delete job post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve job post (admin only)
const approveJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.approveJob(jobId, req.user.id);

    res.json({
      message: 'Job post approved successfully',
      job
    });
  } catch (error) {
    console.error('Approve job post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Apply for job (member and above)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and is active/approved
    const job = await Job.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (!job.is_active || !job.approved_by) {
      return res.status(400).json({ message: 'This job is not currently accepting applications' });
    }

    // Check if application deadline has passed
    if (job.application_deadline && new Date(job.application_deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const applicationData = {
      job_post_id: jobId,
      applicant_id: req.user.id,
      full_name: req.body.full_name || `${req.user.first_name} ${req.user.last_name}`,
      email: req.body.email || req.user.email,
      phone: req.body.phone,
      cover_letter: req.body.cover_letter,
      portfolio_url: req.body.portfolio_url,
      linkedin_url: req.body.linkedin_url,
      current_occupation: req.body.current_occupation,
      current_company: req.body.current_company,
      experience_years: req.body.experience_years,
      expected_salary: req.body.expected_salary,
      availability_date: req.body.availability_date
    };

    const application = await Job.createApplication(applicationData);

    res.status(201).json({
      message: 'Job application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    
    if (error.message.includes('duplicate key')) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload CV for job application
const uploadCV = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check file size (5MB limit for CVs)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 5MB' });
    }

    // Check file type (PDF, DOC, DOCX)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only PDF, DOC, and DOCX files are allowed for CVs' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `cv-${applicationId}-${Date.now()}.${fileExt}`;
    const filePath = `cvs/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('job-documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Error uploading CV' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('job-documents')
      .getPublicUrl(filePath);

    // Update application with resume URL
    const { data: application, error: updateError } = await supabase
      .from('job_applications')
      .update({ resume_url: publicUrl })
      .eq('id', applicationId)
      .select('id, resume_url')
      .single();

    if (updateError) {
      console.error('Update application error:', updateError);
      return res.status(500).json({ message: 'Error updating application with CV' });
    }

    res.json({
      message: 'CV uploaded successfully',
      resumeUrl: publicUrl,
      application
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get job applications for a specific job (job owner or admin)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if user can view applications for this job
    const job = await Job.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (job.posted_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only view applications for your own job posts' });
      }
    }

    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      application_status: req.query.application_status
    };

    const result = await Job.getJobApplications(jobId, filters);

    res.json({
      message: 'Job applications retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's job applications
const getUserApplications = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      application_status: req.query.application_status
    };

    const result = await Job.getUserApplications(req.user.id, filters);

    res.json({
      message: 'User applications retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update application status (admin or job owner)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    // Check if user can update this application
    const { data: application } = await supabase
      .from('job_applications')
      .select(`
        job_post_id,
        job_posts(posted_by)
      `)
      .eq('id', applicationId)
      .single();

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (application.job_posts.posted_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update applications for your own job posts' });
      }
    }

    const updatedApplication = await Job.updateApplicationStatus(
      applicationId, 
      status, 
      req.user.id, 
      notes
    );

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get job statistics (admin only)
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.getJobStats();

    res.json({
      message: 'Job statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createJobPost,
  getJobPosts,
  getJobById,
  updateJobPost,
  deleteJobPost,
  approveJobPost,
  applyForJob,
  uploadCV,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
  getJobStats
};
