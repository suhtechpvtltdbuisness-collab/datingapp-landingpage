import { redirect } from "next/navigation";
import { getToken } from "./session";

/** Where the dating backend (new_dating_app_backend) is running. */
export function backendUrl(): string {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";
  return raw.split("#")[0].trim().replace(/\/+$/, "");
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const cause = (err as { cause?: Error })?.cause?.message;
    console.error(`[Admin API Connection Error] Target: ${url.toString()} | Error: ${message}${cause ? ` | Cause: ${cause}` : ""}`);
    throw new ApiError(0, `Cannot reach the backend at ${backendUrl()}. Is it running? (${message}${cause ? `: ${cause}` : ""})`);
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
  try {
    const res = await api<T[]>(path, { query });
    const rawData = res?.data;
    const items: T[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray((rawData as any)?.items)
      ? (rawData as any).items
      : Array.isArray((rawData as any)?.data)
      ? (rawData as any).data
      : [];

    const pagination = (res?.pagination ?? (rawData as any)?.pagination ?? {
      page: 1,
      limit: items.length,
      total: items.length,
      pages: 1,
    }) as { page: number; limit: number; total: number; pages: number };

    return { items, pagination };
  } catch (err: unknown) {
    const digest = String((err as any)?.digest ?? "");
    const message = String((err as any)?.message ?? "");
    if (digest.includes("NEXT_REDIRECT") || message.includes("NEXT_REDIRECT")) {
      throw err;
    }
    console.error(`[Admin API] Failed to fetch list from ${path}:`, err);
    return {
      items: [] as T[],
      pagination: { page: 1, limit: 0, total: 0, pages: 1 },
    };
  }
}
