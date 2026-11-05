"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ShieldCheck, Sparkles, HelpCircle, Download, Lock } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { brand } from "../theme";
import MagneticButton from "./MagneticButton";

const links = [
  { label: "Safety Tools", href: "#features", icon: ShieldCheck },
  { label: "Premium Plans", href: "#plans", icon: Sparkles },
  { label: "Support & FAQ", href: "#faq", icon: HelpCircle },
  { label: "Download App", href: "#download", icon: Download },
];

export default function SafetyNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  // Glass fades in smoothly across the bottom of the hero (roughly 200–520px of scroll).
  const bg = useTransform(scrollY, [200, 520], ["rgba(255,243,247,0)", "rgba(255,243,247,0.92)"]);
  const blur = useTransform(scrollY, [200, 520], ["blur(0px)", "blur(16px)"]);
  const shadow = useTransform(scrollY, [200, 520], ["0 0 0 rgba(139,47,201,0)", "0 8px 24px -12px rgba(139,47,201,0.25)"]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Smooth scroll handler for anchor links
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = href;
      }
    }
  };

  return (
    <motion.header
      style={{
        backgroundColor: mobileOpen ? "#FFF3F7" : bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        boxShadow: mobileOpen ? "0 4px 20px rgba(0,0,0,0.06)" : shadow,
      }}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-200"
    >
      <nav aria-label="Main" className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3.5 sm:px-6">
        <a
          href="#top"
          onClick={(e) => handleNavigate(e, "#top")}
          aria-label={`${brand.name} — back to top`}
          className="rounded-full shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/40"
        >
          <BrandLogo />
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-7 lg:gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={(e) => handleNavigate(e, l.href)}
                className="rounded font-medium text-brand-ink-soft transition-colors hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Hide Login and Get App on mobile ONLY while the drawer is open */}
          <div className={`items-center gap-1.5 sm:gap-3 ${mobileOpen ? "hidden md:flex" : "flex"}`}>
            <a
              href="/admin"
              className="rounded px-1.5 py-1 text-xs sm:text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40"
            >
              Login
            </a>

            <MagneticButton href="#download" size="sm" className="!px-3 !py-1.5 text-xs sm:!px-5 sm:!py-2.5 sm:text-sm">
              <span className="hidden sm:inline">Get the App</span>
              <span className="sm:hidden">Get App</span>
            </MagneticButton>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-brand-ink shadow-sm transition hover:bg-white active:scale-95 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5 text-brand-ink" /> : <Menu className="h-5 w-5 text-brand-ink" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="relative md:hidden">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-14 sm:top-16 z-40 bg-black/45 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide Down Opaque Drawer Container */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-50 border-b border-pink-200/80 bg-[#FFF3F7] px-4 pb-6 pt-3 shadow-2xl"
            >
              <div className="space-y-1.5">
                {links.map((l) => {
                  const Icon = l.icon;
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={(e) => handleNavigate(e, l.href)}
                      className="flex items-center gap-3 rounded-2xl bg-white/50 px-4 py-3 text-[14.5px] font-semibold text-brand-ink transition-colors hover:bg-white hover:text-brand-magenta active:bg-white"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-brand-magenta">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1">{l.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-ink-soft/40" />
                    </a>
                  );
                })}

                <a
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-2xl bg-white/50 px-4 py-3 text-[14.5px] font-semibold text-brand-ink transition-colors hover:bg-white hover:text-brand-purple active:bg-white"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-brand-purple">
                    <Lock className="h-4 w-4" />
                  </div>
                  <span className="flex-1">Admin Dashboard Login</span>
                  <ArrowRight className="h-3.5 w-3.5 text-brand-ink-soft/40" />
                </a>
              </div>

              {/* Download Action at the Bottom */}
              <div className="mt-4 pt-3.5 border-t border-black/[0.06]">
                <a
                  href="#download"
                  onClick={(e) => handleNavigate(e, "#download")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient py-3 text-center text-[14px] font-bold text-white shadow-md transition hover:opacity-95 active:scale-98"
                >
                  <Download className="h-4 w-4" />
                  <span>Get Vellora App Now</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
