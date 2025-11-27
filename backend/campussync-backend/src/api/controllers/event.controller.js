const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const EventModel = require('../models/Event.model');
const UserModel = require('../models/User.model');
const EmailService = require('../services/email.service');

const Event = EventModel(sequelize);
const User = UserModel(sequelize);

class EventController {
  async createEvent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { title, description, eventDate, location, category, maxParticipants } = req.body;
      let imageUrl = null;

      if (req.file) {
        imageUrl = req.file.secure_url;
      }

      const event = await Event.create({
        title,
        description,
        eventDate,
        location,
        category,
        maxParticipants,
        imageUrl,
        createdBy: req.user.userId
      });

      // Send event notification emails to all users
      const allUsers = await User.findAll();
      for (const user of allUsers) {
        // We use try-catch here so one failed email doesn't crash the request
        try {
            await EmailService.sendEventNotification(user, event);
        } catch (emailError) {
            console.error(`Failed to send email to ${user.email}`, emailError);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: { event }
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getAllEvents(req, res) {
    try {
      const { page = 1, limit = 10, category, status = 'upcoming', search } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Event.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['eventDate', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          events: rows,
          pagination: {
            totalEvents: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
          }
        }
      });
    } catch (error) {
      console.error('Get all events error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getEventById(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.json({ success: true, data: { event } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async updateEvent(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (event.createdBy !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      let updateData = { ...req.body };
      if (req.file) {
        updateData.imageUrl = req.file.secure_url;
      }

      await event.update(updateData);
      res.json({ success: true, message: 'Event updated', data: { event } });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteEvent(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (event.createdBy !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      await event.destroy();
      res.json({ success: true, message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getUpcomingEvents(req, res) {
    try {
      const events = await Event.findAll({
        where: {
          eventDate: { [Op.gte]: new Date() },
          status: 'upcoming'
        },
        order: [['eventDate', 'ASC']],
        limit: 5
      });
      res.json({ success: true, data: { events } });
    } catch (error) {
      console.error('Get upcoming events error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new EventController();