import express from 'express';
import request from 'supertest';

import { AuthController } from '../../src/controllers/auth.controller.js';
import { createAuthRouter } from '../../src/routes/auth.routes.js';
import { errorHandler, notFoundHandler } from '../../src/middleware/error.middleware.js';
import type { AuthServicePort } from '../../src/services/auth.service.js';

const password = 'SecurePassword123!';

const authService: jest.Mocked<AuthServicePort> = {
  login: jest.fn(),
  register: jest.fn(),
};

const app = express();
app.use(express.json());
app.use('/api/auth', createAuthRouter(new AuthController(authService)));
app.use(notFoundHandler);
app.use(errorHandler);

describe('authentication routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns zod validation errors for an invalid registration payload', async () => {
    const response = await request(app).post('/api/auth/register').send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toEqual(expect.any(Array));
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('returns the standard success envelope for registration', async () => {
    authService.register.mockResolvedValue({
      token: 'signed-token',
      user: { id: 'user-id', username: 'ada', email: 'ada@example.com', role: 'USER' },
    });

    const response = await request(app).post('/api/auth/register').send({
      username: 'Ada',
      email: 'ada@example.com',
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, data: expect.objectContaining({ token: 'signed-token' }) });
  });
});
