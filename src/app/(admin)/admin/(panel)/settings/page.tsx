import { formatDate, formatDateTime } from "@/lib/admin/time";
import type { Metadata } from "next";
import AdminPage from "../../_components/AdminPage";
import { EmptyState, SectionCard, SectionTitle, TwoCol, buttonClass, cx, field, fieldLabel, nativeControl } from "../../_components/ui";
import { changePassword } from "../../actions";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { ActivityEntry } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

const passwordInput = cx(
  nativeControl,
  "w-full rounded-full border border-black/10 bg-white/[0.16] px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/65 focus:bg-white/[0.24]",
);

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const { items: activity } = await apiList<ActivityEntry>("/activity", { limit: 20 });

  return (
    <AdminPage admin={admin} heading="Settings" subheading="Manage your admin login & view recent activity">
      <TwoCol>
        <SectionCard>
          <SectionTitle>Change password</SectionTitle>
          <form action={changePassword}>
            <div className={field}>
              <label className={fieldLabel}>Current password</label>
              <input type="password" name="current_password" required className={passwordInput} />
            </div>
            <div className={field}>
              <label className={fieldLabel}>New password</label>
              <input type="password" name="new_password" required minLength={8} className={passwordInput} />
            </div>
            <div className={field}>
              <label className={fieldLabel}>Confirm new password</label>
              <input type="password" name="confirm_password" required minLength={8} className={passwordInput} />
            </div>
            <button className={buttonClass("danger", "px-[22px] py-3")} type="submit">Update password</button>
          </form>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Recent admin activity</SectionTitle>
          {activity.length ? (
            activity.map((a) => (
              <div
                key={a.id}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-black/[0.08] py-2.5 text-[13.5px] last:border-b-0 max-[560px]:flex-col max-[560px]:gap-1"
              >
                <span className="min-w-0 text-admin-ink-2 [overflow-wrap:anywhere]">
                  {a.adminUsername} — {a.action.replaceAll("_", " ")}{a.target ? ` (${a.target})` : ""}
                </span>
                <span className="shrink-0 whitespace-nowrap font-medium text-admin-ink-3">{formatDateTime(a.createdAt)}</span>
              </div>
            ))
          ) : (
            <EmptyState compact>No activity logged yet.</EmptyState>
          )}
        </SectionCard>
      </TwoCol>
    </AdminPage>
  );
}
