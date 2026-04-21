const { supabase } = require('../config/database');

class HelpRequest {
  // Create new help request
  static async createHelpRequest(helpRequestData) {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .insert(helpRequestData)
        .select(`
          id,
          title,
          description,
          help_type,
          urgency_level,
          status,
          amount_needed,
          amount_raised,
          currency,
          deadline,
          beneficiary_name,
          beneficiary_relationship,
          beneficiary_contact,
          location,
          supporting_documents,
          verification_status,
          verification_notes,
          verified_by,
          verified_at,
          assigned_to,
          resolution_details,
          resolution_date,
          privacy_level,
          view_count,
          support_count,
          created_by,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating help request:', error);
      throw error;
    }
  }

  // Get help requests with filtering and pagination
  static async getHelpRequests(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        help_type,
        urgency_level,
        status,
        verification_status,
        created_by,
        assigned_to,
        privacy_level,
        show_closed = false
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('help_requests')
        .select(`
          id,
          title,
          description,
          help_type,
          urgency_level,
          status,
          amount_needed,
          amount_raised,
          currency,
          deadline,
          beneficiary_name,
          beneficiary_relationship,
          beneficiary_contact,
          location,
          supporting_documents,
          verification_status,
          verification_notes,
          verified_by,
          verified_at,
          assigned_to,
          resolution_details,
          resolution_date,
          privacy_level,
          view_count,
          support_count,
          created_by,
          created_at,
          updated_at
        `, { count: 'exact' });

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,help_type.ilike.%${search}%,location.ilike.%${search}%`);
      }

      // Apply filters
      if (help_type) query = query.eq('help_type', help_type);
      if (urgency_level) query = query.eq('urgency_level', urgency_level);
      if (status) query = query.eq('status', status);
      if (verification_status) query = query.eq('verification_status', verification_status);
      if (created_by) query = query.eq('created_by', created_by);
      if (assigned_to) query = query.eq('assigned_to', assigned_to);
      if (privacy_level) query = query.eq('privacy_level', privacy_level);

      // Filter out closed requests unless explicitly requested
      if (!show_closed) {
        query = query.not('status', 'in', '("closed", "cancelled")');
      }

      // Apply pagination and ordering
      query = query
        .order('urgency_level', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: helpRequests, error, count } = await query;

      if (error) throw error;

