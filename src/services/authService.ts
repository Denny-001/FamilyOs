import { api } from './api';

export interface AuthResponse {
  user: { _id: string; name: string; phone: string; email?: string };
  accessToken: string;
  expiresIn: number;
}

export const authService = {
  register: (payload: { name: string; phone: string; password: string; email?: string }) =>
    api.post<{ data: AuthResponse }>('/auth/register', payload).then((r) => r.data.data),

  login: (payload: { phone: string; password: string }) =>
    api.post<{ data: AuthResponse }>('/auth/login', payload).then((r) => r.data.data),

  logout: () => api.post('/auth/logout'),
};