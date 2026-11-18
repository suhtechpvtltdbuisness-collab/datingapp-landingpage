/** GA4 configuration helpers (pure, so they can be unit-tested). */

export const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

/** Returns the Measurement ID only if it is set and well-formed; otherwise null (analytics stays fully off). */
export function validGaId(raw: string | undefined | null): string | null {
  const id = raw?.trim();
  return id && GA_ID_PATTERN.test(id) ? id : null;
}

/** The configured ID. The literal env access is required so Next.js inlines it into client bundles. */
export const GA_ID: string | null = validGaId(process.env.NEXT_PUBLIC_GA_ID);

/**
 * Inline gtag bootstrap, only ever rendered after the visitor accepts analytics.
 * Analytics storage is granted (they just said yes); all advertising-related storage stays denied.
 * No manual page_view: the default config sends the first one and Enhanced Measurement handles route changes.
 */
export function gaInitScript(id: string): string {
  return (
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
    "gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});" +
    "gtag('js',new Date());" +
    `gtag('config',${JSON.stringify(id)});`
  );
}

export function gaScriptSrc(id: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}
