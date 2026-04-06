// src/services/api/eventApi.ts
// Toate apelurile HTTP catre backend pentru entitatea Event

const BASE = 'http://localhost:5296/api/event';  // schimba portul daca e diferit

export interface EventDto {
  id: number;
  name: string;
  description: string;
  date: string;          // ISO string: "2026-06-15T08:00:00"
  location: string;
  city: string;
  category: string;
  participants: number;
  maxParticipants: number;
  price: string;
  organizer: string;
  difficulty: string;
}

export interface EventCreatePayload {
  name: string;
  description: string;
  date: string;
  location: string;
  city: string;
  category: string;
  maxParticipants: number;
  price: string;
  organizer: string;
  difficulty: string;
}

export interface EventUpdatePayload extends EventCreatePayload {}
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

export const eventApi = {
    getAll: () =>
        request<EventDto[]>(BASE),

    getById: (id: number) =>
        request<EventDto>(`${BASE}/${id}`),

    create: (payload: EventCreatePayload) =>
        request<EventDto>(BASE, {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    update: (id: number, payload: EventUpdatePayload) =>
        request<EventDto>(`${BASE}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    delete: (id: number) =>
        request<void>(`${BASE}/${id}`, { method: 'DELETE' }),

    join: (eventId: number, userId: number) =>
        request<void>(`${BASE}/${eventId}/join/${userId}`, { method: 'POST' }),
};
