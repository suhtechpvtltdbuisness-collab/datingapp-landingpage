import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "../safety/theme";
import { company } from "@/lib/company";
import LegalFooter from "../safety/components/LegalFooter";

export const metadata: Metadata = {
  title: `Child Safety Standards | ${brand.name}`,
  description: `${brand.name}'s standards against child sexual abuse and exploitation (CSAE), and how to report a concern.`,
};

const LAST_UPDATED = "3 November 2026";

const linkClass = "font-semibold text-brand-magenta underline-offset-2 hover:underline";
const Mail = ({ to }: { to: string }) => (
  <a href={`mailto:${to}`} className={linkClass}>
    {to}
  </a>
);
const External = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    {children}
  </a>
);

type Section = { id: string; title: string; body: ReactNode };

const sections: Section[] = [
  {
    id: "our-commitment",
    title: "Our Commitment",
    body: (
      <>
        <p>
          {brand.name} is a dating app for adults, operated by <strong>{company.legalName}</strong>. We have <strong>zero tolerance</strong> for child sexual abuse and exploitation (CSAE) and child sexual abuse material (CSAM) of any kind.
        </p>
        <p>
          These standards apply to everyone who uses the {brand.name} app and website, and to all content shared on them, including profiles, photos, bios and messages.
        </p>
      </>
    ),
  },
  {
    id: "adults-only",
    title: "Adults Only (18+)",
    body: (
      <ul>
        <li>You must be at least <strong>18 years old</strong> to create an account or use {brand.name}.</li>
        <li>Every member must give their date of birth when signing up. Anyone under 18 cannot complete sign-up.</li>
        <li>Lying about your age is a breach of our Terms and leads to the account being removed.</li>
        <li>If we learn or have reason to believe that an account belongs to someone under 18, we suspend it immediately and delete it.</li>
      </ul>
    ),
  },
  {
    id: "prohibited",
    title: "What Is Prohibited",
    body: (
      <>
        <p>The following are strictly prohibited on {brand.name}:</p>
        <ul>
          <li>Any child sexual abuse material (CSAM), including images, videos, drawings, AI-generated or edited content that sexualises a minor.</li>
          <li>Grooming, or any attempt to contact, befriend or build trust with a minor for sexual purposes.</li>
          <li>Sexualising minors in any way, including in text, comments or role-play.</li>
          <li>Sextortion, or threatening to share intimate images of a minor.</li>
          <li>Trafficking, or advertising or soliciting a minor for sexual purposes.</li>
          <li>Sharing links to, or asking for, any of the content above.</li>
          <li>Using {brand.name} to arrange to meet a minor.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-to-report",
    title: "How to Report a Concern",
    body: (
      <>
        <p>If you see anything that may involve the abuse or exploitation of a child, or a member who may be under 18, please tell us straight away:</p>
        <ul>
          <li>
            <strong>In the app:</strong> open the person&rsquo;s profile or chat, tap <em>Report</em>, choose the reason that fits best and describe the concern in the comment box.
          </li>
          <li>
            <strong>By email:</strong> write to <Mail to={company.supportEmail} /> with the subject &ldquo;Child safety&rdquo;. Include the member&rsquo;s name and any details that help us find the profile. Please do not attach or forward illegal images.
          </li>
          <li>
            <strong>On our website:</strong> use the <Link href="/report-problem" className={linkClass}>Report a problem</Link> page.
          </li>
        </ul>
        <p>
          If a child is in immediate danger, contact the police first. In India, call <strong>112</strong> (emergency) or <strong>1098</strong> (Childline), or report online at <External href="https://cybercrime.gov.in">cybercrime.gov.in</External>. Elsewhere, you can report CSAM to <External href="https://report.cybertip.org">NCMEC&rsquo;s CyberTipline</External>.
        </p>
      </>
    ),
  },
  {
    id: "what-we-do",
    title: "What We Do When We Receive a Report",
    body: (
      <ul>
        <li>Child safety reports are given the highest priority and reviewed by our team as quickly as possible.</li>
        <li>We remove the content and suspend or permanently ban the accounts involved.</li>
        <li>We preserve relevant information as required by law so it can be provided to the authorities.</li>
        <li>
          We report CSAM and child exploitation to the relevant authorities, including Indian law enforcement under the Protection of Children from Sexual Offences (POCSO) Act and the Information Technology Act, and the National Center for Missing &amp; Exploited Children (NCMEC) where appropriate.
        </li>
        <li>We cooperate fully with law enforcement investigations.</li>
      </ul>
    ),
  },
  {
    id: "legal-compliance",
    title: "Compliance With the Law",
    body: (
      <p>
        {company.legalName} complies with all applicable child safety laws, including India&rsquo;s POCSO Act 2012, the Information Technology Act 2000 and the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, as well as the laws of the other countries where {brand.name} is available.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Child Safety Contact",
    body: (
      <>
        <p>Our designated point of contact for child safety matters, including requests from law enforcement and Google Play, is:</p>
        <ul>
          <li><strong>Company:</strong> {company.legalName}</li>
          <li><strong>Email:</strong> <Mail to={company.supportEmail} /></li>
          <li><strong>Phone:</strong> {company.supportPhone}</li>
          <li><strong>Address:</strong> {company.registeredOffice}</li>
        </ul>
      </>
    ),
  },
];

export default function ChildSafetyPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
        <article className="mx-auto max-w-3xl rounded-card bg-white p-6 shadow-card sm:p-10">
          <Link
            href="/safety"
            className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-4 py-2 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Safety Centre
          </Link>
          <h1 className="mt-6 font-display text-4xl font-extrabold">Child Safety Standards</h1>
          <p className="mt-2 text-sm font-semibold text-brand-ink-soft">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 leading-relaxed text-brand-ink-soft">
            {brand.name} is for adults only. This page sets out our standards against child sexual abuse and exploitation, and explains how to report a concern.
          </p>

          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-8">
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
      <LegalFooter />
    </>
  );
}
