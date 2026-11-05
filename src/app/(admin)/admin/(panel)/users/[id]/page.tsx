import { formatDate, formatDateTime } from "@/lib/admin/time";
/* eslint-disable @next/next/no-img-element */
import { photoSrc } from "@/lib/admin/photo";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPage from "../../../_components/AdminPage";
import ConfirmDeleteForm from "../../../_components/ConfirmDeleteForm";
import SubmitButton from "../../../_components/SubmitButton";
import { AccountStatusBadge, MatchStatusBadge, ReportStatusBadge, location } from "../../../_components/Badges";
import { Badge, EmptyState, KvRow, SectionCard, SectionTitle, TwoCol, buttonClass, cx } from "../../../_components/ui";
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
            <div className="min-w-0">
              <div className="text-[19px] font-bold tracking-tight text-admin-ink truncate">{user.name}, {user.age || "—"}</div>
              <div className="mt-1 text-[13px] text-admin-ink-2 truncate">{user.email}</div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <AccountStatusBadge user={user} />
                {user.plan === "premium" && <Badge tone="warning">Premium</Badge>}
                {user.isOnline ? <Badge tone="info">Online</Badge> : null}
              </div>
            </div>
          </div>

          <div className="mt-[18px]">
            <KvRow label="User ID">
              <span className="rounded bg-admin-brand/10 px-2 py-0.5 font-mono text-[12px] font-semibold text-admin-brand select-all">
                {user.publicUserId || `USR-${user.id.slice(-5)}`}
              </span>
            </KvRow>
            <KvRow label="Gender">{user.gender || "—"}</KvRow>
            <KvRow label="Location">{location(user)}</KvRow>
            <KvRow label="Bio">{user.bio || "—"}</KvRow>
            <KvRow label="Joined">{formatDate(user.createdAt)}</KvRow>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {user.isBanned ? (
              <form action={unbanUser.bind(null, user.id)} className="max-[480px]:w-full">
                <SubmitButton idleText="✅ Unban user" loadingText="Unbanning..." className={cx(buttonClass("success"), "max-[480px]:w-full max-[480px]:justify-center")} />
              </form>
            ) : (
              <form action={banUser.bind(null, user.id)} className="max-[480px]:w-full">
                <SubmitButton idleText="⛔ Ban user" loadingText="Banning..." className={cx(buttonClass("danger"), "max-[480px]:w-full max-[480px]:justify-center")} />
              </form>
            )}

            {!user.isVerified && (
              <form action={verifyUser.bind(null, user.id)} className="max-[480px]:w-full">
                <SubmitButton idleText="✅ Mark verified" loadingText="Verifying..." className={cx(buttonClass("outline"), "max-[480px]:w-full max-[480px]:justify-center")} />
              </form>
            )}

            <div className="max-[480px]:w-full">
              <ConfirmDeleteForm action={deleteUser.bind(null, user.id)} />
            </div>
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
