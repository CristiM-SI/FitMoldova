import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface ProgressState {
    accountCreated: boolean;      // Mereu true dacă user-ul e autentificat
    profileCompleted: boolean;    // True când user-ul salvează profilul cu date completate
    firstActivity: boolean;       // True când user-ul adaugă prima activitate
    joinedClub: boolean;          // True când user-ul se alătură unui club
    joinedChallenge: boolean;     // True când user-ul se înscrie la o provocare
}

interface ProgressContextType {
    progress: ProgressState;
    completeProfile: () => void;
    completeFirstActivity: () => void;
    completeJoinClub: () => void;
    completeChallenge: () => void;
    resetProgress: () => void;
}

const DEFAULT_PROGRESS: ProgressState = {
    accountCreated: true,
    profileCompleted: false,
    firstActivity: false,
    joinedClub: false,
    joinedChallenge: false,
};

const STORAGE_KEY = 'fitmoldova_progress';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();

    const [progress, setProgress] = useState<ProgressState>(() => {
        try {
            // Nu încărcăm din localStorage dacă nu e niciun token activ
            if (!localStorage.getItem('fitmoldova_token')) return DEFAULT_PROGRESS;
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved) as ProgressState;
        } catch { /* ignore */ }
        return DEFAULT_PROGRESS;
    });

    // Resetează progresul când userul se deloghează sau se schimbă
    useEffect(() => {
        if (!isAuthenticated) {
            setProgress(DEFAULT_PROGRESS);
        }
    }, [isAuthenticated]);

    // Persist on change — deferred so it never blocks the render-commit phase
    useEffect(() => {
        if (!isAuthenticated) return; // Nu salvăm dacă nu e autentificat
        const id = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }, 0);
        return () => clearTimeout(id);
    }, [progress, isAuthenticated]);

    const completeProfile = useCallback(() =>
        setProgress((prev) => ({ ...prev, profileCompleted: true })), []);

    const completeFirstActivity = useCallback(() =>
        setProgress((prev) => ({ ...prev, firstActivity: true })), []);

    const completeJoinClub = useCallback(() =>
        setProgress((prev) => ({ ...prev, joinedClub: true })), []);

    const completeChallenge = useCallback(() =>
        setProgress((prev) => ({ ...prev, joinedChallenge: true })), []);

    const resetProgress = useCallback(() => {
        setProgress(DEFAULT_PROGRESS);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const ctxValue = useMemo(() => ({
        progress,
        completeProfile,
        completeFirstActivity,
        completeJoinClub,
        completeChallenge,
        resetProgress,
    }), [progress, completeProfile, completeFirstActivity, completeJoinClub, completeChallenge, resetProgress]);

    return (
        <ProgressContext.Provider value={ctxValue}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = (): ProgressContextType => {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
    return ctx;
};
