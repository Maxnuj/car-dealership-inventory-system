import type { RequestHandler } from 'express';
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
