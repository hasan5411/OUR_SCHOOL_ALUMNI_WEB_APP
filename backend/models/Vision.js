const { supabase } = require('../config/database');

class Vision {
  // Create new vision idea
  static async createVision(visionData) {
    try {
      // Set status = 'proposed' by default
      const visionDataWithDefaults = {
        ...visionData,
        status: 'proposed',
        support_count: 0,
        opposition_count: 0,
        progress_percentage: 0
      };

      const { data, error } = await supabase
        .from('vision_ideas')
        .insert(visionDataWithDefaults)
        .select(`
          id,
          title,
          description,
          category,
          priority_level,
          status,
          implementation_plan,
          budget_estimate,
          budget_currency,
          timeline_months,
          expected_impact,
          success_metrics,
          challenges,
          required_resources,
          proposed_by,
          approved_by,
          approved_at,
          assigned_to,
          start_date,
          target_completion_date,
          actual_completion_date,
          progress_percentage,
          support_count,
          opposition_count,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating vision idea:', error);
      throw error;
    }
  }

  // Get vision ideas with filtering and pagination
  static async getVisionIdeas(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category,
        priority_level,
        status,
        proposed_by,
        assigned_to
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('vision_ideas')
        .select(`
          id,
          title,
          description,
          category,
          priority_level,
          status,
          implementation_plan,
          budget_estimate,
          budget_currency,
          timeline_months,
          expected_impact,
          success_metrics,
          challenges,
          required_resources,
          proposed_by,
          approved_by,
          approved_at,
          assigned_to,
          start_date,
          target_completion_date,
          actual_completion_date,
          progress_percentage,
          support_count,
          opposition_count,
          created_at,
          updated_at
        `, { count: 'exact' });

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
      }

      // Apply filters
      if (category) query = query.eq('category', category);
      if (priority_level) query = query.eq('priority_level', priority_level);
      if (status) query = query.eq('status', status);
      if (proposed_by) query = query.eq('proposed_by', proposed_by);
      if (assigned_to) query = query.eq('assigned_to', assigned_to);

      // Apply pagination and ordering
      query = query
        .order('priority_level', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: visionIdeas, error, count } = await query;

      if (error) throw error;

      return {
        visionIdeas: visionIdeas || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error getting vision ideas:', error);
      throw error;
    }
  }

  // Get single vision idea by ID
  static async getVisionById(visionId) {
    try {
      const { data, error } = await supabase
        .from('vision_ideas')
        .select(`
          id,
          title,
          description,
          category,
          priority_level,
          status,
          implementation_plan,
          budget_estimate,
          budget_currency,
          timeline_months,
          expected_impact,
          success_metrics,
          challenges,
          required_resources,
          proposed_by,
          approved_by,
          approved_at,
          assigned_to,
          start_date,
          target_completion_date,
          actual_completion_date,
          progress_percentage,
          support_count,
          opposition_count,
          created_at,
          updated_at
        `)
        .eq('id', visionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting vision by ID:', error);
      throw error;
    }
  }

  // Update vision idea
  static async updateVision(visionId, updateData) {
    try {
      const { data, error } = await supabase
        .from('vision_ideas')
        .update(updateData)
        .eq('id', visionId)
        .select(`
          id,
          title,
          description,
          category,
          priority_level,
          status,
          implementation_plan,
          budget_estimate,
          budget_currency,
          timeline_months,
          expected_impact,
          success_metrics,
          challenges,
          required_resources,
          proposed_by,
          approved_by,
          approved_at,
          assigned_to,
          start_date,
          target_completion_date,
          actual_completion_date,
          progress_percentage,
          support_count,
          opposition_count,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating vision idea:', error);
      throw error;
    }
  }

  // Delete vision idea
  static async deleteVision(visionId) {
    try {
      const { error } = await supabase
        .from('vision_ideas')
        .delete()
        .eq('id', visionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting vision idea:', error);
      throw error;
    }
  }

  // Approve vision idea (admin/authority only)
  static async approveVision(visionId, adminId, assignedTo = null) {
    try {
      const updateData = {
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        status: 'approved'
      };

      if (assignedTo) {
        updateData.assigned_to = assignedTo;
      }

      const { data, error } = await supabase
        .from('vision_ideas')
        .update(updateData)
        .eq('id', visionId)
        .select(`
          id,
          title,
          approved_by,
          approved_at,
          assigned_to,
          status,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving vision idea:', error);
      throw error;
    }
  }

  // Reject vision idea (admin/authority only)
  static async rejectVision(visionId, adminId, reason = null) {
    try {
      const updateData = {
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        status: 'rejected'
      };

      const { data, error } = await supabase
        .from('vision_ideas')
        .update(updateData)
        .eq('id', visionId)
        .select(`
          id,
          title,
          approved_by,
          approved_at,
          status,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rejecting vision idea:', error);
      throw error;
    }
  }

  // Update vision progress
  static async updateProgress(visionId, progressPercentage, notes = null) {
    try {
      const updateData = {
        progress_percentage: Math.min(100, Math.max(0, progressPercentage))
      };

      if (progressPercentage >= 100) {
        updateData.status = 'completed';
        updateData.actual_completion_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('vision_ideas')
        .update(updateData)
        .eq('id', visionId)
        .select(`
          id,
          title,
          progress_percentage,
          status,
          actual_completion_date,
          updated_at
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating vision progress:', error);
      throw error;
    }
  }

  // Support/oppose vision idea
  static async voteVision(visionId, userId, voteType) {
    try {
      const { data: existingVote } = await supabase
        .from('vision_votes')
        .select('id')
        .eq('vision_id', visionId)
        .eq('user_id', userId)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('vision_votes')
          .update({ vote_type: voteType })
          .eq('vision_id', visionId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('vision_votes')
          .insert({
            vision_id: visionId,
            user_id: userId,
            vote_type: voteType
          });

        if (error) throw error;
      }

      // Update vote counts
      await supabase.rpc('update_vision_vote_counts', { vision_id_param: visionId });

      return { message: 'Vote recorded successfully' };
    } catch (error) {
      console.error('Error voting on vision idea:', error);
      throw error;
    }
  }

  // Get vision statistics
  static async getVisionStats() {
    try {
      const { data: stats, error } = await supabase
        .from('vision_ideas')
        .select(`
          id,
          category,
          priority_level,
          status,
          progress_percentage,
          support_count,
          opposition_count
        `);

      if (error) throw error;

      // Calculate statistics
      const totalVisions = stats?.length || 0;
      const proposedVisions = stats?.filter(v => v.status === 'proposed').length || 0;
      const approvedVisions = stats?.filter(v => v.status === 'approved').length || 0;
      const inProgressVisions = stats?.filter(v => v.status === 'in_progress').length || 0;
      const completedVisions = stats?.filter(v => v.status === 'completed').length || 0;
      const rejectedVisions = stats?.filter(v => v.status === 'rejected').length || 0;

      const categoryStats = {};
      const priorityStats = {};
      let totalSupport = 0;
      let totalOpposition = 0;
      let averageProgress = 0;

      stats?.forEach(vision => {
        // Category statistics
        categoryStats[vision.category] = (categoryStats[vision.category] || 0) + 1;
        
        // Priority statistics
        priorityStats[vision.priority_level] = (priorityStats[vision.priority_level] || 0) + 1;
        
        // Aggregate counts
        totalSupport += vision.support_count || 0;
        totalOpposition += vision.opposition_count || 0;
        averageProgress += vision.progress_percentage || 0;
      });

      averageProgress = totalVisions > 0 ? averageProgress / totalVisions : 0;

      return {
        totalVisions,
        proposedVisions,
        approvedVisions,
        inProgressVisions,
        completedVisions,
        rejectedVisions,
        categoryStats,
        priorityStats,
        totalSupport,
        totalOpposition,
        averageProgress: Math.round(averageProgress * 100) / 100
      };
    } catch (error) {
      console.error('Error getting vision statistics:', error);
      throw error;
    }
  }
}

module.exports = Vision;
