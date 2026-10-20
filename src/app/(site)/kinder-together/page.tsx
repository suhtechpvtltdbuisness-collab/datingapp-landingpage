import type { Metadata } from "next";
import { brand } from "../safety/theme";
import KinderTogetherGuide from "./KinderTogetherGuide";
import LegalFooter from "../safety/components/LegalFooter";

export const metadata: Metadata = {
  title: `Kinder Together | ${brand.name}`,
  description: "A kinder dating community starts with how we treat each other.",
};

export default function KinderTogetherPage() {
  return (
    <>
      <KinderTogetherGuide />
      <LegalFooter />
    </>
  );
}
