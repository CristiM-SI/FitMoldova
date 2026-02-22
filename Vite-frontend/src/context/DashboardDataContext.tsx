import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { MOCK_ACTIVITATI } from '../services/mock/activitati';
import type { Activitate } from '../services/mock/activitati';
import { MOCK_PROVOCARI } from '../services/mock/provocari';
import type { Provocare } from '../services/mock/provocari';

interface DashboardData {
    // Activități
    activitatiCurente: Activitate[];
    activitatiDisponibile: Activitate[];
    // Provocări
    provocariInscrise: Provocare[];
    provocariDisponibile: Provocare[];
}

interface DashboardDataContextType extends DashboardData {
    // Activități
    addActivitate: (item: Activitate) => void;
    removeActivitate: (id: number) => void;
    // Provocări
    addProvocare: (item: Provocare) => void;
    removeProvocare: (id: number) => void;
    // Reset
    resetAll: () => void;
}

/* ---- Constante ---- */
const STORAGE_KEY = 'fitmoldova_dashboard_data';

const DEFAULT_DATA: DashboardData = {
    activitatiCurente: [],
    activitatiDisponibile: MOCK_ACTIVITATI,
    provocariInscrise: [],
    provocariDisponibile: MOCK_PROVOCARI,
};

/* ---- Context ---- */
const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<DashboardData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as DashboardData;
                // Verificăm că structura e validă
                if (parsed.activitatiCurente && parsed.activitatiDisponibile) {
                    return parsed;
                }
            }
        } catch { /* ignore corrupt data */ }
        return DEFAULT_DATA;
    });

    // Persistă la fiecare schimbare
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    /* ---- Activități ---- */
    const addActivitate = useCallback((item: Activitate) => {
        const nouaActivitate: Activitate = {
            ...item,
            id: Date.now(),
            date: new Date().toLocaleDateString('ro-RO', {
                day: 'numeric', month: 'long', year: 'numeric',
            }),
        };
        setData((prev) => ({
            ...prev,
            activitatiCurente: [nouaActivitate, ...prev.activitatiCurente],
            activitatiDisponibile: prev.activitatiDisponibile.filter((a) => a.id !== item.id),
        }));
    }, []);

    const removeActivitate = useCallback((id: number) => {
        setData((prev) => {
            const removed = prev.activitatiCurente.find((a) => a.id === id);
            const original = removed ? MOCK_ACTIVITATI.find((m) => m.name === removed.name) : null;
            return {
                ...prev,
                activitatiCurente: prev.activitatiCurente.filter((a) => a.id !== id),
                activitatiDisponibile: original
                    ? [...prev.activitatiDisponibile, original]
                    : prev.activitatiDisponibile,
            };
        });
    }, []);

    /* ---- Provocări ---- */
    const addProvocare = useCallback((item: Provocare) => {
        const cuProgress: Provocare = { ...item, progress: 0 };
        setData((prev) => ({
            ...prev,
            provocariInscrise: [...prev.provocariInscrise, cuProgress],
            provocariDisponibile: prev.provocariDisponibile.filter((p) => p.id !== item.id),
        }));
    }, []);

    const removeProvocare = useCallback((id: number) => {
        setData((prev) => {
            const removed = prev.provocariInscrise.find((p) => p.id === id);
            const original = removed ? MOCK_PROVOCARI.find((m) => m.name === removed.name) : null;
            return {
                ...prev,
                provocariInscrise: prev.provocariInscrise.filter((p) => p.id !== id),
                provocariDisponibile: original
                    ? [...prev.provocariDisponibile, original]
                    : prev.provocariDisponibile,
            };
        });
    }, []);

    /* ---- Reset ---- */
    const resetAll = useCallback(() => {
        setData(DEFAULT_DATA);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <DashboardDataContext.Provider value={{
            ...data,
            addActivitate, removeActivitate,
            addProvocare, removeProvocare,
            resetAll,
        }}>
            {children}
        </DashboardDataContext.Provider>
    );
};

export const useDashboardData = (): DashboardDataContextType => {
    const ctx = useContext(DashboardDataContext);
    if (!ctx) throw new Error('useDashboardData must be used within DashboardDataProvider');
    return ctx;
};
