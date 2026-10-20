import type { Metadata } from "next";
import { brand } from "../safety/theme";
import RealTalkGuide from "./RealTalkGuide";
import LegalFooter from "../safety/components/LegalFooter";

export const metadata: Metadata = {
  title: `Real Talk Month | ${brand.name}`,
  description: "Real conversations. Safer connections.",
};

export default function RealTalkPage() {
  return (
    <>
      <RealTalkGuide />
      <LegalFooter />
    </>
  );
}
