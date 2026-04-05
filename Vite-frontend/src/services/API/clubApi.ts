const BASE = 'http://localhost:5296/api/club'; // schimba portul daca e diferit

export interface ClubDto {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
  schedule: string;
  level: string;
  rating: number;
  members: number;
}

export interface ClubCreatePayload {
  name: string;
  category: string;
  location: string;
  description: string;
  schedule: string;
  level: string;
}

export interface ClubUpdatePayload extends ClubCreatePayload {
  rating: number;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null as T;
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Eroare server');
  // Dacă răspunsul are structura { isSuccess, data }, returnează direct data
  if (json && typeof json === 'object' && 'data' in json) return json.data as T;
  return json as T;
}

export const clubApi = {
  getAll: () =>
    request<ClubDto[]>(BASE),

  getById: (id: number) =>
    request<ClubDto>(`${BASE}/${id}`),

  create: (payload: ClubCreatePayload) =>
    request<ClubDto>(BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: ClubUpdatePayload) =>
    request<ClubDto>(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  joinClub: (clubId: number, userId: number) =>
    request<void>(`${BASE}/${clubId}/join/${userId}`, { method: 'POST' }),

  delete: (id: number) =>
    request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};
