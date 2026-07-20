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
  const [role, setRole] = useState("user");
  const [nextPath, setNextPath] = useState("");
  const [error, setError] = useState("");
  const [duplicateAccount, setDuplicateAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "admin") {
      setRole("admin");
    }
    setNextPath(safeNextPath(params.get("next")));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setDuplicateAccount(false);
    setLoading(true);
    try {
      await register(name, email, password, role);
      router.push(nextPath || (role === "admin" ? "/admin" : "/dashboard"));
    } catch (requestError) {
      if (requestError instanceof ApiRequestError && requestError.statusCode === 409) {
        setDuplicateAccount(true);
        setError(
          role === "admin"
            ? "An account with this email already exists. Log in with it, or use a different email for a new admin account."
            : "An account with this email already exists. Log in instead, or use a different email."
        );
      } else {
        setError(requestError instanceof Error ? requestError.message : "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginHref =
    role === "admin"
      ? `/login?mode=admin&next=${encodeURIComponent(nextPath || "/admin")}`
      : "/login";

  return (
    <main className="auth-shell">
      <form className="auth-form" onSubmit={onSubmit}>
        <p className="eyebrow">Sign Up</p>
        <h1>{role === "admin" ? "Create an admin account" : "Create your archive account"}</h1>
        <p className="auth-helper">
          {role === "admin"
            ? "Admin accounts can open Archive Operations and upload public archive image records."
            : "Public accounts can browse, search, and return to the archive experience."}
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
        <label>
          Account type
          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setDuplicateAccount(false);
              setError("");
            }}
          >
            <option value="user">Public archive account</option>
            <option value="admin">Admin upload account</option>
          </select>
        </label>
        {error ? <p className="error-banner">{error}</p> : null}
        {duplicateAccount ? (
          <p className="notice">
            <Link href={loginHref}>Log in with this email</Link>
            {role === "admin"
              ? " or use a different email. Existing public-only accounts still need an admin role before they can open uploads."
              : " or use a different email to create a new account."}
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

