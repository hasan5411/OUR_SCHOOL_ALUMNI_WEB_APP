const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const { authenticateToken, requireApproved, requireAdmin, requireAuthority, optionalAuth } = require('../middleware/auth');
const { validateJobPosting } = require('../middleware/validation');

// Public routes (with optional authentication for better access control)
router.get('/', optionalAuth, jobController.getAllJobPostings);
router.get('/stats', optionalAuth, jobController.getJobPostingStats);
router.get('/:jobPostingId', optionalAuth, jobController.getJobPostingById);

// Protected routes (require authentication and approval)
router.post('/', authenticateToken, requireApproved, validateJobPosting, jobController.createJobPosting);

// Update routes (owner, admin, or authority)
router.put('/:jobPostingId', authenticateToken, requireApproved, validateJobPosting, jobController.updateJobPosting);

// Delete routes (owner, admin, or authority)
router.delete('/:jobPostingId', authenticateToken, requireApproved, jobController.deleteJobPosting);

module.exports = router;
