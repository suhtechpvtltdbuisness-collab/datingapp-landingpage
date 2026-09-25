"use client";
import SafetyFeatureCard from "./SafetyFeatureCard";
import SectionHeading from "./SectionHeading";
import { features } from "../data/features";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function SafetyFeatureGrid() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Built in" title="Safety tools in every swipe" subtitle="Everything below is free and built into the app. No upgrade needed to feel safe." />
        <div ref={ref} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <SafetyFeatureCard key={f.id} feature={f} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
