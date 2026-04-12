const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based access control middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.roles?.name;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Require approved user (member or higher)
const requireApproved = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!req.user.is_approved) {
    return res.status(403).json({ 
      message: 'Account not approved. Please wait for admin approval.' 
    });
  }

  next();
};

// Require admin or authority
const requireAdmin = requireRole(['admin', 'authority']);

// Require authority only
const requireAuthority = requireRole(['authority']);

module.exports = {
  authenticateToken,
  requireRole,
  requireApproved,
  requireAdmin,
  requireAuthority
};
