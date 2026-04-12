const { body, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Alumni profile validation
const validateAlumniProfile = [
  body('graduation_year')
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage('Please provide a valid graduation year'),
  body('stream')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Stream must not exceed 50 characters'),
  body('current_occupation')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Current occupation must not exceed 255 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Company must not exceed 255 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  body('linkedin_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  handleValidationErrors
];

// Event validation
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('event_date')
    .isISO8601()
    .withMessage('Please provide a valid event date'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  handleValidationErrors
];

// Announcement validation
const validateAnnouncement = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  handleValidationErrors
];

// Job posting validation
const validateJobPosting = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Company must be between 2 and 255 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  body('job_type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  body('application_url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid application URL'),
  handleValidationErrors
];

// User update validation (admin)
const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role_id')
    .optional()
    .isUUID()
    .withMessage('Invalid role ID'),
  body('is_approved')
    .optional()
    .isBoolean()
    .withMessage('is_approved must be a boolean'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAlumniProfile,
  validateEvent,
  validateAnnouncement,
  validateJobPosting,
  validateUserUpdate,
  handleValidationErrors
};
