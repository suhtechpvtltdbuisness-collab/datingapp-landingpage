"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  OPEN_SETTINGS_EVENT,
  clearGaCookies,
  readConsent,
  subscribeConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { gaInitScript, gaScriptSrc } from "@/lib/ga";

/**
 * undefined on the server and during hydration. The banner is server-rendered in that state (so it paints with the first HTML
 * instead of waiting for hydration); returning visitors with a stored choice have it hidden before paint by the inline
 * script in GoogleAnalytics.tsx, and it is removed from the DOM once hydration confirms the choice.
 */
const useConsent = () => useSyncExternalStore<ConsentChoice | null | undefined>(subscribeConsent, readConsent, () => undefined);

export default function ConsentManager({ gaId }: { gaId: string }) {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const previous = useRef<ConsentChoice | null | undefined>(undefined);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // React to changes: switch GA off (and clear its cookies) on withdrawal, back on if re-accepted.
  useEffect(() => {
    if (consent === undefined) return;
    const flag = `ga-disable-${gaId}`;
    const w = window as unknown as Record<string, unknown> & { gtag?: (...a: unknown[]) => void };
    if (consent === "granted") {
      w[flag] = false;
      w.gtag?.("consent", "update", { analytics_storage: "granted" });
    } else if (previous.current === "granted" || document.cookie.includes("_ga")) {
      w[flag] = true;
      w.gtag?.("consent", "update", { analytics_storage: "denied" });
      clearGaCookies(gaId);
    }
    previous.current = consent;
  }, [consent, gaId]);

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    setReopened(false);
  };

  const showBanner = consent === undefined || consent === null || reopened;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={gaScriptSrc(gaId)} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {gaInitScript(gaId)}
          </Script>
        </>
      )}
      {showBanner && (
        <div
          role="dialog"
          data-cookie-banner=""
          data-reopened={reopened ? "" : undefined}
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-text"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-brand-magenta/15 bg-white p-4 text-brand-ink shadow-2xl sm:bottom-5 sm:p-5"
        >
          <h2 id="cookie-banner-title" className="font-display text-base font-bold">
            Analytics cookies
          </h2>
          <p id="cookie-banner-text" className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">
            With your permission, we use Google Analytics to see which pages are visited and which buttons are clicked. It sets cookies
            and sends usage data to Google. It&rsquo;s optional, and you can change your choice any time from &ldquo;Cookie settings&rdquo; in the footer.{" "}
            <Link href="/cookies" className="font-semibold text-brand-magenta underline-offset-2 hover:underline">
              Cookie Policy
            </Link>
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-full border border-brand-magenta/30 px-5 py-2.5 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/40"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-full border border-brand-magenta/30 px-5 py-2.5 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/40"
            >
              Accept analytics
            </button>
          </div>
        </div>
      )}
    </>
  );
}
