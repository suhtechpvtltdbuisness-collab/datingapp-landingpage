import ConsentManager from "./ConsentManager";
import { GA_ID } from "@/lib/ga";
import { CONSENT_KEY } from "@/lib/consent";

/**
 * GA4 entry point (server component). Renders nothing unless NEXT_PUBLIC_GA_ID is a valid "G-XXXX" id.
 * Otherwise it mounts the consent manager, which shows the cookie banner and loads GA4 only after the visitor accepts.
 * page_view is NOT sent manually: gtag's default config sends the initial one, and GA4 Enhanced Measurement
 * ("Page changes based on browser history events") records App Router navigations. Manual calls would double-count.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      {/* Runs before the banner is parsed: if a choice is already stored, flag <html> so CSS hides the server-rendered banner. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)});if(c==="granted"||c==="denied")document.documentElement.setAttribute("data-consent-set","")}catch(e){}`,
        }}
      />
      <ConsentManager gaId={GA_ID} />
    </>
  );
}
