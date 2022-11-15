import { User } from '../models/user.js';
import { responseBadRequestError, responseServerError, responseNotFound } from '../errors/errors.js';

export const readAll = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      responseServerError(res);
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
        responseBadRequestError(res);
      } else {
        responseServerError(res);
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
        responseBadRequestError(res);
      } else {
        responseServerError(res);
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
        throw responseNotFound(res, 'Не удалось обновить пользователя');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });
};

export const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((updateUser) => {
      if (updateUser) {
        res.send(updateUser);
      } else {
        throw responseNotFound(res, 'Не удалось обновить пользователя');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });
};
