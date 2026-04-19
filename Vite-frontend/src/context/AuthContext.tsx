import React, { createContext, useContext, useState } from 'react';
import { userApi } from '../services/api/userApi';

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
    try {
        const res = await userApi.register(data.firstName, data.lastName, data.email, data.password);
        if (res.isSuccess) {
            // după register, facem login automat ca să obținem JWT
            return await login(data.email, data.password);
        }
        return { success: false, error: res.message ?? 'Eroare la inregistrare.' };
    } catch (err: any) {
        return { success: false, error: err.message ?? 'Eroare de conexiune.' };
    }
};

    const login = async (username: string, password: string): Promise<AuthResult> => {
    try {
        const res = await userApi.login(username, password);
        // res este direct { token, expiresAt, userId, username, ... }
        localStorage.setItem('fitmoldova_token', res.token);
        const loggedUser: User = {
            id: res.userId,
            username: res.username,
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            avatar: `${res.firstName[0]}${res.lastName[0]}`.toUpperCase(),
            registeredAt: res.expiresAt,
            isAdmin: res.role === 'Admin',
        };
        applyAuth(loggedUser, setUser, setIsAuthenticated, setIsAdmin);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message ?? 'Eroare de conexiune.' };
    }
};

const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('fitmoldova_user');
    localStorage.removeItem('fitmoldova_token');
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
