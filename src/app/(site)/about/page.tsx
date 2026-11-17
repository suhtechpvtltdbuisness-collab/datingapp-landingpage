import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "../safety/theme";
import LegalFooter from "../safety/components/LegalFooter";
import { getSiteContent } from "@/lib/siteContent";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `About ${brand.name} | Safety-first dating app by ${company.legalName}`,
  description: `${brand.name} is a dating app built around safety: photo verification, easy reporting and blocking, and tools that keep you in control. Operated by ${company.legalName}.`,
  path: "/about",
});

export const revalidate = 30;

export default async function AboutPage() {
  const content = await getSiteContent();
  const comp = content.company;

  const details: { label: string; value: React.ReactNode }[] = [
    { label: "Legal name", value: comp.legalName },
    { label: "CIN", value: comp.cin },
    ...(comp.gstin ? [{ label: "GSTIN", value: comp.gstin }] : []),
    { label: "Registered office", value: comp.registeredOffice },
    {
      label: "Support email",
      value: (
        <a
          href={`mailto:${comp.supportEmail}`}
          className="font-semibold text-brand-magenta hover:underline"
        >
          {comp.supportEmail}
        </a>
      ),
    },
    {
      label: "Support phone",
      value: (
        <a
          href={`tel:${comp.supportPhone.replace(/[^+\d]/g, "")}`}
          className="font-semibold text-brand-magenta hover:underline"
        >
          {comp.supportPhone}
        </a>
      ),
    },
  ];

  return (
    <>
      <main className="bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
        <article className="mx-auto max-w-3xl rounded-card bg-white p-8 shadow-card sm:p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-4 py-2 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Safety Centre
          </Link>
          <h1 className="mt-6 font-display text-4xl font-extrabold">
            About {brand.name}
          </h1>
          <p className="mt-4 text-lg font-semibold leading-relaxed text-brand-ink">
            {brand.name} is a product of {comp.legalName}.
          </p>
          <p className="mt-3 leading-relaxed text-brand-ink-soft">
            {brand.name} is a dating app built around safety: photo verification, easy reporting and blocking, and tools that keep you in control of who you talk to. Read more in our{" "}
            <Link
              href="/"
              className="font-semibold text-brand-magenta hover:underline"
            >
              Safety Centre
            </Link>
            .
          </p>

          <h2 className="mt-10 font-display text-xl font-bold">Company details</h2>
          <dl className="mt-4 divide-y divide-brand-magenta/10 rounded-2xl bg-brand-bg px-5">
            {details.map((d) => (
              <div
                key={d.label}
                className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]"
              >
                <dt className="text-sm font-semibold text-brand-ink-soft">
                  {d.label}
                </dt>
                <dd className="break-words text-brand-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </main>
      <LegalFooter />
    </>
  );
}
