const { validationResult } = require('express-validator');
const sequelize = require('../config/database');
const EventModel = require('../models/Event.model');
const Event = EventModel(sequelize);

class EventController {
    // 1. Create a new event (Admin/Faculty only)
    async createEvent(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const event = await Event.create({
                ...req.body,
                organizer: req.user.userId // The logged-in user is the organizer
            });

            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: event
            });
        } catch (error) {
            console.error('Create event error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // 2. Get all events
    async getAllEvents(req, res) {
        try {
            const events = await Event.findAll({
                order: [['date', 'ASC']] // Show nearest dates first
            });
            res.json({ success: true, data: events });
        } catch (error) {
            console.error('Get events error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // 3. Get a single event by ID
    async getEventById(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.json({ success: true, data: event });
        } catch (error) {
            console.error('Get event error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

module.exports = new EventController();