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
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-36">
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
