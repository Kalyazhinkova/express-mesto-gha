import { constants } from 'http2';
import { User } from '../models/user.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `Некорректные данные для пользователя. ${message}`,
  });

const responseServerError = (res, message) => res
  .status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

const responseNotFound = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `${message}`,
  });

export const readAll = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const readById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        responseNotFound(res, 'Пользователь не найден.');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const create = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const update = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((updateUser) => {
      if (updateUser) {
        res.send(updateUser);
      } else {
        throw responseBadRequestError(res, 'Не удалось обновить пользователя');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};
