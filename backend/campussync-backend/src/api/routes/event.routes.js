const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/event.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const FileUploadMiddleware = require('../middleware/file-upload.middleware');

const router = express.Router();

const eventValidation = [
  body('title').notEmpty().isLength({ min: 5, max: 200 }),
  body('description').notEmpty().isLength({ min: 10, max: 5000 }),
  body('eventDate').isISO8601(),
  body('location').notEmpty().isLength({ min: 3 }),
  body('category').optional().isIn(['academic', 'sports', 'cultural', 'social', 'workshop', 'seminar', 'other'])
];

router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/', authenticateToken, eventController.getAllEvents);
router.get('/:id', authenticateToken, eventController.getEventById);

router.post('/', 
  authenticateToken, 
  requireRole(['faculty', 'admin']),
  FileUploadMiddleware.single('eventImage'), 
  eventValidation,
  eventController.createEvent
);

router.put('/:id', 
  authenticateToken, 
  requireRole(['faculty', 'admin']),
  FileUploadMiddleware.single('eventImage'), 
  eventValidation,
  eventController.updateEvent
);

router.delete('/:id', 
  authenticateToken, 
  requireRole(['faculty', 'admin']),
  eventController.deleteEvent
);

module.exports = router;    