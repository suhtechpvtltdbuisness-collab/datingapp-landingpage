import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "../safety/theme";

export const metadata: Metadata = { title: `Terms of Service | ${brand.name}` };

const linkClass = "font-semibold text-brand-magenta underline-offset-2 hover:underline";

type Section = { title: string; body: ReactNode };

const sections: Section[] = [
  {
    title: `Using ${brand.name}`,
    body: (
      <>
        <p>{brand.name} is a dating and social connection platform that allows users to create profiles, discover other members, like profiles, match, and communicate through the app.</p>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate and truthful information.</li>
          <li>Keep your account information secure.</li>
          <li>Use {brand.name} respectfully and responsibly.</li>
          <li>Follow applicable laws and {brand.name}&apos;s Community Guidelines.</li>
          <li>Interact with other members respectfully.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Eligibility",
    body: (
      <>
        {/* <p>You must meet {brand.name}&apos;s minimum age requirement to create an account and use its dating features.</p> */}
        <p>You must be 18 or older to use {brand.name}.</p>
        <p>You must not create an account using someone else&apos;s identity or information.</p>
      </>
    ),
  },
  {
    title: "Your Profile",
    body: (
      <>
        <p>You are responsible for the information, photos, prompts, and other content you add to your profile.</p>
        <p>Do not upload:</p>
        <ul>
          <li>Fake or misleading information</li>
          <li>Someone else&apos;s photos without permission</li>
          <li>Harassing, hateful, or abusive content</li>
          <li>Illegal or harmful content</li>
          <li>Content that violates another person&apos;s privacy or rights</li>
        </ul>
      </>
    ),
  },
  {
    title: "Matching & Messaging",
    body: (
      <>
        <p>{brand.name} allows members to like profiles, match with other members, and communicate through available messaging features.</p>
        <p>A match does not guarantee that another member will respond or meet you offline. Use good judgment when communicating or meeting someone you met through {brand.name}.</p>
        <p>Never share sensitive personal information with someone you do not trust.</p>
      </>
    ),
  },
  {
    title: "Safety, Reporting & Blocking",
    body: (
      <>
        <p>You can use {brand.name}&apos;s <strong>Report</strong> and <strong>Block</strong> features when you encounter inappropriate, abusive, suspicious, or unwanted behavior.</p>
        <p>We may review reported activity and take appropriate action, including restricting, suspending, or removing an account when necessary.</p>
        <p>
          For more information, visit the{" "}
          <Link href="/safety" className={linkClass}>
            {brand.name} Safety Centre
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "Prohibited Activities",
    body: (
      <>
        <p>You must not use {brand.name} to:</p>
        <ul>
          <li>Harass, threaten, stalk, or intimidate others.</li>
          <li>Impersonate another person.</li>
          <li>Scam, defraud, or deceive other members.</li>
          <li>Send spam or unwanted promotional messages.</li>
          <li>Attempt to gain unauthorized access to another account.</li>
          <li>Use {brand.name} for illegal activities.</li>
          <li>Circumvent account restrictions or safety measures.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Account Suspension or Removal",
    body: (
      <>
        <p>We may limit, suspend, or remove accounts that violate these Terms, Community Guidelines, safety requirements, or applicable laws.</p>
        <p>We may also take action when necessary to protect users, the platform, or the integrity of our services.</p>
      </>
    ),
  },
  {
    title: "Subscriptions & Payments",
    body: (
      <>
        <p>Some {brand.name} features may require a paid subscription.</p>
        <p>If you purchase a subscription, charges and renewals are handled through the applicable app store or payment provider. Subscriptions may automatically renew until cancelled according to the terms of the provider used for the purchase.</p>
        <p>Please review the applicable billing provider&apos;s cancellation and refund policies.</p>
      </>
    ),
  },
  {
    title: "Privacy",
    body: (
      <p>
        Your use of {brand.name} is also subject to our{" "}
        <Link href="/privacy" className={linkClass}>
          Privacy Policy
        </Link>
        , which explains how we collect, use, store, and protect your information.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    body: <p>We may update these Terms from time to time. When changes are made, we may update the <strong>Last Updated</strong> date and provide additional notice where appropriate.</p>,
  },
  {
    title: "Contact Us",
    body: <p>If you have questions about these Terms or your {brand.name} account, contact us through the support/contact option provided within {brand.name}.</p>,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
      <article className="mx-auto max-w-3xl rounded-card bg-white p-8 shadow-card sm:p-10">
        <Link
          href="/safety"
          className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-4 py-2 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Safety Centre
        </Link>
        <h1 className="mt-6 font-display text-4xl font-extrabold">Terms of Service</h1>
        <p className="mt-2 text-sm font-semibold text-brand-ink-soft">Last updated: September 2026</p>
        <p className="mt-6 leading-relaxed text-brand-ink-soft">
          Welcome to <strong className="text-brand-ink">{brand.name}</strong>. By creating an account or using {brand.name}, you agree to these Terms of Service. Please read them carefully before using the platform.
        </p>

        {sections.map((section, i) => (
          <section key={section.title} className="mt-10">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              {i + 1}. {section.title}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-brand-ink-soft [&_strong]:text-brand-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6">
              {section.body}
            </div>
          </section>
        ))}

        <p className="mt-12 rounded-2xl bg-brand-bg p-5 font-semibold leading-relaxed text-brand-ink">
          By using {brand.name}, you acknowledge that you have read and agree to these Terms of Service.
        </p>
      </article>
    </main>
  );
}
