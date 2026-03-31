// TODO: schimba BASE_URL cu portul real al backend-ului tau
const BASE_URL = 'http://localhost:5296/api/activitate';

export interface ActivitateCreatePayload {
  name: string;
  type: string;
  duration: string;
  distance: string;
  calories: number;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(text || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return (json?.data ?? json) as T;
}

export const activitateApi = {
  create: (payload: ActivitateCreatePayload) =>
    request<ActivitateCreatePayload & { id: number }>(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
};