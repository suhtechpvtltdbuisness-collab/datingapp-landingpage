"use client";
import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { EASE } from "../theme";

export default function SectionHeading({ eyebrow, title, subtitle, id }: { eyebrow: string; title: string; subtitle?: string; id?: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE }}
      className="max-w-2xl"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-brand-accent">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-brand-ink-soft">{subtitle}</p>}
    </motion.div>
  );
}
