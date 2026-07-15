"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const signedInUser = await login(email, password);
      router.push(signedInUser.role === "admin" ? "/admin" : "/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-form" onSubmit={onSubmit}>
        <p className="eyebrow">Log In</p>
        <h1>Return to the archive</h1>
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
          New here? <Link href="/sign-up">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
