import type { Metadata } from "next";
import AdminPage from "../../_components/AdminPage";
import WebsiteContentManager from "./WebsiteContentManager";
import { requireAdmin } from "@/lib/admin/session";
import { getSiteContent } from "@/lib/siteContent";

export const metadata: Metadata = { title: "Website Content CMS" };
export const dynamic = "force-dynamic";

export default async function WebsiteCmsPage() {
  const admin = await requireAdmin();
  const content = await getSiteContent();

  // Unique key ensures React resets all form inputs and internal state with latest DB data
  const renderKey = `${content.hero?.badge || ""}-${content.plansHeader?.title || ""}-${content.kinderTogether?.title || ""}-${content.safetyTips?.title || ""}-${content.realTalk?.title || ""}-${content.faqs?.length || 0}-${content.features?.length || 0}-${content.campaigns?.length || 0}`;

  return (
    <AdminPage
      admin={admin}
      heading="Website Content CMS"
      subheading="Manage hero banners, app download links, contact info, FAQs, features, campaigns, and campaign landing pages live on the website"
    >
      <WebsiteContentManager key={renderKey} initialContent={content} />
    </AdminPage>
  );
}
