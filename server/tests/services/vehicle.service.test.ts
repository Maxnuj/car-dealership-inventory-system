import { InsufficientStockError, NotFoundError } from '../../src/utils/app-error.js';
import type { VehicleRepositoryPort } from '../../src/repositories/vehicle.repository.js';
import { VehicleService } from '../../src/services/vehicle.service.js';

const vehicle = {
  id: '2ac5c5e4-2ce3-456c-9188-2369b7cb2c72',
  make: 'Tesla',
  model: 'Model 3',
  category: 'Sedan',
  price: { toString: () => '42000.00' },
  quantity: 4,
  description: null,
  imageUrl: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as never;

describe('VehicleService', () => {
  const repository: jest.Mocked<VehicleRepositoryPort> = {
    archive: jest.fn(),
    create: jest.fn(),
    findActiveById: jest.fn(),
    findAllActive: jest.fn(),
    findById: jest.fn(),
    purchase: jest.fn(),
    restock: jest.fn(),
    update: jest.fn(),
  };
  const service = new VehicleService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('creates a vehicle through the repository', async () => {
    repository.create.mockResolvedValue(vehicle);

    await expect(
      service.create({ make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 42000, quantity: 4 }),
    ).resolves.toBe(vehicle);
  });

  it('returns active vehicles for public listing', async () => {
    repository.findAllActive.mockResolvedValue([vehicle]);

    await expect(service.getAll()).resolves.toEqual([vehicle]);
  });

  it('throws a not-found error for an unavailable vehicle', async () => {
    repository.findActiveById.mockResolvedValue(null);

    await expect(service.getById(vehicle.id)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('updates an existing vehicle', async () => {
    repository.findById.mockResolvedValue(vehicle);
    repository.update.mockResolvedValue({ ...vehicle, quantity: 5 });

    await expect(service.update(vehicle.id, { quantity: 5 })).resolves.toMatchObject({ quantity: 5 });
  });

  it('archives an existing vehicle when deleted', async () => {
    repository.findById.mockResolvedValue(vehicle);
    repository.archive.mockResolvedValue({ ...vehicle, isActive: false });

    await expect(service.remove(vehicle.id)).resolves.toMatchObject({ isActive: false });
  });

  it('returns updated inventory for a successful purchase', async () => {
    repository.purchase.mockResolvedValue({ status: 'purchased', vehicle: { ...vehicle, quantity: 2 } });

    await expect(service.purchase(vehicle.id, 'user-id', 2)).resolves.toMatchObject({ quantity: 2 });
  });

  it('rejects a purchase that would oversell inventory', async () => {
    repository.purchase.mockResolvedValue({ status: 'insufficient_stock' });

    await expect(service.purchase(vehicle.id, 'user-id', 9)).rejects.toBeInstanceOf(InsufficientStockError);
  });

  it('restocks an existing vehicle', async () => {
    repository.restock.mockResolvedValue({ status: 'restocked', vehicle: { ...vehicle, quantity: 7 } });

    await expect(service.restock(vehicle.id, 3)).resolves.toMatchObject({ quantity: 7 });
  });
});
