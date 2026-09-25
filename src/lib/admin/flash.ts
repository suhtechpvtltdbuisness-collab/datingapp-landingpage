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

export async function flash(message: string, category: FlashCategory) {
  const jar = await cookies();
  const existing = parse(jar.get(FLASH_COOKIE)?.value)?.messages ?? [];
  const batch: FlashBatch = { id: Date.now(), messages: [...existing, { category, message }] };
  jar.set(FLASH_COOKIE, JSON.stringify(batch), { path: "/admin", sameSite: "lax", maxAge: 60 });
}

export async function getFlashes(): Promise<FlashBatch | null> {
  return parse((await cookies()).get(FLASH_COOKIE)?.value);
}
