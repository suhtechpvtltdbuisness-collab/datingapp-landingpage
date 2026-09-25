import type { Metadata } from "next";
import { Poppins, Inter, Cormorant_Garamond } from "next/font/google";
import MotionProvider from "./MotionProvider";
import "./globals.css";

const display = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const brand = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: "Velora Safety Centre",
  description: "How we help you date with confidence: verification, reporting, and tools that put you in control.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${brand.variable}`}>
      <body className="font-sans antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
