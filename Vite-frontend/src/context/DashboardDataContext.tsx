import {
    createContext, useState, useEffect, useCallback, useMemo, type ReactNode,
} from 'react';
import { activityApi, type ActivityDto } from '../services/api/activityApi';
import { challengeApi, type ChallengeDto } from '../services/api/challengeApi';
import { eventApi, type EventDto } from '../services/api/eventApi';
import { clubApi, type ClubDto } from '../services/api/clubApi';
import { useAuth } from './AuthContext';
import type { Traseu } from '../types/Route';

// ─── Tipuri legacy (compatibilitate cu paginile existente) ───────────────────

export interface LegacyActivity {
    id: number; name: string; type: string;
    distance: string; duration: string; calories: number; date: string;
}
export interface LegacyChallenge {
    id: number; name: string; description: string;
    duration: string; difficulty: string; participants: number; progress?: number;
}
export interface LegacyEvent {
    id: number; name: string; category: string; date: string;
    city: string; participants: number; price: string; difficulty: string;
    description: string; imageUrl?: string; image?: string; icon?: string;
    time?: string; tags?: string[]; lat?: number; lng?: number;
}

export interface DashboardApiState {
    activities: ActivityDto[];
    challenges: ChallengeDto[];
    events: EventDto[];
    clubs: ClubDto[];

    userClubs: ClubDto[];
    joinedChallengeIds: number[];
    joinedEventIds: number[];
    joinedActivityIds: number[];        // NOU
    joinedActivities: ActivityDto[];    // NOU — activitatile complete la care e inscris

    activitatiCurente: LegacyActivity[];
    provocariInscrise: LegacyChallenge[];
    evenimenteInscrise: LegacyEvent[];
    traseeSalvate: Traseu[];

    loading: boolean;
    error: string | null;

    joinChallenge: (id: number) => Promise<void>;
    leaveChallenge: (id: number) => Promise<void>;
    joinEvent: (id: number) => Promise<void>;
    leaveEvent: (id: number) => Promise<void>;
    joinClub: (id: number) => Promise<void>;
    leaveClub: (id: number) => Promise<void>;
    joinActivity: (id: number) => Promise<void>;    // NOU
    leaveActivity: (id: number) => Promise<void>;   // NOU
    refetch: () => void;

    addActivitate: (item: LegacyActivity) => void;
    removeActivitate: (id: number) => void;
    addProvocare: (item: LegacyChallenge) => void;
    removeProvocare: (id: number) => void;
    addEveniment: (item: LegacyEvent) => void;
    removeEveniment: (id: number) => void;
    addTraseu: (item: Traseu) => void;
    removeTraseu: (id: number) => void;
    addRecomandare: (item: LegacyActivity) => void;
    resetAll: () => void;
}

export const DashboardDataContext = createContext<DashboardApiState | undefined>(undefined);

const LS = {
    activities: 'fm_user_activities',
    challenges: 'fm_user_challenges',
    events:     'fm_user_events',
    routes:     'fm_user_routes',
};

