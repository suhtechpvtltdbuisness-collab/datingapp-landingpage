import { cookies } from "next/headers";

/**
 * One-time flash messages ("User banned.", "Invalid username or password.").
 * Stored in a short-lived cookie that the FlashStack component clears once shown.
 */
export const FLASH_COOKIE = "admin_flash";

export type FlashCategory = "success" | "error";

export interface FlashMessage {
  category: FlashCategory;
  message: string;
}

export interface FlashBatch {
  id: number;
  messages: FlashMessage[];
}

function parse(raw: string | undefined): FlashBatch | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as FlashBatch;
    if (Array.isArray(data.messages) && data.messages.length) return data;
  } catch {
    /* ignore */
  }
  return null;
}

function flashCookieOptions() {
  return {
    path: "/admin" as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function flash(message: string, category: FlashCategory) {
  const jar = await cookies();
  const existing = parse(jar.get(FLASH_COOKIE)?.value)?.messages ?? [];
  const batch: FlashBatch = { id: Date.now(), messages: [...existing, { category, message }] };
  jar.set(FLASH_COOKIE, JSON.stringify(batch), { ...flashCookieOptions(), maxAge: 60 });
}

/**
 * Read pending flashes. Cookies cannot be modified while rendering a page, so the
 * cookie is cleared client-side by FlashStack once the messages are shown.
 */
export async function getFlashes(): Promise<FlashBatch | null> {
  const jar = await cookies();
  return parse(jar.get(FLASH_COOKIE)?.value);
}
