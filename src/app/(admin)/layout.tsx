import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./admin.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: { template: "%s · DatingApp Admin", default: "Dashboard · DatingApp Admin" },
};

/** Root layout for the admin panel (separate from the Safety site's layout and fonts). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} m-0 min-h-screen bg-admin-page bg-fixed leading-[normal] text-admin-ink`}>{children}</body>
    </html>
  );
}
