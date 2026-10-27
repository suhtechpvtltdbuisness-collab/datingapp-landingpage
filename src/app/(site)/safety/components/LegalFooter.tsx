import Link from "next/link";
import { company, copyrightLine } from "@/lib/company";

const links = [
  { label: "About", href: "/about" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Delete account", href: "/delete" },
];

/** Compact footer for pages that don't carry the full SafetyFooter. */
export default function LegalFooter() {
  return (
    <footer className="bg-brand-bg px-4 pb-10 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 border-t border-brand-magenta/10 pt-6 text-xs text-brand-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p>{copyrightLine}</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-magenta">
              {l.label}
            </Link>
          ))}
          <a href={`mailto:${company.supportEmail}`} className="hover:text-brand-magenta">
            {company.supportEmail}
          </a>
        </nav>
      </div>
    </footer>
  );
}
