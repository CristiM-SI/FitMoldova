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
    // Date globale din API
    activities: ActivityDto[];
    challenges: ChallengeDto[];
    events: EventDto[];
    clubs: ClubDto[];

    // Date personale din API
    userClubs: ClubDto[];
    joinedChallengeIds: number[];
    joinedEventIds: number[];

    // Câmpuri legacy (localStorage) — folosite de Activitati.tsx, Profile.tsx etc.
    activitatiCurente: LegacyActivity[];
    provocariInscrise: LegacyChallenge[];
    evenimenteInscrise: LegacyEvent[];
    traseeSalvate: Traseu[];

    loading: boolean;
    error: string | null;

    // Acțiuni API
    joinChallenge: (id: number) => Promise<void>;
    leaveChallenge: (id: number) => Promise<void>;
    joinEvent: (id: number) => Promise<void>;
    leaveEvent: (id: number) => Promise<void>;
    joinClub: (id: number) => Promise<void>;
    leaveClub: (id: number) => Promise<void>;
    refetch: () => void;

    // Acțiuni legacy (localStorage)
    addActivitate: (item: LegacyActivity) => void;
    removeActivitate: (id: number) => void;
    addProvocare: (item: LegacyChallenge) => void;
    removeProvocare: (id: number) => void;
    addEveniment: (item: LegacyEvent) => void;
    removeEveniment: (id: number) => void;
    addTraseu: (item: Traseu) => void;
    removeTraseu: (id: number) => void;
    // alias folosit în unele pagini vechi
    addRecomandare: (item: LegacyActivity) => void;
    resetAll: () => void;
}

export const DashboardDataContext = createContext<DashboardApiState | undefined>(undefined);

// ─── localStorage helpers ────────────────────────────────────────────────────

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

