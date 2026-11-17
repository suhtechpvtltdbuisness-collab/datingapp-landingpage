import SafetyNav from "../safety/components/SafetyNav";
import ReportProblemSection from "../safety/components/ReportProblemSection";
import SafetyFooter from "../safety/components/SafetyFooter";
import { brand } from "../safety/theme";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Report a Problem | ${brand.name}`,
  description: `Report an account, messaging, payment or safety problem to the ${brand.name} support and safety team.`,
  path: "/report-problem",
});

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
