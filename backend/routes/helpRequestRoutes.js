const express = require('express');
const router = express.Router();

const helpRequestController = require('../controllers/helpRequestController');
const { authenticateToken, requireApproved, requireAdmin } = require('../middleware/auth');

// Public routes (any authenticated user can view verified help requests)
router.get('/', authenticateToken, helpRequestController.getHelpRequests);
router.get('/stats', authenticateToken, requireAdmin, helpRequestController.getHelpRequestStats);

// User's own help requests - MUST be defined BEFORE dynamic /:helpRequestId routes
// Otherwise "my-requests" will be treated as a helpRequestId parameter
router.get('/my-requests', authenticateToken, requireApproved, helpRequestController.getUserHelpRequests);

// Dynamic routes - these catch-all routes must come after static routes
router.get('/:helpRequestId', authenticateToken, helpRequestController.getHelpRequestById);

// Help request management (member and above for creation, owner/admin for update/delete)
router.post('/', authenticateToken, requireApproved, helpRequestController.createHelpRequest);
router.put('/:helpRequestId', authenticateToken, requireApproved, helpRequestController.updateHelpRequest);
router.delete('/:helpRequestId', authenticateToken, requireApproved, helpRequestController.deleteHelpRequest);

// Admin/Authority verification and approval actions
router.put('/:helpRequestId/verify', authenticateToken, requireAdmin, helpRequestController.verifyHelpRequest);
router.put('/:helpRequestId/approve', authenticateToken, requireAdmin, helpRequestController.approveHelpRequest);

// Resolution and management (assigned user or admin)
router.put('/:helpRequestId/resolve', authenticateToken, requireApproved, helpRequestController.resolveHelpRequest);
router.put('/:helpRequestId/amount', authenticateToken, requireApproved, helpRequestController.updateAmountRaised);

// Support (member and above)
router.post('/:helpRequestId/support', authenticateToken, requireApproved, helpRequestController.supportHelpRequest);

module.exports = router;
