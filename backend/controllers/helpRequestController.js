const HelpRequest = require('../models/HelpRequest');

// Create help request (member and above)
const createHelpRequest = async (req, res) => {
  try {
    const helpRequestData = {
      title: req.body.title,
      description: req.body.description,
      help_type: req.body.help_type,
      urgency_level: req.body.urgency_level || 'medium',
      amount_needed: req.body.amount_needed,
      currency: req.body.currency || 'NGN',
      deadline: req.body.deadline,
      beneficiary_name: req.body.beneficiary_name,
      beneficiary_relationship: req.body.beneficiary_relationship,
      beneficiary_contact: req.body.beneficiary_contact,
      location: req.body.location,
      supporting_documents: req.body.supporting_documents,
      privacy_level: req.body.privacy_level || 'public',
      created_by: req.user.id
    };

    const helpRequest = await HelpRequest.createHelpRequest(helpRequestData);

    res.status(201).json({
      message: 'Help request submitted successfully. It will be reviewed by administrators.',
      helpRequest
    });
  } catch (error) {
    console.error('Create help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get help requests (public access with role-based filtering)
const getHelpRequests = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      help_type: req.query.help_type,
      urgency_level: req.query.urgency_level,
      status: req.query.status,
      verification_status: req.query.verification_status,
      show_closed: req.query.show_closed === 'true'
    };

    // Non-admin users can only see verified requests
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      filters.verification_status = 'verified';
    }

    const result = await HelpRequest.getHelpRequests(filters);

    res.json({
      message: 'Help requests retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get help requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single help request
const getHelpRequestById = async (req, res) => {
  try {
    const { helpRequestId } = req.params;

    const helpRequest = await HelpRequest.getHelpRequestById(helpRequestId);

    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    // Check if user can view this help request
    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (helpRequest.verification_status !== 'verified') {
        return res.status(404).json({ message: 'Help request not found' });
      }
      
      // Check privacy level
      if (helpRequest.privacy_level === 'private' && helpRequest.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: This is a private help request' });
      }
    }

    res.json({
      message: 'Help request retrieved successfully',
      helpRequest
    });
  } catch (error) {
    console.error('Get help request by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update help request (owner or admin)
const updateHelpRequest = async (req, res) => {
  try {
    const { helpRequestId } = req.params;
    const updateData = req.body;

    // Check if user can update this help request
    const existingHelpRequest = await HelpRequest.getHelpRequestById(helpRequestId);
    if (!existingHelpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingHelpRequest.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update your own help requests' });
      }
      
      // Regular users can only update certain fields and only if not verified
      if (existingHelpRequest.verification_status === 'verified') {
        return res.status(403).json({ message: 'Access denied: Cannot update verified help requests' });
      }
      
      const allowedFields = ['title', 'description', 'help_type', 'urgency_level', 'amount_needed', 'deadline', 'beneficiary_name', 'beneficiary_relationship', 'beneficiary_contact', 'location', 'supporting_documents', 'privacy_level'];
      const filteredData = {};
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });
      
      updateData = filteredData;
    }

    const helpRequest = await HelpRequest.updateHelpRequest(helpRequestId, updateData);

    res.json({
      message: 'Help request updated successfully',
      helpRequest
    });
  } catch (error) {
    console.error('Update help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete help request (owner or admin)
const deleteHelpRequest = async (req, res) => {
  try {
    const { helpRequestId } = req.params;

    // Check if user can delete this help request
    const existingHelpRequest = await HelpRequest.getHelpRequestById(helpRequestId);
    if (!existingHelpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingHelpRequest.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only delete your own help requests' });
      }
      
      // Regular users can only delete unverified requests
      if (existingHelpRequest.verification_status !== 'pending') {
        return res.status(403).json({ message: 'Access denied: Cannot delete verified help requests' });
      }
    }

    await HelpRequest.deleteHelpRequest(helpRequestId);

    res.json({
      message: 'Help request deleted successfully'
    });
  } catch (error) {
    console.error('Delete help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify help request (admin/authority only)
const verifyHelpRequest = async (req, res) => {
  try {
    const { helpRequestId } = req.params;
    const { verification_status, notes } = req.body;

    if (!['verified', 'rejected'].includes(verification_status)) {
      return res.status(400).json({ message: 'Invalid verification status. Must be "verified" or "rejected"' });
    }

    const helpRequest = await HelpRequest.verifyHelpRequest(helpRequestId, req.user.id, verification_status, notes);

    res.json({
      message: `Help request ${verification_status} successfully`,
      helpRequest
    });
  } catch (error) {
    console.error('Verify help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve help request (admin/authority only)
const approveHelpRequest = async (req, res) => {
  try {
    const { helpRequestId } = req.params;
    const { assigned_to } = req.body;

    const helpRequest = await HelpRequest.approveHelpRequest(helpRequestId, req.user.id, assigned_to);

    res.json({
      message: 'Help request approved successfully',
      helpRequest
    });
  } catch (error) {
    console.error('Approve help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Resolve help request (assigned user or admin)
const resolveHelpRequest = async (req, res) => {
  try {
    const { helpRequestId } = req.params;
    const { resolution_details } = req.body;

    // Check if user can resolve this help request
    const existingHelpRequest = await HelpRequest.getHelpRequestById(helpRequestId);
    if (!existingHelpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingHelpRequest.assigned_to !== req.user.id && existingHelpRequest.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only resolve help requests assigned to you or created by you' });
      }
    }

    const helpRequest = await HelpRequest.resolveHelpRequest(helpRequestId, resolution_details, req.user.id);

    res.json({
      message: 'Help request resolved successfully',
      helpRequest
    });
  } catch (error) {
    console.error('Resolve help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update amount raised (admin or assigned user)
const updateAmountRaised = async (req, res) => {
  try {
    const { helpRequestId } = req.params;
    const { amount_raised } = req.body;

    // Check if user can update this help request
    const existingHelpRequest = await HelpRequest.getHelpRequestById(helpRequestId);
    if (!existingHelpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    if (req.user.roles?.name !== 'admin' && req.user.roles?.name !== 'authority') {
      if (existingHelpRequest.assigned_to !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update amount for help requests assigned to you' });
      }
    }

    const helpRequest = await HelpRequest.updateAmountRaised(helpRequestId, amount_raised);

    res.json({
      message: 'Amount raised updated successfully',
      helpRequest
    });
  } catch (error) {
    console.error('Update amount raised error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Support help request (member and above)
const supportHelpRequest = async (req, res) => {
  try {
    const { helpRequestId } = req.params;

    const result = await HelpRequest.supportHelpRequest(helpRequestId, req.user.id);

    res.json(result);
  } catch (error) {
    console.error('Support help request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's help requests
const getUserHelpRequests = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      status: req.query.status,
      help_type: req.query.help_type
    };

    const result = await HelpRequest.getUserHelpRequests(req.user.id, filters);

    res.json({
      message: 'User help requests retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get user help requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get help request statistics (admin only)
const getHelpRequestStats = async (req, res) => {
  try {
    const stats = await HelpRequest.getHelpRequestStats();

    res.json({
      message: 'Help request statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get help request stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createHelpRequest,
  getHelpRequests,
  getHelpRequestById,
  updateHelpRequest,
  deleteHelpRequest,
  verifyHelpRequest,
  approveHelpRequest,
  resolveHelpRequest,
  updateAmountRaised,
  supportHelpRequest,
  getUserHelpRequests,
  getHelpRequestStats
};
