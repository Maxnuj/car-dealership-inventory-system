import { PrismaClient, type Prisma, type Vehicle } from '@prisma/client';

import type { SearchVehiclesInput } from '../validators/vehicle.validator.js';

export type CreateVehicleData = Prisma.VehicleCreateInput;
export type UpdateVehicleData = Prisma.VehicleUpdateInput;
export type PurchaseResult =
  | { status: 'not_found' }
  | { status: 'insufficient_stock' }
  | { status: 'purchased'; vehicle: Vehicle };
export type RestockResult = { status: 'not_found' } | { status: 'restocked'; vehicle: Vehicle };

export interface VehicleRepositoryPort {
  archive(id: string): Promise<Vehicle>;
  create(data: CreateVehicleData): Promise<Vehicle>;
  findActiveById(id: string): Promise<Vehicle | null>;
  findAllActive(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  purchase(id: string, userId: string, quantity: number): Promise<PurchaseResult>;
  restock(id: string, quantity: number): Promise<RestockResult>;
  search(filters: SearchVehiclesInput): Promise<Vehicle[]>;
  update(id: string, data: UpdateVehicleData): Promise<Vehicle>;
}

export class VehicleRepository implements VehicleRepositoryPort {
  public constructor(private readonly client: PrismaClient) {}

  public create(data: CreateVehicleData): Promise<Vehicle> {
    return this.client.vehicle.create({ data });
  }

  public findAllActive(): Promise<Vehicle[]> {
    return this.client.vehicle.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  }

  public findActiveById(id: string): Promise<Vehicle | null> {
    return this.client.vehicle.findFirst({ where: { id, isActive: true } });
  }

  public findById(id: string): Promise<Vehicle | null> {
    return this.client.vehicle.findUnique({ where: { id } });
  }

  public search(filters: SearchVehiclesInput): Promise<Vehicle[]> {
    const { make, model, category, minPrice, maxPrice } = filters;
    const where: Prisma.VehicleWhereInput = {
      isActive: true,
      ...(make === undefined ? {} : { make: { contains: make, mode: 'insensitive' } }),
      ...(model === undefined ? {} : { model: { contains: model, mode: 'insensitive' } }),
      ...(category === undefined ? {} : { category: { contains: category, mode: 'insensitive' } }),
      ...(minPrice === undefined && maxPrice === undefined
        ? {}
        : { price: { ...(minPrice === undefined ? {} : { gte: minPrice }), ...(maxPrice === undefined ? {} : { lte: maxPrice }) } }),
    };
    return this.client.vehicle.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  public update(id: string, data: UpdateVehicleData): Promise<Vehicle> {
    return this.client.vehicle.update({ where: { id }, data });
  }

  public archive(id: string): Promise<Vehicle> {
    return this.client.vehicle.update({ where: { id }, data: { isActive: false } });
  }

  public async purchase(id: string, userId: string, quantity: number): Promise<PurchaseResult> {
    return this.client.$transaction(async (transaction) => {
      const vehicle = await transaction.vehicle.findFirst({ where: { id, isActive: true } });
      if (!vehicle) return { status: 'not_found' };

      const decrement = await transaction.vehicle.updateMany({
        where: { id, isActive: true, quantity: { gte: quantity } },
        data: { quantity: { decrement: quantity } },
      });
      if (decrement.count === 0) return { status: 'insufficient_stock' };

      const updatedVehicle = await transaction.vehicle.findUniqueOrThrow({ where: { id } });
      await transaction.purchase.create({
        data: { userId, vehicleId: id, quantity, unitPrice: vehicle.price },
      });
      return { status: 'purchased', vehicle: updatedVehicle };
    });
  }

  public async restock(id: string, quantity: number): Promise<RestockResult> {
    const update = await this.client.vehicle.updateMany({
      where: { id },
      data: { quantity: { increment: quantity } },
    });
    if (update.count === 0) return { status: 'not_found' };
    return { status: 'restocked', vehicle: await this.client.vehicle.findUniqueOrThrow({ where: { id } }) };
  }
}
