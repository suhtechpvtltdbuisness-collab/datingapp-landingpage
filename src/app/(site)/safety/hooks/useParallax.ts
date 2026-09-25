"use client";
import { useRef } from "react";
import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/** Maps the element's scroll progress through the viewport to a smoothed translateY. */
export function useParallax<T extends HTMLElement = HTMLDivElement>(distance = 80): {
  ref: React.RefObject<T | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  return { ref, y };
}
