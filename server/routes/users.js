const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin, requireAuthority } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

// All user routes require admin or authority role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/users - Get all users with pagination and filters
router.get('/', userController.getAllUsers);

// GET /api/users/stats - Get user statistics
router.get('/stats', userController.getUserStats);

// GET /api/users/:userId - Get user by ID
router.get('/:userId', userController.getUserById);

// PUT /api/users/:userId - Update user
router.put('/:userId', validateUserUpdate, userController.updateUser);

// PUT /api/users/:userId/approve - Approve user
router.put('/:userId/approve', userController.approveUser);

// DELETE /api/users/:userId - Delete user (authority only)
router.delete('/:userId', requireAuthority, userController.deleteUser);

module.exports = router;
