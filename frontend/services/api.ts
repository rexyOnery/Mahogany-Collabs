export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8090";

const API_GATEWAY_INTERNAL_URL =
  process.env.API_GATEWAY_INTERNAL_URL || API_BASE_URL;

const apiBaseUrl = () =>
  typeof window === "undefined" ? API_GATEWAY_INTERNAL_URL : API_BASE_URL;

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export async function apiFetch<T>(
  path: string,
  options: NextFetchInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const baseUrl = apiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error(`Could not reach the archive API gateway at ${baseUrl}.`);
  }

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body?.data as T;
}

export async function safeApiFetch<T>(
  path: string,
  fallback: T,
  options: NextFetchInit = {}
): Promise<T> {
  try {
    return await apiFetch<T>(path, {
      next: { revalidate: 60 },
      ...options
    });
  } catch {
    return fallback;
  }
}
