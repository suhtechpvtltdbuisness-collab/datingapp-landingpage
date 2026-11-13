import type { Metadata } from "next";
import { brand } from "../safety/theme";
import SafetyTipsGuide from "./SafetyTipsGuide";
import LegalFooter from "../safety/components/LegalFooter";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Safety Tips | ${brand.name}`,
  description: "A simple guide to meeting new people, protecting your privacy, and knowing what to do if something feels wrong.",
};

export default async function SafetyTipsPage() {
  const content = await getSiteContent();

  return (
    <>
      <SafetyTipsGuide data={content.safetyTips} />
      <LegalFooter />
    </>
  );
}