      return {
        helpRequests: helpRequests || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting help requests:', error);
      throw error;
    }
  }

  // Get single help request by ID
  static async getHelpRequestById(helpRequestId) {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          id,
          title,
          description,
          help_type,
          urgency_level,
          status,
          amount_needed,
          amount_raised,
          currency,
          deadline,
          beneficiary_name,
          beneficiary_relationship,
          beneficiary_contact,
          location,
          supporting_documents,
          verification_status,
          verification_notes,
          verified_by,
          verified_at,
          assigned_to,
          resolution_details,
          resolution_date,
          privacy_level,
          view_count,
          support_count,
          created_by,
          created_at,
          updated_at
        `)
        .eq('id', helpRequestId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting help request by ID:', error);
      throw error;
    }
  }

  // Update help request
  static async updateHelpRequest(helpRequestId, updateData) {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .update(updateData)
        .eq('id', helpRequestId)
        .select(`
          id,
          title,
          description,
          help_type,
          urgency_level,
          status,
          amount_needed,
          amount_raised,
          currency,
          deadline,
          beneficiary_name,
          beneficiary_relationship,
          beneficiary_contact,
          location,
          supporting_documents,
          verification_status,
          verification_notes,
          verified_by,
          verified_at,
          assigned_to,
          resolution_details,
          resolution_date,
          privacy_level,
          view_count,
          support_count,
          created_by,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating help request:', error);
      throw error;
    }
  }

  // Delete help request
  static async deleteHelpRequest(helpRequestId) {
    try {
      const { error } = await supabase
        .from('help_requests')
        .delete()
        .eq('id', helpRequestId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting help request:', error);
      throw error;
    }
  }

  // Verify help request (admin/authority only)
  static async verifyHelpRequest(helpRequestId, adminId, verificationStatus, notes = null) {
    try {
      const updateData = {
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        verification_status: verificationStatus
      };

      if (notes) {
        updateData.verification_notes = notes;
      }

      const { data, error } = await supabase
        .from('help_requests')
        .update(updateData)
        .eq('id', helpRequestId)
        .select(`
          id,
          title,
          verified_by,
          verified_at,
          verification_status,
          verification_notes,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying help request:', error);
      throw error;
    }
  }

  // Approve help request (admin/authority only)
  static async approveHelpRequest(helpRequestId, adminId, assignedTo = null) {
    try {
      const updateData = {
        status: 'under_review'
      };

      if (assignedTo) {
        updateData.assigned_to = assignedTo;
        updateData.status = 'in_progress';
      }

      const { data, error } = await supabase
        .from('help_requests')
        .update(updateData)
        .eq('id', helpRequestId)
        .select(`
          id,
          title,
          status,
          assigned_to,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving help request:', error);
      throw error;
    }
  }

  // Resolve help request
  static async resolveHelpRequest(helpRequestId, resolutionDetails, userId) {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .update({
          status: 'resolved',
          resolution_details,
          resolution_date: new Date().toISOString()
        })
        .eq('id', helpRequestId)
        .select(`
          id,
          title,
          status,
          resolution_details,
          resolution_date,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error resolving help request:', error);
      throw error;
    }
  }

  // Update amount raised
  static async updateAmountRaised(helpRequestId, amount) {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .update({ amount_raised: amount })
        .eq('id', helpRequestId)
        .select(`
          id,
          title,
          amount_needed,
          amount_raised,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating amount raised:', error);
      throw error;
    }
  }

  // Support help request
  static async supportHelpRequest(helpRequestId, userId) {
    try {
      const { data: existingSupport } = await supabase
        .from('help_request_supports')
        .select('id')
        .eq('help_request_id', helpRequestId)
        .eq('user_id', userId)
        .single();

      if (existingSupport) {
        // Remove existing support
        const { error } = await supabase
          .from('help_request_supports')
          .delete()
          .eq('help_request_id', helpRequestId)
          .eq('user_id', userId);

        if (error) throw error;

        await supabase.rpc('update_help_request_support_count', { help_request_id_param: helpRequestId });
        
        return { message: 'Support removed successfully' };
      } else {
        // Add new support
        const { error } = await supabase
          .from('help_request_supports')
          .insert({
            help_request_id: helpRequestId,
            user_id: userId
          });

        if (error) throw error;

        await supabase.rpc('update_help_request_support_count', { help_request_id_param: helpRequestId });
        
        return { message: 'Support added successfully' };
      }
    } catch (error) {
      console.error('Error supporting help request:', error);
      throw error;
    }
  }

  // Get user's help requests
  static async getUserHelpRequests(userId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        help_type
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('help_requests')
        .select(`
          id,
          title,
          description,
          help_type,
          urgency_level,
          status,
          amount_needed,
          amount_raised,
          currency,
          deadline,
          beneficiary_name,
          beneficiary_relationship,
          beneficiary_contact,
          location,
          verification_status,
          verification_notes,
          privacy_level,
          view_count,
          support_count,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('created_by', userId);

      // Apply filters
      if (status) query = query.eq('status', status);
      if (help_type) query = query.eq('help_type', help_type);

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: helpRequests, error, count } = await query;

      if (error) throw error;

      return {
        helpRequests: helpRequests || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user help requests:', error);
      throw error;
    }
  }

  // Get help request statistics
  static async getHelpRequestStats() {
    try {
      const { data: stats, error } = await supabase
        .from('help_requests')
        .select(`
          id,
          help_type,
          urgency_level,
          status,
          verification_status,
          amount_needed,
          amount_raised,
          currency,
          support_count,
          view_count
        `);

      if (error) throw error;

      // Calculate statistics
      const totalRequests = stats?.length || 0;
      const openRequests = stats?.filter(r => r.status === 'open').length || 0;
      const underReviewRequests = stats?.filter(r => r.status === 'under_review').length || 0;
      const inProgressRequests = stats?.filter(r => r.status === 'in_progress').length || 0;
      const resolvedRequests = stats?.filter(r => r.status === 'resolved').length || 0;
      const closedRequests = stats?.filter(r => r.status === 'closed').length || 0;

      const typeStats = {};
      const urgencyStats = {};
      const verificationStats = {};
      let totalAmountNeeded = 0;
      let totalAmountRaised = 0;
      let totalSupports = 0;
      let totalViews = 0;

      stats?.forEach(request => {
        // Type statistics
        typeStats[request.help_type] = (typeStats[request.help_type] || 0) + 1;
        
        // Urgency statistics
        urgencyStats[request.urgency_level] = (urgencyStats[request.urgency_level] || 0) + 1;
        
        // Verification statistics
        verificationStats[request.verification_status] = (verificationStats[request.verification_status] || 0) + 1;
        
        // Aggregate counts and amounts
        totalAmountNeeded += request.amount_needed || 0;
        totalAmountRaised += request.amount_raised || 0;
        totalSupports += request.support_count || 0;
        totalViews += request.view_count || 0;
      });

      return {
        totalRequests,
        openRequests,
        underReviewRequests,
        inProgressRequests,
        resolvedRequests,
        closedRequests,
        typeStats,
        urgencyStats,
        verificationStats,
        totalAmountNeeded,
        totalAmountRaised,
        totalSupports,
        totalViews,
        fundingProgress: totalAmountNeeded > 0 ? Math.round((totalAmountRaised / totalAmountNeeded) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting help request statistics:', error);
      throw error;
    }
  }
}

module.exports = HelpRequest;
