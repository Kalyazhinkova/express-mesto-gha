import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import { constants } from 'http2';

import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';

export const run = async (envName) => {
  process.on('unhandleRejection', (err) => {
    console.error(err);
    process.exit(1); // выход с ошибкой
  });

  const app = express();
  const config = { PORT: 3000, HOST: 'localhost' };
  config.NODE_ENV = envName;

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    req.user = {
      _id: '6372665aa3bea6f3ea34fc25',
    };
    if (req.headers.Authorization || req.headers.authorization) {
      req.user._id = req.headers.Authorization || req.headers.authorization;
    }

    next();
  });
  app.use(bodyParser.json());
  app.use('/users', userRouter);
  app.use('/cards', cardRouter);
  app.all('/*', (req, res) => {
    res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
  });

  mongoose.set('runValidators', true);
  await mongoose.connect('mongodb://localhost:27017/mestodb');
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
