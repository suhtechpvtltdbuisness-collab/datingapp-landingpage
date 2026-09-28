import { Heart, Users, MessageSquare, User } from "lucide-react";
import DownloadCtaBar from "./DownloadCtaBar";
import BrandLogo from "./BrandLogo";
import { brand } from "../theme";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Safety",
    links: [
      { label: "Safety tools", href: "#features" },
      { label: "Premium plans", href: "#plans" },
      { label: "Handbook", href: "#handbook" },
      { label: "Report a problem", href: "/report-problem" },
      { label: "Community guidelines", href: "#community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Contact", href: "mailto:support@vellora.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/", external: true },
      { label: "YouTube", href: "https://www.youtube.com/@velloraapp", external: true },
      { label: "X", href: "https://x.com/velloraapp", external: true },
    ],
  },
];

const navIcons = [
  { Icon: Heart, label: "Liked you", active: true },
  { Icon: Users, label: "People" },
  { Icon: MessageSquare, label: "Chat" },
  { Icon: User, label: "Profile" },
];

export default function SafetyFooter() {
  return (
    <footer className="pb-10 pt-8">
      <DownloadCtaBar />
      <div className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLogo size="lg" withTagline />
            <p className="mt-4 font-brand text-lg italic text-brand-ink-soft">{brand.motto}</p>
            <ul className="mt-6 flex w-max gap-2 rounded-full bg-white p-2 shadow-card" aria-label="App sections">
              {navIcons.map(({ Icon, label, active }) => (
                <li key={label} title={label} className={`grid h-11 w-11 place-items-center rounded-full ${active ? "bg-brand-gradient text-white" : "text-brand-ink-soft"}`}>
                  <Icon className="h-5 w-5" aria-hidden fill={active ? "currentColor" : "none"} />
                  <span className="sr-only">{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-xs text-sm text-brand-ink-soft">Dating should feel exciting, not risky. We're building it that way.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className="font-display text-sm font-bold text-brand-ink">{g.title}</h2>
                <ul className="mt-3 space-y-2">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noreferrer" : undefined}
                        className="rounded text-sm text-brand-ink-soft hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="mt-12 border-t border-brand-magenta/10 pt-6 text-xs text-brand-ink-soft">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
