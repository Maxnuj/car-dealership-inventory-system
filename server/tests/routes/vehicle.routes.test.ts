import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import { VehicleController } from '../../src/controllers/vehicle.controller.js';
import { errorHandler, notFoundHandler } from '../../src/middleware/error.middleware.js';
import { createVehicleRouter } from '../../src/routes/vehicle.routes.js';
import type { VehicleServicePort } from '../../src/services/vehicle.service.js';
import { InsufficientStockError, NotFoundError } from '../../src/utils/app-error.js';

const vehicle = {
  id: '2ac5c5e4-2ce3-456c-9188-2369b7cb2c72',
  make: 'Tesla',
  model: 'Model 3',
  category: 'Sedan',
  price: '42000.00',
  quantity: 4,
  isActive: true,
};
const adminToken = jwt.sign({ sub: 'admin-id', role: 'ADMIN' }, process.env.JWT_SECRET as string);
const userToken = jwt.sign({ sub: 'user-id', role: 'USER' }, process.env.JWT_SECRET as string);
const service: jest.Mocked<VehicleServicePort> = {
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  purchase: jest.fn(),
  remove: jest.fn(),
  restock: jest.fn(),
  update: jest.fn(),
};
const app = express();
app.use(express.json());
app.use('/api/vehicles', createVehicleRouter(new VehicleController(service)));
app.use(notFoundHandler);
app.use(errorHandler);

const input = { make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 42000, quantity: 4 };

describe('vehicle routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a vehicle for an ADMIN', async () => {
    service.create.mockResolvedValue(vehicle as never);
    const response = await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send(input);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, data: expect.objectContaining({ id: vehicle.id }) });
  });

  it('returns active vehicles publicly', async () => {
    service.getAll.mockResolvedValue([vehicle] as never);
    const response = await request(app).get('/api/vehicles');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('returns a vehicle by ID publicly', async () => {
    service.getById.mockResolvedValue(vehicle as never);
    const response = await request(app).get(`/api/vehicles/${vehicle.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(vehicle.id);
  });

  it('updates and archives a vehicle for an ADMIN', async () => {
    service.update.mockResolvedValue({ ...vehicle, quantity: 6 } as never);
    service.remove.mockResolvedValue({ ...vehicle, isActive: false } as never);
    await expect(request(app).put(`/api/vehicles/${vehicle.id}`).set('Authorization', `Bearer ${adminToken}`).send({ quantity: 6 })).resolves.toMatchObject({ status: 200 });
    await expect(request(app).delete(`/api/vehicles/${vehicle.id}`).set('Authorization', `Bearer ${adminToken}`)).resolves.toMatchObject({ status: 200 });
  });

  it('rejects invalid vehicle payloads', async () => {
    const response = await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send({ ...input, price: 0, quantity: -1 });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('rejects unauthenticated and non-admin mutation attempts', async () => {
    await expect(request(app).post('/api/vehicles').send(input)).resolves.toMatchObject({ status: 401 });
    await expect(request(app).post('/api/vehicles').set('Authorization', `Bearer ${userToken}`).send(input)).resolves.toMatchObject({ status: 403 });
  });

  it('purchases a vehicle for an authenticated user', async () => {
    service.purchase.mockResolvedValue({ ...vehicle, quantity: 3 } as never);
    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body.data.quantity).toBe(3);
  });

  it('reports purchase inventory conflicts and missing vehicles', async () => {
    service.purchase.mockRejectedValueOnce(new InsufficientStockError());
    const conflict = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 10 });
    expect(conflict.status).toBe(409);

    service.purchase.mockRejectedValueOnce(new NotFoundError('Vehicle not found'));
    const missing = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });
    expect(missing.status).toBe(404);
  });

  it('rejects invalid and unauthenticated purchases', async () => {
    await expect(request(app).post(`/api/vehicles/${vehicle.id}/purchase`).send({ quantity: 1 })).resolves.toMatchObject({ status: 401 });
    await expect(request(app).post(`/api/vehicles/${vehicle.id}/purchase`).set('Authorization', `Bearer ${userToken}`).send({ quantity: 0 })).resolves.toMatchObject({ status: 400 });
  });

  it('restocks for an ADMIN and rejects invalid or USER requests', async () => {
    service.restock.mockResolvedValue({ ...vehicle, quantity: 8 } as never);
    await expect(request(app).post(`/api/vehicles/${vehicle.id}/restock`).set('Authorization', `Bearer ${adminToken}`).send({ quantity: 4 })).resolves.toMatchObject({ status: 200 });
    await expect(request(app).post(`/api/vehicles/${vehicle.id}/restock`).set('Authorization', `Bearer ${adminToken}`).send({ quantity: 0 })).resolves.toMatchObject({ status: 400 });
    await expect(request(app).post(`/api/vehicles/${vehicle.id}/restock`).set('Authorization', `Bearer ${userToken}`).send({ quantity: 4 })).resolves.toMatchObject({ status: 403 });
  });
});
