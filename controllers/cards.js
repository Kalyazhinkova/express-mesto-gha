import { constants } from 'http2';
import { Card } from '../models/card.js';

const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `Некорректные данные карточки. ${message}`,
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

export const read = async (req, res) => {
  try {
    const cards = await Card.find({});
    req.send(cards);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      responseBadRequestError(res, err.message);
    } else {
      responseServerError(res, err.message);
    }
  }
};

export const create = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = { name, link, owner: req.user._id };
    const newCard = await Card.create(card);
    req.send(newCard);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      responseBadRequestError(res, err.message);
    } else {
      responseServerError(res, err.message);
    }
  }
};

export const remove = (req, res) => {
  Card.findById(req.params.id).then((card) => {
    if (!card) {
      throw responseNotFound(res, 'Запрашиваемая карточка не найдена');
    } else if (card.owner.toString() !== req.user._id) {
      throw responseNotFound(res, 'Нельзя удалить чужую карточку!');
    } else {
      return Card.findByIdAndDelete(req.params.id);
    }
  }).then((card) => { res.send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        responseNotFound(res, 'Карточки с таким id не существует');
      } else { res.send(result); }
    }).catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((result) => {
    if (!result) {
      responseNotFound(res, 'Карточки с таким id не существует');
    } else { res.send(result); }
  }).catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      responseBadRequestError(res, err.message);
    } else {
      responseServerError(res, err.message);
    }
  });
};
