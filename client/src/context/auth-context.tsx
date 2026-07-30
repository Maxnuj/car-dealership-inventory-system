import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { dealershipService } from '../services/dealership.service';
import type { User } from '../types/api';

type AuthContextValue = {
  user: User | null;
  login(email: string, password: string): Promise<void>;
  register(username: string, email: string, password: string): Promise<void>;
  logout(): void;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const userKey = 'dealership_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(userKey);
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const persist = (result: { token: string; user: User }) => {
    localStorage.setItem('dealership_token', result.token);
    localStorage.setItem(userKey, JSON.stringify(result.user));
    setUser(result.user);
  };
  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: async (email, password) => persist(await dealershipService.login(email, password)),
    register: async (username, email, password) => persist(await dealershipService.register(username, email, password)),
    logout: () => { localStorage.removeItem('dealership_token'); localStorage.removeItem(userKey); setUser(null); },
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
