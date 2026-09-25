"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import BrandLogo from "./BrandLogo";
import MagneticButton from "./MagneticButton";

const links = [
  { label: "Safety", href: "#features" },
  { label: "Premium", href: "#plans" },
  { label: "Support", href: "#faq" },
  { label: "Download", href: "#download" },
];

export default function SafetyNav() {
  const { scrollY } = useScroll();
  // Glass fades in smoothly across the bottom of the hero (roughly 200–520px of scroll).
  const bg = useTransform(scrollY, [200, 520], ["rgba(255,243,247,0)", "rgba(255,243,247,0.72)"]);
  const blur = useTransform(scrollY, [200, 520], ["blur(0px)", "blur(16px)"]);
  const shadow = useTransform(scrollY, [200, 520], ["0 0 0 rgba(139,47,201,0)", "0 8px 24px -12px rgba(139,47,201,0.25)"]);

  return (
    <motion.header
      style={{ backgroundColor: bg, backdropFilter: blur, WebkitBackdropFilter: blur, boxShadow: shadow }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="Velora Safety Centre, back to top" className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/40">
          <BrandLogo />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="rounded font-medium text-brand-ink-soft transition-colors hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <MagneticButton href="#download" size="sm">Get the App</MagneticButton>
      </nav>
    </motion.header>
  );
}
