import { Card } from '../models/card.js';
import { responseBadRequestError, responseServerError, responseNotFound } from '../errors/errors.js';

export const read = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      responseServerError(res);
    });
};

export const create = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });
};

export const remove = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw responseNotFound(res, 'Запрашиваемая карточка не найдена');
      } else {
        res.send(card);
      }
    }).then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        responseNotFound(res, 'Карточки с таким id не существует');
      } else { res.send({ data: result }); }
    }).catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
      }
    });
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((result) => {
    if (!result) {
      responseNotFound(res, 'Карточки с таким id не существует');
    } else { res.send(result); }
  }).catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      responseBadRequestError(res);
    } else {
      responseServerError(res);
    }
  });
};
