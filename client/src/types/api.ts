export type Role = 'USER' | 'ADMIN';

export type User = { id: string; username: string; email: string; role: Role };
export type AuthResult = { token: string; user: User };
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  category: string;
  price: string;
  quantity: number;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
};
export type VehicleInput = {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  description?: string | null;
  imageUrl?: string | null;
};
export type VehicleSearch = { make?: string; model?: string; category?: string; minPrice?: string; maxPrice?: string };
type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; message: string; errors?: unknown };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
