"use client";

import { AuthProvider } from "@/store/auth-context";

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

