const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const { authenticateToken, requireApproved, requireAdmin, requireAuthority, optionalAuth } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

// Public routes (with optional authentication for better access control)
router.get('/', optionalAuth, eventController.getAllEvents);
router.get('/:eventId', optionalAuth, eventController.getEventById);

// Protected routes (require authentication and approval)
router.post('/:eventId/register', authenticateToken, requireApproved, eventController.registerForEvent);
router.delete('/:eventId/register', authenticateToken, requireApproved, eventController.unregisterFromEvent);

// Admin/Authority routes
router.post('/', authenticateToken, requireAdmin, validateEvent, eventController.createEvent);
router.put('/:eventId', authenticateToken, requireAdmin, validateEvent, eventController.updateEvent);

// Authority only routes
router.delete('/:eventId', authenticateToken, requireAuthority, eventController.deleteEvent);

module.exports = router;
