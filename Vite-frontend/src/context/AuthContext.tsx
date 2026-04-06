import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../services/mock/Mockdata';
import axiosInstance from '../services/api/axiosInstance';

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

// interface AuthResult {
//     success: boolean;
//     error?: string;
// }

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

function buildUserFromApiData(data: {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  registeredAt: string;
}): User {
  return {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    avatar: `${data.firstName[0] ?? ''}${data.lastName[0] ?? ''}`.toUpperCase(),
    registeredAt: data.registeredAt,
    isAdmin: data.role === 'admin',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = readStoredAuth();
  const [user, setUser] = useState<User | null>(initial.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [isAdmin, setIsAdmin] = useState(initial.isAdmin);
  const [loading] = useState(false);

  const register = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      type RegisterResult = { isSuccess: boolean; message?: string; data: Parameters<typeof buildUserFromApiData>[0] };
      const { data: result } = await axiosInstance.post<RegisterResult>('/user/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      if (result.isSuccess) {
        const newUser = buildUserFromApiData(result.data);
        setUser(newUser);
        setIsAuthenticated(true);
        setIsAdmin(newUser.isAdmin === true);
        localStorage.setItem('fitmoldova_user', JSON.stringify(newUser));
        return { success: true };
      }

      return { success: false, error: result.message ?? 'Înregistrare eșuată.' };
    } catch {
      // API unavailable — fall back to mock registration
      const newUser: User = {
        id: Date.now(),
        username: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
        registeredAt: new Date().toISOString(),
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('fitmoldova_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Try mock users first (for dev/demo accounts)
    const mockUser = MOCK_USERS.find((u) => u.username === username && u.password === password);
    if (mockUser) {
      const loggedUser: User = {
        id: mockUser.id,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        avatar: mockUser.avatar,
        registeredAt: mockUser.registeredAt,
        isAdmin: mockUser.isAdmin,
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      setIsAdmin(loggedUser.isAdmin === true);
      localStorage.setItem('fitmoldova_user', JSON.stringify(loggedUser));
      return { success: true };
    }

    // Try real API
    try {
      type LoginResult = { isSuccess: boolean; message?: string; data: Parameters<typeof buildUserFromApiData>[0] };
      const { data: result } = await axiosInstance.post<LoginResult>('/user/login', { username, password });

      if (result.isSuccess) {
        const loggedUser = buildUserFromApiData(result.data);
        setUser(loggedUser);
        setIsAuthenticated(true);
        setIsAdmin(loggedUser.isAdmin === true);
        localStorage.setItem('fitmoldova_user', JSON.stringify(loggedUser));
        return { success: true };
      }

      return { success: false, error: result.message ?? 'Credențiale incorecte.' };
    } catch {
      // API unavailable — check localStorage for previously registered user
      const saved = localStorage.getItem('fitmoldova_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as User;
          if (parsed.username === username) {
            setUser(parsed);
            setIsAuthenticated(true);
            return { success: true };
          }
        } catch { /* ignore */ }
      }
      return { success: false, error: 'Utilizator sau parolă incorectă' };
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