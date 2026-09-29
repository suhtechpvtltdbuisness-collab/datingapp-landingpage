import type { Metadata } from "next";
import { brand } from "../safety/theme";
import RealTalkGuide from "./RealTalkGuide";

export const metadata: Metadata = {
  title: `Real Talk Month | ${brand.name}`,
  description: "Real conversations. Safer connections.",
};

export default function RealTalkPage() {
  return <RealTalkGuide />;
}
