/**
 * Typed GA4 custom events. Uses the gtag() that GoogleAnalytics.tsx installs; does nothing when GA is
 * not loaded (no NEXT_PUBLIC_GA_ID, no consent, ad blocker, SSR), so callers never need to guard.
 *
 * Only non-identifying, allow-listed parameters can be sent. Never add emails, phone numbers, names or tokens.
 * Events are fired from click handlers only (never from render or effects), so navigation can't double-fire them.
 *
 * Not implemented because the website has no such flow: sign_up (registration happens in the mobile app) and
 * login (/api/account/login only verifies ownership for account deletion; the admin login is a private area).
 */

import { hasAnalyticsConsent } from "./consent.ts";

export type Placement = "hero" | "nav" | "download_bar" | "plans_section" | "footer" | "legal_footer" | "about_page";

export type AnalyticsEvent =
  | { name: "app_download_click"; params: { store: "google_play" | "app_store"; placement: Placement } }
  | { name: "premium_click"; params: { placement: Placement; plan?: string } }
  | { name: "contact_click"; params: { method: "email" | "phone"; placement: Placement } };

type GtagFn = (command: "event", name: string, params: Record<string, string>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

/** Keeps only short plain strings that cannot be an email address; defence in depth behind the types. */
export function sanitizeParams(params: Record<string, string | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0 && value.length <= 60 && !value.includes("@")) out[key] = value;
  }
  return out;
}

/** Sends the event to GA4. Returns true if it was handed to gtag. */
export function trackEvent(event: AnalyticsEvent): boolean {
  // No consent, no event: gtag is not even loaded until the visitor accepts analytics.
  if (typeof window === "undefined" || !hasAnalyticsConsent() || typeof window.gtag !== "function") return false;
  try {
    window.gtag("event", event.name, sanitizeParams(event.params));
    return true;
  } catch {
    return false; // analytics must never break the page
  }
}
