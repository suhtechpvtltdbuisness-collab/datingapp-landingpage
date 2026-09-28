import type { Metadata } from "next";
import SafetyNav from "../safety/components/SafetyNav";
import ReportProblemSection from "../safety/components/ReportProblemSection";
import SafetyFooter from "../safety/components/SafetyFooter";
import { brand } from "../safety/theme";

export const metadata: Metadata = { title: `Report a Problem | ${brand.name}` };

export default function ReportProblemPage() {
  return (
    <>
      <SafetyNav />
      <main className="pt-16">
        <ReportProblemSection />
      </main>
      <SafetyFooter />
    </>
  );
}
