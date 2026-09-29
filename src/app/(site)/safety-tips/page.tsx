import type { Metadata } from "next";
import { brand } from "../safety/theme";
import SafetyTipsGuide from "./SafetyTipsGuide";

export const metadata: Metadata = {
  title: `Safety Tips | ${brand.name}`,
  description: "A simple guide to meeting new people, protecting your privacy, and knowing what to do if something feels wrong.",
};

export default function SafetyTipsPage() {
  return <SafetyTipsGuide />;
}
