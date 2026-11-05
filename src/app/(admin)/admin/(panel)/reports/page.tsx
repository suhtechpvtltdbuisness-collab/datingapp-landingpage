import { formatDate, formatDateTime } from "@/lib/admin/time";
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
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/admin/users/${r.reportedUser.id}`} className={nameLink}>
                          {r.reportedUser.name}
                        </Link>
                        {r.reportedUser.isBanned ? <Badge tone="danger">Banned</Badge> : null}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        {r.reportedUser.publicUserId ? (
                          <span className="font-semibold text-admin-brand">{r.reportedUser.publicUserId}</span>
                        ) : (
                          <span>ID: {r.reportedUser.id}</span>
                        )}
                      </div>
                    </div>
                  ) : r.reportedUserId ? (
                    <div>
                      <Link href={`/admin/users/${r.reportedUserId}`} className={nameLink}>
                        {r.reportedUserName || "Unknown user"}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        ID: {r.reportedUserId}
                      </div>
                    </div>
                  ) : r.reportedUserName ? (
                    <div>
                      <span className="text-admin-ink-3">{r.reportedUserName} (account deleted)</span>
                    </div>
                  ) : (
                    <span className="text-admin-ink-3">Unknown user</span>
                  )}
                </Td>
                <Td>
                  {r.reporter ? (
                    <div>
                      <Link href={`/admin/users/${r.reporter.id}`} className={nameLink}>
                        {r.reporter.name}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        {r.reporter.publicUserId ? (
                          <span className="font-semibold text-admin-brand">{r.reporter.publicUserId}</span>
                        ) : (
                          <span>ID: {r.reporter.id}</span>
                        )}
                      </div>
                    </div>
                  ) : r.reporterId ? (
                    <div>
                      <Link href={`/admin/users/${r.reporterId}`} className={nameLink}>
                        Anonymous
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        ID: {r.reporterId}
                      </div>
                    </div>
                  ) : (
                    <span className="text-admin-ink-3">Anonymous</span>
                  )}
                </Td>
                <Td>{r.reason}</Td>
                <Td>{formatDate(r.createdAt)}</Td>
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
                    <span className="text-[12px] text-admin-ink-3">{r.resolvedAt ? formatDate(r.resolvedAt) : ""}</span>
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
