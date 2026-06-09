import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { userApi, type LoginResponse } from '../services/api/userApi';

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    registeredAt: string;
}

interface JwtPayload {
    userId: string;
    email: string;
    'http://schemas.microsoft.com/2008/06/identity/claims/role': string;
    exp: number;
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
    login: (email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
}

// ─── Constante & helpers la nivel de modul ───────────────────────────────────

const STORAGE = {
    token: 'fitmoldova_token',
    user:  'fitmoldova_user',
};

function decodeAdminFromToken(token: string): boolean {
    try {
        const payload = jwtDecode<any>(token);
        const roleKey = Object.keys(payload).find(k => k.toLowerCase().includes('role'));
        const role = roleKey ? payload[roleKey] : undefined;
        return role === 'Admin';
    } catch (e) {
        console.error('[AuthContext] JWT decode error:', e);
        return false;
    }
}

function readStoredAuth(): { user: User | null; isAuthenticated: boolean; isAdmin: boolean } {
    try {
        const token = localStorage.getItem(STORAGE.token);
        const saved = localStorage.getItem(STORAGE.user);
        if (token && saved) {
            const payload = jwtDecode<JwtPayload>(token);
            if (payload.exp * 1000 < Date.now()) {
                // Token expirat — sterg, dar NU sterg refresh token-ul.
                // axiosInstance va incerca refresh la primul request.
                localStorage.removeItem(STORAGE.user);
                localStorage.removeItem(STORAGE.token);
                return { user: null, isAuthenticated: false, isAdmin: false };
            }
            const parsed = JSON.parse(saved) as User;
            const isAdmin = decodeAdminFromToken(token);
            return { user: parsed, isAuthenticated: true, isAdmin };
        }
    } catch {
        localStorage.removeItem(STORAGE.user);
        localStorage.removeItem(STORAGE.token);
    }
    return { user: null, isAuthenticated: false, isAdmin: false };
}

// ─── Context ────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    register: async () => ({ success: false }),
    login: async () => ({ success: false }),
    logout: async () => {},
});

// ─── Provider ───────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const initial = readStoredAuth();
    const [user, setUser] = useState<User | null>(initial.user);
    const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
    const [isAdmin, setIsAdmin] = useState(initial.isAdmin);
    const [loading] = useState(false);

    // Aplică răspunsul de auth (token + user) — partajat de login și register
    const applyAuth = (res: LoginResponse): void => {
        localStorage.setItem(STORAGE.token, res.token);
        const loggedUser: User = {
            id: res.userId,
            username: res.username,
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            avatar: `${res.firstName[0]}${res.lastName[0]}`.toUpperCase(),
            registeredAt: res.expiresAt,
        };
        const adminFlag = decodeAdminFromToken(res.token);
        setUser(loggedUser);
        setIsAuthenticated(true);
        setIsAdmin(adminFlag);
        localStorage.setItem(STORAGE.user, JSON.stringify(loggedUser));
    };

    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            const res = await userApi.login(email, password);
            applyAuth(res);
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Eroare de conexiune.';
            return { success: false, error: message };
        }
    };

    const register = async (data: {
        firstName: string; lastName: string; email: string; password: string;
    }): Promise<AuthResult> => {
        try {
            const res = await userApi.register(data.firstName, data.lastName, data.email, data.password);
            applyAuth(res);
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Eroare de conexiune.';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem(STORAGE.user);
        localStorage.removeItem(STORAGE.token);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);