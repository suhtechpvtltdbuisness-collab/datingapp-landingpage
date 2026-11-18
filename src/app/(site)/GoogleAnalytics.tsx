import ConsentManager from "./ConsentManager";
import { GA_ID } from "@/lib/ga";

/**
 * GA4 entry point (server component). Renders nothing unless NEXT_PUBLIC_GA_ID is a valid "G-XXXX" id.
 * Otherwise it mounts the consent manager, which shows the cookie banner and loads GA4 only after the visitor accepts.
 * page_view is NOT sent manually: gtag's default config sends the initial one, and GA4 Enhanced Measurement
 * ("Page changes based on browser history events") records App Router navigations. Manual calls would double-count.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return <ConsentManager gaId={GA_ID} />;
}
