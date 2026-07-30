import { z } from 'zod';

const vehicleFields = {
  make: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(50),
  price: z.coerce.number().positive('Price must be greater than zero'),
  quantity: z.coerce.number().int().nonnegative('Quantity cannot be negative'),
  description: z.string().trim().max(5000).nullable().optional(),
  imageUrl: z.string().trim().url().nullable().optional(),
};

export const createVehicleSchema = z.object(vehicleFields);
export const updateVehicleSchema = z
  .object(vehicleFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be supplied');
export const vehicleIdParamsSchema = z.object({ id: z.string().uuid() });
export const inventoryQuantitySchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be greater than zero'),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
