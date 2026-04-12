const Payment = require('../models/Payment');

// Create payment transaction (member and above)
const createPayment = async (req, res) => {
  try {
    const paymentData = {
      student_id: req.body.student_id,
      payment_type: req.body.payment_type,
      amount: req.body.amount,
      currency: req.body.currency || 'BDT',
      payment_method: req.body.payment_method,
      transaction_id: req.body.transaction_id,
      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      payment_date: req.body.payment_date,
      due_date: req.body.due_date,
      description: req.body.description,
      notes: req.body.notes,
      created_by: req.user.id
    };

    const payment = await Payment.createPayment(paymentData);

    res.status(201).json({
      message: 'Payment transaction created successfully',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create bKash payment (member and above)
const createBkashPayment = async (req, res) => {
  try {
    const paymentData = {
      student_id: req.body.student_id,
      payment_type: req.body.payment_type,
      amount: req.body.amount,
      currency: req.body.currency || 'BDT',
      transaction_id: req.body.transaction_id,
      payment_date: req.body.payment_date,
      due_date: req.body.due_date,
      description: req.body.description,
      notes: req.body.notes,
      created_by: req.user.id
    };

    const payment = await Payment.createBkashPayment(paymentData);

    res.status(201).json({
      message: 'bKash payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create bKash payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Nagad payment (member and above)
const createNagadPayment = async (req, res) => {
  try {
    const paymentData = {
      student_id: req.body.student_id,
      payment_type: req.body.payment_type,
      amount: req.body.amount,
      currency: req.body.currency || 'BDT',
      transaction_id: req.body.transaction_id,
      payment_date: req.body.payment_date,
      due_date: req.body.due_date,
      description: req.body.description,
      notes: req.body.notes,
      created_by: req.user.id
    };

    const payment = await Payment.createNagadPayment(paymentData);

    res.status(201).json({
      message: 'Nagad payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create Nagad payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payments (role-based access)
const getPayments = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      payment_type: req.query.payment_type,
      payment_method: req.query.payment_method,
      payment_status: req.query.payment_status,
      student_id: req.query.student_id,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
      min_amount: req.query.min_amount,
      max_amount: req.query.max_amount
    };

    const result = await Payment.getPayments(filters, req.user.roles?.name, req.user.id);

    res.json({
      message: 'Payments retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.getPaymentById(paymentId, req.user.roles?.name, req.user.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      message: 'Payment retrieved successfully',
      payment
    });
  } catch (error) {
    console.error('Get payment by ID error:', error);
    
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update payment (owner or admin)
const updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const updateData = req.body;

    const payment = await Payment.updatePayment(paymentId, updateData, req.user.roles?.name, req.user.id);

    res.json({
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    console.error('Update payment error:', error);
    
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete payment (owner or admin)
const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    await Payment.deletePayment(paymentId, req.user.roles?.name, req.user.id);

    res.json({
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify payment (admin/authority only)
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { verification_status, notes } = req.body;

    if (!['completed', 'failed', 'refunded'].includes(verification_status)) {
      return res.status(400).json({ message: 'Invalid verification status. Must be completed, failed, or refunded' });
    }

    const payment = await Payment.verifyPayment(paymentId, req.user.id, verification_status, notes);

    res.json({
      message: `Payment ${verification_status} successfully`,
      payment
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's payment history
const getUserPayments = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      payment_type: req.query.payment_type,
      payment_method: req.query.payment_method,
      payment_status: req.query.payment_status,
      from_date: req.query.from_date,
      to_date: req.query.to_date
    };

    const result = await Payment.getUserPayments(req.user.id, filters);

    res.json({
      message: 'User payments retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get payment statistics (role-based access)
const getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.getPaymentStats(req.user.roles?.name, req.user.id);

    res.json({
      message: 'Payment statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search payments by reference or transaction ID
const searchPayments = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: query,
      payment_method: req.query.payment_method,
      payment_status: req.query.payment_status
    };

    const result = await Payment.getPayments(filters, req.user.roles?.name, req.user.id);

    res.json({
      message: 'Payment search completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Search payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPayment,
  createBkashPayment,
  createNagadPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  verifyPayment,
  getUserPayments,
  getPaymentStats,
  searchPayments
};
