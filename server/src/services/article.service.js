const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getArticles = async () => {
  return await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
};

const getArticleById = async (id) => {
  return await prisma.article.findUnique({ where: { id } });
};

const createArticle = async (data) => {
  return await prisma.article.create({ data });
};

const deleteArticle = async (id) => {
  return await prisma.article.delete({ where: { id } });
};

module.exports = { getArticles, getArticleById, createArticle, deleteArticle };
