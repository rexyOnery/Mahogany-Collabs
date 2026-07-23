"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="page-shell">Loading your archive session...</main>;
  }

  if (!user) {
    const loginHref = requireRole === "admin" ? "/login?mode=admin&next=/admin" : "/login";
    return (
      <main className="page-shell centered-state">
        <ShieldAlert size={36} />
        <h1>{requireRole === "admin" ? "Admin sign in required" : "Sign in required"}</h1>
        <p>
          {requireRole === "admin"
            ? "Log in with an administrator account provisioned by the archive team."
            : "Please log in to access this protected archive workspace."}
        </p>
        <div className="auth-action-row">
          <Link href={loginHref} className="button">
            {requireRole === "admin" ? "Admin Log In" : "Log In"}
          </Link>
          {requireRole !== "admin" ? (
            <Link href="/sign-up" className="button button-light">
              Sign Up
            </Link>
          ) : null}
        </div>
      </main>
    );
  }

  if (requireRole && user.role !== requireRole) {
    return (
      <main className="page-shell centered-state">
        <ShieldAlert size={36} />
        <h1>Admin access required</h1>
        <p>This workspace is reserved for archive administrators.</p>
        <div className="auth-action-row">
          <Link href="/login?mode=admin&next=/admin" className="button">
            Log In as Admin
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

