"use client";
import { LazyMotion, MotionConfig } from "framer-motion";

// Animation features (gestures, exit, layout) are fetched after first paint instead of being in the initial bundle.
// domMax is needed for the shared-layout `layoutId` highlight in the plans selector.
const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
