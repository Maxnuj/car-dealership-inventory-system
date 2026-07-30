import axios from 'axios';

import type { ApiResponse } from '../types/api';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dealership_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const unwrap = <T>(response: { data: ApiResponse<T> }): T => {
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
