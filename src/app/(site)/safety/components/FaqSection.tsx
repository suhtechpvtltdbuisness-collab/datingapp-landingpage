"use client";
import { useState } from "react";
import FaqAccordionItem from "./FaqAccordionItem";
import SectionHeading from "./SectionHeading";
import { faqs } from "../data/faqs";

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading id="faq-title" eyebrow="Questions" title="Good questions, honest answers" subtitle="Can't find what you're looking for? Contact support in the app under Profile → Help." />
        <ul className="space-y-3">
          {faqs.map((f) => (
            <FaqAccordionItem key={f.id} faq={f} open={openId === f.id} onToggle={() => setOpenId(openId === f.id ? null : f.id)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
