const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const { authenticateToken, requireApproved, requireAdmin } = require('../middleware/auth');

// Payment creation (member and above)
router.post('/', authenticateToken, requireApproved, paymentController.createPayment);
router.post('/bkash', authenticateToken, requireApproved, paymentController.createBkashPayment);
router.post('/nagad', authenticateToken, requireApproved, paymentController.createNagadPayment);

// Payment retrieval (role-based access)
router.get('/', authenticateToken, paymentController.getPayments);
router.get('/stats', authenticateToken, paymentController.getPaymentStats);
router.get('/search', authenticateToken, paymentController.searchPayments);

// User's own payment history
router.get('/my-payments', authenticateToken, requireApproved, paymentController.getUserPayments);

// Single payment operations
router.get('/:paymentId', authenticateToken, paymentController.getPaymentById);
router.put('/:paymentId', authenticateToken, requireApproved, paymentController.updatePayment);
router.delete('/:paymentId', authenticateToken, requireApproved, paymentController.deletePayment);

// Admin/Authority verification
router.put('/:paymentId/verify', authenticateToken, requireAdmin, paymentController.verifyPayment);

module.exports = router;
