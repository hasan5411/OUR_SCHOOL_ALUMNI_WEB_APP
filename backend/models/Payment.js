const { supabase } = require('../config/database');

class Payment {
  // Create new payment transaction
  static async createPayment(paymentData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select(`
          id,
          student_id,
          payment_reference,
          payment_type,
          amount,
          currency,
          payment_method,
          payment_status,
          transaction_id,
          bank_name,
          account_number,
          payment_date,
          due_date,
          paid_date,
          description,
          notes,
          created_by,
          verified_by,
          verified_at,
          created_at,
          updated_at,
          students(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Get payments with filtering and pagination
  static async getPayments(filters = {}, requestingUserRole, requestingUserId) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        payment_type,
        payment_method,
        payment_status,
        student_id,
        from_date,
        to_date,
        min_amount,
        max_amount
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('payments')
        .select(`
          id,
          student_id,
          payment_reference,
          payment_type,
          amount,
          currency,
          payment_method,
          payment_status,
          transaction_id,
          bank_name,
          account_number,
          payment_date,
          due_date,
          paid_date,
          description,
          notes,
          created_by,
          verified_by,
          verified_at,
          created_at,
          updated_at,
          students(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `, { count: 'exact' });

      // Apply search filter
      if (search) {
        query = query.or(`
          payment_reference.ilike.%${search}%,
          payment_type.ilike.%${search}%,
          description.ilike.%${search}%,
          transaction_id.ilike.%${search}%,
          students.first_name.ilike.%${search}%,
          students.last_name.ilike.%${search}%
        `);
      }

      // Apply filters
      if (payment_type) query = query.eq('payment_type', payment_type);
      if (payment_method) query = query.eq('payment_method', payment_method);
      if (payment_status) query = query.eq('payment_status', payment_status);
      if (student_id) query = query.eq('student_id', student_id);

      // Date range filters
      if (from_date) query = query.gte('payment_date', from_date);
      if (to_date) query = query.lte('payment_date', to_date);
      if (from_date) query = query.gte('paid_date', from_date);
      if (to_date) query = query.lte('paid_date', to_date);

      // Amount range filters
      if (min_amount) query = query.gte('amount', min_amount);
      if (max_amount) query = query.lte('amount', max_amount);

      // Role-based access control
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        // Regular users can only see their own payments
        query = query.eq('created_by', requestingUserId);
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: payments, error, count } = await query;

      if (error) throw error;

      return {
        payments: payments || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }

  // Get single payment by ID
  static async getPaymentById(paymentId, requestingUserRole, requestingUserId) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          id,
          student_id,
          payment_reference,
          payment_type,
          amount,
          currency,
          payment_method,
          payment_status,
          transaction_id,
          bank_name,
          account_number,
          payment_date,
          due_date,
          paid_date,
          description,
          notes,
          created_by,
          verified_by,
          verified_at,
          created_at,
          updated_at,
          students(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('id', paymentId)
        .single();

      // Role-based access control
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        query = query.eq('created_by', requestingUserId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      throw error;
    }
  }

  // Update payment
  static async updatePayment(paymentId, updateData, requestingUserRole, requestingUserId) {
    try {
      // Check if user can update this payment
      const existingPayment = await Payment.getPaymentById(paymentId, requestingUserRole, requestingUserId);
      if (!existingPayment) {
        throw new Error('Payment not found');
      }

      // Regular users can only update certain fields and only their own payments
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        if (existingPayment.created_by !== requestingUserId) {
          throw new Error('Access denied: You can only update your own payments');
        }

        // Regular users can only update limited fields
        const allowedFields = ['description', 'notes'];
        const filteredData = {};
        
        allowedFields.forEach(field => {
          if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field];
          }
        });
        
        updateData = filteredData;
      }

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select(`
          id,
          student_id,
          payment_reference,
          payment_type,
          amount,
          currency,
          payment_method,
          payment_status,
          transaction_id,
          bank_name,
          account_number,
          payment_date,
          due_date,
          paid_date,
          description,
          notes,
          created_by,
          verified_by,
          verified_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  // Delete payment
  static async deletePayment(paymentId, requestingUserRole, requestingUserId) {
    try {
      // Check if user can delete this payment
      const existingPayment = await Payment.getPaymentById(paymentId, requestingUserRole, requestingUserId);
      if (!existingPayment) {
        throw new Error('Payment not found');
      }

      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        if (existingPayment.created_by !== requestingUserId) {
          throw new Error('Access denied: You can only delete your own payments');
        }
        
        // Regular users can only delete pending payments
        if (existingPayment.payment_status !== 'pending') {
          throw new Error('Access denied: Cannot delete verified or completed payments');
        }
      }

      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  // Verify payment (admin/authority only)
  static async verifyPayment(paymentId, adminId, verificationStatus, notes = null) {
    try {
      const updateData = {
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        payment_status: verificationStatus
      };

      if (verificationStatus === 'completed') {
        updateData.paid_date = new Date().toISOString();
      }

      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select(`
          id,
          payment_reference,
          payment_status,
          verified_by,
          verified_at,
          paid_date,
          notes,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Create bKash payment
  static async createBkashPayment(paymentData) {
    try {
      const bkashPaymentData = {
        ...paymentData,
        payment_method: 'bkash',
        payment_reference: `BKASH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      return await Payment.createPayment(bkashPaymentData);
    } catch (error) {
      console.error('Error creating bKash payment:', error);
      throw error;
    }
  }

  // Create Nagad payment
  static async createNagadPayment(paymentData) {
    try {
      const nagadPaymentData = {
        ...paymentData,
        payment_method: 'nagad',
        payment_reference: `NAGAD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      return await Payment.createPayment(nagadPaymentData);
    } catch (error) {
      console.error('Error creating Nagad payment:', error);
      throw error;
    }
  }

  // Get payment statistics
  static async getPaymentStats(requestingUserRole, requestingUserId) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          id,
          payment_type,
          payment_method,
          payment_status,
          amount,
          currency,
          payment_date,
          created_at
        `);

      // Role-based access control
      if (requestingUserRole !== 'admin' && requestingUserRole !== 'authority') {
        query = query.eq('created_by', requestingUserId);
      }

      const { data: payments, error } = await query;

      if (error) throw error;

      // Calculate statistics
      const totalPayments = payments?.length || 0;
      const pendingPayments = payments?.filter(p => p.payment_status === 'pending').length || 0;
      const completedPayments = payments?.filter(p => p.payment_status === 'completed').length || 0;
      const failedPayments = payments?.filter(p => p.payment_status === 'failed').length || 0;
      const refundedPayments = payments?.filter(p => p.payment_status === 'refunded').length || 0;

      const paymentTypeStats = {};
      const paymentMethodStats = {};
      let totalAmount = 0;
      let completedAmount = 0;
      let pendingAmount = 0;

      payments?.forEach(payment => {
        // Payment type statistics
        paymentTypeStats[payment.payment_type] = (paymentTypeStats[payment.payment_type] || 0) + 1;
        
        // Payment method statistics
        paymentMethodStats[payment.payment_method] = (paymentMethodStats[payment.payment_method] || 0) + 1;
        
        // Aggregate amounts
        totalAmount += payment.amount || 0;
        if (payment.payment_status === 'completed') {
          completedAmount += payment.amount || 0;
        }
        if (payment.payment_status === 'pending') {
          pendingAmount += payment.amount || 0;
        }
      });

      return {
        totalPayments,
        pendingPayments,
        completedPayments,
        failedPayments,
        refundedPayments,
        paymentTypeStats,
        paymentMethodStats,
        totalAmount,
        completedAmount,
        pendingAmount,
        averageAmount: totalPayments > 0 ? totalAmount / totalPayments : 0
      };
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      throw error;
    }
  }

  // Get user's payment history
  static async getUserPayments(userId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        payment_type,
        payment_method,
        payment_status,
        from_date,
        to_date
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('payments')
        .select(`
          id,
          student_id,
          payment_reference,
          payment_type,
          amount,
          currency,
          payment_method,
          payment_status,
          transaction_id,
          payment_date,
          due_date,
          paid_date,
          description,
          notes,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('created_by', userId);

      // Apply filters
      if (payment_type) query = query.eq('payment_type', payment_type);
      if (payment_method) query = query.eq('payment_method', payment_method);
      if (payment_status) query = query.eq('payment_status', payment_status);
      if (from_date) query = query.gte('payment_date', from_date);
      if (to_date) query = query.lte('payment_date', to_date);

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: payments, error, count } = await query;

      if (error) throw error;

      return {
        payments: payments || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  }
}

module.exports = Payment;
