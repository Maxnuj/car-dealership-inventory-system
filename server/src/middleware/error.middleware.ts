import type { ErrorRequestHandler, RequestHandler } from 'express';

import { AppError } from '../utils/app-error.js';

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${request.method} ${request.originalUrl} was not found`));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details === undefined ? {} : { errors: error.details }),
    });
    return;
  }

  console.error(error);
  response.status(500).json({ success: false, message: 'An unexpected error occurred' });
};
