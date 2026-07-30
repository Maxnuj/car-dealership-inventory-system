import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { AuthController } from './controllers/auth.controller.js';
import { VehicleController } from './controllers/vehicle.controller.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { UserRepository } from './repositories/user.repository.js';
import { createAuthRouter } from './routes/auth.routes.js';
import { createVehicleRouter } from './routes/vehicle.routes.js';
import { AuthService } from './services/auth.service.js';
import { VehicleService } from './services/vehicle.service.js';
import { VehicleRepository } from './repositories/vehicle.repository.js';

export const createApp = (): express.Express => {
  const app = express();
  const authController = new AuthController(new AuthService(new UserRepository(prisma)));
  const vehicleController = new VehicleController(new VehicleService(new VehicleRepository(prisma)));
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: false }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/vehicles', createVehicleRouter(vehicleController));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
