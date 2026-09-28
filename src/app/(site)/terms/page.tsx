import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "../safety/theme";

export const metadata: Metadata = { title: `Terms of Service | ${brand.name}` };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
      <article className="mx-auto max-w-3xl rounded-card bg-white p-8 shadow-card sm:p-10">
        <Link href="/safety" className="text-sm font-semibold text-brand-magenta underline-offset-2 hover:underline">
          Back to Safety Centre
        </Link>
        <h1 className="mt-6 font-display text-4xl font-extrabold">Terms of Service</h1>
        <p className="mt-4 leading-relaxed text-brand-ink-soft">
          These terms explain the basic rules for using {brand.name}: be honest, respect other members, do not misuse the service, and follow applicable laws.
        </p>
        <section className="mt-8 space-y-4 leading-relaxed text-brand-ink-soft">
          <p>You are responsible for the information you share and the way you interact with people on the platform.</p>
          <p>We may limit, suspend, or remove accounts that violate safety rules, community standards, or legal requirements.</p>
          <p>Subscriptions, if available, renew until cancelled through the app store or billing provider used at purchase.</p>
        </section>
      </article>
    </main>
  );
}
