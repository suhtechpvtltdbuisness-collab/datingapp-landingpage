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
import { getSiteContent } from "@/lib/siteContent";
import { getPublicPlans } from "@/lib/plans";

export const metadata: Metadata = { title: brand.name };
export const dynamic = "force-dynamic";

export default async function SafetyPage() {
  const [content, plans] = await Promise.all([
    getSiteContent(),
    getPublicPlans(),
  ]);

  return (
    <>
      <SafetyNav />
      <main>
        <SafetyHero hero={content.hero} />
        <SafetyFeatureGrid features={content.features} />
        <SafetyHandbookBanner handbook={content.handbook} />
        <CampaignCarousel campaigns={content.campaigns} />
        <PlansSection plansHeader={content.plansHeader} plans={plans} />
        <FaqSection faqs={content.faqs} />
      </main>
      <SafetyFooter company={content.company} storeLinks={content.hero} />
    </>
  );
}
