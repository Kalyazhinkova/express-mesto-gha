import { constants } from 'http2';

export const responseBadRequestError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: 'Некорректные данные для пользователя.',
  });

export const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({
    message: 'На сервере произошла ошибка.',
  });

export const responseNotFound = (res, message) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: `${message}`,
  });
