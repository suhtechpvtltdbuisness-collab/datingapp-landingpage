"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { brand, EASE, spring } from "../safety/theme";

type Topic = { id: string; emoji: string; title: string; text: string };

const topics: Topic[] = [
  {
    id: "communication",
    emoji: "💬",
    title: "Healthy Communication",
    text: "Learn how to communicate honestly, handle rejection respectfully, and have conversations about boundaries.",
  },
  {
    id: "red-flags",
    emoji: "🛡️",
    title: "Spot the Red Flags",
    text: "Understand common warning signs such as rushing intimacy, inconsistent stories, pressure, controlling behavior, or requests for money.",
  },
  {
    id: "catfishing",
    emoji: "🎭",
    title: "Catfishing & Fake Profiles",
    text: "Learn how to identify suspicious profiles and why you should take your time before trusting someone you've met online.",
  },
  {
    id: "scams",
    emoji: "💰",
    title: "Dating & Online Scams",
    text: "Know the warning signs when someone asks for money, financial information, gifts, or urgent help.",
  },
  {
    id: "privacy",
    emoji: "🔐",
    title: "Protect Your Privacy",
    text: "Tips for protecting your photos, personal information, passwords, OTPs, location, and other sensitive details.",
  },
  {
    id: "consent",
    emoji: "❤️",
    title: "Boundaries & Consent",
    text: "Understand that everyone has the right to set boundaries, change their mind, and say no without pressure.",
  },
];

export default function RealTalkGuide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(new Set([topics[0].id]));
  const active = topics[activeIndex];

  const open = (i: number) => {
    setActiveIndex(i);
    setSeen((prev) => new Set(prev).add(topics[i].id));
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-ink">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#8B2FC9] to-[#FF3D77] px-4 pb-32 pt-10 text-white sm:px-6">
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
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Awareness
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Real Talk Month</h1>
              <p className="mt-4 font-display text-xl font-bold italic">Real conversations. Safer connections.</p>
              <p className="mt-3 max-w-xl text-lg text-white/90">
                Dating comes with questions, boundaries, expectations, and sometimes uncomfortable situations. <strong>Real Talk Month</strong> gives{" "}
                {brand.name} members practical information to help them recognize warning signs, communicate clearly, and make safer choices online and
                offline.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[16/10] overflow-hidden rounded-card border-4 border-white/30 bg-gradient-to-br from-[#8B2FC9] to-[#FF3D77] shadow-2xl"
              >
                <Image src="/illustrations/campaign-awareness.svg" alt="" fill unoptimized sizes="40vw" className="object-cover" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-ink shadow-card"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-white">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold">{topics.length} topics to explore</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl space-y-6 px-4 pb-24 sm:px-6">
        {/* Topic explorer */}
        <section id="explorer" className="scroll-mt-6 rounded-card bg-white p-5 shadow-card sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-ink-soft">Pick a topic to explore</p>
            <p className="text-sm font-semibold text-brand-magenta">
              {seen.size} / {topics.length} explored
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-bg">
            <motion.div
              className="h-full rounded-full bg-brand-gradient"
              animate={{ width: `${(seen.size / topics.length) * 100}%` }}
              transition={spring}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Topic list */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {topics.map((t, i) => {
                const on = i === activeIndex;
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    onClick={() => open(i)}
                    aria-pressed={on}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors ${
                      on ? "border-transparent bg-brand-gradient text-white shadow-glow" : "border-brand-ink/10 bg-white hover:border-brand-magenta/30"
                    }`}
                  >
                    <span className="text-3xl" aria-hidden>
                      {t.emoji}
                    </span>
                    <span className={`font-display text-sm font-bold ${on ? "text-white" : "text-brand-ink"}`}>{t.title}</span>
                    {seen.has(t.id) && !on && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Active topic */}
            <div className="relative min-h-[320px] overflow-hidden rounded-card bg-brand-bg p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex h-full flex-col"
                >
                  <motion.span
                    initial={{ scale: 0.4, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={spring}
                    className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-5xl shadow-card"
                    aria-hidden
                  >
                    {active.emoji}
                  </motion.span>
                  <p className="mt-6 text-xs font-bold uppercase tracking-wide text-brand-magenta">
                    Topic {activeIndex + 1} of {topics.length}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-extrabold">{active.title}</h2>
                  <p className="mt-4 flex-1 text-lg leading-relaxed text-brand-ink-soft">{active.text}</p>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => open((activeIndex - 1 + topics.length) % topics.length)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-ink-soft shadow-card hover:text-brand-ink"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden /> Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => open((activeIndex + 1) % topics.length)}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow"
                    >
                      Next topic <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* All topics at a glance */}
        <section>
          <h2 className="mt-10 font-display text-2xl font-extrabold">All topics at a glance</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => {
                  open(i);
                  document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-card bg-white p-6 text-left shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span className="text-3xl" aria-hidden>
                  {t.emoji}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{t.text}</p>
              </motion.button>
            ))}
          </div>
        </section>

        <div className="flex justify-center pt-6">
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
