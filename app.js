import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { constants } from 'http2';
import { errors } from 'celebrate';

import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';
import { router as authRouter } from './routes/auth.js';
import { auth } from './middlewares/auth.js';

export const run = async (envName) => {
  process.on('unhandleRejection', (err) => {
    console.error(err);
    process.exit(1); // выход с ошибкой
  });

  const config = dotenv.config({ path: path.resolve('.env.common') }).parsed;
  if (!config) {
    throw new Error('Config not found');
  }

  config.NODE_ENV = envName;

  const app = express();

  app.set('config', config);
  app.use(bodyParser.json());

  app.use('/', authRouter);
  app.use('/users', auth, userRouter);
  app.use('/cards', auth, cardRouter);
  app.use(errors());
  app.all('/*', (req, res) => {
    res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
  });

  app.use((err, req, res, next) => {
    const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    const message = err.message || 'Неизвестная ошибка';
    res.status(status).send({ message });
    next();
  });

  mongoose.set('runValidators', true);
  await mongoose.connect(config.DB_URL);
  const server = app.listen(config.PORT, config.HOST, () => {
    console.log(`Сервер запущен http://${config.HOST}:${config.PORT}`);
  });

  // завершаем работу приложения
  const stop = async () => {
    await mongoose.connection.close();
    server.close();
    process.exit(0); // выход без ошибок
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};
