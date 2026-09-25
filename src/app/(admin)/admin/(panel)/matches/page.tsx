import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../../_components/AdminPage";
import { MatchStatusBadge } from "../../_components/Badges";
import { EmptyState, SectionCard, Table, Td, nameLink } from "../../_components/ui";
import { all } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/session";
import type { MatchRow } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Matches" };
export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const admin = await requireAdmin();
  const matches = all<MatchRow & { user_a_name: string; user_b_name: string }>(
    `SELECT m.*, ua.full_name AS user_a_name, ub.full_name AS user_b_name
     FROM matches m
     JOIN users ua ON ua.id = m.user_a_id
     JOIN users ub ON ub.id = m.user_b_id
     ORDER BY m.created_at DESC`,
  );

  return (
    <AdminPage admin={admin} heading="Matches" subheading={`${matches.length} match${matches.length !== 1 ? "es" : ""} recorded`}>
      <SectionCard>
        {matches.length ? (
          <Table head={["User A", "User B", "Status", "Matched on"]}>
            {matches.map((m) => (
              <tr key={m.id}>
                <Td><Link href={`/admin/users/${m.user_a_id}`} className={nameLink}>{m.user_a_name}</Link></Td>
                <Td><Link href={`/admin/users/${m.user_b_id}`} className={nameLink}>{m.user_b_name}</Link></Td>
                <Td><MatchStatusBadge status={m.status} /></Td>
                <Td>{m.created_at.slice(0, 10)}</Td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState icon="💤">No matches recorded yet.</EmptyState>
        )}
      </SectionCard>
    </AdminPage>
  );
}
