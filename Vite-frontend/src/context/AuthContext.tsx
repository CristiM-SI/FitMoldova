import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../services/mock/Mockdata';
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => { success: boolean };
  login: (username: string, password: string) => { success: boolean };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  register: () => ({ success: false }),
  login: () => ({ success: false }),
  logout: () => {},
});

// Read auth state synchronously from localStorage during the very first render.
// This eliminates the loading:true → loading:false transition (and the
// <LoadingScreen /> it triggers) on every page refresh.
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = readStoredAuth();
  const [user, setUser] = useState<User | null>(initial.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [isAdmin, setIsAdmin] = useState(initial.isAdmin);
  const [loading] = useState(false); // always false — auth is known synchronously

  const register = (data: { firstName: string; lastName: string; email: string; password: string }) => {
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
  };

  const login = (username: string, password: string) => {
    // Caută în utilizatorii mock
    const mockUser = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
    );

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

    // Caută în utilizatorii înregistrați din localStorage
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

    return { success: false, error: "Utilizator sau parolă incorectă" };
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
