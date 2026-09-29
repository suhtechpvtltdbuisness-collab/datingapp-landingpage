"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Ban,
  Check,
  Clock,
  Coffee,
  DoorOpen,
  EyeOff,
  Flag,
  Heart,
  MessageCircle,
  Phone,
  ShieldAlert,
  Siren,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { brand, EASE, spring } from "../safety/theme";

type Tip = {
  id: string;
  icon: LucideIcon;
  title: string;
  lead: string;
  intro?: string;
  items: string[];
  note?: string;
};

const tips: Tip[] = [
  {
    id: "before-you-meet",
    icon: MessageCircle,
    title: "Before You Meet",
    lead: "Take your time.",
    intro:
      "Get to know someone through the app before deciding to meet in person.",
    items: [
      `Keep your first conversations on ${brand.name}.`,
      "Don't feel pressured to share personal information.",
      "Look for consistent and genuine profile information.",
      "Be cautious if someone asks for money, financial information, or favors.",
    ],
  },
  {
    id: "plan-your-date",
    icon: Coffee,
    title: "Plan Your First Date Safely",
    lead: "Choose a public place.",
    items: [
      "Meet at a busy café, restaurant, mall, or other public location.",
      "Arrange your own transportation whenever possible.",
      "Tell a trusted friend or family member where you're going.",
      "Share your planned meeting location and expected return time.",
      "Consider arranging a check-in with someone you trust.",
    ],
  },
  {
    id: "protect-your-info",
    icon: EyeOff,
    title: "Protect Your Personal Information",
    lead: "Your privacy matters.",
    intro: "Avoid sharing sensitive information such as:",
    items: [
      "Home address",
      "Passwords or OTPs",
      "Bank or payment details",
      "Government ID numbers",
      "Private photographs you don't want shared",
      "Real-time location with someone you don't trust",
    ],
    note: "Remember: You never owe anyone personal information.",
  },
  {
    id: "trust-your-instincts",
    icon: Heart,
    title: "Trust Your Instincts",
    lead: "If something feels wrong, you can leave.",
    intro:
      "You don't need to continue a conversation or date just because you matched.",
    items: [],
    note: "Your safety is more important than being polite.",
  },
  {
    id: "red-flags",
    icon: TriangleAlert,
    title: "Watch for Red Flags",
    lead: "Be careful if someone:",
    items: [
      `Quickly asks to move the conversation off ${brand.name}.`,
      "Pressures you to meet immediately.",
      "Asks for money or financial help.",
      "Avoids reasonable questions about their identity.",
      "Becomes controlling, threatening, or abusive.",
      "Pressures you to share private photos or information.",
      "Repeatedly ignores your boundaries.",
    ],
  },
  {
    id: "during-your-date",
    icon: Clock,
    title: "During Your Date",
    lead: "Keep control of your own plans.",
    items: [
      "Keep your phone charged.",
      "Stay in a public place.",
      "Keep your belongings with you.",
      "Don't accept pressure to go somewhere you don't want to go.",
      "Leave if you feel uncomfortable or unsafe.",
    ],
  },
  {
    id: "something-went-wrong",
    icon: Flag,
    title: "Something Went Wrong?",
    lead: `You can report or block someone directly in ${brand.name}.`,
    items: [],
    note: "When reporting, provide relevant information if you're comfortable doing so.",
  },
  {
    id: "immediate-danger",
    icon: Siren,
    title: "If You're in Immediate Danger",
    lead: `${brand.name} cannot provide emergency response.`,
    items: [],
  },
];

const exitSteps = [
  { icon: Ban, label: "Block", text: "Stop all further contact instantly." },
  { icon: Flag, label: "Report", text: "Tell us what happened so we can act." },
  {
    icon: DoorOpen,
    label: "Leave",
    text: "Walk away. You don't owe an explanation.",
  },
];

const toolCards = [
  {
    icon: Ban,
    label: "Block",
    text: "Use Block when you don't want further interaction.",
  },
  {
    icon: Flag,
    label: "Report",
    text: `Use Report when someone's behavior violates ${brand.name}'s rules or makes you feel unsafe.`,
  },
];

const checkable = new Set([
  "before-you-meet",
  "plan-your-date",
  "during-your-date",
]);

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const ids = tips.map((t) => t.id);

