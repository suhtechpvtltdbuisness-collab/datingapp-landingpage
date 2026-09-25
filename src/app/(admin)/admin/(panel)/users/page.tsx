import type { Metadata } from "next";
import Link from "next/link";
import AdminPage from "../../_components/AdminPage";
import StatusSelect from "../../_components/StatusSelect";
import { AccountStatusBadge, location } from "../../_components/Badges";
import {
  Avatar, Badge, EmptyState, SectionCard, Table, Td, buttonClass, cx, emailText, nameLink, nativeControl, nativeControlColors, userCell,
} from "../../_components/ui";
import { all } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/session";
import type { UserRow } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = params.status ?? "all";

  const conditions: string[] = [];
  const values: string[] = [];
  if (q) {
    conditions.push("(full_name LIKE ? OR email LIKE ?)");
    values.push(`%${q}%`, `%${q}%`);
  }
  if (status === "verified") conditions.push("is_verified = 1");
  else if (status === "banned") conditions.push("is_banned = 1");
  else if (status === "premium") conditions.push("plan = 'premium'");

  let query = "SELECT * FROM users";
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC";
  const users = all<UserRow>(query, ...values);

  return (
    <AdminPage admin={admin} heading="Users" subheading={`${users.length} account${users.length !== 1 ? "s" : ""}`}>
      <form className="mb-[18px] flex gap-2.5 max-[860px]:flex-wrap" method="get">
        <input
          type="text"
          name="q"
          placeholder="Search by name or email…"
          defaultValue={q}
          className={cx(nativeControl, nativeControlColors, "flex-1 rounded-full border border-black/[0.08] bg-white px-4 py-[11px] text-[13.5px] outline-none focus:border-admin-primary max-[860px]:basis-full")}
        />
        <StatusSelect status={status} />
        <button className={buttonClass("outline")} type="submit">Search</button>
      </form>

      <SectionCard>
        {users.length ? (
          <Table head={["User", "Location", "Age", "Status", "Plan", ""]}>
            {users.map((u) => (
              <tr key={u.id}>
                <Td>
                  <Link className={userCell} href={`/admin/users/${u.id}`}>
                    <Avatar src={u.photo_url || "https://i.pravatar.cc/100"} />
                    <div>
                      <div className={nameLink}>{u.full_name}</div>
                      <div className={emailText}>{u.email}</div>
                    </div>
                  </Link>
                </Td>
                <Td>{location(u)}</Td>
                <Td>{u.age || "—"}</Td>
                <Td>
                  <AccountStatusBadge user={u} />{" "}
                  {u.is_online ? <Badge tone="info">Online</Badge> : null}
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
    </AdminPage>
  );
}
