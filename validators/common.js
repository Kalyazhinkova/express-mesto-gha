import { celebrator, Joi } from 'celebrate';

// Настраиваем celebrate для дальнейшего использования
export const celebrate = celebrator(
  { mode: 'full' }, // проверять весь запрос, а не только его часть - это указание для celebrate
  { abortEarly: false }, // не останавливать проверку при первой же ошибке - это указание для Joi
);

export const sсhemaObjectId = Joi.string().hex().length(24); // как валидировать ObjectID
export const sсhemaURL = Joi.string().uri({ scheme: ['http', 'https'] }); // проверка на url
