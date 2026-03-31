import React, { createContext, useContext, useState } from 'react';
import { userApi } from '../services/API/userApi';

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    registeredAt: string;
    isAdmin?: boolean;
}

interface AuthResult {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<AuthResult>;
    login: (username: string, password: string) => Promise<AuthResult>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    register: async () => ({ success: false }),
    login: async () => ({ success: false }),
    logout: () => {},
});

function readStoredAuth(): { user: User | null; isAuthenticated: boolean; isAdmin: boolean } {
    try {
        const saved = localStorage.getItem('fitmoldova_user');
        if (saved) {
            const parsed = JSON.parse(saved) as User;
            return { user: parsed, isAuthenticated: true, isAdmin: parsed.isAdmin === true };
        }
    } catch {
        localStorage.removeItem('fitmoldova_user');
    }
    return { user: null, isAuthenticated: false, isAdmin: false };
}

function applyAuth(
    loggedUser: User,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>,
) {
    setUser(loggedUser);
    setIsAuthenticated(true);
    setIsAdmin(loggedUser.isAdmin === true);
    localStorage.setItem('fitmoldova_user', JSON.stringify(loggedUser));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const initial = readStoredAuth();
    const [user, setUser] = useState<User | null>(initial.user);
    const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
    const [isAdmin, setIsAdmin] = useState(initial.isAdmin);
    const [loading] = useState(false);

    const register = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<AuthResult> => {
        const username = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`;

        try {
            const res = await userApi.register(username, data.email, data.password);
            if (res.isSuccess && res.data != null) {
                const newUser: User = {
                    id: res.data as unknown as number,
                    username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    avatar: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
                    registeredAt: new Date().toISOString(),
                    isAdmin: false,
                };
                applyAuth(newUser, setUser, setIsAuthenticated, setIsAdmin);
                return { success: true };
            }
            return { success: false, error: res.message ?? 'Eroare la inregistrare.' };
        } catch {
            return { success: false, error: 'Eroare de conexiune la server. Asigura-te ca backend-ul ruleaza.' };
        }
    };

    const login = async (username: string, password: string): Promise<AuthResult> => {
        try {
            const res = await userApi.login(username, password);
            if (res.isSuccess && res.data) {
                const d = res.data;
                const loggedUser: User = {
                    id: d.id,
                    username: d.username,
                    firstName: d.username.split('.')[0] ?? d.username,
                    lastName: d.username.split('.')[1] ?? '',
                    email: d.email,
                    avatar: d.username.slice(0, 2).toUpperCase(),
                    registeredAt: new Date().toISOString(),
                    isAdmin: d.role === 'Admin',
                };
                applyAuth(loggedUser, setUser, setIsAuthenticated, setIsAdmin);
                return { success: true };
            }
            return { success: false, error: res.message ?? 'Utilizator sau parola incorecta' };
        } catch {
            return { success: false, error: 'Eroare de conexiune la server. Asigura-te ca backend-ul ruleaza pe localhost:5296.' };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('fitmoldova_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
};

export default AuthContext;
