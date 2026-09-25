"use client";
import { motion } from "framer-motion";
import { useMagnetic } from "../hooks/useMagnetic";
import { spring } from "../theme";

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: "gradient" | "white";
  size?: "sm" | "lg";
  className?: string;
}

export default function MagneticButton({ href, children, variant = "gradient", size = "lg", className = "" }: Props) {
  const { ref, style, handlers } = useMagnetic<HTMLAnchorElement>(size === "lg" ? 10 : 6);
  const look =
    variant === "gradient"
      ? "bg-brand-gradient text-white shadow-glow"
      : "bg-white text-brand-magenta shadow-card";
  const pad = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-2.5 text-sm";
  return (
    <motion.a
      ref={ref}
      href={href}
      style={style}
      {...handlers}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/40 ${look} ${pad} ${className}`}
    >
      {children}
    </motion.a>
  );
}
