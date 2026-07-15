"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminDemo, setAdminDemo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, adminDemo ? "admin" : "user");
      router.push(adminDemo ? "/admin" : "/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-form" onSubmit={onSubmit}>
        <p className="eyebrow">Sign Up</p>
        <h1>Create your archive account</h1>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
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
            minLength={8}
            required
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={adminDemo}
            onChange={(event) => setAdminDemo(event.target.checked)}
          />
          Create an admin demo account
        </label>
        {error ? <p className="error-banner">{error}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p>
          Already registered? <Link href="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
