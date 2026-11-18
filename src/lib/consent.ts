/**
 * Analytics consent state, kept in this browser's localStorage (no cookie is set for the choice itself).
 * Opt-in: until the visitor chooses "granted", nothing is sent to Google Analytics.
 */

export const CONSENT_KEY = "vellora_consent_v1";
export const CONSENT_EVENT = "vellora:consent-change";
export const OPEN_SETTINGS_EVENT = "vellora:open-consent-settings";

export type ConsentChoice = "granted" | "denied";

/** The stored choice, or null if the visitor hasn't chosen yet (or storage is unavailable). */
export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* storage blocked: the choice still applies for this page view via the event below */
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
}

export function hasAnalyticsConsent(): boolean {
  return typeof window !== "undefined" && readConsent() === "granted";
}

/** For useSyncExternalStore: notifies on a choice made in this tab or another. */
export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** Best-effort removal of the GA cookies (_ga, _ga_<id>) on this host and its parent domain. */
export function clearGaCookies(gaId: string, doc: { cookie: string; location?: { hostname: string } } = document): void {
  const suffix = gaId.replace(/^G-/, "");
  const names = ["_ga", `_ga_${suffix}`, "_gid"];
  const host = (doc.location ?? globalThis.location)?.hostname ?? "";
  const parts = host.split(".");
  const domains = ["", host, ...(parts.length > 2 ? [`.${parts.slice(-2).join(".")}`] : parts.length === 2 ? [`.${host}`] : [])];
  for (const name of names) {
    for (const domain of domains) {
      doc.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
