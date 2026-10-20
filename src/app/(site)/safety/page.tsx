import type { Metadata } from "next";
import SafetyNav from "./components/SafetyNav";
import SafetyHero from "./components/SafetyHero";
import SafetyFeatureGrid from "./components/SafetyFeatureGrid";
import SafetyHandbookBanner from "./components/SafetyHandbookBanner";
import CampaignCarousel from "./components/CampaignCarousel";
import PlansSection from "./components/PlansSection";
import FaqSection from "./components/FaqSection";
import SafetyFooter from "./components/SafetyFooter";
import { brand } from "./theme";

export const metadata: Metadata = { title: brand.name };

export default function SafetyPage() {
  return (
    <>
      <SafetyNav />
      <main>
        <SafetyHero />
        <SafetyFeatureGrid />
        <SafetyHandbookBanner />
        <CampaignCarousel />
        <PlansSection />
        <FaqSection />
      </main>
      <SafetyFooter />
    </>
  );
}
