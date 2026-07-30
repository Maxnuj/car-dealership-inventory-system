import { PrismaClient, type Prisma, type Vehicle } from '@prisma/client';

export type CreateVehicleData = Prisma.VehicleCreateInput;
export type UpdateVehicleData = Prisma.VehicleUpdateInput;

export interface VehicleRepositoryPort {
  archive(id: string): Promise<Vehicle>;
  create(data: CreateVehicleData): Promise<Vehicle>;
  findActiveById(id: string): Promise<Vehicle | null>;
  findAllActive(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
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

  public update(id: string, data: UpdateVehicleData): Promise<Vehicle> {
    return this.client.vehicle.update({ where: { id }, data });
  }

  public archive(id: string): Promise<Vehicle> {
    return this.client.vehicle.update({ where: { id }, data: { isActive: false } });
  }
}
