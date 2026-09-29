import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "../safety/theme";

export const metadata: Metadata = { title: `Privacy Policy | ${brand.name}` };

type Section = { title: string; body: ReactNode };

const sections: Section[] = [
  {
    title: "Information We Collect",
    body: (
      <>
        <p>Depending on how you use {brand.name}, we may collect:</p>
        <ul>
          <li><strong>Account information:</strong> name, email address, phone number, date of birth, and login information.</li>
          <li><strong>Profile information:</strong> profile photos, bio, interests, preferences, location, and other information you choose to add.</li>
          <li><strong>Dating activity:</strong> likes, matches, interactions, and profile preferences.</li>
          <li><strong>Messages:</strong> information associated with communications sent through {brand.name}.</li>
          <li><strong>Safety information:</strong> reports, blocks, complaints, verification information, and information needed to investigate safety issues.</li>
          <li><strong>Technical information:</strong> device information, IP address, browser/app information, and basic usage data.</li>
          <li><strong>Payment information:</strong> subscription and transaction information processed through the applicable payment provider.</li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    body: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Display and personalize your dating profile.</li>
          <li>Provide matching and discovery features.</li>
          <li>Enable likes, matches, and messaging.</li>
          <li>Verify profiles where verification is available.</li>
          <li>Prevent spam, fraud, abuse, and misuse.</li>
          <li>Process reports and safety complaints.</li>
          <li>Provide customer support.</li>
          <li>Process subscriptions and payments.</li>
          <li>Maintain, improve, and secure {brand.name}.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Location Information",
    body: <p>If you enable location-related features, {brand.name} may use location information to provide features such as distance-based discovery.</p>,
  },
  {
    title: "Photos and Profile Content",
    body: (
      <>
        <p>Photos, bios, interests, and other information you choose to add to your profile may be visible to other {brand.name} members according to your account and discovery settings.</p>
        <p>Do not upload information that you do not want other members to see.</p>
      </>
    ),
  },
  {
    title: "Messages and Safety Reports",
    body: (
      <>
        <p>Messages and safety reports may be processed to provide the messaging and safety features of {brand.name} and to investigate violations of our Terms or Community Guidelines.</p>
        <p>Safety reports and verification information may be reviewed by authorized team members when necessary for safety, moderation, or support.</p>
      </>
    ),
  },
  {
    title: "Sharing of Information",
    body: (
      <>
        <p>We do not make your personal information publicly available except where you choose to display information through your {brand.name} profile or where disclosure is otherwise permitted or required by applicable law.</p>
        <p>We may share information with service providers that help us operate {brand.name}, such as hosting, authentication, analytics, customer support, payment, and security providers.</p>
      </>
    ),
  },
  {
    title: "Data Security",
    body: (
      <>
        <p>We use reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, or disclosure.</p>
        <p>However, no online service can guarantee complete security.</p>
      </>
    ),
  },
  {
    title: "Your Choices and Privacy Rights",
    body: (
      <>
        <p>Depending on applicable law, you may be able to request access to, correction of, or deletion of your personal information and may have other rights regarding your data.</p>
        <p>Where we rely on your consent to process your information, you may withdraw that consent at any time by contacting us.</p>
      </>
    ),
  },
  {
    title: "Account Deletion",
    body: (
      <>
        <p>You can request deletion of your {brand.name} account through the available account settings or by contacting support.</p>
        <p>Some information may need to be retained for legitimate purposes such as legal compliance, fraud prevention, dispute resolution, or security.</p>
      </>
    ),
  },
  {
    title: "Children's Privacy",
    body: (
      <>
        <p><strong>{brand.name} is intended only for users aged 18 and above.</strong> We do not knowingly allow individuals under 18 to create or maintain dating accounts.</p>
        <p>If we become aware that an account belongs to someone under 18, we may take appropriate action, including removing the account.</p>
      </>
    ),
  },
  {
    title: "Changes to This Privacy Policy",
    body: (
      <>
        <p>We may update this Privacy Policy from time to time. When we make material changes, we may provide additional notice where appropriate.</p>
        <p>The <strong>Last Updated</strong> date at the top of this page will indicate when the policy was most recently changed.</p>
      </>
    ),
  },
  {
    title: "Contact Us",
    body: <p>If you have questions about this Privacy Policy, your account, or your personal information, contact {brand.name} through the support/contact option provided within the app or website.</p>,
  },
];

export default function PrivacyPage() {
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
        <h1 className="mt-6 font-display text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-2 text-sm font-semibold text-brand-ink-soft">Last updated: September 2026</p>
        <p className="mt-6 leading-relaxed text-brand-ink-soft">
          {brand.name} respects your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices available to you when you use {brand.name}.
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
      </article>
    </main>
  );
}
