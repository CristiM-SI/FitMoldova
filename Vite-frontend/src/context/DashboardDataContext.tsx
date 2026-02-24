import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { MOCK_ACTIVITATI } from '../services/mock/activitati';
import type { Activitate } from '../services/mock/activitati';
import { MOCK_PROVOCARI } from '../services/mock/provocari';
import type { Provocare } from '../services/mock/provocari';
import { MOCK_CLUBURI } from '../services/mock/cluburi';
import type { Club } from '../services/mock/cluburi';
import { MOCK_EVENIMENTE } from '../services/mock/evenimente';
import type { Eveniment } from '../services/mock/evenimente';

interface DashboardData {
    activitatiCurente: Activitate[];
    activitatiDisponibile: Activitate[];
    provocariInscrise: Provocare[];
    provocariDisponibile: Provocare[];
    cluburiJoined: Club[];
    cluburiDisponibile: Club[];
    evenimenteInscrise: Eveniment[];
    evenimenteDisponibile: Eveniment[];
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
};

export const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined); // eslint-disable-line react-refresh/only-export-components

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<DashboardData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as DashboardData;
                if (parsed.activitatiCurente && parsed.activitatiDisponibile) {
                    // Deduplică provocări inscrise (fix pentru date corupte din versiuni anterioare)
                    const seenIds = new Set<number>();
                    const deduped = (parsed.provocariInscrise || []).filter((p) => {
                        if (seenIds.has(p.id)) return false;
                        seenIds.add(p.id);
                        return true;
                    });
                    return {
                        ...parsed,
                        provocariInscrise:     deduped,
                        evenimenteInscrise:    parsed.evenimenteInscrise    ?? [],
                        evenimenteDisponibile: parsed.evenimenteDisponibile ?? MOCK_EVENIMENTE,
                        cluburiJoined:         parsed.cluburiJoined         ?? [],
                        cluburiDisponibile:    parsed.cluburiDisponibile    ?? MOCK_CLUBURI,
                    };
                }
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
            resetAll,
        }}>
            {children}
        </DashboardDataContext.Provider>
    );
};
