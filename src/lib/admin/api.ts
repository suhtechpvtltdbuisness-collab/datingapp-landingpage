import { redirect } from "next/navigation";
import { getToken } from "./session";

/** Where the dating backend (new_dating_app_backend) is running. */
export function backendUrl(): string {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return raw.replace(/\/+$/, "");
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface Envelope<T> {
  message?: string;
  data: T;
  pagination?: unknown;
}

type Query = Record<string, string | number | undefined>;

/** Calls the backend's /admin API. A rejected or expired token sends the admin back to sign in. */
export async function api<T>(
  path: string,
  opts: { method?: string; body?: unknown; query?: Query; auth?: boolean } = {},
): Promise<Envelope<T>> {
  const { method = "GET", body, query, auth = true } = opts;
  const url = new URL(`${backendUrl()}/admin${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await getToken();
    if (!token) redirect("/admin/logout");
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, `Cannot reach the backend at ${backendUrl()}. Is it running?`);
  }

  const json = (await res.json().catch(() => ({}))) as Partial<Envelope<T>>;
  if (!res.ok) {
    if (auth && res.status === 401) redirect("/admin/logout");
    throw new ApiError(res.status, json.message || `Request failed (${res.status})`);
  }
  return json as Envelope<T>;
}

/** Fetches a paginated list and returns it as { items, pagination }. */
export async function apiList<T>(path: string, query?: Query) {
  const res = await api<T[]>(path, { query });
  return {
    items: res.data,
    pagination: res.pagination as { page: number; limit: number; total: number; pages: number },
  };
}
