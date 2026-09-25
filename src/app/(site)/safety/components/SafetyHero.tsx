"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, ArrowRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useParallax } from "../hooks/useParallax";
import { EASE } from "../theme";

const headline = ["Date", "boldly.", "We've", "got", "your", "back."];

function PhotoCard({ name, tag, image, className }: { name: string; tag: string; image: string; className: string }) {
  return (
    <div className={`absolute w-44 overflow-hidden rounded-card bg-white p-2 shadow-card-hover sm:w-52 ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-photo bg-brand-gradient-soft">
        <Image src={image} alt="" fill unoptimized priority sizes="208px" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 rounded-b-photo bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
          <p className="flex items-center gap-1 font-display font-semibold">
            {name}
            <BadgeCheck className="h-4 w-4 text-white" aria-label="Verified" />
          </p>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-accent-soft">{tag}</p>
        </div>
      </div>
    </div>
  );
}

export default function SafetyHero() {
  const { ref, y } = useParallax<HTMLDivElement>(60);

  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-gradient-soft opacity-60 blur-3xl" />
        <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-brand-magenta/15 blur-3xl" />
        <div className="absolute left-[6%] top-44 h-64 w-64 rounded-full bg-brand-purple/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_22%_38%,rgba(255,255,255,0.95)_0_2px,transparent_3px),radial-gradient(circle_at_76%_26%,rgba(224,41,155,0.22)_0_2px,transparent_3px),radial-gradient(circle_at_61%_58%,rgba(139,47,201,0.18)_0_1px,transparent_2px)] bg-[length:120px_120px,180px_180px,150px_150px] opacity-70" />
        <div className="absolute left-1/2 top-36 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-white/70" />
        <div className="absolute left-[54%] top-28 h-[22rem] w-[22rem] rounded-full border border-brand-pink/15" />
        <div className="absolute left-[8%] top-72 hidden h-24 w-24 rotate-12 rounded-[2rem] border border-white/80 bg-white/35 shadow-card backdrop-blur-sm md:block" />
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
        className="pointer-events-none absolute right-[12%] top-36 -z-10 hidden h-20 w-20 rounded-[1.75rem] bg-white/60 shadow-card backdrop-blur-md md:block"
      >
        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-magenta/40" />
        <ShieldCheck className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-brand-magenta" />
      </motion.div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-magenta shadow-card"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden /> Vellora Safety Centre
          </motion.p>
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-brand-ink sm:text-6xl">
            {headline.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className={`inline-block ${i === 1 ? "bg-brand-gradient bg-clip-text text-transparent" : ""}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.06 }}
                >
                  {word}
                </motion.span>
                {i < headline.length - 1 && " "}
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
            className="mt-6 max-w-md text-lg text-brand-ink-soft"
          >
            Verification, one-tap reporting, and a team reviewing what you flag, so you can focus on the good part.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.72 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#features">
              Explore safety tools <ArrowRight className="h-4 w-4" aria-hidden />
            </MagneticButton>
            <a href="#handbook" className="rounded font-semibold text-brand-magenta underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40">
              Read the handbook
            </a>
          </motion.div>
        </div>

        <div ref={ref} className="relative mx-auto h-[380px] w-full max-w-[360px] sm:h-[440px] sm:max-w-[410px]" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9),0_40px_90px_-55px_rgba(224,41,155,0.65)] backdrop-blur-sm" />
          <div className="absolute left-8 top-8 h-14 w-14 rounded-full border border-brand-pink/20 bg-white/50" />
          <div className="absolute bottom-12 right-4 h-20 w-20 rounded-full border border-brand-purple/20 bg-white/40" />
          <div className="absolute right-12 top-4 grid h-12 w-12 place-items-center rounded-full bg-brand-night text-white shadow-card">
            <BadgeCheck className="h-5 w-5 text-brand-accent-soft" />
          </div>
          <motion.div style={{ y }} className="absolute inset-0">
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <motion.div initial={{ opacity: 0, rotate: -14, scale: 0.9 }} animate={{ opacity: 1, rotate: -8, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
                <PhotoCard name="Aanya, 26" tag="Verified" image="/illustrations/profile-aanya.svg" className="left-0 top-2" />
              </motion.div>
              <motion.div initial={{ opacity: 0, rotate: 14, scale: 0.9 }} animate={{ opacity: 1, rotate: 7, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}>
                <PhotoCard name="Rohan, 28" tag="New" image="/illustrations/profile-rohan.svg" className="right-0 top-28" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
                className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink shadow-card-hover"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                Photo verified
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
