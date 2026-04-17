const BASE = 'http://localhost:5296/api/club';

export interface ClubDto {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
  schedule: string;
  level: string;
  rating: number;
  imageUrl: string;
  /** Număr membri calculat pe server din COUNT(*) pe ClubMembers. */
  membersCount: number;
}

export interface ClubCreatePayload {
  name: string;
  category: string;
  location: string;
  description: string;
  schedule: string;
  level: string;
  imageUrl: string;
}

export interface ClubUpdatePayload extends ClubCreatePayload {
  rating: number;
}

export interface ClubMemberDto {
  id: number;
  username: string;
  joinedAt: string;
}

/**
 * Fetch wrapper robust — nu crapă la răspunsuri non-JSON (HTML de eroare,
 * body gol, text plain). Extrage mereu text-ul, apoi încearcă JSON.parse
 * doar dacă textul arată a JSON.
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? `Nu s-a putut contacta serverul: ${err.message}`
        : 'Nu s-a putut contacta serverul.'
    );
  }

  if (res.status === 204) return null as T;

  const text = await res.text();
  let parsed: unknown = null;

  if (text && text.trim().length > 0) {
    try {
      parsed = JSON.parse(text);
    } catch {
      if (!res.ok) {
        const snippet = text.replace(/<[^>]+>/g, ' ').trim().slice(0, 200);
        throw new Error(`Server: ${res.status} ${res.statusText}${snippet ? ' — ' + snippet : ''}`);
      }
      return text as unknown as T;
    }
  }

  if (!res.ok) {
    const msg =
      (parsed && typeof parsed === 'object' && parsed !== null && 'message' in parsed
        ? String((parsed as { message?: unknown }).message ?? '')
        : '') || `Eroare server: ${res.status}`;
    throw new Error(msg);
  }

  // Structură standard { isSuccess, data, message } → returnăm doar data
  if (parsed && typeof parsed === 'object' && 'data' in parsed) {
    return (parsed as { data: T }).data;
  }

  return parsed as T;
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

  /** POST /api/club/{clubId}/join/{userId} — inserează membership. */
  joinClub: (clubId: number, userId: number) =>
    request<void>(`${BASE}/${clubId}/join/${userId}`, { method: 'POST' }),

  /** DELETE /api/club/{clubId}/leave/{userId} — șterge membership. */
  leaveClub: (clubId: number, userId: number) =>
    request<void>(`${BASE}/${clubId}/leave/${userId}`, { method: 'DELETE' }),

  /** GET /api/club/{clubId}/members — listă membri. */
  getMembers: (clubId: number) =>
    request<ClubMemberDto[]>(`${BASE}/${clubId}/members`),

  /** GET /api/club/user/{userId} — cluburile în care userul e membru. */
  getUserClubs: (userId: number) =>
    request<ClubDto[]>(`${BASE}/user/${userId}`),

  delete: (id: number) =>
    request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};
