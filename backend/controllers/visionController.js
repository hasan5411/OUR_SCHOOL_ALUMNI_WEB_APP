const Vision = require('../models/Vision');

// Create vision idea (member and above)
const createVision = async (req, res) => {
  try {
    const visionData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority_level: req.body.priority_level || 'medium',
      implementation_plan: req.body.implementation_plan,
      budget_estimate: req.body.budget_estimate,
      budget_currency: req.body.budget_currency || 'NGN',
      timeline_months: req.body.timeline_months,
      expected_impact: req.body.expected_impact,
      success_metrics: req.body.success_metrics,
      challenges: req.body.challenges,
      required_resources: req.body.required_resources,
      proposed_by: req.user.id
    };

    const vision = await Vision.createVision(visionData);

    res.status(201).json({
      message: 'Vision idea submitted successfully. It will be reviewed by administrators.',
      vision
    });
  } catch (error) {
    console.error('Create vision error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get vision ideas (public access with role-based filtering)
const getVisionIdeas = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      category: req.query.category,
      priority_level: req.query.priority_level,
      status: req.query.status
    };

    // Non-admin users can only see approved visions
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      filters.status = 'approved';
    }

    const result = await Vision.getVisionIdeas(filters);

    res.json({
      message: 'Vision ideas retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get vision ideas error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single vision idea
const getVisionById = async (req, res) => {
  try {
    const { visionId } = req.params;

    const vision = await Vision.getVisionById(visionId);

    if (!vision) {
      return res.status(404).json({ message: 'Vision idea not found' });
    }

    // Check if user can view this vision
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (vision.status !== 'approved') {
        return res.status(404).json({ message: 'Vision idea not found' });
      }
    }

    res.json({
      message: 'Vision idea retrieved successfully',
      vision
    });
  } catch (error) {
    console.error('Get vision by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update vision idea (owner or admin)
const updateVision = async (req, res) => {
  try {
    const { visionId } = req.params;
    const updateData = req.body;

    // Check if user can update this vision
    const existingVision = await Vision.getVisionById(visionId);
    if (!existingVision) {
      return res.status(404).json({ message: 'Vision idea not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingVision.proposed_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update your own vision ideas' });
      }
      
      // Regular users can only update certain fields and only if not approved
      if (existingVision.status === 'approved') {
        return res.status(403).json({ message: 'Access denied: Cannot update approved vision ideas' });
      }
      
      const allowedFields = ['title', 'description', 'category', 'priority_level', 'implementation_plan', 'budget_estimate', 'timeline_months', 'expected_impact', 'success_metrics', 'challenges', 'required_resources'];
      const filteredData = {};
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });
      
      updateData = filteredData;
    }

    const vision = await Vision.updateVision(visionId, updateData);

    res.json({
      message: 'Vision idea updated successfully',
      vision
    });
  } catch (error) {
    console.error('Update vision error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete vision idea (owner or admin)
const deleteVision = async (req, res) => {
  try {
    const { visionId } = req.params;

    // Check if user can delete this vision
    const existingVision = await Vision.getVisionById(visionId);
    if (!existingVision) {
      return res.status(404).json({ message: 'Vision idea not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingVision.proposed_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only delete your own vision ideas' });
      }
      
      // Regular users can only delete unapproved visions
      if (existingVision.status !== 'proposed') {
        return res.status(403).json({ message: 'Access denied: Cannot delete approved vision ideas' });
      }
    }

    await Vision.deleteVision(visionId);

    res.json({
      message: 'Vision idea deleted successfully'
    });
  } catch (error) {
    console.error('Delete vision error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve vision idea (admin/authority only)
const approveVision = async (req, res) => {
  try {
    const { visionId } = req.params;
    const { assigned_to } = req.body;

    const vision = await Vision.approveVision(visionId, req.user.id, assigned_to);

    res.json({
      message: 'Vision idea approved successfully',
      vision
    });
  } catch (error) {
    console.error('Approve vision error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject vision idea (admin/authority only)
const rejectVision = async (req, res) => {
  try {
    const { visionId } = req.params;
    const { reason } = req.body;

    const vision = await Vision.rejectVision(visionId, req.user.id, reason);

    res.json({
      message: 'Vision idea rejected successfully',
      vision
    });
  } catch (error) {
    console.error('Reject vision error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update vision progress (assigned user or admin)
const updateVisionProgress = async (req, res) => {
  try {
    const { visionId } = req.params;
    const { progress_percentage, notes } = req.body;

    // Check if user can update this vision progress
    const existingVision = await Vision.getVisionById(visionId);
    if (!existingVision) {
      return res.status(404).json({ message: 'Vision idea not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingVision.assigned_to !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update progress for visions assigned to you' });
      }
    }

    const vision = await Vision.updateProgress(visionId, progress_percentage, notes);

    res.json({
      message: 'Vision progress updated successfully',
      vision
    });
  } catch (error) {
    console.error('Update vision progress error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Support/oppose vision idea (member and above)
const voteVision = async (req, res) => {
  try {
    const { visionId } = req.params;
    const { vote_type } = req.body; // 'support' or 'oppose'

    if (!['support', 'oppose'].includes(vote_type)) {
      return res.status(400).json({ message: 'Invalid vote type. Must be "support" or "oppose"' });
    }

    const result = await Vision.voteVision(visionId, req.user.id, vote_type);

    res.json(result);
  } catch (error) {
    console.error('Vote vision error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's vision ideas
const getUserVisions = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      status: req.query.status,
      category: req.query.category
    };

    // Add proposed_by filter for user's own visions
    filters.proposed_by = req.user.id;

    const result = await Vision.getVisionIdeas(filters);

    res.json({
      message: 'User vision ideas retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get user visions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get vision statistics (admin only)
const getVisionStats = async (req, res) => {
  try {
    const stats = await Vision.getVisionStats();

    res.json({
      message: 'Vision statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get vision stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createVision,
  getVisionIdeas,
  getVisionById,
  updateVision,
  deleteVision,
  approveVision,
  rejectVision,
  updateVisionProgress,
  voteVision,
  getUserVisions,
  getVisionStats
};
