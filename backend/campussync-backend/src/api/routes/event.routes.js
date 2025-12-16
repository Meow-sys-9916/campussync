const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/event.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

const eventValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('venue').notEmpty().withMessage('Venue is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

// ROUTES
// 1. GET all events
router.get('/', authenticateToken, eventController.getAllEvents.bind(eventController));

// 2. GET single event
router.get('/:id', authenticateToken, eventController.getEventById.bind(eventController));

// 3. POST create event (The one failing right now)
// 👇 Notice the .bind(eventController) at the end!
router.post('/', authenticateToken, eventValidation, eventController.createEvent.bind(eventController));

module.exports = router;