"use client";
import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import PlanOption from "./PlanOption";
import MagneticButton from "./MagneticButton";
import { storeLinks } from "@/lib/company";
import { plans as fallbackPlans, perks as fallbackPerks, defaultPlanId, type Plan } from "../data/plans";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { EASE, brand } from "../theme";
import type { SitePlansHeader } from "@/lib/siteContent";

interface Props {
  plansHeader?: SitePlansHeader;
  plans?: Plan[];
}

export default function PlansSection({ plansHeader, plans: initialPlans }: Props) {
  const currentPlans = initialPlans && initialPlans.length > 0 ? initialPlans : fallbackPlans;
  const initialSelectedId =
    currentPlans.find((p) => p.badge?.toLowerCase().includes("best") || p.id === defaultPlanId)?.id ||
    currentPlans[0]?.id;
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const selected = currentPlans.find((p) => p.id === selectedId) ?? currentPlans[0];
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const activePerks =
    plansHeader?.perks && plansHeader.perks.length > 0
      ? plansHeader.perks
      : fallbackPerks;

  const eyebrow = plansHeader?.eyebrow || `${brand.name} Premium`;
  const title = plansHeader?.title || "Want a little extra?";
  const subtitle =
    plansHeader?.subtitle ||
    "Premium adds a few perks on top. Every safety tool on this page stays free for everyone, whether you subscribe or not.";
  const safetyNoteTitle =
    plansHeader?.safetyNoteTitle || "Safety is never a paid feature";
  const safetyNoteDesc =
    plansHeader?.safetyNoteDesc ||
    "Verification, blocking, reporting and image blur are free on every account.";

  return (
    <section id="plans" aria-labelledby="plans-title" className="scroll-mt-20 px-4 py-10 sm:py-14 lg:py-20 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading
            id="plans-title"
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
          />
          <ul className="mt-6 space-y-3 sm:mt-8">
            {activePerks.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3 rounded-card bg-white p-5 shadow-card">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-white">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block font-display font-semibold text-brand-ink">{perk.title}</span>
                  <span className="text-sm text-brand-ink-soft">{perk.description}</span>
                </span>
              </li>
            ))}
            <li className="flex items-start gap-3 rounded-card border border-brand-magenta/15 p-5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient-soft text-brand-magenta">
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm text-brand-ink-soft">
                <span className="block font-display font-semibold text-brand-ink">{safetyNoteTitle}</span>
                {safetyNoteDesc}
              </span>
            </li>
          </ul>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <fieldset>
            <legend className="mb-4 font-display text-xl font-bold text-brand-ink">Select your plan</legend>
            <LayoutGroup>
              <div className="relative isolate space-y-4">
                {currentPlans.map((plan) => (
                  <PlanOption
                    key={plan.id}
                    plan={plan}
                    selected={plan.id === selectedId}
                    onSelect={() => setSelectedId(plan.id)}
                    allPlans={currentPlans}
                  />
                ))}
              </div>
            </LayoutGroup>
          </fieldset>
          <MagneticButton
            href={storeLinks.googlePlay ?? "#download"}
            analytics={{ name: "premium_click", params: { placement: "plans_section", plan: selected?.label } }}
            className="mt-6 w-full"
          >
            Get {selected?.label || "Plan"} in the app <ArrowRight className="h-4 w-4" aria-hidden />
          </MagneticButton>
          <p className="mt-4 text-center text-sm leading-relaxed text-brand-ink-soft">
            Subscribe inside the {brand.name} app. Prices in INR, shown per week. Recurring billing, cancel anytime. By subscribing, you agree to our{" "}
            <a href="/terms" className="font-semibold text-brand-magenta underline-offset-2 hover:underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="font-semibold text-brand-magenta underline-offset-2 hover:underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
