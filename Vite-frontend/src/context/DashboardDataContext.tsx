import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { MOCK_ACTIVITATI } from '../services/mock/activitati';
import type { Activitate } from '../services/mock/activitati';
import { MOCK_PROVOCARI } from '../services/mock/provocari';
import type { Provocare } from '../services/mock/provocari';
import { MOCK_CLUBURI } from '../services/mock/cluburi';
import type { Club } from '../services/mock/cluburi';
import { MOCK_EVENIMENTE } from '../services/mock/evenimente';
import type { Eveniment } from '../services/mock/evenimente';
import type { Traseu } from '../types/Route';

interface DashboardData {
    activitatiCurente: Activitate[];
    activitatiDisponibile: Activitate[];
    provocariInscrise: Provocare[];
    provocariDisponibile: Provocare[];
    cluburiJoined: Club[];
    cluburiDisponibile: Club[];
    evenimenteInscrise: Eveniment[];
    evenimenteDisponibile: Eveniment[];
    traseeSalvate: Traseu[];
}

export interface DashboardDataContextType extends DashboardData {
    addActivitate: (item: Activitate) => void;
    removeActivitate: (id: number) => void;
    addProvocare: (item: Provocare) => void;
    removeProvocare: (id: number) => void;
    addClub: (item: Club) => void;
    removeClub: (id: number) => void;
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
    cluburiJoined: [],
    cluburiDisponibile: MOCK_CLUBURI,
    evenimenteInscrise: [],
    evenimenteDisponibile: MOCK_EVENIMENTE,
    traseeSalvate: [],
};

export const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

/* ── Helpers ── */
const ensureArray = <T,>(val: unknown, fallback: T[]): T[] => (Array.isArray(val) ? val as T[] : fallback);

const sanitizeData = (raw: any): DashboardData => {
    if (!raw || typeof raw !== 'object') return DEFAULT_DATA;

    // Deduplicate provocări înscrise
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
        cluburiJoined:          ensureArray(raw.cluburiJoined,          []),
        cluburiDisponibile:     ensureArray(raw.cluburiDisponibile,     MOCK_CLUBURI),
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

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
            // Previne duplicatele — dacă deja există cu același id, nu adăuga din nou
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
            // Doar provocările din mock se restaurează în lista disponibilă
            const orig = MOCK_PROVOCARI.find((m) => m.id === id);
            return {
                ...p,
                provocariInscrise: p.provocariInscrise.filter((x) => x.id !== id),
                provocariDisponibile: orig ? [...p.provocariDisponibile, orig] : p.provocariDisponibile,
            };
        });
    }, []);

    /* ---- Cluburi ---- */
    const addClub = useCallback((item: Club) => {
        setData((p) => ({
            ...p,
            cluburiJoined: [...p.cluburiJoined, item],
            cluburiDisponibile: p.cluburiDisponibile.filter((c) => c.id !== item.id),
        }));
    }, []);

    const removeClub = useCallback((id: number) => {
        setData((p) => {
            const rm = p.cluburiJoined.find((c) => c.id === id);
            const orig = rm ? MOCK_CLUBURI.find((m) => m.name === rm.name) : null;
            return {
                ...p,
                cluburiJoined: p.cluburiJoined.filter((c) => c.id !== id),
                cluburiDisponibile: orig ? [...p.cluburiDisponibile, orig] : p.cluburiDisponibile,
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
        setData((p) => {
            const rm = p.evenimenteInscrise.find((e) => e.id === id);
            const orig = rm ? MOCK_EVENIMENTE.find((m) => m.name === rm.name) : null;
            return {
                ...p,
                evenimenteInscrise: p.evenimenteInscrise.filter((e) => e.id !== id),
                evenimenteDisponibile: orig ? [...p.evenimenteDisponibile, orig] : p.evenimenteDisponibile,
            };
        });
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

    return (
        <DashboardDataContext.Provider value={{
            ...data,
            addActivitate, removeActivitate,
            addProvocare, removeProvocare,
            addClub, removeClub,
            addEveniment, removeEveniment,
            addTraseu, removeTraseu,
            resetAll,
        }}>
            {children}
        </DashboardDataContext.Provider>
    );
};
