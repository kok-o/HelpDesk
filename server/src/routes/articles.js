const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, articleController.getArticles);
router.get('/:id', authenticate, articleController.getArticle);

router.post('/', authenticate, requireRole(['ADMIN', 'AGENT']), articleController.createArticle);
router.delete('/:id', authenticate, requireRole(['ADMIN', 'AGENT']), articleController.deleteArticle);

module.exports = router;
