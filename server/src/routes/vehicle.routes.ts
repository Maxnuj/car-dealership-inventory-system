import { Router } from 'express';

import type { VehicleController } from '../controllers/vehicle.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.middleware.js';
import { createVehicleSchema, inventoryQuantitySchema, searchVehiclesSchema, updateVehicleSchema, vehicleIdParamsSchema } from '../validators/vehicle.validator.js';

export const createVehicleRouter = (controller: VehicleController): Router => {
  const router = Router();
  router.get('/', controller.getAll);
  router.get('/search', validateQuery(searchVehiclesSchema), controller.search);
  router.get('/:id', validateParams(vehicleIdParamsSchema), controller.getById);
  router.post('/', authenticate, authorize('ADMIN'), validateBody(createVehicleSchema), controller.create);
  router.post('/:id/purchase', authenticate, validateParams(vehicleIdParamsSchema), validateBody(inventoryQuantitySchema), controller.purchase);
  router.post('/:id/restock', authenticate, authorize('ADMIN'), validateParams(vehicleIdParamsSchema), validateBody(inventoryQuantitySchema), controller.restock);
  router.put('/:id', authenticate, authorize('ADMIN'), validateParams(vehicleIdParamsSchema), validateBody(updateVehicleSchema), controller.update);
  router.delete('/:id', authenticate, authorize('ADMIN'), validateParams(vehicleIdParamsSchema), controller.remove);
  return router;
};
