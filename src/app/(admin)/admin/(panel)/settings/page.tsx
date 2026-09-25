import type { Metadata } from "next";
import AdminPage from "../../_components/AdminPage";
import { EmptyState, KvRow, SectionCard, SectionTitle, TwoCol, buttonClass, cx, field, fieldLabel, nativeControl } from "../../_components/ui";
import { changePassword } from "../../actions";
import { all } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/session";
import type { ActivityRow } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

const passwordInput = cx(
  nativeControl,
  "w-full rounded-full border border-black/10 bg-white/[0.16] px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/65 focus:bg-white/[0.24]",
);

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const activity = all<ActivityRow>("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 20");

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
              <KvRow
                key={a.id}
                label={<>{a.admin_username} — {a.action.replaceAll("_", " ")}{a.target ? ` (${a.target})` : ""}</>}
                valueClassName="font-medium text-admin-ink-3"
              >
                {a.created_at.slice(0, 16).replace("T", " ")}
              </KvRow>
            ))
          ) : (
            <EmptyState compact>No activity logged yet.</EmptyState>
          )}
        </SectionCard>
      </TwoCol>
    </AdminPage>
  );
}
