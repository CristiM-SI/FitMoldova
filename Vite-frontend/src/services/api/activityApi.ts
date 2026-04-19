import { BASE_URL } from './axiosInstance';
const BASE = `${BASE_URL}/activity`;

export interface ActivityDto {
    id: number;
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
    description: string;
    imageUrl: string;
    createdBy: string;
    participantsCount: number;
}

export interface ActivityCreatePayload {
    userId: number;
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
    description: string;
    imageUrl: string;
}

export interface ActivityUpdatePayload {
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
    description: string;
    imageUrl: string;
}

/**
 * Fetch wrapper robust — nu mai crapă la răspunsuri non-JSON (HTML de eroare,
 * body gol, text plain). Extrage mereu text-ul, apoi încearcă să-l parseze
 * ca JSON doar dacă arată a JSON.
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
    let res: Response;
    try {
        res = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
    } catch (err) {
        // Eroare de rețea / CORS / server oprit
        throw new Error(
            err instanceof Error
                ? `Nu s-a putut contacta serverul: ${err.message}`
                : 'Nu s-a putut contacta serverul.'
        );
    }

    if (res.status === 204) return null as T;

    // Citește răspunsul ca text întâi. Nu aruncă erori chiar dacă body-ul e gol.
    const text = await res.text();

    // Încearcă să parseze ca JSON. Dacă nu reușește (HTML de eroare, text plain),
    // folosește raw text pentru mesajul de eroare.
    let parsed: unknown = null;
    if (text && text.trim().length > 0) {
        try {
            parsed = JSON.parse(text);
        } catch {
            // Nu e JSON — poate e HTML (dev exception page) sau mesaj text.
            if (!res.ok) {
                // Tăiem HTML-ul la primele 200 caractere pentru lizibilitate.
                const snippet = text.replace(/<[^>]+>/g, ' ').trim().slice(0, 200);
                throw new Error(`Server: ${res.status} ${res.statusText}${snippet ? ' — ' + snippet : ''}`);
            }
            // Răspuns 2xx dar nu e JSON — returnăm text-ul ca atare
            return text as unknown as T;
        }
    }

    // Dacă backend-ul a întors eroare (4xx/5xx), aruncăm mesajul din JSON
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

export const activityApi = {
    getAll: () => request<ActivityDto[]>(BASE),

    getById: (id: number) => request<ActivityDto>(`${BASE}/${id}`),

    create: (payload: ActivityCreatePayload) =>
        request<number>(BASE, { method: 'POST', body: JSON.stringify(normalizePayload(payload)) }),

    update: (id: number, payload: ActivityUpdatePayload) =>
        request<number>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(normalizePayload(payload)) }),

    delete: (id: number) =>
        request<void>(`${BASE}/${id}`, { method: 'DELETE' }),

    join: (activityId: number, userId: number) =>
        request<void>(`${BASE}/${activityId}/join/${userId}`, { method: 'POST' }),

    getParticipants: (activityId: number) =>
        request<Array<{ id: number; username: string; joinedAt: string }>>(`${BASE}/${activityId}/participants`),
};

/**
 * Normalizează payload-ul înainte de trimitere:
 * - asigură format ISO 8601 complet pentru `date` (cu secunde), altfel
 *   System.Text.Json din .NET poate refuza "2026-04-17T10:00" fără secunde.
 */
function normalizePayload<T extends { date?: string }>(payload: T): T {
    if (!payload.date) return payload;
    const d = payload.date;
    // Format datetime-local: "YYYY-MM-DDTHH:MM" (16 caractere) → adaugă ":00"
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(d)) {
        return { ...payload, date: `${d}:00` };
    }
    return payload;
}
