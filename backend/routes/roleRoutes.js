const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const { authenticateToken, requireAdmin, requireAuthority } = require('../middleware/auth');

// All role management routes require authentication
router.use(authenticateToken);

// View-only routes (admin and above)
router.get('/roles', requireAdmin, roleController.getAllRoles);
router.get('/stats', requireAdmin, roleController.getRoleStats);
router.get('/pending', requireAdmin, roleController.getPendingUsers);
router.get('/admins', requireAdmin, roleController.getAdmins);
router.get('/admin-limit', requireAdmin, roleController.checkAdminLimit);

// User approval/rejection (admin and above)
router.post('/users/:userId/approve', requireAdmin, roleController.approveUser);
router.post('/users/:userId/reject', requireAdmin, roleController.rejectUser);

// Bulk operations (admin and above)
router.post('/bulk-approve', requireAdmin, roleController.bulkApproveUsers);
router.post('/bulk-reject', requireAdmin, roleController.bulkRejectUsers);

// Admin promotion/demotion (authority only)
router.post('/users/:userId/promote-admin', requireAuthority, roleController.promoteToAdmin);
router.post('/users/:userId/demote-member', requireAuthority, roleController.demoteToMember);
router.put('/:id/demote-member', requireAuthority, roleController.demoteToMember);

// Role changes (authority only)
router.put('/users/:userId/role', requireAuthority, roleController.changeUserRole);

module.exports = router;
