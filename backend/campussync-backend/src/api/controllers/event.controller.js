const { validationResult } = require('express-validator');
const sequelize = require('../config/database');
const EventModel = require('../models/Event.model');
const Event = EventModel(sequelize);

class EventController {
    
    // 1. Create a new event
    async createEvent(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const event = await Event.create({
                ...req.body,
                organizer: req.user.userId, // Set the logged-in user as organizer
                attendees: [] // Initialize empty attendees list
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

    // 2. Get all events (Sorted by date)
    async getAllEvents(req, res) {
        try {
            const events = await Event.findAll({
                order: [['date', 'ASC']]
            });
            res.json({ success: true, data: events });
        } catch (error) {
            console.error('Get events error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // 3. Get Single Event (REQUIRED for "View Details")
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

    // 4. Delete Event (REQUIRED for Dashboard delete button)
    async deleteEvent(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Optional: Ensure only the organizer can delete
            // if (event.organizer !== req.user.userId) {
            //     return res.status(403).json({ success: false, message: 'Unauthorized' });
            // }

            await event.destroy();
            res.json({ success: true, message: 'Event deleted successfully' });
        } catch (error) {
            console.error('Delete event error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    // 5. Register for Event (REQUIRED for "Register" button)
    async registerForEvent(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            const userId = req.user.userId;
            
            // Ensure attendees is an array
            let attendees = event.attendees || [];

            // Check if user is already registered
            if (attendees.includes(userId)) {
                return res.status(400).json({ success: false, message: 'You are already registered for this event' });
            }

            // Add user to the list
            attendees.push(userId);
            
            // Update the database
            // We explicitly update the 'attendees' field
            await Event.update(
                { attendees: attendees },
                { where: { id: event.id } }
            );

            res.json({ success: true, message: 'Registration successful!' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

module.exports = new EventController();