import { createContext, useContext, useState, type ReactNode } from "react";

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    joinDate: string;
}

interface UserContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile) => void;
    updateUser: (fields: Partial<UserProfile>) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<UserProfile | null>(null);

    const setUser = (userData: UserProfile) => setUserState(userData);
    const updateUser = (fields: Partial<UserProfile>) =>
        setUserState((prev) => (prev ? { ...prev, ...fields } : null));
    const clearUser = () => setUserState(null);

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, clearUser }}>
    {children}
    </UserContext.Provider>
);
};

export const useUser = (): UserContextType => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
};

