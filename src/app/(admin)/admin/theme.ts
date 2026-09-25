/**
 * Design tokens for the admin panel, registered in tailwind.config.ts as
 * `admin-*` colors, gradients and shadows (e.g. text-admin-ink-2, bg-admin-brand).
 */
export const adminTheme = {
  colors: {
    primary: "#ff3d77",
    "primary-dark": "#d81159",
    accent: "#8b5cf6",
    "accent-deep": "#6d28d9",
    warm: "#ff8a5c",
    gold: "#ffc94d",
    success: "#33d69f",
    danger: "#ff4470",
    info: "#4da3ff",
    ink: "#1b1130",
    "ink-2": "#6b6178",
    "ink-3": "#9c93a8",
    "success-ink": "#159c6b",
    "warning-ink": "#a5720a",
    "info-ink": "#1c6dd0",
  },
  backgroundImage: {
    page: "linear-gradient(160deg, #ffe3ed 0%, #f6e4fb 45%, #eae3ff 100%)",
    auth: "linear-gradient(135deg, #ff3d77 0%, #cc3aa6 55%, #8b5cf6 100%)",
    brand: "linear-gradient(135deg, #ff3d77, #8b5cf6)",
    "stat-1": "linear-gradient(135deg, #ff3d77, #ff8aa3)",
    "stat-2": "linear-gradient(135deg, #8b5cf6, #b794f6)",
    "stat-3": "linear-gradient(135deg, #ffc94d, #ff8a5c)",
    "stat-4": "linear-gradient(135deg, #33d69f, #6ff0c3)",
    "stat-5": "linear-gradient(135deg, #4da3ff, #7fd8ff)",
    "stat-6": "linear-gradient(135deg, #ff4470, #ff8aa3)",
    "grad-danger": "linear-gradient(135deg, #ff4470, #ff3d77)",
    "grad-success": "linear-gradient(135deg, #33d69f, #22b788)",
    "grad-error": "linear-gradient(135deg, #ff4470, #d81159)",
  },
  boxShadow: {
    glass: "0 18px 40px rgba(124, 19, 73, 0.12)",
    nav: "0 10px 24px rgba(255, 61, 119, 0.28)",
    auth: "0 24px 60px rgba(84, 4, 60, 0.35)",
    flash: "0 10px 26px rgba(0, 0, 0, 0.15)",
    lift: "0 10px 24px rgba(0, 0, 0, 0.18)",
    bar: "0 10px 24px -18px rgba(124, 19, 73, 0.45)",
  },
} as const;
