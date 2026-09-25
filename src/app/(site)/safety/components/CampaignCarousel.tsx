"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import CampaignCard from "./CampaignCard";
import SectionHeading from "./SectionHeading";
import { campaigns } from "../data/campaigns";

/** One spring pair per card so the active card eases to 1.0 and neighbours to 0.92. */
function useCardSprings(count: number) {
  const springs: { scale: MotionValue<number>; opacity: MotionValue<number>; rawS: MotionValue<number>; rawO: MotionValue<number> }[] = [];
  for (let i = 0; i < count; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rawS = useMotionValue(1);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rawO = useMotionValue(1);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scale = useSpring(rawS, { stiffness: 260, damping: 26 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const opacity = useSpring(rawO, { stiffness: 260, damping: 26 });
    springs.push({ scale, opacity, rawS, rawO });
  }
  return springs;
}

export default function CampaignCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const springs = useCardSprings(campaigns.length);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia("(min-width: 768px)");

    const update = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
      springs.forEach((s, i) => {
        const on = mq.matches || reduce || i === best; // desktop grid: all cards full size
        s.rawS.set(on ? 1 : 0.92);
        s.rawO.set(on ? 1 : 0.6);
      });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    mq.addEventListener("change", update);
    return () => {
      track.removeEventListener("scroll", update);
      mq.removeEventListener("change", update);
    };
  }, [springs, reduce]);

  return (
    <section id="community" aria-labelledby="community-title" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="community-title" eyebrow="Beyond the app" title="Safety that shows up IRL" subtitle="Staying safe doesn't stop at the chat. Here's what we're doing offline and in our community." />
      </div>
      <div
        ref={trackRef}
        className="no-scrollbar mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-[9vw] pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-6"
        tabIndex={0}
        aria-label="Community initiatives, scroll horizontally"
      >
        {campaigns.map((c, i) => (
          <CampaignCard key={c.id} campaign={c} scale={springs[i].scale} opacity={springs[i].opacity} />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden>
        {campaigns.map((c, i) => (
          <span key={c.id} className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-brand-gradient" : "w-2 bg-brand-magenta/25"}`} />
        ))}
      </div>
    </section>
  );
}
