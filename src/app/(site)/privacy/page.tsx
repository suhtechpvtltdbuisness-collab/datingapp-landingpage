import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "../safety/theme";

export const metadata: Metadata = { title: `Privacy Policy | ${brand.name}` };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
      <article className="mx-auto max-w-3xl rounded-card bg-white p-8 shadow-card sm:p-10">
        <Link href="/safety" className="text-sm font-semibold text-brand-magenta underline-offset-2 hover:underline">
          Back to Safety Centre
        </Link>
        <h1 className="mt-6 font-display text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-4 leading-relaxed text-brand-ink-soft">
          This policy summarizes how {brand.name} handles account, profile, safety, and support information.
        </p>
        <section className="mt-8 space-y-4 leading-relaxed text-brand-ink-soft">
          <p>We use profile and activity data to provide matching, messaging, verification, support, and safety features.</p>
          <p>Safety reports and verification signals may be reviewed by trained team members to help protect the community.</p>
          <p>You can contact support to ask about account access, correction, deletion, or privacy questions.</p>
        </section>
      </article>
    </main>
  );
}