export default function SafetyTipsGuide() {
  const active = useActiveSection(ids);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [exitStep, setExitStep] = useState(0);

  const totalCheckable = tips
    .filter((t) => checkable.has(t.id))
    .reduce((n, t) => n + t.items.length, 0);
  const progress = checked.size / totalCheckable;

  const toggle = <T,>(set: Set<T>, value: T, update: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update(next);
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-ink">
      {/* Hero */}
      <header className="relative overflow-hidden bg-brand-gradient px-4 pb-32 pt-10 text-white sm:px-6">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-white/10"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/safety#community"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Safety Centre
          </Link>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-magenta">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> First Date,
                Safe Date
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
                Safety Tips
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/90">
                A simple guide to meeting new people, protecting your privacy,
                and knowing what to do if something feels wrong.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: Sparkles, label: `${tips.length} simple steps` },
                  { icon: Clock, label: "3 min read" },
                  { icon: Phone, label: "Emergency: 112" },
                ].map(({ icon: ChipIcon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"
                  >
                    <ChipIcon className="h-4 w-4" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative aspect-[16/10] overflow-hidden rounded-card border-4 border-white/30 bg-gradient-to-br from-[#FF3D77] to-[#FF8A3D] shadow-2xl"
              >
                <Image
                  src="/illustrations/campaign-workshop.svg"
                  alt=""
                  fill
                  unoptimized
                  sizes="40vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-ink shadow-card"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-white">
                  <ShieldAlert className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold">
                  Your safety comes first
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-16 grid max-w-6xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[260px_1fr]">
        {/* Sticky step nav */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav
            aria-label="Guide steps"
            className="rounded-card bg-white p-4 shadow-card"
          >
            <p className="px-2 text-xs font-bold uppercase tracking-wide text-brand-ink-soft">
              Your date-ready checklist
            </p>
            <div className="mx-2 mt-3 h-2 overflow-hidden rounded-full bg-brand-bg">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                animate={{ width: `${progress * 100}%` }}
                transition={spring}
              />
            </div>
            <p className="mx-2 mt-2 text-xs text-brand-ink-soft">
              {checked.size} of {totalCheckable} ticked {progress === 1 && "🎉"}
            </p>
            <ol className="mt-4 hidden space-y-1 lg:block">
              {tips.map((t, i) => {
                const done =
                  checkable.has(t.id) &&
                  t.items.every((item) => checked.has(`${t.id}:${item}`));
                return (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors ${
                        active === t.id
                          ? "bg-brand-bg font-semibold text-brand-magenta"
                          : "text-brand-ink-soft hover:text-brand-ink"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          done
                            ? "bg-emerald-500 text-white"
                            : active === t.id
                              ? "bg-brand-gradient text-white"
                              : "bg-brand-bg"
                        }`}
                      >
                        {done ? (
                          <Check
                            className="h-3.5 w-3.5"
                            strokeWidth={3}
                            aria-hidden
                          />
                        ) : (
                          i + 1
                        )}
                      </span>
                      {t.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        {/* Steps */}
        <div className="space-y-6">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            const danger = tip.id === "immediate-danger";
            return (
              <motion.section
                key={tip.id}
                id={tip.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, ease: EASE }}
                className={`scroll-mt-6 rounded-card p-6 shadow-card sm:p-8 ${danger ? "bg-brand-night text-white" : "bg-white"}`}
              >
                <div className="flex items-start gap-4">
                  <motion.span
                    whileHover={{ rotate: -8, scale: 1.08 }}
                    transition={spring}
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${danger ? "bg-red-500 text-white" : "bg-brand-gradient text-white shadow-glow"}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </motion.span>
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-wide ${danger ? "text-red-300" : "text-brand-magenta"}`}
                    >
                      Step {i + 1}
                    </p>
                    <h2 className="font-display text-2xl font-extrabold">
                      {tip.title}
                    </h2>
                  </div>
                </div>
                <p
                  className={`mt-5 font-display text-lg font-bold ${danger ? "text-white" : "text-brand-ink"}`}
                >
                  {tip.lead}
                </p>
                {tip.intro && (
                  <p
                    className={`mt-1 leading-relaxed ${danger ? "text-white/80" : "text-brand-ink-soft"}`}
                  >
                    {tip.intro}
                  </p>
                )}

                {/* Interactive checklist */}
                {checkable.has(tip.id) && (
                  <ul className="mt-5 space-y-2">
                    {tip.items.map((item) => {
                      const key = `${tip.id}:${item}`;
                      const on = checked.has(key);
                      return (
                        <li key={item}>
                          <button
                            type="button"
                            onClick={() => toggle(checked, key, setChecked)}
                            aria-pressed={on}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                              on
                                ? "border-brand-magenta/40 bg-brand-bg"
                                : "border-brand-ink/10 hover:border-brand-magenta/30"
                            }`}
                          >
                            <motion.span
                              animate={{ scale: on ? [1, 1.25, 1] : 1 }}
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                                on
                                  ? "border-transparent bg-brand-gradient text-white"
                                  : "border-brand-ink/20"
                              }`}
                            >
                              {on && (
                                <Check
                                  className="h-3.5 w-3.5"
                                  strokeWidth={3}
                                  aria-hidden
                                />
                              )}
                            </motion.span>
                            <span
                              className={
                                on ? "text-brand-ink" : "text-brand-ink-soft"
                              }
                            >
                              {item}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Don't-share chips */}
                {tip.id === "protect-your-info" && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {tip.items.map((item) => (
                      <motion.div
                        key={item}
                        whileHover={{ y: -3 }}
                        transition={spring}
                        className="flex items-center gap-3 rounded-2xl bg-brand-bg px-4 py-3"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-brand-magenta shadow-card">
                          <EyeOff className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="text-sm font-medium text-brand-ink">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Block → Report → Leave */}
                {tip.id === "trust-your-instincts" && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-brand-ink">
                      If someone makes you uncomfortable:
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {exitSteps.map((s, n) => {
                        const StepIcon = s.icon;
                        const on = exitStep === n;
                        return (
                          <div
                            key={s.label}
                            className="flex items-center gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => setExitStep(n)}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-display font-semibold transition-all ${
                                on
                                  ? "bg-brand-gradient text-white shadow-glow"
                                  : "bg-brand-bg text-brand-ink-soft hover:text-brand-ink"
                              }`}
                            >
                              <StepIcon className="h-4 w-4" aria-hidden />
                              {s.label}
                            </button>
                            {n < exitSteps.length - 1 && (
                              <span className="text-brand-magenta" aria-hidden>
                                →
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={exitStep}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 text-brand-ink-soft"
                      >
                        {exitSteps[exitStep].text}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                )}

                {/* Red flag spotter */}
                {tip.id === "red-flags" && (
                  <>
                    <p className="mt-1 text-sm text-brand-ink-soft">
                      Tap any flag you&apos;ve noticed in a conversation.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {tip.items.map((item, n) => {
                        const on = flags.has(n);
                        return (
                          <motion.button
                            key={item}
                            type="button"
                            onClick={() => toggle(flags, n, setFlags)}
                            aria-pressed={on}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                              on
                                ? "border-red-300 bg-red-50"
                                : "border-brand-ink/10 hover:border-red-200"
                            }`}
                          >
                            <TriangleAlert
                              className={`mt-0.5 h-5 w-5 shrink-0 ${on ? "text-red-500" : "text-brand-ink/30"}`}
                              aria-hidden
                            />
                            <span
                              className={`text-sm ${on ? "text-brand-ink" : "text-brand-ink-soft"}`}
                            >
                              {item}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {flags.size > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
                            <ShieldAlert
                              className="h-5 w-5 shrink-0"
                              aria-hidden
                            />
                            <span>
                              You&apos;ve spotted {flags.size} red flag
                              {flags.size > 1 && "s"}. It&apos;s okay to slow
                              down, step back, or block and report.
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* Block / Report tools */}
                {tip.id === "something-went-wrong" && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {toolCards.map((c) => {
                      const ToolIcon = c.icon;
                      return (
                        <motion.div
                          key={c.label}
                          whileHover={{ y: -4 }}
                          transition={spring}
                          className="rounded-2xl bg-brand-bg p-5"
                        >
                          <ToolIcon
                            className="h-6 w-6 text-brand-magenta"
                            aria-hidden
                          />
                          <p className="mt-3 font-display text-lg font-bold">
                            {c.label}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">
                            {c.text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Emergency */}
                {danger && (
                  <div className="mt-4 space-y-4">
                    <p className="leading-relaxed text-white/80">
                      If you are in immediate danger, contact your local
                      emergency services first and move to a safe place.
                    </p>
                    <a
                      href="tel:112"
                      className="flex items-center justify-between gap-4 rounded-2xl bg-red-500 p-5 transition-transform hover:scale-[1.01]"
                    >
                      <span>
                        <span className="block text-xs font-bold uppercase tracking-wide text-white/80">
                          India national emergency number
                        </span>
                        <span className="font-display text-4xl font-extrabold">
                          112
                        </span>
                      </span>
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-red-500">
                        <Phone className="h-6 w-6" aria-hidden />
                      </span>
                    </a>
                    <p className="text-white/80">
                      After you&apos;re safe, you can report the incident to{" "}
                      {brand.name} through the app.
                    </p>
                  </div>
                )}

                {tip.note && (
                  <p className="mt-5 rounded-2xl border-l-4 border-brand-magenta bg-brand-bg px-4 py-3 font-semibold text-brand-ink">
                    {tip.note}
                  </p>
                )}
              </motion.section>
            );
          })}

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
      </div>
    </main>
  );
}
