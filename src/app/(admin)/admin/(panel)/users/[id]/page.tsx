/* eslint-disable @next/next/no-img-element */
import { photoSrc } from "@/lib/admin/photo";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPage from "../../../_components/AdminPage";
import ConfirmDeleteForm from "../../../_components/ConfirmDeleteForm";
import { AccountStatusBadge, MatchStatusBadge, ReportStatusBadge, location } from "../../../_components/Badges";
import { Badge, EmptyState, KvRow, SectionCard, SectionTitle, TwoCol, buttonClass } from "../../../_components/ui";
import { banUser, deleteUser, unbanUser, verifyUser } from "../../../actions";
import { ApiError, api } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { UserDetail } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** A missing user (or a malformed id) lands on the "User not found." redirect. */
async function loadUser(id: string): Promise<UserDetail> {
  try {
    return (await api<UserDetail>(`/users/${encodeURIComponent(id)}`)).data;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) redirect("/admin/users/missing");
    throw err;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const detail = await api<UserDetail>(`/users/${encodeURIComponent(id)}`).catch(() => null);
  return { title: detail?.data.user.name ?? "User" };
}

export default async function UserDetailPage({ params }: { params: Params }) {
  const admin = await requireAdmin();
  const { user, matches, reports } = await loadUser((await params).id);

  return (
    <AdminPage admin={admin} heading={user.name} subheading={<Link href="/admin/users">← Back to Users</Link>}>
      <TwoCol>
        <SectionCard>
          <div className="mb-2 flex items-center gap-5 max-[560px]:flex-wrap max-[560px]:gap-3.5">
            <img
              className="h-[84px] w-[84px] max-w-none rounded-[24px] object-cover align-baseline max-[560px]:h-[72px] max-[560px]:w-[72px]"
              src={photoSrc(user.photoUrl)}
              alt=""
            />
            <div>
              <div className="text-[20px] font-extrabold">{user.name}, {user.age || "—"}</div>
              <div className="mt-1 text-[13px] text-admin-ink-2">{user.email}</div>
              <div className="mt-2">
                <AccountStatusBadge user={user} />{" "}
                {user.plan === "premium" && <Badge tone="warning">Premium</Badge>}{" "}
                {user.isOnline ? <Badge tone="info">Online</Badge> : null}
              </div>
            </div>
          </div>

          <div className="mt-[22px]">
            <KvRow label="Gender">{user.gender || "—"}</KvRow>
            <KvRow label="Location">{location(user)}</KvRow>
            <KvRow label="Bio">{user.bio || "—"}</KvRow>
            <KvRow label="Joined">{user.createdAt.slice(0, 10)}</KvRow>
          </div>

          <div className="mt-5 flex gap-2.5 max-[560px]:flex-wrap">
            {user.isBanned ? (
              <form action={unbanUser.bind(null, user.id)}>
                <button className={buttonClass("success")} type="submit">✅ Unban user</button>
              </form>
            ) : (
              <form action={banUser.bind(null, user.id)}>
                <button className={buttonClass("danger")} type="submit">⛔ Ban user</button>
              </form>
            )}

            {!user.isVerified && (
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
                <KvRow key={m.id} label={m.matchedUser?.name ?? "Deleted user"}>
                  <MatchStatusBadge status="active" />
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
