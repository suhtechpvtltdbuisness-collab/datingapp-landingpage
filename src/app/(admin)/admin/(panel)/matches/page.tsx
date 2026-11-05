import { formatDate, formatDateTime } from "@/lib/admin/time";
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
  return (
    <div>
      <Link href={`/admin/users/${user.id}`} className={nameLink}>{user.name}</Link>
      <div className="mt-0.5 font-mono text-[11px] text-admin-brand font-semibold">
        {user.publicUserId || `USR-${user.id.slice(-5)}`}
      </div>
    </div>
  );
}

export default async function MatchesPage() {
  const admin = await requireAdmin();
  const { items: matches, pagination } = await apiList<AdminMatch>("/matches", { limit: 50 });
  const total = pagination?.total ?? matches.length;

  return (
    <AdminPage admin={admin} heading="Matches" subheading={`${total} match${total !== 1 ? "es" : ""} recorded`}>
      {matches.length ? (
        <>
          {/* 📱 Mobile Matches Cards (< 640px) - Direct cards, no outer box */}
          <div className="space-y-3 sm:hidden mb-6">
            {matches.map((m) => (
              <div
                key={m.id}
                className="rounded-[22px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-md transition hover:shadow-md"
              >
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-admin-ink-3">
                    Match Pair
                  </span>
                  <MatchStatusBadge status={m.status} />
                </div>

                <div className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-admin-ink-3">Partner 1</div>
                    <UserLink user={m.userA} />
                  </div>

                  <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-pink-500/10 text-admin-brand text-[12px] font-bold">
                    💘
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <div className="text-[10px] uppercase font-bold text-admin-ink-3">Partner 2</div>
                    <UserLink user={m.userB} />
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-admin-ink-3">
                  <span>Matched on:</span>
                  <span className="font-medium text-admin-ink-2">{formatDate(m.matchedAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 Desktop Table (>= 640px) inside SectionCard */}
          <div className="hidden sm:block">
            <SectionCard>
              <Table head={["User A", "User B", "Status", "Matched on"]}>
                {matches.map((m) => (
                  <tr key={m.id}>
                    <Td><UserLink user={m.userA} /></Td>
                    <Td><UserLink user={m.userB} /></Td>
                    <Td><MatchStatusBadge status={m.status} /></Td>
                    <Td>{formatDate(m.matchedAt)}</Td>
                  </tr>
                ))}
              </Table>
            </SectionCard>
          </div>
        </>
      ) : (
        <SectionCard>
          <EmptyState icon="💤">No matches recorded yet.</EmptyState>
        </SectionCard>
      )}
    </AdminPage>
  );
}
