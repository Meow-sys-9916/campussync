const { validationResult } = require('express-validator');
const sequelize = require('../config/database');
const EventModel = require('../models/Event.model');
const Event = EventModel(sequelize);

class EventController {
    
    // Create Event
    async createEvent(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            const event = await Event.create({
                ...req.body,
                organizer: req.user.userId
            });
            res.status(201).json({ success: true, data: event });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // Get All Events
    async getAllEvents(req, res) {
        try {
            const events = await Event.findAll({ order: [['date', 'ASC']] });
            res.json({ success: true, data: events });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // Get Single Event
    async getEventById(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
            res.json({ success: true, data: event });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // Delete Event
    async deleteEvent(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
            await event.destroy();
            res.json({ success: true, message: 'Event deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // ✅ ADD THIS: Register Logic
    async registerForEvent(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

            const userId = req.user.userId;
            let attendees = event.attendees || [];

            if (attendees.includes(userId)) {
                return res.status(400).json({ success: false, message: 'Already registered' });
            }

            attendees.push(userId);
            
            // Force update for JSON array
            await Event.update({ attendees: attendees }, { where: { id: event.id } });

            res.json({ success: true, message: 'Registration successful!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

module.exports = new EventController();