const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";

type ApiEnvelope<T> = {
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

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
