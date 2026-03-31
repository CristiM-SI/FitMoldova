// src/services/API/userApi.ts
const BASE = 'http://localhost:5296/api/user';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  role: string; // "User" | "Moderator" | "Admin"
}

export interface RegisterResponse {
  id: number;
}

interface ServiceResponse<T = unknown> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

async function request<T>(url: string, options?: RequestInit): Promise<ServiceResponse<T>> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  return json as ServiceResponse<T>;
}

export const userApi = {
  login: (credential: string, password: string) =>
    request<LoginResponse>(`${BASE}/login`, {
      method: 'POST',
      body: JSON.stringify({ credential, password }),
    }),

  register: (username: string, email: string, password: string) =>
    request<RegisterResponse>(`${BASE}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  getById: (id: number) =>
    request<LoginResponse>(`${BASE}/${id}`),
};
