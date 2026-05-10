import { ErrorRequestHandler } from 'express';

import HttpError from '../errors/http-error';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
};

export default errorHandler;
