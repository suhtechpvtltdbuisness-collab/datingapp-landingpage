import { brand } from "../safety/theme";
import RealTalkGuide from "./RealTalkGuide";
import LegalFooter from "../safety/components/LegalFooter";
import { getSiteContent } from "@/lib/siteContent";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: `Real Talk Month | ${brand.name}`,
  description: `Real Talk Month is a ${brand.name} community campaign: real conversations and safer connections, with practical tips on healthy communication while dating.`,
  path: "/real-talk",
});

export default async function RealTalkPage() {
  const content = await getSiteContent();

  return (
    <>
      <RealTalkGuide data={content.realTalk} />
      <LegalFooter />
    </>
  );
}
