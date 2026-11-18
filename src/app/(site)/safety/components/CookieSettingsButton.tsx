"use client";
import { GA_ID } from "@/lib/ga";
import { openConsentSettings } from "@/lib/consent";

/** Footer link that reopens the cookie choice. Hidden when analytics isn't configured (nothing to choose). */
export default function CookieSettingsButton({ className = "" }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Cookie settings
    </button>
  );
}
