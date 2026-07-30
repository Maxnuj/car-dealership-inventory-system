import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { ForbiddenError, UnauthorizedError } from '../utils/app-error.js';

export type JwtPayload = { sub: string; role: 'USER' | 'ADMIN' };

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export const authenticate: RequestHandler = (request, _response, next) => {
  const token = request.header('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return next(new UnauthorizedError('Authentication is required'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || typeof payload.sub !== 'string' || (payload.role !== 'USER' && payload.role !== 'ADMIN')) return next(new UnauthorizedError('Invalid authentication token'));
    request.auth = { sub: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};

export const authorize = (...roles: JwtPayload['role'][]): RequestHandler => (request, _response, next) => {
  if (!request.auth) return next(new UnauthorizedError('Authentication is required'));
  if (!roles.includes(request.auth.role)) return next(new ForbiddenError());
  next();
};
