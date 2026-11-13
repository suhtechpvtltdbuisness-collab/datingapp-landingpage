import type { Metadata } from "next";
import { brand } from "../safety/theme";
import KinderTogetherGuide from "./KinderTogetherGuide";
import LegalFooter from "../safety/components/LegalFooter";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Kinder Together | ${brand.name}`,
  description: "A kinder dating community starts with how we treat each other.",
};

export default async function KinderTogetherPage() {
  const content = await getSiteContent();

  return (
    <>
      <KinderTogetherGuide data={content.kinderTogether} />
      <LegalFooter />
    </>
  );
}
