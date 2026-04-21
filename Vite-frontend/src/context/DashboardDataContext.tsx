import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { MOCK_ACTIVITATI } from '../services/mock/activitati';
import type { Activitate } from '../services/mock/activitati';
import { MOCK_PROVOCARI } from '../services/mock/provocari';
import type { Provocare } from '../services/mock/provocari';
import { MOCK_EVENIMENTE } from '../services/mock/evenimente';
import type { Eveniment } from '../services/mock/evenimente';
import type { Traseu } from '../types/Route';
import { eventApi } from '../services/api/eventApi';
import type { EventDto } from '../services/api/eventApi';

const CATEGORY_ICON: Record<string, string> = {
    Maraton: '🏅', Ciclism: '🚴', Yoga: '🧘', Fitness: '💪',
    Trail: '🥾', Înot: '🏊', Social: '🎉',
};

function toEveniment(dto: EventDto): Eveniment {
    return {
        ...dto,
        icon: CATEGORY_ICON[dto.category] ?? '🏋️',
        image: dto.imageUrl ?? '',
        time: '—',
        tags: [],
        lat: 47.0245,
        lng: 28.8322,
        category: dto.category as Eveniment['category'],
        difficulty: dto.difficulty as Eveniment['difficulty'],
    };
}

/**
 * NOTĂ: cluburile NU mai sunt în acest context. Sunt gestionate exclusiv
 * prin API (clubApi) cu relația N-N User↔Club în backend. Pentru a afla
 * cluburile unui user folosește hook-ul useUserClubs() sau clubApi.getUserClubs(userId).
 */
interface DashboardData {
    activitatiCurente: Activitate[];
    activitatiDisponibile: Activitate[];
    provocariInscrise: Provocare[];
    provocariDisponibile: Provocare[];
    evenimenteInscrise: Eveniment[];
    evenimenteDisponibile: Eveniment[];
    traseeSalvate: Traseu[];
}

export interface DashboardDataContextType extends DashboardData {
    addActivitate: (item: Activitate) => void;
    removeActivitate: (id: number) => void;
    addRecomandare: (item: Activitate) => void;
    addProvocare: (item: Provocare) => void;
    removeProvocare: (id: number) => void;
    addEveniment: (item: Eveniment) => void;
    removeEveniment: (id: number) => void;
    addTraseu: (item: Traseu) => void;
    removeTraseu: (id: number) => void;
    resetAll: () => void;
}

const STORAGE_KEY = 'fitmoldova_dashboard_data';

const DEFAULT_DATA: DashboardData = {
    activitatiCurente: [],
    activitatiDisponibile: MOCK_ACTIVITATI,
    provocariInscrise: [],
    provocariDisponibile: MOCK_PROVOCARI,
    evenimenteInscrise: [],
    evenimenteDisponibile: MOCK_EVENIMENTE,
    traseeSalvate: [],
};

export const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

const ensureArray = <T,>(val: unknown, fallback: T[]): T[] => (Array.isArray(val) ? val as T[] : fallback);

