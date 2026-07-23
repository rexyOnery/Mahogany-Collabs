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

const AuthContext = createContext(undefined);

const STORAGE_KEY = "archive-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const persist = useCallback((payload) => {
    setUser(payload.user);
    setToken(payload.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const payload = await loginRequest({ email, password });
      persist(payload);
      return payload.user;
    },
    [persist]
  );

  const register = useCallback(
    async (name, email, password) => {
      const payload = await registerRequest({ name, email, password });
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

