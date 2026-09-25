/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminPage from "../../../_components/AdminPage";
import ConfirmDeleteForm from "../../../_components/ConfirmDeleteForm";
import { AccountStatusBadge, MatchStatusBadge, ReportStatusBadge, location } from "../../../_components/Badges";
import { Badge, EmptyState, KvRow, SectionCard, SectionTitle, TwoCol, buttonClass } from "../../../_components/ui";
import { banUser, deleteUser, unbanUser, verifyUser } from "../../../actions";
import { all, get } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/session";
import type { MatchRow, ReportRow, UserRow } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** Only numeric ids are valid user pages; anything else is a 404. */
function parseId(raw: string): number {
  if (!/^\d+$/.test(raw)) notFound();
  return Number(raw);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const user = /^\d+$/.test(id) ? get<UserRow>("SELECT full_name FROM users WHERE id = ?", Number(id)) : undefined;
  return { title: user?.full_name ?? "User" };
}

export default async function UserDetailPage({ params }: { params: Params }) {
  const admin = await requireAdmin();
  const userId = parseId((await params).id);

  const user = get<UserRow>("SELECT * FROM users WHERE id = ?", userId);
  if (!user) redirect("/admin/users/missing");

  const matches = all<MatchRow & { other_name: string }>(
    `SELECT m.*,
            CASE WHEN m.user_a_id = ? THEN ub.full_name ELSE ua.full_name END AS other_name
     FROM matches m
     JOIN users ua ON ua.id = m.user_a_id
     JOIN users ub ON ub.id = m.user_b_id
     WHERE m.user_a_id = ? OR m.user_b_id = ?
     ORDER BY m.created_at DESC`,
    userId, userId, userId,
  );
  const reports = all<ReportRow>("SELECT * FROM reports WHERE reported_id = ? ORDER BY created_at DESC", userId);

  return (
    <AdminPage admin={admin} heading={user.full_name} subheading={<Link href="/admin/users">← Back to Users</Link>}>
      <TwoCol>
        <SectionCard>
          <div className="mb-2 flex items-center gap-5 max-[560px]:flex-wrap max-[560px]:gap-3.5">
            <img
              className="h-[84px] w-[84px] max-w-none rounded-[24px] object-cover align-baseline max-[560px]:h-[72px] max-[560px]:w-[72px]"
              src={user.photo_url || "https://i.pravatar.cc/200"}
              alt=""
            />
            <div>
              <div className="text-[20px] font-extrabold">{user.full_name}, {user.age || "—"}</div>
              <div className="mt-1 text-[13px] text-admin-ink-2">{user.email}</div>
              <div className="mt-2">
                <AccountStatusBadge user={user} />{" "}
                {user.plan === "premium" && <Badge tone="warning">Premium</Badge>}{" "}
                {user.is_online ? <Badge tone="info">Online</Badge> : null}
              </div>
            </div>
          </div>

          <div className="mt-[22px]">
            <KvRow label="Gender">{user.gender || "—"}</KvRow>
            <KvRow label="Location">{location(user)}</KvRow>
            <KvRow label="Bio">{user.bio || "—"}</KvRow>
            <KvRow label="Joined">{user.created_at.slice(0, 10)}</KvRow>
          </div>

          <div className="mt-5 flex gap-2.5 max-[560px]:flex-wrap">
            {user.is_banned ? (
              <form action={unbanUser.bind(null, user.id)}>
                <button className={buttonClass("success")} type="submit">✅ Unban user</button>
              </form>
            ) : (
              <form action={banUser.bind(null, user.id)}>
                <button className={buttonClass("danger")} type="submit">⛔ Ban user</button>
              </form>
            )}

            {!user.is_verified && (
              <form action={verifyUser.bind(null, user.id)}>
                <button className={buttonClass("outline")} type="submit">✅ Mark verified</button>
              </form>
            )}

            <ConfirmDeleteForm action={deleteUser.bind(null, user.id)} />
          </div>
        </SectionCard>

        <div>
          <SectionCard>
            <SectionTitle>Matches ({matches.length})</SectionTitle>
            {matches.length ? (
              matches.map((m) => (
                <KvRow key={m.id} label={m.other_name}>
                  <MatchStatusBadge status={m.status} />
                </KvRow>
              ))
            ) : (
              <EmptyState icon="💤" compact>No matches yet.</EmptyState>
            )}
          </SectionCard>

          <SectionCard>
            <SectionTitle>Reports against this user ({reports.length})</SectionTitle>
            {reports.length ? (
              reports.map((r) => (
                <KvRow key={r.id} label={r.reason}>
                  <ReportStatusBadge status={r.status} />
                </KvRow>
              ))
            ) : (
              <EmptyState icon="🎉" compact>No reports.</EmptyState>
            )}
          </SectionCard>
        </div>
      </TwoCol>
    </AdminPage>
  );
}
