"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8090";

export class ApiRequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

async function request(path, body, token) {
  let response;

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

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(
      payload?.message || "Authentication request failed",
      response.status
    );
  }

  return payload?.data;
}

export const loginRequest = (input) =>
  request("/api/auth/login", input);

export const registerRequest = (input) =>
  request("/api/auth/register", input);

