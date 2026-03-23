const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicket);

router.post('/:id/comments', ticketController.addComment);

// Admin / Agent only routes
router.put('/:id/status', requireRole(['ADMIN', 'AGENT']), ticketController.updateStatus);
router.put('/:id/assign', requireRole(['ADMIN']), ticketController.assignTicket);

module.exports = router;
