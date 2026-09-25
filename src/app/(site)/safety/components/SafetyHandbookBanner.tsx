"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookHeart, ArrowRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import EmergencyNotice from "./EmergencyNotice";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { EASE } from "../theme";

export default function SafetyHandbookBanner() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="handbook" aria-labelledby="handbook-title" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative overflow-hidden rounded-card bg-brand-gradient p-8 text-white shadow-glow sm:p-10 lg:col-span-3"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10" aria-hidden />
          <Image src="/illustrations/handbook.svg" alt="" width={240} height={180} unoptimized className="pointer-events-none absolute -right-4 bottom-4 hidden w-56 drop-shadow-xl sm:block lg:w-48 xl:w-60" />
          <BookHeart className="h-10 w-10" aria-hidden />
          <h2 id="handbook-title" className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">The Safe Dating Handbook</h2>
          <p className="mt-3 max-w-md text-white/90 sm:max-w-[55%]">
            A short, friendly guide to meeting someone new: public places, your own ride home, trusting your gut, and what to do when something feels off.
          </p>
          <MagneticButton href="#faq" variant="white" className="mt-7">
            Read the handbook <ArrowRight className="h-4 w-4" aria-hidden />
          </MagneticButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <EmergencyNotice />
        </motion.div>
      </div>
    </section>
  );
}
