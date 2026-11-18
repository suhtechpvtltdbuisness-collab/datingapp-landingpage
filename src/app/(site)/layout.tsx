import type { Metadata } from "next";
import { Poppins, Inter, Cormorant_Garamond } from "next/font/google";
import MotionProvider from "./MotionProvider";
import GoogleAnalytics from "./GoogleAnalytics";
import "./globals.css";
import { brand as brandInfo } from "./safety/theme";
import { defaultOgImage, siteUrl } from "@/lib/seo";

const display = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const brand = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-brand" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: brandInfo.name,
  applicationName: brandInfo.name,
  description: "How we help you date with confidence: verification, reporting, and tools that put you in control.",
  // Fallbacks for any page that does not set its own; pages use pageMetadata() from @/lib/seo.
  openGraph: { type: "website", siteName: brandInfo.name, images: [defaultOgImage] },
  twitter: { card: "summary", images: [defaultOgImage.url] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${brand.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
