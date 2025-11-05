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
    body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/),
    body('studentId').optional().isLength({ min: 3, max: 20 })
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, FileUploadMiddleware.single('profilePhoto'), authController.updateProfile);

module.exports = router;