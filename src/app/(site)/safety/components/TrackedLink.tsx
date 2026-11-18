"use client";
import type { AnchorHTMLAttributes } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { analytics?: AnalyticsEvent };

/** Plain <a> that reports a GA4 event on click. Lets server components track links (events are serialisable props). */
export default function TrackedLink({ analytics, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        if (analytics) trackEvent(analytics);
        onClick?.(e);
      }}
    />
  );
}
