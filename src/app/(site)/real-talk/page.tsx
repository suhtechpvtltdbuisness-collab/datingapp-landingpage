import type { Metadata } from "next";
import { brand } from "../safety/theme";
import RealTalkGuide from "./RealTalkGuide";
import LegalFooter from "../safety/components/LegalFooter";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Real Talk Month | ${brand.name}`,
  description: "Real conversations. Safer connections.",
};

export default async function RealTalkPage() {
  const content = await getSiteContent();

  return (
    <>
      <RealTalkGuide data={content.realTalk} />
      <LegalFooter />
    </>
  );
}
