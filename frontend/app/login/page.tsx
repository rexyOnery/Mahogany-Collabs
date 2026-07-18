"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const safeNextPath = (value: string | null) =>
  value?.startsWith("/") && !value.startsWith("//") ? value : "";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAdminMode(params.get("mode") === "admin" || params.get("next") === "/admin");
    setNextPath(safeNextPath(params.get("next")));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const signedInUser = await login(email, password);
      if (adminMode && signedInUser.role !== "admin") {
        setError("This account is not an admin account. Create or use an admin account to upload archive images.");
        return;
      }

      router.push(nextPath || (signedInUser.role === "admin" ? "/admin" : "/dashboard"));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-form" onSubmit={onSubmit}>
        <p className="eyebrow">{adminMode ? "Admin Log In" : "Log In"}</p>
        <h1>{adminMode ? "Open archive operations" : "Return to the archive"}</h1>
        <p className="auth-helper">
          {adminMode
            ? "Use an admin account to access the upload workspace."
            : "Sign in to continue your archive session."}
        </p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="error-banner">{error}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Log In"}
        </button>
        <p>
          New here?{" "}
          <Link href={adminMode ? "/sign-up?role=admin&next=/admin" : "/sign-up"}>
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
