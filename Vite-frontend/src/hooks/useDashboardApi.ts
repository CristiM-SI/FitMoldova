import { useState, useEffect } from 'react';
import { activityApi, type ActivityDto } from '../services/api/activityApi';
import { challengeApi, type ChallengeDto } from '../services/api/challengeApi';
import { eventApi, type EventDto } from '../services/api/eventApi';

const JOINED_KEY = 'fitmoldova_joined_challenges';
function loadJoinedIds(): number[] {
    try { return JSON.parse(localStorage.getItem(JOINED_KEY) ?? '[]'); }
    catch { return []; }
}

export interface DashboardApiData {
    activities: ActivityDto[];
    challenges: ChallengeDto[];
    events: EventDto[];
    joinedChallengeIds: number[];
    loading: boolean;
    error: string | null;
}

export function useDashboardApi(): DashboardApiData {
    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
    const [events, setEvents] = useState<EventDto[]>([]);
    const [joinedChallengeIds] = useState<number[]>(loadJoinedIds);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const [acts, chals, evs] = await Promise.allSettled([
                    activityApi.getAll(),
                    challengeApi.getAll(),
                    eventApi.getAll(),
                ]);

                if (cancelled) return;

                if (acts.status === 'fulfilled') setActivities(acts.value ?? []);
                if (chals.status === 'fulfilled') setChallenges(chals.value ?? []);
                if (evs.status === 'fulfilled') setEvents(evs.value ?? []);

                // Dacă toate au eșuat, setăm eroarea
                if (acts.status === 'rejected' && chals.status === 'rejected' && evs.status === 'rejected') {
                    setError('Nu s-a putut contacta serverul.');
                }
            } catch {
                if (!cancelled) setError('Eroare la încărcarea datelor.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAll();
        return () => { cancelled = true; };
    }, []);

    return { activities, challenges, events, joinedChallengeIds, loading, error };
}