// ─── Provider ────────────────────────────────────────────────────────────────

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    // Date din API
    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
    const [events, setEvents]         = useState<EventDto[]>([]);
    const [clubs, setClubs]           = useState<ClubDto[]>([]);
    const [userClubs, setUserClubs]   = useState<ClubDto[]>([]);
    const [joinedChallengeIds, setJoinedChallengeIds] = useState<number[]>([]);
    const [joinedEventIds, setJoinedEventIds]         = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    const [tick, setTick]       = useState(0);

    // Date localStorage (pagini vechi)
    const [activitatiCurente, setActivitatiCurente]   = useState<LegacyActivity[]>(() => loadLS(LS.activities));
    const [provocariInscrise, setProvocariInscrise]   = useState<LegacyChallenge[]>(() => loadLS(LS.challenges));
    const [evenimenteInscrise, setEvenimenteInscrise] = useState<LegacyEvent[]>(() => loadLS(LS.events));
    const [traseeSalvate, setTrseeSalvate]            = useState<Traseu[]>(() => loadLS(LS.routes));

    // Persistă localStorage
    useEffect(() => { saveLS(LS.activities, activitatiCurente); }, [activitatiCurente]);
    useEffect(() => { saveLS(LS.challenges, provocariInscrise); }, [provocariInscrise]);
    useEffect(() => { saveLS(LS.events, evenimenteInscrise); },    [evenimenteInscrise]);
    useEffect(() => { saveLS(LS.routes, traseeSalvate); },         [traseeSalvate]);

    const refetch = useCallback(() => setTick(t => t + 1), []);

    // Fetch API
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const fetches = [
            activityApi.getAll(),
            challengeApi.getAll(),
            eventApi.getAll(),
            clubApi.getAll(),
            ...(user?.id ? [clubApi.getUserClubs(user.id)] : []),
        ];

        Promise.allSettled(fetches).then(results => {
            if (cancelled) return;
            const [acts, chals, evs, clbs, uClubs] = results;
            if (acts.status  === 'fulfilled') setActivities((acts.value  as ActivityDto[]) ?? []);
            if (chals.status === 'fulfilled') setChallenges((chals.value as ChallengeDto[]) ?? []);
            if (evs.status   === 'fulfilled') setEvents((evs.value       as EventDto[]) ?? []);
            if (clbs.status  === 'fulfilled') setClubs((clbs.value       as ClubDto[]) ?? []);
            if (uClubs?.status === 'fulfilled') setUserClubs((uClubs.value as ClubDto[]) ?? []);
            if (acts.status === 'rejected' && chals.status === 'rejected' && evs.status === 'rejected') {
                setError('Nu s-a putut contacta serverul.');
            }
            setLoading(false);
        });

        return () => { cancelled = true; };
    }, [user?.id, tick]);

    // ─── Acțiuni API ──────────────────────────────────────────────────────────

    const joinChallenge = useCallback(async (id: number) => {
        if (!user?.id) return;
        await challengeApi.joinChallenge(id, user.id);
        setJoinedChallengeIds(p => p.includes(id) ? p : [...p, id]);
    }, [user?.id]);

    const leaveChallenge = useCallback(async (id: number) => {
        if (!user?.id) return;
        await challengeApi.leaveChallenge(id, user.id);
        setJoinedChallengeIds(p => p.filter(x => x !== id));
    }, [user?.id]);

    const joinEvent = useCallback(async (id: number) => {
        if (!user?.id) return;
        await eventApi.join(id, user.id);
        setJoinedEventIds(p => p.includes(id) ? p : [...p, id]);
    }, [user?.id]);

    const leaveEvent = useCallback(async (id: number) => {
        if (!user?.id) return;
        await eventApi.leave(id, user.id);
        setJoinedEventIds(p => p.filter(x => x !== id));
    }, [user?.id]);

    const joinClub = useCallback(async (id: number) => {
        if (!user?.id) return;
        await clubApi.joinClub(id, user.id);
        const club = clubs.find(c => c.id === id);
        if (club) setUserClubs(p => p.some(c => c.id === id) ? p : [...p, club]);
    }, [user?.id, clubs]);

    const leaveClub = useCallback(async (id: number) => {
        if (!user?.id) return;
        await clubApi.leaveClub(id, user.id);
        setUserClubs(p => p.filter(c => c.id !== id));
    }, [user?.id]);

    // ─── Acțiuni legacy ───────────────────────────────────────────────────────

    const addActivitate = useCallback((item: LegacyActivity) => {
        setActivitatiCurente(p => p.some(a => a.id === item.id) ? p : [{ ...item, id: item.id || Date.now() }, ...p]);
    }, []);

    const removeActivitate = useCallback((id: number) => {
        setActivitatiCurente(p => p.filter(a => a.id !== id));
    }, []);

    const addRecomandare = useCallback((item: LegacyActivity) => {
        // alias pentru compatibilitate — nu face nimic cu starea locală
        // recomandările vin din API (activityApi.getAll)
        void item;
    }, []);

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
        Object.values(LS).forEach(k => localStorage.removeItem(k));
    }, []);

    // ─── Value ────────────────────────────────────────────────────────────────

    const value = useMemo<DashboardApiState>(() => ({
        activities, challenges, events, clubs,
        userClubs, joinedChallengeIds, joinedEventIds,
        activitatiCurente, provocariInscrise, evenimenteInscrise, traseeSalvate,
        loading, error,
        joinChallenge, leaveChallenge, joinEvent, leaveEvent, joinClub, leaveClub,
        refetch,
        addActivitate, removeActivitate, addRecomandare,
        addProvocare, removeProvocare,
        addEveniment, removeEveniment,
        addTraseu, removeTraseu,
        resetAll,
    }), [
        activities, challenges, events, clubs,
        userClubs, joinedChallengeIds, joinedEventIds,
        activitatiCurente, provocariInscrise, evenimenteInscrise, traseeSalvate,
        loading, error,
        joinChallenge, leaveChallenge, joinEvent, leaveEvent, joinClub, leaveClub,
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
