const express = require('express');
const router = express.Router();

const alumniController = require('../controllers/alumniController');
const { authenticateToken, requireApproved, optionalAuth } = require('../middleware/auth');
const { validateAlumniProfile } = require('../middleware/validation');

// Public routes (with optional authentication for better access control)
router.get('/', optionalAuth, alumniController.getAllAlumni);
router.get('/stats', optionalAuth, alumniController.getAlumniStats);
router.get('/search', optionalAuth, alumniController.searchAlumni);
router.get('/:alumniId', optionalAuth, alumniController.getAlumniById);

// Protected routes (require authentication and approval)
router.post('/profile', authenticateToken, requireApproved, validateAlumniProfile, alumniController.createOrUpdateAlumniProfile);
router.put('/profile', authenticateToken, requireApproved, validateAlumniProfile, alumniController.createOrUpdateAlumniProfile);

module.exports = router;
