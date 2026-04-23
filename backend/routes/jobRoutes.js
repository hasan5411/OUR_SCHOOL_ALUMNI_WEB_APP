const express = require('express');
const router = express.Router();
const multer = require('multer');
const { memoryStorage } = multer;

const jobController = require('../controllers/jobController');
const { authenticateToken, requireApproved, requireAdmin } = require('../middleware/auth');

// Configure multer for memory storage (for CV uploads)
const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for CVs
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for CVs'), false);
    }
  }
});

// Public routes (any authenticated user can view jobs)
router.get('/', authenticateToken, jobController.getJobPosts);
router.get('/stats', authenticateToken, requireAdmin, jobController.getJobStats);

// Static routes MUST be defined before dynamic routes
// Job applications - static routes (must come before /:jobId)
router.get('/my-applications', authenticateToken, requireApproved, jobController.getUserApplications);

// Dynamic routes - these catch-all routes must come after static routes
router.get('/:jobId', authenticateToken, jobController.getJobById);

// Job post management (member and above for creation, owner/admin for update/delete)
router.post('/', authenticateToken, requireApproved, jobController.createJobPost);
router.put('/:jobId', authenticateToken, requireApproved, jobController.updateJobPost);
router.delete('/:jobId', authenticateToken, requireApproved, jobController.deleteJobPost);

// Admin approval
router.put('/:jobId/approve', authenticateToken, requireAdmin, jobController.approveJobPost);

// Job applications (member and above)
router.post('/:jobId/apply', authenticateToken, requireApproved, jobController.applyForJob);

// CV upload for applications
router.post('/applications/:applicationId/cv', authenticateToken, requireApproved, upload.single('cv'), jobController.uploadCV);

// View applications for a job (job owner or admin)
router.get('/:jobId/applications', authenticateToken, requireApproved, jobController.getJobApplications);

// Update application status (admin or job owner)
router.put('/applications/:applicationId/status', authenticateToken, requireApproved, jobController.updateApplicationStatus);

module.exports = router;
