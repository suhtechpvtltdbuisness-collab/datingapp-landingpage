import Link from "next/link";
import { brand } from "../safety/theme";
import LegalFooter from "../safety/components/LegalFooter";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

const linkClass = "font-semibold text-brand-magenta underline-offset-2 hover:underline";
const External = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{children}</a>
);

export const metadata = pageMetadata({
  title: `Cookie Policy | ${brand.name}`,
  description: `How the ${brand.name} website uses Google Analytics 4 cookies only with your consent, and how to change your choice.`,
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
        <p className="mt-2 text-sm font-semibold text-brand-ink-soft">Last updated: 18 November 2026</p>
        <p className="mt-4 leading-relaxed text-brand-ink-soft">
          This policy explains how the {brand.name} website (<strong className="text-brand-ink">{company.domain}</strong>) uses cookies and similar technologies. It covers the website only. For how the {brand.name} app handles your data, see our{" "}
          <Link href="/privacy" className={linkClass}>Privacy Policy</Link>.
        </p>

        <section className="mt-8 space-y-3 leading-relaxed text-brand-ink-soft">
          <h2 className="font-display text-xl font-bold text-brand-ink">Strictly necessary storage</h2>
          <p>
            The public pages do not need cookies to work. We store your cookie choice (accepted or rejected) in your browser&rsquo;s local storage under the name <code>vellora_consent_v1</code>, so we don&rsquo;t ask you again on every visit. Our staff admin area uses a session cookie to keep authorised staff signed in; visitors never receive it.
          </p>
        </section>

        <section className="mt-8 space-y-3 leading-relaxed text-brand-ink-soft">
          <h2 className="font-display text-xl font-bold text-brand-ink">Analytics: Google Analytics 4 (only with your consent)</h2>
          <p>
            If you choose <strong>Accept analytics</strong>, we load Google Analytics 4, a web analytics service provided by Google, to understand how the website is used and to improve it. Until you accept, Google Analytics is not loaded and no analytics data is sent to Google. If you choose <strong>Reject</strong>, or ignore the banner, it stays off.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Cookies set:</strong> <code>_ga</code> and <code>_ga_&lt;ID&gt;</code>, which Google uses to tell visits and visitors apart. Google&rsquo;s documentation says they last up to two years by default.</li>
            <li><strong>What is measured:</strong> pages viewed, scrolling, clicks on links that leave the site, file downloads, form and video interactions (as provided by GA4&rsquo;s standard measurement), and our own events when you click a store download button, a premium plan button, or a contact link (email or phone).</li>
            <li><strong>What Google receives:</strong> these events together with technical information your browser sends, such as device, browser, language and approximate location. Google may process this data on servers in other countries.</li>
            <li><strong>What we do not send:</strong> we do not deliberately send your name, email address, phone number, password or other account details to Google Analytics. We do not use Google Analytics for advertising, and we turn Google&rsquo;s advertising storage options off.</li>
          </ul>
          <p>
            Google acts as a service provider for us, and also has its own terms. See{" "}
            <External href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use its services</External> and{" "}
            <External href="https://policies.google.com/privacy">Google&rsquo;s Privacy Policy</External>.
          </p>
        </section>

        <section className="mt-8 space-y-3 leading-relaxed text-brand-ink-soft">
          <h2 className="font-display text-xl font-bold text-brand-ink">Your choices</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Change your mind at any time with <strong>Cookie settings</strong> in the footer of any page. If you withdraw consent, we stop sending analytics data and remove the Google Analytics cookies from your browser where we are able to; data already sent to Google is handled under Google&rsquo;s own retention settings.
            </li>
            <li>You can also block or delete cookies in your browser settings, or install Google&rsquo;s <External href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</External>.</li>
          </ul>
          <p>
            Questions? Email <a href={`mailto:${company.supportEmail}`} className={linkClass}>{company.supportEmail}</a>.
          </p>
        </section>
      </article>
    </main>
    <LegalFooter />
    </>
  );
}
