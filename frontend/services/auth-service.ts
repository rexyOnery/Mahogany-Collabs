"use client";

import type { AuthResponse } from "@/types/archive";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8090";

type Credentials = {
  email: string;
  password: string;
};

type RegisterInput = Credentials & {
  name: string;
  role?: "user" | "admin";
};

type ApiResponsePayload<T> = {
  data?: T;
  message?: string;
};

export class ApiRequestError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

async function request<T>(path: string, body: unknown, token?: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new ApiRequestError(
      `Could not reach the archive API gateway at ${API_BASE_URL}. Make sure the Docker dev stack is running and port 8090 is available.`
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiResponsePayload<T> | null;

  if (!response.ok) {
    throw new ApiRequestError(
      payload?.message || "Authentication request failed",
      response.status
    );
  }

  return payload?.data as T;
}

export const loginRequest = (input: Credentials) =>
  request<AuthResponse>("/api/auth/login", input);

export const registerRequest = (input: RegisterInput) =>
  request<AuthResponse>("/api/auth/register", input);
