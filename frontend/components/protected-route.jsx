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
    const signUpHref = requireRole === "admin" ? "/sign-up?role=admin&next=/admin" : "/sign-up";
    return (
      <main className="page-shell centered-state">
        <ShieldAlert size={36} />
        <h1>{requireRole === "admin" ? "Admin sign in required" : "Sign in required"}</h1>
        <p>
          {requireRole === "admin"
            ? "Log in or register as an admin to access Archive Operations and upload records."
            : "Please log in to access this protected archive workspace."}
        </p>
        <div className="auth-action-row">
          <Link href={loginHref} className="button">
            {requireRole === "admin" ? "Admin Log In" : "Log In"}
          </Link>
          <Link href={signUpHref} className="button button-light">
            {requireRole === "admin" ? "Register Admin" : "Sign Up"}
          </Link>
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
          <Link href="/sign-up?role=admin&next=/admin" className="button button-light">
            Register Admin
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

