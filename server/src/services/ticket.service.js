const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTicket = async (data, creatorId) => {
  return await prisma.ticket.create({
    data: { ...data, creatorId }
  });
};

const getTickets = async (userRole, userId, query) => {
  const filter = {};
  if (userRole === 'USER') {
    filter.creatorId = userId;
  }
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;

  return await prisma.ticket.findMany({
    where: filter,
    include: { 
      creator: { select: { id: true, name: true, email: true } }, 
      assignedAgent: { select: { id: true, name: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getTicketById = async (id, userRole, userId) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { 
      comments: { include: { author: { select: { name: true, role: true } } } }, 
      creator: { select: { name: true, email: true } }, 
      assignedAgent: { select: { name: true, email: true } } 
    }
  });

  if (!ticket) throw new Error('Ticket not found');
  if (userRole === 'USER' && ticket.creatorId !== userId) {
    throw new Error('Forbidden: Not your ticket');
  }

  return ticket;
};

const updateTicketStatus = async (id, status) => {
  return await prisma.ticket.update({ where: { id }, data: { status } });
};

const assignTicket = async (id, agentId) => {
  return await prisma.ticket.update({ where: { id }, data: { assignedAgentId: agentId } });
};

const addComment = async (ticketId, authorId, content) => {
  return await prisma.comment.create({
    data: { content, ticketId, authorId }
  });
};

module.exports = { createTicket, getTickets, getTicketById, updateTicketStatus, assignTicket, addComment };
