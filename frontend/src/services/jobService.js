import api from './api';

export const jobService = {
  // Get job posts
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.experience_level) params.append('experience_level', filters.experience_level);
    if (filters.location) params.append('location', filters.location);
    
    const response = await api.get(`/jobs?${params}`);
    return response.data;
  },

  // Get single job post
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create job post
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job post
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job post
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // Approve job post (admin only)
  approveJob: async (jobId) => {
    const response = await api.put(`/jobs/${jobId}/approve`);
    return response.data;
  },

  // Apply for job
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  // Upload CV for application
  uploadCV: async (applicationId, file) => {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await api.post(`/jobs/applications/${applicationId}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get job applications (job owner or admin)
  getJobApplications: async (jobId, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.application_status) params.append('application_status', filters.application_status);
    
    const response = await api.get(`/jobs/${jobId}/applications?${params}`);
    return response.data;
  },

  // Get user's job applications
  getUserApplications: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.application_status) params.append('application_status', filters.application_status);
    
    const response = await api.get(`/jobs/my-applications?${params}`);
    return response.data;
  },

  // Update application status (job owner or admin)
  updateApplicationStatus: async (applicationId, statusData) => {
    const response = await api.put(`/jobs/applications/${applicationId}/status`, statusData);
    return response.data;
  },

  // Get job statistics (admin only)
  getJobStats: async () => {
    const response = await api.get('/jobs/stats');
    return response.data;
  }
};
