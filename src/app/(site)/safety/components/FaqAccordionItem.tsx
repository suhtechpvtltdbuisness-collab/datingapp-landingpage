"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Faq } from "../data/faqs";
import { EASE } from "../theme";

interface Props {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
}

export default function FaqAccordionItem({ faq, open, onToggle }: Props) {
  const panelId = `faq-panel-${faq.id}`;
  const btnId = `faq-btn-${faq.id}`;
  return (
    <motion.li layout transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden rounded-card bg-white shadow-card">
      <h3>
        <button
          id={btnId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 rounded-card px-6 py-5 text-left font-display font-semibold text-brand-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-purple/30"
        >
          {faq.question}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${open ? "bg-brand-gradient text-white" : "bg-brand-gradient-soft text-brand-magenta"}`}
          >
            <ChevronDown className="h-4 w-4" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="px-6 pb-6 leading-relaxed text-brand-ink-soft">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
