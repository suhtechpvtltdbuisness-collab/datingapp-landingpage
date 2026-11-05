import { photoSrc } from "@/lib/admin/photo";
import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../../_components/AdminPage";
import SmartSearchBar from "../../_components/SmartSearchBar";
import { AccountStatusBadge, location } from "../../_components/Badges";
import {
  Avatar, Badge, EmptyState, SectionCard, Table, Td, buttonClass, emailText, nameLink, userCell,
} from "../../_components/ui";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = params.status ?? "all";

  const { items: users, pagination } = await apiList<AdminUser>("/users", { q, status, limit: 50 });
  const total = pagination?.total ?? users.length;

  return (
    <AdminPage admin={admin} heading="Users" subheading={`${total} account${total !== 1 ? "s" : ""}`}>
      <SmartSearchBar initialQuery={q} status={status} />

      {/* 📱 Mobile Card Queue (< 640px): No outer background box on mobile */}
      <div className="space-y-3 sm:hidden mb-6">
        {users.length ? (
          users.map((u) => {
            const publicId = u.publicUserId || `USR-${u.id.slice(-5)}`;
            return (
              <div
                key={u.id}
                className="rounded-[22px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-md transition hover:shadow-md"
              >
                {/* User profile header */}
                <div className="flex items-start gap-3">
                  <Avatar src={photoSrc(u.photoUrl)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link href={`/admin/users/${u.id}`} className={nameLink}>
                        {u.name}
                      </Link>
                      <span className="rounded bg-admin-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-admin-brand">
                        {publicId}
                      </span>
                    </div>
                    <div className={emailText}>{u.email}</div>
                  </div>
                </div>

                {/* Status & Plan Badges */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <AccountStatusBadge user={u} />
                  {u.isOnline && <Badge tone="info">Online</Badge>}
                  {u.plan === "premium" ? (
                    <Badge tone="warning">Premium</Badge>
                  ) : (
                    <Badge tone="neutral">Free</Badge>
                  )}
                </div>

                {/* Details: Location & Age */}
                <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-admin-ink-2 pt-2 border-t border-black/[0.05]">
                  <span className="truncate">📍 {location(u)}</span>
                  <span className="shrink-0 text-admin-ink-3">Age: {u.age || "—"}</span>
                </div>

                {/* Action link */}
                <div className="mt-3 pt-2.5 border-t border-black/[0.05]">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white py-2 text-[12.5px] font-semibold text-admin-ink shadow-2xs hover:border-pink-300 hover:bg-pink-50/50 hover:text-admin-brand transition"
                  >
                    <span>View Profile</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState icon="🔍">No users match this filter.</EmptyState>
        )}
      </div>

      {/* 💻 Desktop Table (>= 640px): Standard table inside SectionCard */}
      <div className="hidden sm:block">
        <SectionCard>
          {users.length ? (
            <Table head={["User", "Location", "Age", "Status", "Plan", "Action"]}>
              {users.map((u) => (
                <tr key={u.id}>
                  <Td>
                    <Link className={userCell} href={`/admin/users/${u.id}`}>
                      <Avatar src={photoSrc(u.photoUrl)} />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={nameLink}>{u.name}</span>
                          {u.publicUserId ? (
                            <span className="rounded bg-admin-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-admin-brand">
                              {u.publicUserId}
                            </span>
                          ) : (
                            <span className="rounded bg-admin-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-admin-brand">
                              USR-{u.id.slice(-5)}
                            </span>
                          )}
                        </div>
                        <div className={emailText}>{u.email}</div>
                      </div>
                    </Link>
                  </Td>
                  <Td>{location(u)}</Td>
                  <Td>{u.age || "—"}</Td>
                  <Td>
                    <AccountStatusBadge user={u} />{" "}
                    {u.isOnline ? <Badge tone="info">Online</Badge> : null}
                  </Td>
                  <Td>{u.plan === "premium" ? <Badge tone="warning">Premium</Badge> : "Free"}</Td>
                  <Td className="whitespace-nowrap text-right">
                    <Link className={buttonClass("outline")} href={`/admin/users/${u.id}`}>View</Link>
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState icon="🔍">No users match this filter.</EmptyState>
          )}
        </SectionCard>
      </div>
    </AdminPage>
  );
}
