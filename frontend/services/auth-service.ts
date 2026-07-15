"use client";

import type { AuthResponse } from "@/types/archive";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";

type Credentials = {
  email: string;
  password: string;
};

type RegisterInput = Credentials & {
  name: string;
  role?: "user" | "admin";
};

async function request<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Authentication request failed");
  }

  return payload.data as T;
}

export const loginRequest = (input: Credentials) =>
  request<AuthResponse>("/api/auth/login", input);

export const registerRequest = (input: RegisterInput) =>
  request<AuthResponse>("/api/auth/register", input);
