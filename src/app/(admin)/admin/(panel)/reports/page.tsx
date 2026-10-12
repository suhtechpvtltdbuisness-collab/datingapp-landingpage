import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../../_components/AdminPage";
import { ReportStatusBadge } from "../../_components/Badges";
import { Badge, EmptyState, SectionCard, Table, Td, buttonClass, cx, nameLink } from "../../_components/ui";
import { dismissReport, resolveReport } from "../../actions";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminReport } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const tabs = [
  { status: "pending", label: "Pending" },
  { status: "resolved", label: "Resolved" },
  { status: "dismissed", label: "Dismissed" },
  { status: "all", label: "All" },
];

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const admin = await requireAdmin();
  const status = (await searchParams).status ?? "pending";
  const { items: reports } = await apiList<AdminReport>("/reports", { status, limit: 200 });

  return (
    <AdminPage admin={admin} heading="Moderation queue" subheading="Reports submitted by users from inside the app">
      <div className="mb-[18px] flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.status}
            href={`/admin/reports?status=${t.status}`}
            className={cx(
              "rounded-full border px-4 py-2 text-[13px] font-semibold",
              status === t.status ? "border-transparent bg-admin-brand text-white" : "border-black/[0.06] bg-white text-admin-ink-2",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <SectionCard>
        {reports.length ? (
          <Table head={["Reported user", "Reported by", "Reason", "Filed", "Status", ""]}>
            {reports.map((r) => (
              <tr key={r.id}>
                <Td>
                  {r.reportedUser ? (
                    <Link href={`/admin/users/${r.reportedUser.id}`} className={nameLink}>{r.reportedUser.name}</Link>
                  ) : (
                    <span className="text-admin-ink-3">Deleted user</span>
                  )}
                  {r.reportedUser?.isBanned ? <Badge tone="danger" className="ml-1.5">Banned</Badge> : null}
                </Td>
                <Td>{r.reporter?.name || "Anonymous"}</Td>
                <Td>{r.reason}</Td>
                <Td>{r.createdAt.slice(0, 10)}</Td>
                <Td><ReportStatusBadge status={r.status} /></Td>
                <Td className="whitespace-nowrap text-right">
                  {r.status === "pending" ? (
                    <>
                      <form className="inline" action={resolveReport.bind(null, r.id)}>
                        <button className={buttonClass("success")} type="submit">Resolve</button>
                      </form>{" "}
                      <form className="inline" action={dismissReport.bind(null, r.id)}>
                        <button className={buttonClass("outline")} type="submit">Dismiss</button>
                      </form>
                    </>
                  ) : (
                    <span className="text-[12px] text-admin-ink-3">{r.resolvedAt ? r.resolvedAt.slice(0, 10) : ""}</span>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState icon="🎉">Nothing here.</EmptyState>
        )}
      </SectionCard>
    </AdminPage>
  );
}
