"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ApiRequestError } from "@/services/auth-service";

const safeNextPath = (value) =>
  value?.startsWith("/") && !value.startsWith("//") ? value : "";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("");
  const [error, setError] = useState("");
  const [duplicateAccount, setDuplicateAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(safeNextPath(params.get("next")));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setDuplicateAccount(false);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push(nextPath && nextPath !== "/admin" ? nextPath : "/dashboard");
    } catch (requestError) {
      if (requestError instanceof ApiRequestError && requestError.statusCode === 409) {
        setDuplicateAccount(true);
        setError("An account with this email already exists. Log in instead, or use a different email.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginHref = "/login";

  return (
    <main className="auth-shell">
      <form className="auth-form" onSubmit={onSubmit}>
        <p className="eyebrow">Sign Up</p>
        <h1>Create your archive account</h1>
        <p className="auth-helper">
          Public accounts can browse, search, and return to the archive experience.
        </p>
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
        {error ? <p className="error-banner">{error}</p> : null}
        {duplicateAccount ? (
          <p className="notice">
            <Link href={loginHref}>Log in with this email</Link>
            {" or use a different email to create a new account."}
          </p>
        ) : null}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p>
          Already registered?{" "}
          <Link href={loginHref}>Log in</Link>
        </p>
      </form>
    </main>
  );
}

