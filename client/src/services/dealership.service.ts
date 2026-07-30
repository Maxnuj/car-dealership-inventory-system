import { api, unwrap } from './api';
import type { AuthResult, Vehicle, VehicleInput, VehicleSearch } from '../types/api';

export const dealershipService = {
  login: async (email: string, password: string) => unwrap<AuthResult>(await api.post('/auth/login', { email, password })),
  register: async (username: string, email: string, password: string) => unwrap<AuthResult>(await api.post('/auth/register', { username, email, password })),
  listVehicles: async () => unwrap<Vehicle[]>(await api.get('/vehicles')),
  searchVehicles: async (filters: VehicleSearch) => unwrap<Vehicle[]>(await api.get('/vehicles/search', { params: filters })),
  createVehicle: async (input: VehicleInput) => unwrap<Vehicle>(await api.post('/vehicles', input)),
  updateVehicle: async (id: string, input: Partial<VehicleInput>) => unwrap<Vehicle>(await api.put(`/vehicles/${id}`, input)),
  deleteVehicle: async (id: string) => unwrap<Vehicle>(await api.delete(`/vehicles/${id}`)),
  purchaseVehicle: async (id: string, quantity: number) => unwrap<Vehicle>(await api.post(`/vehicles/${id}/purchase`, { quantity })),
  restockVehicle: async (id: string, quantity: number) => unwrap<Vehicle>(await api.post(`/vehicles/${id}/restock`, { quantity })),
};
