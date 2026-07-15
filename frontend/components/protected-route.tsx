"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireRole?: "admin" | "user";
};

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="page-shell">Loading your archive session...</main>;
  }

  if (!user) {
    return (
      <main className="page-shell centered-state">
        <ShieldAlert size={36} />
        <h1>Sign in required</h1>
        <p>Please log in to access this protected archive workspace.</p>
        <Link href="/login" className="button">
          Log In
        </Link>
      </main>
    );
  }

  if (requireRole && user.role !== requireRole) {
    return (
      <main className="page-shell centered-state">
        <ShieldAlert size={36} />
        <h1>Admin access required</h1>
        <p>This workspace is reserved for archive administrators.</p>
        <Link href="/dashboard" className="button">
          Go to Dashboard
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
