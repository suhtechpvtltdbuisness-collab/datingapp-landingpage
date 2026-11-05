import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./admin.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: { template: "%s · DatingApp Admin", default: "Dashboard · DatingApp Admin" },
};

/** Root layout for the admin panel using crisp, high-legibility Inter font */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.className} m-0 min-h-screen bg-admin-page bg-fixed leading-[normal] text-admin-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
