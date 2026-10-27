import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "../safety/components/BrandLogo";
import LegalFooter from "../safety/components/LegalFooter";
import { brand } from "../safety/theme";
import DeleteAccountFlow from "./DeleteAccountFlow";

export const metadata: Metadata = {
  title: `Delete your account | ${brand.name}`,
  description: `Verify your identity and permanently delete your ${brand.name} account and data.`,
  robots: { index: true, follow: true },
};

export default function DeleteAccountPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-bg px-4 py-10 text-brand-ink sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <header className="flex items-center justify-between">
            <Link href="/safety" aria-label={`${brand.name} home`} className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/40">
              <BrandLogo />
            </Link>
            <Link href="/safety" className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-4 py-2 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back
            </Link>
          </header>

          <div className="mt-10">
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Delete your account</h1>
            <p className="mt-3 leading-relaxed text-brand-ink-soft">
              We&apos;re sorry to see you go. Verify it&apos;s really you, review what will be removed, and confirm. It only takes a minute.
            </p>
          </div>

          <DeleteAccountFlow />
        </div>
      </main>
      <LegalFooter />
    </>
  );
}
