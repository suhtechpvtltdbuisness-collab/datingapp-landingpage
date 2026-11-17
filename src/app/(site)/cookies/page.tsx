import Link from "next/link";
import { brand } from "../safety/theme";
import LegalFooter from "../safety/components/LegalFooter";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Cookie Policy | ${brand.name}`,
  description: `How ${brand.name} uses essential and analytics cookies, and how you can manage cookie settings in your browser.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
    <main className="min-h-screen bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
      <article className="mx-auto max-w-3xl rounded-card bg-white p-8 shadow-card sm:p-10">
        <Link href="/" className="text-sm font-semibold text-brand-magenta underline-offset-2 hover:underline">
          Back to Safety Centre
        </Link>
        <h1 className="mt-6 font-display text-4xl font-extrabold">Cookie Policy</h1>
        <p className="mt-4 leading-relaxed text-brand-ink-soft">
          {brand.name} may use cookies and similar technologies to keep the site reliable, remember preferences, and understand basic performance.
        </p>
        <section className="mt-8 space-y-4 leading-relaxed text-brand-ink-soft">
          <p>Essential cookies help pages load, secure sessions, and keep core website features working.</p>
          <p>Analytics cookies, when used, help us understand aggregated site performance and improve the experience.</p>
          <p>You can manage cookie settings through your browser controls.</p>
        </section>
      </article>
    </main>
    <LegalFooter />
    </>
  );
}
