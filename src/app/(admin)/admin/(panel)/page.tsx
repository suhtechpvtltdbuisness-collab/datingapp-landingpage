import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../_components/AdminPage";
import { ReportStatusBadge, location } from "../_components/Badges";
import {
  Avatar, Badge, EmptyState, SectionCard, SectionTitle, StatCard, StatGrid, Table, Td, TwoCol,
  buttonClass, emailText, nameText, userCell,
} from "../_components/ui";
import { all, count } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/session";
import type { ReportRow, UserRow } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const stats = {
    total_users: count("SELECT COUNT(*) c FROM users"),
    verified_users: count("SELECT COUNT(*) c FROM users WHERE is_verified = 1"),
    banned_users: count("SELECT COUNT(*) c FROM users WHERE is_banned = 1"),
    premium_users: count("SELECT COUNT(*) c FROM users WHERE plan = 'premium'"),
    total_matches: count("SELECT COUNT(*) c FROM matches"),
    pending_reports: count("SELECT COUNT(*) c FROM reports WHERE status = 'pending'"),
  };
  const recentUsers = all<UserRow>("SELECT * FROM users ORDER BY created_at DESC LIMIT 5");
  const recentReports = all<ReportRow & { reported_name: string }>(
    `SELECT reports.*, u.full_name AS reported_name
     FROM reports JOIN users u ON u.id = reports.reported_id
     ORDER BY reports.created_at DESC LIMIT 5`,
  );

  return (
    <AdminPage admin={admin} heading="Overview" subheading="Live snapshot of the DatingApp community">
      <StatGrid>
        <StatCard tone={1} icon="👥" value={stats.total_users} label="Total users" />
        <StatCard tone={2} icon="💘" value={stats.total_matches} label="Matches made" />
        <StatCard tone={3} icon="👑" value={stats.premium_users} label="Premium members" />
        <StatCard tone={4} icon="✅" value={stats.verified_users} label="Verified profiles" />
        <StatCard tone={6} icon="🚩" value={stats.pending_reports} label="Pending reports" />
        <StatCard tone={5} icon="⛔" value={stats.banned_users} label="Banned accounts" />
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
                      <Avatar src={u.photo_url || "https://i.pravatar.cc/100"} />
                      <div>
                        <div className={nameText}>{u.full_name}</div>
                        <div className={emailText}>{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{location(u)}</Td>
                  <Td>{u.plan === "premium" ? <Badge tone="warning">Premium</Badge> : <Badge tone="neutral">Free</Badge>}</Td>
                  <Td>{u.created_at.slice(0, 10)}</Td>
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
                  <Td className="font-semibold">{r.reported_name}</Td>
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
