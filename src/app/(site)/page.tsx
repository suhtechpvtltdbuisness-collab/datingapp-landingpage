import SafetyNav from "./safety/components/SafetyNav";
import SafetyHero from "./safety/components/SafetyHero";
import SafetyFeatureGrid from "./safety/components/SafetyFeatureGrid";
import SafetyHandbookBanner from "./safety/components/SafetyHandbookBanner";
import CampaignCarousel from "./safety/components/CampaignCarousel";
import PlansSection from "./safety/components/PlansSection";
import FaqSection from "./safety/components/FaqSection";
import SafetyFooter from "./safety/components/SafetyFooter";
import JsonLd from "./JsonLd";
import { brand } from "./safety/theme";
import { getSiteContent } from "@/lib/siteContent";
import { getPublicPlans } from "@/lib/plans";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${brand.name} – ${brand.tagline} | Verified, safety-first dating app`,
  description: `${brand.name} is a dating app built around safety: verified profiles, easy reporting and blocking, and tools that keep you in control. Meet genuine people and start a connection that feels real.`,
  path: "/",
});
// ISR: the page is served from cache and refreshed at most every 60 s (admin saves also call revalidatePath("/") for instant updates).
// Previously force-dynamic, so every visit waited on two uncached backend round-trips before the first byte.
export const revalidate = 60;

export default async function HomePage() {
  const [content, plans] = await Promise.all([
    getSiteContent({ revalidate: 60 }),
    getPublicPlans({ revalidate: 60 }),
  ]);

  return (
    <>
      <JsonLd data={[organizationJsonLd({ sameAs: [content.company.instagram, content.company.youtube, content.company.x] }), websiteJsonLd()]} />
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
