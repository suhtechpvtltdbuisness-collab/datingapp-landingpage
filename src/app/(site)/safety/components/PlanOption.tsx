"use client";
import { motion } from "framer-motion";
import type { Plan } from "../data/plans";
import { savingsPercent, CURRENCY } from "../data/plans";
import { EASE } from "../theme";

const price = new Intl.NumberFormat("en-IN", { style: "currency", currency: CURRENCY, minimumFractionDigits: 2 });

interface Props {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}

export default function PlanOption({ plan, selected, onSelect }: Props) {
  const saving = savingsPercent(plan);
  const sub = plan.note ?? (saving > 0 ? `Save ${saving}% vs weekly` : undefined);

  return (
    <label
      className={`relative flex cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-card p-6 shadow-card transition-colors duration-500 focus-within:ring-4 focus-within:ring-brand-purple/40 ${
        selected ? "text-white" : "bg-white text-brand-ink hover:shadow-card-hover"
      }`}
    >
      {selected && (
        <motion.span
          layoutId="plan-highlight"
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-0 -z-0 bg-brand-gradient shadow-glow"
          aria-hidden
        />
      )}
      <input type="radio" name="plan" value={plan.id} checked={selected} onChange={onSelect} className="sr-only" />
      <span className="relative">
        {plan.badge && (
          <span
            className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              selected ? "bg-white/20 text-white" : "bg-brand-gradient-soft text-brand-magenta"
            }`}
          >
            {plan.badge}
          </span>
        )}
        <span className="block font-display text-xl font-bold">{plan.label}</span>
        {sub && <span className={`mt-1 block text-sm ${selected ? "text-white/90" : "text-brand-ink-soft"}`}>{sub}</span>}
      </span>
      <span className="relative text-right">
        <span className="block font-display text-2xl font-bold">{price.format(plan.pricePerWeek)}</span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${selected ? "text-white/85" : "text-brand-ink-soft"}`}>per week</span>
      </span>
    </label>
  );
}
