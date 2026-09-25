import type { Config } from "tailwindcss";
import { tokens } from "./src/app/(site)/safety/theme";
import { adminTheme } from "./src/app/(admin)/admin/theme";

const prefixed = <T extends Record<string, string>>(group: T) =>
  Object.fromEntries(Object.entries(group).map(([k, v]) => [`admin-${k}`, v]));

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "var(--brand-pink)",
          magenta: "var(--brand-magenta)",
          purple: "var(--brand-purple)",
          bg: "var(--brand-bg)",
          ink: "var(--brand-ink)",
          "ink-soft": "var(--brand-ink-soft)",
          accent: "var(--brand-accent)",
          "accent-soft": "var(--brand-accent-soft)",
          gold: "var(--brand-gold)",
          night: "var(--brand-night)",
        },
        admin: adminTheme.colors,
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brand-gradient-soft": "var(--brand-gradient-soft)",
        "brand-wordmark": "var(--brand-wordmark)",
        ...prefixed(adminTheme.backgroundImage),
      },
      borderRadius: { card: tokens.radius.card, photo: tokens.radius.photo },
      boxShadow: {
        card: tokens.shadow.card,
        "card-hover": tokens.shadow.cardHover,
        glow: tokens.shadow.glow,
        ...prefixed(adminTheme.boxShadow),
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        brand: ["var(--font-brand)", "Georgia", "serif"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 32s linear infinite" },
    },
  },
  plugins: [],
};
export default config;
