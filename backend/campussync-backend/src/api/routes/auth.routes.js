const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const FileUploadMiddleware = require('../middleware/file-upload.middleware');

const router = express.Router();

const registerValidation = [
    body('firstName').notEmpty().isLength({ min: 2, max: 50 }),
    body('lastName').notEmpty().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('studentId').optional().isLength({ min: 3, max: 20 }),
    body('semester').optional(),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// --- THE FIX IS HERE: Added .bind(authController) ---
router.post('/register', registerValidation, authController.register.bind(authController));
router.post('/login', loginValidation, authController.login.bind(authController));


router.get('/profile', authenticateToken, authController.getProfile.bind(authController));
router.put('/profile', authenticateToken, FileUploadMiddleware.single('profilePhoto'), authController.updateProfile.bind(authController));

module.exports = router;