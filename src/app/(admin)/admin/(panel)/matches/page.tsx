import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../../_components/AdminPage";
import { MatchStatusBadge } from "../../_components/Badges";
import { EmptyState, SectionCard, Table, Td, nameLink } from "../../_components/ui";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminMatch, UserSummary } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Matches" };
export const dynamic = "force-dynamic";

function UserLink({ user }: { user: UserSummary | null }) {
  if (!user) return <span className="text-admin-ink-3">Deleted user</span>;
  return <Link href={`/admin/users/${user.id}`} className={nameLink}>{user.name}</Link>;
}

export default async function MatchesPage() {
  const admin = await requireAdmin();
  const { items: matches, pagination } = await apiList<AdminMatch>("/matches", { limit: 200 });

  return (
    <AdminPage admin={admin} heading="Matches" subheading={`${pagination.total} match${pagination.total !== 1 ? "es" : ""} recorded`}>
      <SectionCard>
        {matches.length ? (
          <Table head={["User A", "User B", "Status", "Matched on"]}>
            {matches.map((m) => (
              <tr key={m.id}>
                <Td><UserLink user={m.userA} /></Td>
                <Td><UserLink user={m.userB} /></Td>
                <Td><MatchStatusBadge status={m.status} /></Td>
                <Td>{m.matchedAt.slice(0, 10)}</Td>
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
