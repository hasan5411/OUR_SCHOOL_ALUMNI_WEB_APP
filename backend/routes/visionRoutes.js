const express = require('express');
const router = express.Router();

const visionController = require('../controllers/visionController');
const { authenticateToken, requireApproved, requireAdmin } = require('../middleware/auth');

// Public routes (any authenticated user can view approved visions)
router.get('/', authenticateToken, visionController.getVisionIdeas);
router.get('/stats', authenticateToken, requireAdmin, visionController.getVisionStats);
router.get('/:visionId', authenticateToken, visionController.getVisionById);

// Vision idea management (member and above for creation, owner/admin for update/delete)
router.post('/', authenticateToken, requireApproved, visionController.createVision);
router.put('/:visionId', authenticateToken, requireApproved, visionController.updateVision);
router.delete('/:visionId', authenticateToken, requireApproved, visionController.deleteVision);

// Admin/Authority approval actions
router.put('/:visionId/approve', authenticateToken, requireAdmin, visionController.approveVision);
router.put('/:visionId/reject', authenticateToken, requireAdmin, visionController.rejectVision);

// Progress tracking (assigned user or admin)
router.put('/:visionId/progress', authenticateToken, requireApproved, visionController.updateVisionProgress);

// Voting (member and above)
router.post('/:visionId/vote', authenticateToken, requireApproved, visionController.voteVision);

// User's own visions
router.get('/my-visions', authenticateToken, requireApproved, visionController.getUserVisions);

module.exports = router;
