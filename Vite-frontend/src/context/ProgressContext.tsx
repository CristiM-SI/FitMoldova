import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as ProgressState;
    } catch { /* ignore */ }
    return DEFAULT_PROGRESS;
  });

  // Persist la fiecare schimbare
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeProfile = () =>
    setProgress((prev) => ({ ...prev, profileCompleted: true }));

  const completeFirstActivity = () =>
    setProgress((prev) => ({ ...prev, firstActivity: true }));

  const completeJoinClub = () =>
    setProgress((prev) => ({ ...prev, joinedClub: true }));

  const completeChallenge = () =>
    setProgress((prev) => ({ ...prev, joinedChallenge: true }));

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      completeProfile,
      completeFirstActivity,
      completeJoinClub,
      completeChallenge,
      resetProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};
