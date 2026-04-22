const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
  getUserEventRegistrations,
  updateRegistrationStatus,
  getEventStats
} = require('../controllers/eventController');
const { authenticateToken, requireApproved } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// Public routes (with authentication)
router.get('/', authenticateToken, getEvents);
router.get('/stats', authenticateToken, requireAdmin, getEventStats);
router.get('/my-registrations', authenticateToken, getUserEventRegistrations);

// Event routes
router.post('/', authenticateToken, requireApproved, createEvent);
router.get('/:eventId', authenticateToken, getEventById);
router.put('/:eventId', authenticateToken, requireApproved, updateEvent);
router.delete('/:eventId', authenticateToken, requireApproved, deleteEvent);

// Registration routes
router.post('/:eventId/register', authenticateToken, requireApproved, registerForEvent);
router.get('/:eventId/registrations', authenticateToken, getEventRegistrations);
router.put('/registrations/:registrationId', authenticateToken, requireAdmin, updateRegistrationStatus);

module.exports = router;
