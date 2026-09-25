"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Camera, IdCard, Sparkles, ShieldBan, Share2, Video, MessageSquareHeart, EyeOff, type LucideIcon } from "lucide-react";
import type { Feature, FeatureIcon } from "../data/features";
import { EASE } from "../theme";

const icons: Record<FeatureIcon, LucideIcon> = {
  camera: Camera,
  idCard: IdCard,
  sparkles: Sparkles,
  shieldBan: ShieldBan,
  share: Share2,
  video: Video,
  messageCheck: MessageSquareHeart,
  eyeOff: EyeOff,
};

const MAX_TILT = 4;

export default function SafetyFeatureCard({ feature, index, visible }: { feature: Feature; index: number; visible: boolean }) {
  const Icon = icons[feature.icon];
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.07 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduce ? undefined : { y: -4 }}
      className="group flex flex-col rounded-card bg-white p-6 shadow-card transition-shadow duration-500 hover:shadow-card-hover"
    >
      <span className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-brand-gradient-soft text-brand-magenta">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="font-display text-lg font-bold text-brand-ink">{feature.title}</h3>
      <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-brand-ink-soft">{feature.description}</p>
      <a
        href={feature.href}
        className="mt-5 inline-flex items-center gap-1.5 self-start rounded text-sm font-semibold text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40"
      >
        Learn more <span className="sr-only">about {feature.title}</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden />
      </a>
    </motion.article>
  );
}
