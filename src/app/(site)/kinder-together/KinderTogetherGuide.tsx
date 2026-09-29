"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Hand, Heart, HeartHandshake, MessageCircleHeart, Sparkles, Users, type LucideIcon } from "lucide-react";
import { brand, EASE, spring } from "../safety/theme";

type Principle = {
  id: string;
  icon: LucideIcon;
  title: string;
  lead?: string;
  items: string[];
};

const principles: Principle[] = [
  {
    id: "respect",
    icon: MessageCircleHeart,
    title: "Treat People With Respect",
    items: [
      "Be respectful, even when you're not interested.",
      "Accept “no” without arguing or pressuring.",
      "Avoid harassment, insults, threats, or hateful behavior.",
      "Remember that there is a real person behind every profile.",
    ],
  },
  {
    id: "boundaries",
    icon: Hand,
    title: "Respect Boundaries",
    lead: "Consent and comfort matter at every step.",
    items: [
      "Don't pressure someone to share personal information.",
      "Don't pressure someone to meet, continue chatting, or share photos.",
      "Respect someone's decision to end a conversation or date.",
      "Give others the same space and respect you expect.",
    ],
  },
];

const values = [
  { icon: Heart, label: "Comfortable" },
  { icon: Users, label: "Heard" },
  { icon: Hand, label: "Free to set boundaries" },
];

const total = principles.reduce((n, p) => n + p.items.length, 0);

export default function KinderTogetherGuide() {
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const [pledged, setPledged] = useState(false);
  const progress = agreed.size / total;
  const allAgreed = agreed.size === total;

  const toggle = (key: string) => {
    const next = new Set(agreed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setAgreed(next);
    if (next.size < total) setPledged(false);
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-ink">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#E0299B] to-[#8B2FC9] px-4 pb-32 pt-10 text-white sm:px-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-white/10" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/safety#community"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Safety Centre
          </Link>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-magenta">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Community
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Kinder Together</h1>
              <p className="mt-4 max-w-xl font-display text-xl font-bold text-white">
                A kinder dating community starts with how we treat each other.
              </p>
              <p className="mt-3 max-w-xl text-lg text-white/90">
                {brand.name} is built around respectful connections. Everyone deserves to feel comfortable, heard, and free to set their own
                boundaries.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {values.map(({ icon: ValueIcon, label }, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: EASE }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"
                  >
                    <ValueIcon className="h-4 w-4" aria-hidden />
                    {label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[16/10] overflow-hidden rounded-card border-4 border-white/30 bg-gradient-to-br from-[#E0299B] to-[#8B2FC9] shadow-2xl"
              >
                <Image src="/illustrations/campaign-community.svg" alt="" fill unoptimized sizes="40vw" className="object-cover" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-ink shadow-card"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-white">
                  <HeartHandshake className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold">Real people, real respect</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-16 max-w-4xl space-y-6 px-4 pb-24 sm:px-6">
        {/* Progress */}
        <div className="rounded-card bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-ink-soft">Tap each one you agree with</p>
            <p className="text-sm font-semibold text-brand-magenta">
              {agreed.size} / {total}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-bg">
            <motion.div className="h-full rounded-full bg-brand-gradient" animate={{ width: `${progress * 100}%` }} transition={spring} />
          </div>
        </div>

        {principles.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.section
              key={p.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="rounded-card bg-white p-6 shadow-card sm:p-8"
            >
              <div className="flex items-start gap-4">
                <motion.span
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={spring}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow"
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </motion.span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">Principle {i + 1}</p>
                  <h2 className="font-display text-2xl font-extrabold">{p.title}</h2>
                </div>
              </div>
              {p.lead && (
                <p className="mt-5 rounded-2xl border-l-4 border-brand-magenta bg-brand-bg px-4 py-3 font-display text-lg font-bold">{p.lead}</p>
              )}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.items.map((item) => {
                  const key = `${p.id}:${item}`;
                  const on = agreed.has(key);
                  return (
                    <motion.button
                      key={item}
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={on}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      transition={spring}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                        on ? "border-brand-magenta/40 bg-brand-bg" : "border-brand-ink/10 hover:border-brand-magenta/30"
                      }`}
                    >
                      <motion.span
                        animate={{ scale: on ? [1, 1.25, 1] : 1 }}
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                          on ? "border-transparent bg-brand-gradient text-white" : "border-brand-ink/20"
                        }`}
                      >
                        {on && <Heart className="h-3 w-3 fill-current" aria-hidden />}
                      </motion.span>
                      <span className={on ? "text-brand-ink" : "text-brand-ink-soft"}>{item}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}

        {/* Pledge */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-card bg-brand-gradient p-8 text-center text-white shadow-glow sm:p-10"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" aria-hidden />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10" aria-hidden />
          <AnimatePresence mode="wait">
            {pledged ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="relative">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-brand-magenta"
                >
                  <Check className="h-8 w-8" strokeWidth={3} aria-hidden />
                </motion.span>
                <h2 className="mt-5 font-display text-3xl font-extrabold">Thank you for being kind 💖</h2>
                <p className="mx-auto mt-3 max-w-md text-white/90">You&apos;re helping make {brand.name} a place where everyone feels safe and respected.</p>
              </motion.div>
            ) : (
              <motion.div key="pledge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <HeartHandshake className="mx-auto h-12 w-12" aria-hidden />
                <h2 className="mt-4 font-display text-3xl font-extrabold">Take the Kindness Pledge</h2>
                <p className="mx-auto mt-3 max-w-md text-white/90">
                  {allAgreed ? "You've agreed to every principle. Make it official!" : `Agree to all ${total} principles above to unlock the pledge.`}
                </p>
                <motion.button
                  type="button"
                  disabled={!allAgreed}
                  onClick={() => setPledged(true)}
                  whileHover={allAgreed ? { scale: 1.04 } : undefined}
                  whileTap={allAgreed ? { scale: 0.96 } : undefined}
                  transition={spring}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-display font-semibold text-brand-magenta shadow-card disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Heart className="h-4 w-4" aria-hidden />
                  I pledge to be kind
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <div className="flex justify-center pt-4">
          <Link
            href="/safety"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display font-semibold text-brand-magenta shadow-card transition-shadow hover:shadow-card-hover"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Safety Centre
          </Link>
        </div>
      </div>
    </main>
  );
}
