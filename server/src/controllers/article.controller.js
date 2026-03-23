const articleService = require('../services/article.service');

const getArticles = async (req, res) => {
  try {
    const articles = await articleService.getArticles();
    res.json(articles);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const getArticle = async (req, res) => {
  try {
    const article = await articleService.getArticleById(parseInt(req.params.id));
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const article = await articleService.createArticle({ title, content, tags });
    res.status(201).json(article);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

const deleteArticle = async (req, res) => {
  try {
    await articleService.deleteArticle(parseInt(req.params.id));
    res.json({ message: 'Article deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

module.exports = { getArticles, getArticle, createArticle, deleteArticle };
