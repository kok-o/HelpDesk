require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./utils/logger');

// 5. Ловим падения сервера
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1); // Рекомендуется завершать процесс после uncaughtException
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

const app = express();

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 3. Morgan -> Winston
app.use(morgan('combined', { stream: logger.stream }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);

const articleRoutes = require('./routes/articles');
app.use('/api/articles', articleRoutes);

// 4. Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack
  });
  res.status(err.status || 500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
