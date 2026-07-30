import type { RequestHandler } from 'express';

import type { VehicleServicePort } from '../services/vehicle.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import type { SearchVehiclesInput } from '../validators/vehicle.validator.js';

export class VehicleController {
  public constructor(private readonly vehicleService: VehicleServicePort) {}

  public create: RequestHandler = asyncHandler(async (request, response) => {
    success(response, await this.vehicleService.create(request.body), 201);
  });

  public getAll: RequestHandler = asyncHandler(async (_request, response) => {
    success(response, await this.vehicleService.getAll());
  });

  public getById: RequestHandler = asyncHandler(async (request, response) => {
    success(response, await this.vehicleService.getById(request.params.id as string));
  });

  public search: RequestHandler = asyncHandler(async (_request, response) => {
    success(response, await this.vehicleService.search(response.locals.validatedQuery as SearchVehiclesInput));
  });

  public update: RequestHandler = asyncHandler(async (request, response) => {
    success(response, await this.vehicleService.update(request.params.id as string, request.body));
  });

  public remove: RequestHandler = asyncHandler(async (request, response) => {
    success(response, await this.vehicleService.remove(request.params.id as string));
  });

  public purchase: RequestHandler = asyncHandler(async (request, response) => {
    success(response, await this.vehicleService.purchase(request.params.id as string, request.auth!.sub, request.body.quantity));
  });

  public restock: RequestHandler = asyncHandler(async (request, response) => {
    success(response, await this.vehicleService.restock(request.params.id as string, request.body.quantity));
  });
}
