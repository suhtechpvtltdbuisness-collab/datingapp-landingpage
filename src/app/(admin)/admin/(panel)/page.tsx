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
        <SectionCard>
          <SectionTitle>
            Newest signups
            <Link href="/admin/users" className={buttonClass("ghost")}>View all →</Link>
          </SectionTitle>
          {recentUsers.length ? (
            <Table head={["User", "Location", "Plan", "Joined"]}>
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <Td>
                    <div className={userCell}>
                      <Avatar src={u.photoUrl || "https://i.pravatar.cc/100"} />
                      <div>
                        <div className={nameText}>{u.name}</div>
                        <div className={emailText}>{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{location(u)}</Td>
                  <Td>{u.plan === "premium" ? <Badge tone="warning">Premium</Badge> : <Badge tone="neutral">Free</Badge>}</Td>
                  <Td>{u.createdAt.slice(0, 10)}</Td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState icon="🙈">No users yet.</EmptyState>
          )}
        </SectionCard>

        <SectionCard>
          <SectionTitle>
            Latest reports
            <Link href="/admin/reports" className={buttonClass("ghost")}>View all →</Link>
          </SectionTitle>
          {recentReports.length ? (
            <Table head={["Reported", "Reason", "Status"]}>
              {recentReports.map((r) => (
                <tr key={r.id}>
                  <Td className="font-semibold">{(r.reportedUser?.name ?? "Deleted user")}</Td>
                  <Td>{r.reason}</Td>
                  <Td><ReportStatusBadge status={r.status} /></Td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState icon="🎉">No reports — all clear.</EmptyState>
          )}
        </SectionCard>
      </TwoCol>
    </AdminPage>
  );
}
