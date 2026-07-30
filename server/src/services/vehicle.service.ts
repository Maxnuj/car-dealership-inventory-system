import type { Vehicle } from '@prisma/client';

import type { VehicleRepositoryPort } from '../repositories/vehicle.repository.js';
import type { CreateVehicleInput, UpdateVehicleInput } from '../validators/vehicle.validator.js';
import { NotFoundError } from '../utils/app-error.js';
import { InsufficientStockError } from '../utils/app-error.js';

export interface VehicleServicePort {
  create(input: CreateVehicleInput): Promise<Vehicle>;
  getAll(): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle>;
  purchase(id: string, userId: string, quantity: number): Promise<Vehicle>;
  remove(id: string): Promise<Vehicle>;
  restock(id: string, quantity: number): Promise<Vehicle>;
  update(id: string, input: UpdateVehicleInput): Promise<Vehicle>;
}

export class VehicleService implements VehicleServicePort {
  public constructor(private readonly vehicles: VehicleRepositoryPort) {}

  public create(input: CreateVehicleInput): Promise<Vehicle> {
    return this.vehicles.create(input);
  }

  public getAll(): Promise<Vehicle[]> {
    return this.vehicles.findAllActive();
  }

  public async getById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicles.findActiveById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
    return vehicle;
  }

  public async update(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
    await this.requireVehicle(id);
    return this.vehicles.update(id, input);
  }

  public async remove(id: string): Promise<Vehicle> {
    await this.requireVehicle(id);
    return this.vehicles.archive(id);
  }

  public async purchase(id: string, userId: string, quantity: number): Promise<Vehicle> {
    const result = await this.vehicles.purchase(id, userId, quantity);
    if (result.status === 'not_found') throw new NotFoundError('Vehicle not found');
    if (result.status === 'insufficient_stock') throw new InsufficientStockError();
    return result.vehicle;
  }

  public async restock(id: string, quantity: number): Promise<Vehicle> {
    const result = await this.vehicles.restock(id, quantity);
    if (result.status === 'not_found') throw new NotFoundError('Vehicle not found');
    return result.vehicle;
  }

  private async requireVehicle(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicles.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
    return vehicle;
  }
}
