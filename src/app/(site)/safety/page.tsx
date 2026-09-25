import type { Metadata } from "next";
import SafetyNav from "./components/SafetyNav";
import SafetyHero from "./components/SafetyHero";
import SafetyFeatureGrid from "./components/SafetyFeatureGrid";
import SafetyHandbookBanner from "./components/SafetyHandbookBanner";
import CampaignCarousel from "./components/CampaignCarousel";
import PartnerLogoMarquee from "./components/PartnerLogoMarquee";
import PlansSection from "./components/PlansSection";
import FaqSection from "./components/FaqSection";
import SafetyFooter from "./components/SafetyFooter";

export const metadata: Metadata = { title: "Vellora Safety Centre" };

export default function SafetyPage() {
  return (
    <>
      <SafetyNav />
      <main>
        <SafetyHero />
        <SafetyFeatureGrid />
        <SafetyHandbookBanner />
        <CampaignCarousel />
        <PartnerLogoMarquee />
        <PlansSection />
        <FaqSection />
      </main>
      <SafetyFooter />
    </>
  );
}
