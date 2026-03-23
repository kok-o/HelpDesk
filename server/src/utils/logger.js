const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

// 1. Создание папки logs автоматически
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 2. Добавь формат логов (чтобы читать было удобно)
const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Настройка Winston
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }), // Чтобы ошибки логировались со стектрейсом
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // 6. Ограничение размера логов
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',   // максимальный размер одного файла
      maxFiles: '14d',  // хранить файлы за последние 14 дней
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Читаемый формат для консоли в режиме разработки
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    })
  );
}

// 3. Morgan -> Winston (прокидываем stream)
logger.stream = {
  write: (message) => {
    // Убираем лишние переносы строк, которые добавляет morgan
    logger.info(message.trim());
  },
};

module.exports = logger;
