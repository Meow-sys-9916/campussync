const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, eventController.createEvent);
router.get('/', authenticateToken, eventController.getAllEvents);
router.get('/:id', authenticateToken, eventController.getEventById);
router.delete('/:id', authenticateToken, eventController.deleteEvent);

// ✅ REGISTER AND UNREGISTER ROUTES
router.post('/:id/register', authenticateToken, eventController.registerForEvent);
router.post('/:id/unregister', authenticateToken, eventController.unregisterForEvent);

module.exports = router;