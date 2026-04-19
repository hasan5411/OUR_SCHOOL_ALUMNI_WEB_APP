const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// User registration
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Get or create visitor role ID
    const visitorRole = await User.ensureRole('visitor', 'Can view public content only');
    if (!visitorRole) {
      return res.status(500).json({ message: 'Error setting up user role' });
    }

    // Create user
    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role_id: visitorRole.id,
      is_approved: false,
      is_active: true
    });

    // Generate token
    const token = generateToken(user.id);

    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully. Please wait for admin approval.',
      user: {
        ...userWithoutPassword,
        role: userWithoutPassword.roles?.name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check if user is approved (except authority)
    if (!user.is_approved && user.roles?.name !== 'authority') {
      return res.status(401).json({ message: 'Account not approved. Please wait for admin approval.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        role: userWithoutPassword.roles?.name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      user: {
        ...userWithoutPassword,
        role: userWithoutPassword.roles?.name
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
