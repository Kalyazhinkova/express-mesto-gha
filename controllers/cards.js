import { Card } from '../models/card.js';
import { HTTPError } from '../errors/HTTPError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ServerError } from '../errors/ServerError.js';

const notFoundError = (message) => new NotFoundError(message);
const serverError = (message) => new ServerError(message);
const badRequestError = (message) => new BadRequestError(`Некорректные данные для карточки. ${message}`);

export const read = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
      // if (err instanceof HTTPError) {
      //   next(err);
      // } else {
      //   next(serverError(err.message));
      // }
    });
};

export const create = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(serverError(err.message));
      }
    });
};

export const remove = (req, res, next) => {
  Card.findOneAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw notFoundError('Запрашиваемая карточка не найдена!');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои карточки!');
      } else {
        res.send(card);
      }
    }).then((card) => { res.send(card); })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(serverError(err.message));
      }
    });
};

export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        throw notFoundError('Карточки с таким id не существует');
      } else { res.send({ data: result }); }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(serverError(err.message));
      }
    });
};

export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((result) => {
    if (!result) {
      throw notFoundError('Карточки с таким id не существует');
    } else { res.send(result); }
  })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError(err.message));
      } else {
        next(serverError(err.message));
      }
    });
};
