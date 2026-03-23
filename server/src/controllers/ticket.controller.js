const ticketService = require('../services/ticket.service');

const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = await ticketService.createTicket({ title, description, category, priority }, req.user.userId);
    res.status(201).json(ticket);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTickets(req.user.role, req.user.userId, req.query);
    res.json(tickets);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(parseInt(req.params.id), req.user.role, req.user.userId);
    res.json(ticket);
  } catch (err) { 
    res.status(err.message.includes('Forbidden') ? 403 : 404).json({ error: err.message }); 
  }
};

const updateStatus = async (req, res) => {
  try {
    const ticket = await ticketService.updateTicketStatus(parseInt(req.params.id), req.body.status);
    res.json(ticket);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const assignTicket = async (req, res) => {
  try {
    const ticket = await ticketService.assignTicket(parseInt(req.params.id), req.body.agentId);
    res.json(ticket);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const addComment = async (req, res) => {
  try {
    const comment = await ticketService.addComment(parseInt(req.params.id), req.user.userId, req.body.content);
    res.status(201).json(comment);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

module.exports = { createTicket, getTickets, getTicket, updateStatus, assignTicket, addComment };
