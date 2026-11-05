import type { Metadata } from "next";
import AdminPage from "../../_components/AdminPage";
import PlanManager from "./PlanManager";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminPlan } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Subscription Plans" };
export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const admin = await requireAdmin();
  const { items: plans } = await apiList<AdminPlan>("/plans", { limit: 100 });
  const planList = Array.isArray(plans) ? plans : [];

  return (
    <AdminPage
      admin={admin}
      heading="VIP &amp; Subscription Plans"
      subheading="Manage membership tiers, pricing, and perks for the mobile app"
    >
      <PlanManager plans={planList} />
    </AdminPage>
  );
}
