"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { loginRequest, registerRequest } from "@/services/auth-service";
import type { AuthResponse, AuthUser } from "@/types/archive";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: "user" | "admin"
  ) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "archive-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthResponse;
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const persist = useCallback((payload: AuthResponse) => {
    setUser(payload.user);
    setToken(payload.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const payload = await loginRequest({ email, password });
      persist(payload);
      return payload.user;
    },
    [persist]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role?: "user" | "admin"
    ) => {
      const payload = await registerRequest({ name, email, password, role });
      persist(payload);
      return payload.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [loading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
