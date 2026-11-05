import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../../_components/AdminPage";
import ReportsTable from "./ReportsTable";
import { cx } from "../../_components/ui";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminReport } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const tabs = [
  { status: "all", label: "All" },
  { status: "pending", label: "Pending" },
  { status: "resolved", label: "Resolved" },
  { status: "dismissed", label: "Dismissed" },
];

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const admin = await requireAdmin();
  const status = (await searchParams).status ?? "all";
  const { items: reports } = await apiList<AdminReport>("/reports", { status, limit: 50 });
  const reportList = Array.isArray(reports) ? reports : [];

  return (
    <AdminPage admin={admin} heading="Moderation queue" subheading="Reports submitted by users from inside the app">
      <div className="mb-4 grid grid-cols-4 max-w-[340px] rounded-full border border-black/[0.07] bg-white/75 p-1 shadow-xs">
        {tabs.map((t) => (
          <Link
            key={t.status}
            href={`/admin/reports?status=${t.status}`}
            className={cx(
              "rounded-full py-1.5 text-center text-[11px] sm:text-[12px] font-semibold transition-all",
              status === t.status ? "bg-admin-brand text-white shadow-xs" : "text-admin-ink-2 hover:text-admin-ink",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <ReportsTable reports={reportList} />
    </AdminPage>
  );
}
