"use client";
import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { EASE } from "../theme";

export default function SectionHeading({ eyebrow, title, subtitle, id, as: Heading = "h2" }: { eyebrow: string; title: string; subtitle?: string; id?: string; as?: "h1" | "h2" }) {
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
      <Heading id={id} className="mt-3 font-display text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">{title}</Heading>
      {subtitle && <p className="mt-3 text-base text-brand-ink-soft sm:mt-4 sm:text-lg">{subtitle}</p>}
    </motion.div>
  );
}
