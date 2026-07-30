import type { ParamsDictionary, RequestHandler } from 'express-serve-static-core';
import type { ZodType } from 'zod';

import { AppError } from '../utils/app-error.js';

export const validateBody = (schema: ZodType): RequestHandler => (request, _response, next) => {
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', parsed.error.issues));
    return;
  }

  request.body = parsed.data;
  next();
};

export const validateParams = (schema: ZodType): RequestHandler => (request, _response, next) => {
  const parsed = schema.safeParse(request.params);
  if (!parsed.success) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', parsed.error.issues));
    return;
  }

  request.params = parsed.data as ParamsDictionary;
  next();
};
