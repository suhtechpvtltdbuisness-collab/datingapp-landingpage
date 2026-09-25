"use client";
import { useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Element drifts toward the cursor within `strength` px, springing back on leave. */
export function useMagnetic<T extends HTMLElement>(strength = 10) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(my, { stiffness: 300, damping: 20, mass: 0.5 });

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2 * strength);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2 * strength);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return { ref, style: { x, y }, handlers: { onMouseMove, onMouseLeave } };
}
