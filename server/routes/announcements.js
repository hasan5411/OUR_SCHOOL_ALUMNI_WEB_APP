const express = require('express');
const router = express.Router();

const announcementController = require('../controllers/announcementController');
const { authenticateToken, requireAdmin, requireAuthority, optionalAuth } = require('../middleware/auth');
const { validateAnnouncement } = require('../middleware/validation');

// Public routes (with optional authentication for better access control)
router.get('/', optionalAuth, announcementController.getAllAnnouncements);
router.get('/:announcementId', optionalAuth, announcementController.getAnnouncementById);

// Admin/Authority routes
router.post('/', authenticateToken, requireAdmin, validateAnnouncement, announcementController.createAnnouncement);
router.put('/:announcementId', authenticateToken, requireAdmin, validateAnnouncement, announcementController.updateAnnouncement);

// Authority only routes
router.delete('/:announcementId', authenticateToken, requireAuthority, announcementController.deleteAnnouncement);

module.exports = router;