const sanitizeData = (raw: any): DashboardData => {
    if (!raw || typeof raw !== 'object') return DEFAULT_DATA;

    const seen = new Set<number>();
    const provocariInscrise = ensureArray(raw.provocariInscrise, []).filter((p: Provocare) => {
        if (!p || typeof p.id !== 'number') return false;
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
    });

    return {
        activitatiCurente:      ensureArray(raw.activitatiCurente,      []),
        activitatiDisponibile:  ensureArray(raw.activitatiDisponibile,  MOCK_ACTIVITATI),
        provocariInscrise,
        provocariDisponibile:   ensureArray(raw.provocariDisponibile,   MOCK_PROVOCARI),
        evenimenteInscrise:     ensureArray(raw.evenimenteInscrise,     []),
        evenimenteDisponibile:  ensureArray(raw.evenimenteDisponibile,  MOCK_EVENIMENTE),
        traseeSalvate:          ensureArray(raw.traseeSalvate,          []),
    };
};

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<DashboardData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return sanitizeData(parsed);
            }
        } catch { /* ignore */ }
        return DEFAULT_DATA;
    });

    const [apiEvents, setApiEvents] = useState<Eveniment[]>([]);

    useEffect(() => {
        eventApi.getAll()
            .then((data) => setApiEvents(data.map(toEveniment)))
            .catch(() => setApiEvents(MOCK_EVENIMENTE));
    }, []);

    useEffect(() => {
        const id = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }, 0);
        return () => clearTimeout(id);
    }, [data]);

    /* ---- Activitati ---- */
    const addActivitate = useCallback((item: Activitate) => {
        const nou: Activitate = {
            ...item, id: Date.now(),
            date: new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }),
        };
        setData((p) => ({
            ...p,
            activitatiCurente: [nou, ...p.activitatiCurente],
            activitatiDisponibile: p.activitatiDisponibile.filter((a) => a.id !== item.id),
        }));
    }, []);

    const addRecomandare = useCallback((item: Activitate) => {
        setData((p) => ({
            ...p,
            activitatiDisponibile: [item, ...p.activitatiDisponibile],
        }));
    }, []);

    const removeActivitate = useCallback((id: number) => {
        setData((p) => {
            const rm = p.activitatiCurente.find((a) => a.id === id);
            const orig = rm ? MOCK_ACTIVITATI.find((m) => m.name === rm.name) : null;
            return {
                ...p,
                activitatiCurente: p.activitatiCurente.filter((a) => a.id !== id),
                activitatiDisponibile: orig ? [...p.activitatiDisponibile, orig] : p.activitatiDisponibile,
            };
        });
    }, []);

    /* ---- Provocari ---- */
    const addProvocare = useCallback((item: Provocare) => {
        setData((p) => {
            if (p.provocariInscrise.some((x) => x.id === item.id)) return p;
            return {
                ...p,
                provocariInscrise: [...p.provocariInscrise, { ...item, progress: 0 }],
                provocariDisponibile: p.provocariDisponibile.filter((x) => x.id !== item.id),
            };
        });
    }, []);

    const removeProvocare = useCallback((id: number) => {
        setData((p) => {
            const rm = p.provocariInscrise.find((x) => x.id === id);
            if (!rm) return p;
            const orig = MOCK_PROVOCARI.find((m) => m.id === id);
            return {
                ...p,
                provocariInscrise: p.provocariInscrise.filter((x) => x.id !== id),
                provocariDisponibile: orig ? [...p.provocariDisponibile, orig] : p.provocariDisponibile,
            };
        });
    }, []);

    /* ---- Evenimente ---- */
    const addEveniment = useCallback((item: Eveniment) => {
        setData((p) => ({
            ...p,
            evenimenteInscrise: [...p.evenimenteInscrise, item],
            evenimenteDisponibile: p.evenimenteDisponibile.filter((e) => e.id !== item.id),
        }));
    }, []);

    const removeEveniment = useCallback((id: number) => {
        setData((p) => ({
            ...p,
            evenimenteInscrise: p.evenimenteInscrise.filter((e) => e.id !== id),
        }));
    }, []);

    /* ---- Trasee ---- */
    const addTraseu = useCallback((item: Traseu) => {
        setData((p) => {
            if (p.traseeSalvate.some((t) => t.id === item.id)) return p;
            return { ...p, traseeSalvate: [...p.traseeSalvate, item] };
        });
    }, []);

    const removeTraseu = useCallback((id: number) => {
        setData((p) => ({
            ...p,
            traseeSalvate: p.traseeSalvate.filter((t) => t.id !== id),
        }));
    }, []);

    const resetAll = useCallback(() => {
        setData(DEFAULT_DATA);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const evenimenteDisponibile = useMemo(() => {
        const inscribeIds = new Set(data.evenimenteInscrise.map((e) => e.id));
        const source = apiEvents.length > 0 ? apiEvents : data.evenimenteDisponibile;
        return source.filter((e) => !inscribeIds.has(e.id));
    }, [apiEvents, data.evenimenteInscrise, data.evenimenteDisponibile]);

    const ctxValue = useMemo(() => ({
        ...data,
        evenimenteDisponibile,
        addActivitate, removeActivitate, addRecomandare,
        addProvocare, removeProvocare,
        addEveniment, removeEveniment,
        addTraseu, removeTraseu,
        resetAll,
    }), [data, evenimenteDisponibile, addActivitate, removeActivitate, addRecomandare, addProvocare, removeProvocare, addEveniment, removeEveniment, addTraseu, removeTraseu, resetAll]);

    return (
        <DashboardDataContext.Provider value={ctxValue}>
            {children}
        </DashboardDataContext.Provider>
    );
};
