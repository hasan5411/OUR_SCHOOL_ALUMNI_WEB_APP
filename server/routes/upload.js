const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadController');
const { authenticateToken, requireApproved, requireAdmin, requireAuthority } = require('../middleware/auth');

// Upload profile image (approved users only)
router.post('/profile', authenticateToken, requireApproved, uploadController.upload.single('image'), uploadController.uploadProfileImage);

// Upload event image (admin/authority only)
router.post('/event', authenticateToken, requireAdmin, uploadController.upload.single('image'), uploadController.uploadEventImage);

// Upload announcement image (admin/authority only)
router.post('/announcement', authenticateToken, requireAdmin, uploadController.upload.single('image'), uploadController.uploadAnnouncementImage);

// Upload document (approved users only)
router.post('/document', authenticateToken, requireApproved, uploadController.upload.single('document'), uploadController.uploadDocument);

// Delete file (admin/authority only)
router.delete('/file', authenticateToken, requireAdmin, uploadController.deleteFile);

module.exports = router;
