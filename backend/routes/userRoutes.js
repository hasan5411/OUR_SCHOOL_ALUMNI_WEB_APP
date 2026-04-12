const express = require('express');
const router = express.Router();
const multer = require('multer');
const { memoryStorage } = multer;

const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for memory storage (for image uploads)
const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 100 * 1024, // 100KB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
    }
  }
});

// All user routes require authentication
router.use(authenticateToken);

// Current user profile routes
router.get('/profile', userController.getCurrentUserProfile);
router.put('/profile', userController.updateCurrentUserProfile);
router.post('/profile/image', upload.single('image'), userController.uploadCurrentUserProfileImage);

// Search alumni (accessible to all authenticated users)
router.get('/search', userController.searchAlumni);

// Admin/Authority specific routes for managing other users
router.get('/:userId/profile', userController.getProfile);
router.put('/:userId/profile', userController.updateProfile);
router.post('/:userId/profile/image', upload.single('image'), userController.uploadProfileImage);

module.exports = router;
