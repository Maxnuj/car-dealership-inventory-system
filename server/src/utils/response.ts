import type { Response } from 'express';

export const success = <T>(response: Response, data: T, statusCode = 200): Response =>
  response.status(statusCode).json({ success: true, data });
