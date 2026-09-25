"use client";
import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Campaign } from "../data/campaigns";

interface Props {
  campaign: Campaign;
  scale: MotionValue<number> | number;
  opacity: MotionValue<number> | number;
}

export default function CampaignCard({ campaign, scale, opacity }: Props) {
  return (
    <motion.article
      style={{ scale, opacity }}
      className="group flex w-[82vw] max-w-[380px] shrink-0 snap-center flex-col overflow-hidden rounded-card bg-white shadow-card md:w-auto md:max-w-none"
    >
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${campaign.art}`}>
        <Image
          src={campaign.image}
          alt={campaign.imageAlt}
          fill
          unoptimized
          sizes="(min-width: 768px) 33vw, 82vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-magenta">
          {campaign.eyebrow}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-brand-ink">{campaign.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-brand-ink-soft">{campaign.description}</p>
        <a href="#faq" className="mt-5 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40">
          {campaign.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </a>
      </div>
    </motion.article>
  );
}
