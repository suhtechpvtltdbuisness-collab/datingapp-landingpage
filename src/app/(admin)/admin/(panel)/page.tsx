import { formatDate, formatDateTime } from "@/lib/admin/time";
import { photoSrc } from "@/lib/admin/photo";
import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../_components/AdminPage";
import { ReportStatusBadge, location } from "../_components/Badges";
import {
  Avatar, Badge, EmptyState, SectionCard, SectionTitle, StatCard, StatGrid, Table, Td, TwoCol,
  buttonClass, emailText, nameText, userCell,
} from "../_components/ui";
import { api } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminReport, AdminStats, AdminUser } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const { data } = await api<{ stats: AdminStats; recentUsers: AdminUser[]; recentReports: AdminReport[] }>("/dashboard");
  const { stats, recentUsers, recentReports } = data;

  return (
    <AdminPage admin={admin} heading="Overview" subheading="Live snapshot of the DatingApp community">
      <StatGrid>
        <StatCard tone={1} icon="👥" value={stats.totalUsers} label="Total users" />
        <StatCard tone={2} icon="💘" value={stats.totalMatches} label="Matches made" />
        <StatCard tone={3} icon="👑" value={stats.premiumUsers} label="Premium members" />
        <StatCard tone={4} icon="✅" value={stats.verifiedUsers} label="Verified profiles" />
        <StatCard tone={6} icon="🚩" value={stats.pendingReports} label="Pending reports" />
        <StatCard tone={5} icon="⛔" value={stats.bannedUsers} label="Banned accounts" />
      </StatGrid>

      <TwoCol>
        {/* Left Col: Newest Signups */}
        <div>
          {/* 📱 Mobile View (< 640px): No outer background box */}
          <div className="mb-6 sm:hidden">
            <SectionTitle>
              <span>Newest signups</span>
              <Link href="/admin/users" className={buttonClass("ghost")}>View all →</Link>
            </SectionTitle>
            {recentUsers.length ? (
              <div className="space-y-2.5">
                {recentUsers.map((u) => (
                  <Link
                    key={u.id}
                    href={`/admin/users/${u.id}`}
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-white/70 bg-white/85 p-3.5 shadow-xs backdrop-blur-md transition hover:bg-white"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar src={photoSrc(u.photoUrl)} />
                      <div className="min-w-0">
                        <div className="font-bold text-[13.5px] text-admin-ink truncate">{u.name}</div>
                        <div className="text-[11px] text-admin-ink-3 truncate">📍 {location(u)}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {u.plan === "premium" ? <Badge tone="warning">Premium</Badge> : <Badge tone="neutral">Free</Badge>}
                      <div className="mt-1 text-[10.5px] text-admin-ink-3">{formatDate(u.createdAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon="🙈">No users yet.</EmptyState>
            )}
          </div>

          {/* 💻 Desktop View (>= 640px): Table inside SectionCard */}
          <div className="hidden sm:block">
            <SectionCard>
              <SectionTitle>
                <span>Newest signups</span>
                <Link href="/admin/users" className={buttonClass("ghost")}>View all →</Link>
              </SectionTitle>
              {recentUsers.length ? (
                <Table head={["User", "Location", "Plan", "Joined"]}>
                  {recentUsers.map((u) => (
                    <tr key={u.id}>
                      <Td>
                        <div className={userCell}>
                          <Avatar src={photoSrc(u.photoUrl)} />
                          <div>
                            <div className={nameText}>{u.name}</div>
                            <div className={emailText}>{u.email}</div>
                          </div>
                        </div>
                      </Td>
                      <Td>{location(u)}</Td>
                      <Td>{u.plan === "premium" ? <Badge tone="warning">Premium</Badge> : <Badge tone="neutral">Free</Badge>}</Td>
                      <Td>{formatDate(u.createdAt)}</Td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <EmptyState icon="🙈">No users yet.</EmptyState>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Right Col: Latest Reports */}
        <div>
          {/* 📱 Mobile View (< 640px): No outer background box */}
          <div className="mb-6 sm:hidden">
            <SectionTitle>
              <span>Latest reports</span>
              <Link href="/admin/reports" className={buttonClass("ghost")}>View all →</Link>
            </SectionTitle>
            {recentReports.length ? (
              <div className="space-y-2.5">
                {recentReports.map((r) => (
                  <Link
                    key={r.id}
                    href="/admin/reports"
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-white/70 bg-white/85 p-3.5 shadow-xs backdrop-blur-md transition hover:bg-white"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[13.5px] text-admin-ink truncate">
                        {r.reportedUser?.name ?? r.reportedUserName ?? "Unknown user"}
                      </div>
                      <div className="text-[11px] text-admin-ink-3 truncate">{r.reason}</div>
                    </div>
                    <div className="shrink-0">
                      <ReportStatusBadge status={r.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon="🎉">No reports — all clear.</EmptyState>
            )}
          </div>

          {/* 💻 Desktop View (>= 640px): Table inside SectionCard */}
          <div className="hidden sm:block">
            <SectionCard>
              <SectionTitle>
                <span>Latest reports</span>
                <Link href="/admin/reports" className={buttonClass("ghost")}>View all →</Link>
              </SectionTitle>
              {recentReports.length ? (
                <Table head={["Reported", "Reason", "Status"]}>
                  {recentReports.map((r) => (
                    <tr key={r.id}>
                      <Td className="font-semibold">
                        {r.reportedUser?.name ?? r.reportedUserName ?? "Unknown user"}
                      </Td>
                      <Td>{r.reason}</Td>
                      <Td><ReportStatusBadge status={r.status} /></Td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <EmptyState icon="🎉">No reports — all clear.</EmptyState>
              )}
            </SectionCard>
          </div>
        </div>
      </TwoCol>
    </AdminPage>
  );
}
