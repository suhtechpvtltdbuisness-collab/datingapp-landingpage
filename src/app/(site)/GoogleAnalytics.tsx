import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

/**
 * GA4 loader (server component). Renders nothing unless NEXT_PUBLIC_GA_ID is set to a valid "G-XXXX" id.
 * page_view is NOT sent manually: gtag's default config sends the initial one, and GA4 Enhanced Measurement
 * ("Page changes based on browser history events") records App Router navigations, which use history.pushState.
 * Adding manual page_view calls here would double-count.
 */
export default function GoogleAnalytics() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});`}
      </Script>
    </>
  );
}
