import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../services/mock/Mockdata';
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => { success: boolean };
  login: (email: string, password: string) => { success: boolean };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  register: () => ({ success: false }),
  login: () => ({ success: false }),
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('fitmoldova_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('fitmoldova_user');
      }
    }
    setLoading(false);
  }, []);

  const register = (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const newUser: User = {
      id: Date.now(),
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
  };

  const login = (email: string, _password: string) => {
    const saved = localStorage.getItem('fitmoldova_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User;
        if (parsed.email === email) {
          setUser(parsed);
          setIsAuthenticated(true);
          return { success: true };
        }
      } catch { /* ignore */ }
    }
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fitmoldova_user');
  };

  return (
      <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export default AuthContext;
