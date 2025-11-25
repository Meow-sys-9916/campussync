const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sequelize = require('../config/database');
const UserModel = require('../models/User.model');
const EmailService = require('../services/email.service');
const User = UserModel(sequelize);

class AuthController {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
<<<<<<< Updated upstream
            const { firstName, lastName, email, studentId,
                password, major, phone } = req.body;
            const existingUser = await User.findOne({
                where: { email: email.toLowerCase() }
            });
=======

            // UPDATED: Added 'semester' to this list
            const { firstName, lastName, email, studentId,
                password, major, phone, semester } = req.body;

            const existingUser = await User.findOne({
                where: { email: email.toLowerCase() }
            });

>>>>>>> Stashed changes
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
<<<<<<< Updated upstream
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
=======

            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

>>>>>>> Stashed changes
            const user = await User.create({
                firstName,
                lastName,
                email: email.toLowerCase(),
                studentId,
                password: hashedPassword,
                major,
<<<<<<< Updated upstream
                phone,
                role: 'student'
            });
            const token = this.generateToken(user);
            const userResponse = { ...user.toJSON() };
            delete userResponse.password;
            // Send welcome email
            await EmailService.sendWelcomeEmail(user);
=======
                // UPDATED: Added 'semester' here
                semester,
                phone,
                role: 'student'
            });

            const token = this.generateToken(user);
            const userResponse = { ...user.toJSON() };
            delete userResponse.password;

            // Send welcome email
            await EmailService.sendWelcomeEmail(user);

>>>>>>> Stashed changes
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: userResponse,
                    token
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed'
                });
            }
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
            const { email, password } = req.body;
            const user = await User.scope('withPassword').findOne({
                where: { email: email.toLowerCase() }
            });
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
<<<<<<< Updated upstream
            const isPasswordValid = await bcrypt.compare(password, user.password);
=======

            const isPasswordValid = await bcrypt.compare(password, user.password);

>>>>>>> Stashed changes
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
<<<<<<< Updated upstream
            const token = this.generateToken(user);
            await user.update({ lastLoginAt: new Date() });
            const userResponse = { ...user.toJSON() };
            delete userResponse.password;
=======

            const token = this.generateToken(user);
            await user.update({ lastLoginAt: new Date() });

            const userResponse = { ...user.toJSON() };
            delete userResponse.password;

>>>>>>> Stashed changes
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userResponse,
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            res.json({
                success: true,
                data: { user: user.toJSON() }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async updateProfile(req, res) {
        try {
<<<<<<< Updated upstream
            const { firstName, lastName, major, phone, studentId } = req.body;
            const user = await User.findByPk(req.user.userId);
=======
            // UPDATED: You can technically allow updating semester here too if you want
            const { firstName, lastName, major, phone, studentId, semester } = req.body;
            const user = await User.findByPk(req.user.userId);

>>>>>>> Stashed changes
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
            let profilePhoto = user.profilePhoto;
            if (req.file) {
                profilePhoto = req.file.secure_url;
            }
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
            await user.update({
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                major: major || user.major,
<<<<<<< Updated upstream
=======
                semester: semester || user.semester, // Added semester update capability
>>>>>>> Stashed changes
                phone: phone || user.phone,
                studentId: studentId || user.studentId,
                profilePhoto: profilePhoto
            });
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: user.toJSON() }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    generateToken(user) {
        return jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d', issuer: 'campusync-api' }
        );
    }
}

module.exports = new AuthController();