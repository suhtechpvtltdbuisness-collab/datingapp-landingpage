import { brand } from "../safety/theme";
import KinderTogetherGuide from "./KinderTogetherGuide";
import LegalFooter from "../safety/components/LegalFooter";
import { getSiteContent } from "@/lib/siteContent";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: `Kinder Together | ${brand.name}`,
  description: `Kinder Together: a ${brand.name} community campaign for a kinder dating community, starting with how we treat each other.`,
  path: "/kinder-together",
});

export default async function KinderTogetherPage() {
  const content = await getSiteContent();

  return (
    <>
      <KinderTogetherGuide data={content.kinderTogether} />
      <LegalFooter />
    </>
  );
}