function loadLS<T>(key: string): T[] {
    try { return JSON.parse(localStorage.getItem(key) ?? '[]') ?? []; }
    catch { return []; }
}
function saveLS<T>(key: string, val: T[]) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useAuth();

    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
    const [events, setEvents]         = useState<EventDto[]>([]);
    const [clubs, setClubs]           = useState<ClubDto[]>([]);
    const [userClubs, setUserClubs]   = useState<ClubDto[]>([]);
    const [joinedChallengeIds, setJoinedChallengeIds] = useState<number[]>([]);
    const [joinedEventIds, setJoinedEventIds]         = useState<number[]>([]);
    const [joinedActivityIds, setJoinedActivityIds]   = useState<number[]>([]);   // NOU
    const [joinedActivities, setJoinedActivities]     = useState<ActivityDto[]>([]); // NOU
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    const [tick, setTick]       = useState(0);

    const [activitatiCurente, setActivitatiCurente]   = useState<LegacyActivity[]>(() => loadLS(LS.activities));
    const [provocariInscrise, setProvocariInscrise]   = useState<LegacyChallenge[]>(() => loadLS(LS.challenges));
    const [evenimenteInscrise, setEvenimenteInscrise] = useState<LegacyEvent[]>(() => loadLS(LS.events));
    const [traseeSalvate, setTrseeSalvate]            = useState<Traseu[]>(() => loadLS(LS.routes));

    useEffect(() => { saveLS(LS.activities, activitatiCurente); }, [activitatiCurente]);
    useEffect(() => { saveLS(LS.challenges, provocariInscrise); }, [provocariInscrise]);
    useEffect(() => { saveLS(LS.events, evenimenteInscrise); },    [evenimenteInscrise]);
    useEffect(() => { saveLS(LS.routes, traseeSalvate); },         [traseeSalvate]);

    const refetch = useCallback(() => setTick(t => t + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const fetches: Promise<unknown>[] = [
            activityApi.getAll(),
            challengeApi.getAll(),
            eventApi.getAll(),
            clubApi.getAll(),
            ...(user?.id ? [clubApi.getUserClubs(user.id)] : []),
            ...(isAuthenticated ? [activityApi.getJoined()] : []),
            ...(isAuthenticated ? [eventApi.getJoined()]   : []),
        ];

        Promise.allSettled(fetches).then(results => {
            if (cancelled) return;
            const [acts, chals, evs, clbs, uClubs, joinedActs, joinedEvs] = results;
            if (acts.status    === 'fulfilled') setActivities((acts.value    as ActivityDto[]) ?? []);
            if (chals.status   === 'fulfilled') setChallenges((chals.value   as ChallengeDto[]) ?? []);
            if (evs.status     === 'fulfilled') setEvents((evs.value         as EventDto[]) ?? []);
            if (clbs.status    === 'fulfilled') setClubs((clbs.value         as ClubDto[]) ?? []);
            if (uClubs?.status === 'fulfilled') setUserClubs((uClubs.value   as ClubDto[]) ?? []);

            if (joinedActs?.status === 'fulfilled') {
                const ja = (joinedActs.value as ActivityDto[]) ?? [];
                setJoinedActivities(ja);
                setJoinedActivityIds(ja.map(a => a.id));
            }

            // Seteaza evenimentele joined din API (sursa de adevar)
            if (joinedEvs?.status === 'fulfilled') {
                setJoinedEventIds((joinedEvs.value as number[]) ?? []);
            }

            if (acts.status === 'rejected' && chals.status === 'rejected' && evs.status === 'rejected') {
                setError('Nu s-a putut contacta serverul.');
            }
            setLoading(false);
        });

        return () => { cancelled = true; };
    }, [user?.id, isAuthenticated, tick]);

    // ─── Acțiuni API ──────────────────────────────────────────────────────────

    const joinChallenge = useCallback(async (id: number) => {
        if (!user?.id) return;
        await challengeApi.joinChallenge(id);
        setJoinedChallengeIds(p => p.includes(id) ? p : [...p, id]);
    }, [user?.id]);

    const leaveChallenge = useCallback(async (id: number) => {
        if (!user?.id) return;
        await challengeApi.leaveChallenge(id);
        setJoinedChallengeIds(p => p.filter(x => x !== id));
    }, [user?.id]);

    const joinEvent = useCallback(async (id: number) => {
        if (!user?.id) return;
        setEvents(prev => prev.map(e => e.id === id ? { ...e, participants: (e.participants ?? 0) + 1 } : e));
        setJoinedEventIds(p => p.includes(id) ? p : [...p, id]);
        try {
            await eventApi.join(id);
        } catch (err) {
            setEvents(prev => prev.map(e => e.id === id ? { ...e, participants: Math.max(0, (e.participants ?? 1) - 1) } : e));
            setJoinedEventIds(p => p.filter(x => x !== id));
            throw err;
        }
    }, [user?.id]);

    const leaveEvent = useCallback(async (id: number) => {
        if (!user?.id) return;
        setEvents(prev => prev.map(e => e.id === id ? { ...e, participants: Math.max(0, (e.participants ?? 1) - 1) } : e));
        setJoinedEventIds(p => p.filter(x => x !== id));
        try {
            await eventApi.leave(id);
        } catch (err) {
            setEvents(prev => prev.map(e => e.id === id ? { ...e, participants: (e.participants ?? 0) + 1 } : e));
            setJoinedEventIds(p => [...p, id]);
            throw err;
        }
    }, [user?.id]);

    const joinClub = useCallback(async (id: number) => {
        if (!user?.id) return;
        await clubApi.joinClub(id);
        const club = clubs.find(c => c.id === id);
        if (club) setUserClubs(p => p.some(c => c.id === id) ? p : [...p, club]);
    }, [user?.id, clubs]);

    const leaveClub = useCallback(async (id: number) => {
        if (!user?.id) return;
        await clubApi.leaveClub(id);
        setUserClubs(p => p.filter(c => c.id !== id));
    }, [user?.id]);

    // NOU: join/leave activitate
    const joinActivity = useCallback(async (id: number) => {
        if (!user?.id) return;
        await activityApi.join(id);
        const activity = activities.find(a => a.id === id);
        if (activity) {
            setJoinedActivities(p => p.some(a => a.id === id) ? p : [...p, activity]);
            setJoinedActivityIds(p => p.includes(id) ? p : [...p, id]);
        }
    }, [user?.id, activities]);

    const leaveActivity = useCallback(async (id: number) => {
        if (!user?.id) return;
        await activityApi.leave(id);
        setJoinedActivities(p => p.filter(a => a.id !== id));
        setJoinedActivityIds(p => p.filter(x => x !== id));
    }, [user?.id]);

    // ─── Acțiuni legacy ───────────────────────────────────────────────────────

    const addActivitate = useCallback((item: LegacyActivity) => {
        setActivitatiCurente(p => p.some(a => a.id === item.id) ? p : [{ ...item, id: item.id || Date.now() }, ...p]);
    }, []);

    const removeActivitate = useCallback((id: number) => {
        setActivitatiCurente(p => p.filter(a => a.id !== id));
    }, []);

    const addRecomandare = useCallback((_item: LegacyActivity) => { void _item; }, []);

    const addProvocare = useCallback((item: LegacyChallenge) => {
        setProvocariInscrise(p => p.some(x => x.id === item.id) ? p : [...p, { ...item, progress: 0 }]);
    }, []);

    const removeProvocare = useCallback((id: number) => {
        setProvocariInscrise(p => p.filter(x => x.id !== id));
    }, []);

    const addEveniment = useCallback((item: LegacyEvent) => {
        setEvenimenteInscrise(p => p.some(e => e.id === item.id) ? p : [...p, item]);
    }, []);

    const removeEveniment = useCallback((id: number) => {
        setEvenimenteInscrise(p => p.filter(e => e.id !== id));
    }, []);

    const addTraseu = useCallback((item: Traseu) => {
        setTrseeSalvate(p => p.some(t => t.id === item.id) ? p : [...p, item]);
    }, []);

    const removeTraseu = useCallback((id: number) => {
        setTrseeSalvate(p => p.filter(t => t.id !== id));
    }, []);

    const resetAll = useCallback(() => {
        setActivitatiCurente([]); setProvocariInscrise([]);
        setEvenimenteInscrise([]); setTrseeSalvate([]);
        setJoinedActivities([]); setJoinedActivityIds([]);
        Object.values(LS).forEach(k => localStorage.removeItem(k));
    }, []);

    const value = useMemo<DashboardApiState>(() => ({
        activities, challenges, events, clubs,
        userClubs, joinedChallengeIds, joinedEventIds,
        joinedActivityIds, joinedActivities,
        activitatiCurente, provocariInscrise, evenimenteInscrise, traseeSalvate,
        loading, error,
        joinChallenge, leaveChallenge, joinEvent, leaveEvent, joinClub, leaveClub,
        joinActivity, leaveActivity,
        refetch,
        addActivitate, removeActivitate, addRecomandare,
        addProvocare, removeProvocare,
        addEveniment, removeEveniment,
        addTraseu, removeTraseu,
        resetAll,
    }), [
        activities, challenges, events, clubs,
        userClubs, joinedChallengeIds, joinedEventIds,
        joinedActivityIds, joinedActivities,
        activitatiCurente, provocariInscrise, evenimenteInscrise, traseeSalvate,
        loading, error,
        joinChallenge, leaveChallenge, joinEvent, leaveEvent, joinClub, leaveClub,
        joinActivity, leaveActivity,
        refetch,
        addActivitate, removeActivitate, addRecomandare,
        addProvocare, removeProvocare,
        addEveniment, removeEveniment,
        addTraseu, removeTraseu,
        resetAll,
    ]);

    return (
        <DashboardDataContext.Provider value={value}>
            {children}
        </DashboardDataContext.Provider>
    );
};
