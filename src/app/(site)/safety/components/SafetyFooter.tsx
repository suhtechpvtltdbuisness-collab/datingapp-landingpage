import { Heart, Users, MessageSquare, User } from "lucide-react";
import DownloadCtaBar from "./DownloadCtaBar";
import BrandLogo from "./BrandLogo";
import { brand } from "../theme";
import {
  company as defaultCompany,
  copyrightLine,
  socialLinks as defaultSocialLinks,
  storeLinks as defaultStoreLinks,
} from "@/lib/company";
import type { SiteCompany } from "@/lib/siteContent";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const navIcons = [
  { Icon: Heart, label: "Liked you", active: true },
  { Icon: Users, label: "People" },
  { Icon: MessageSquare, label: "Chat" },
  { Icon: User, label: "Profile" },
];

interface Props {
  company?: SiteCompany;
  storeLinks?: {
    googlePlayUrl?: string;
    appStoreUrl?: string;
    googlePlay?: string | null;
    appStore?: string | null;
  };
}

export default function SafetyFooter({ company, storeLinks }: Props) {
  const comp = company || defaultCompany;
  const playUrl =
    storeLinks?.googlePlayUrl ||
    storeLinks?.googlePlay ||
    defaultStoreLinks.googlePlay;
  const appStoreUrl =
    storeLinks?.appStoreUrl ||
    storeLinks?.appStore ||
    defaultStoreLinks.appStore;
  const igUrl = company?.instagram || defaultSocialLinks.instagram;
  const ytUrl = company?.youtube || defaultSocialLinks.youtube;
  const xUrl = company?.x || defaultSocialLinks.x;

  const groups: { title: string; links: FooterLink[] }[] = [
    {
      title: "Download",
      links: [
        ...(playUrl
          ? [{ label: "Google Play Store", href: playUrl, external: true }]
          : []),
        ...(appStoreUrl
          ? [{ label: "Apple App Store", href: appStoreUrl, external: true }]
          : [{ label: "App Store (Coming Soon)", href: "#download" }]),
      ],
    },
    {
      title: "Safety",
      links: [
        { label: "Safety tools", href: "/#features" },
        { label: "Premium plans", href: "/#plans" },
        { label: "Handbook", href: "/#handbook" },
        { label: "Report a problem", href: "/report-problem" },
        { label: "Community guidelines", href: "/#community" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blogs" },
        { label: "Contact", href: `mailto:${comp.supportEmail}` },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Cookies", href: "/cookies" },
        { label: "Child safety", href: "/child-safety" },
      ],
    },
    {
      title: "Socials",
      links: [
        ...(igUrl ? [{ label: "Instagram", href: igUrl, external: true }] : []),
        ...(ytUrl ? [{ label: "YouTube", href: ytUrl, external: true }] : []),
        ...(xUrl ? [{ label: "X", href: xUrl, external: true }] : []),
      ],
    },
  ];

  return (
    <footer className="pb-10 pt-8">
      <DownloadCtaBar />
      <div className="mx-auto mt-10 max-w-6xl sm:mt-16 px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLogo size="lg" withTagline />
            <p className="mt-4 font-brand text-lg italic text-brand-ink-soft">
              {brand.motto}
            </p>
            <ul
              className="mt-6 flex w-max gap-2 rounded-full bg-white p-2 shadow-card"
              aria-label="App sections"
            >
              {navIcons.map(({ Icon, label, active }) => (
                <li
                  key={label}
                  title={label}
                  className={`grid h-11 w-11 place-items-center rounded-full ${
                    active ? "bg-brand-gradient text-white" : "text-brand-ink-soft"
                  }`}
                >
                  <Icon
                    className="h-5 w-5"
                    aria-hidden
                    fill={active ? "currentColor" : "none"}
                  />
                  <span className="sr-only">{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-xs text-sm text-brand-ink-soft">
              Dating should feel exciting, not risky. We&apos;re building it that way.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {groups
              .filter((g) => g.links.length > 0)
              .map((g) => (
                <div key={g.title}>
                  <h2 className="font-display text-sm font-bold text-brand-ink">
                    {g.title}
                  </h2>
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
        <p className="mt-12 border-t border-brand-magenta/10 pt-6 text-xs text-brand-ink-soft">
          © {new Date().getFullYear()} {comp.legalName || "Suh Tech Private Limited"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
