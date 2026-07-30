import { Router } from 'express';

import type { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

export const createAuthRouter = (controller: AuthController): Router => {
  const router = Router();
  router.post('/register', validateBody(registerSchema), controller.register);
  router.post('/login', validateBody(loginSchema), controller.login);
  return router;
};
