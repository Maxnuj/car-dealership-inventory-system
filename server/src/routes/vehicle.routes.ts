import { Router } from 'express';

import type { VehicleController } from '../controllers/vehicle.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody, validateParams } from '../middleware/validate.middleware.js';
import { createVehicleSchema, updateVehicleSchema, vehicleIdParamsSchema } from '../validators/vehicle.validator.js';

export const createVehicleRouter = (controller: VehicleController): Router => {
  const router = Router();
  router.get('/', controller.getAll);
  router.get('/:id', validateParams(vehicleIdParamsSchema), controller.getById);
  router.post('/', authenticate, authorize('ADMIN'), validateBody(createVehicleSchema), controller.create);
  router.put('/:id', authenticate, authorize('ADMIN'), validateParams(vehicleIdParamsSchema), validateBody(updateVehicleSchema), controller.update);
  router.delete('/:id', authenticate, authorize('ADMIN'), validateParams(vehicleIdParamsSchema), controller.remove);
  return router;
};
