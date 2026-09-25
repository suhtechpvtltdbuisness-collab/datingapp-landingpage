/**
 * Design tokens for the Safety page. CSS variables live in globals.css;
 * Tailwind maps to them in tailwind.config.ts. Components use Tailwind
 * token classes (bg-brand-pink, shadow-card, rounded-card) — never raw hex.
 */
export const tokens = {
  color: {
    pink: "#FF3D77",
    magenta: "#E0299B",
    purple: "#8B2FC9",
    bg: "#FFF3F7",
    ink: "#1E1033",
    inkSoft: "#5B4A6B",
    accent: "#FF8A3D",
    accentSoft: "#FFE3CC",
    gold: "#9A5F24",
    night: "#1A0F2E",
  },
  radius: { card: "24px", chip: "9999px", photo: "20px" },
  shadow: {
    card: "0 1px 2px rgba(139,47,201,.06), 0 8px 24px -8px rgba(224,41,155,.18)",
    cardHover: "0 2px 4px rgba(139,47,201,.08), 0 24px 48px -12px rgba(224,41,155,.32)",
    glow: "0 12px 32px -8px rgba(255,61,119,.55)",
  },
} as const;

/** Apple-ish easeOutExpo curve used for every entrance. */
export const brand = {
  name: "Vellora",
  tagline: "Destined connections",
  motto: "Written in the stars. Connected by numbers.",
  emblem: "/brand/velora-emblem.png",
  logo: "/brand/velora-logo.jpg",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

export const spring = { type: "spring", stiffness: 260, damping: 24 } as const;
