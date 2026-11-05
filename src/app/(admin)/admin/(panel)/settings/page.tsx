import { formatDate, formatDateTime } from "@/lib/admin/time";
import type { Metadata } from "next";
import {
  History,
  KeyRound,
  UserCheck,
  AlertTriangle,
  LogIn,
  LogOut,
  Trash2,
  Zap,
  Clock,
} from "lucide-react";
import AdminPage from "../../_components/AdminPage";
import ChangePasswordCard from "./ChangePasswordCard";
import { Badge, EmptyState } from "../../_components/ui";
import { apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { ActivityEntry } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Settings & Security" };
export const dynamic = "force-dynamic";

function getActionMeta(action: string) {
  const norm = action.toLowerCase();
  if (norm.includes("login") || norm.includes("sign_in")) {
    return {
      label: "Admin Signed In",
      badgeTone: "success" as const,
      icon: LogIn,
      iconColor: "text-emerald-500",
      bgTone: "bg-emerald-500/10",
    };
  }
  if (norm.includes("logout") || norm.includes("sign_out")) {
    return {
      label: "Session Ended",
      badgeTone: "neutral" as const,
      icon: LogOut,
      iconColor: "text-slate-500",
      bgTone: "bg-slate-500/10",
    };
  }
  if (norm.includes("ban")) {
    return {
      label: "User Banned",
      badgeTone: "danger" as const,
      icon: AlertTriangle,
      iconColor: "text-red-500",
      bgTone: "bg-red-500/10",
    };
  }
  if (norm.includes("unban")) {
    return {
      label: "User Unbanned",
      badgeTone: "success" as const,
      icon: UserCheck,
      iconColor: "text-emerald-500",
      bgTone: "bg-emerald-500/10",
    };
  }
  if (norm.includes("delete")) {
    return {
      label: "Record Deleted",
      badgeTone: "danger" as const,
      icon: Trash2,
      iconColor: "text-red-500",
      bgTone: "bg-red-500/10",
    };
  }
  if (norm.includes("password")) {
    return {
      label: "Password Updated",
      badgeTone: "warning" as const,
      icon: KeyRound,
      iconColor: "text-amber-500",
      bgTone: "bg-amber-500/10",
    };
  }
  return {
    label: action.replaceAll("_", " "),
    badgeTone: "info" as const,
    icon: Zap,
    iconColor: "text-purple-500",
    bgTone: "bg-purple-500/10",
  };
}

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const { items: activity } = await apiList<ActivityEntry>("/activity", { limit: 25 });
  const activityList = Array.isArray(activity) ? activity : [];

  return (
    <AdminPage
      admin={admin}
      heading="Settings"
      subheading="Manage your admin login & view recent activity"
    >
      {/* 
        =============================================================================
        [Commented out as requested]
        Auth Engine
        Argon2 / SHA-256
        =============================================================================
        <div className="rounded-[16px] border border-white/80 bg-white/70 px-3 py-1.5 backdrop-blur-md">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-admin-ink-3">Auth Engine</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-admin-ink">
            <Lock className="h-3.5 w-3.5 text-pink-500" />
            <span>Argon2 / SHA-256</span>
          </div>
        </div>
      */}

      {/* Two-Column Modern Grid (No background container box on mobile) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start mb-6">
        {/* Left Column: Password Update Form */}
        <div className="lg:col-span-5 min-w-0">
          <ChangePasswordCard />
        </div>

        {/* Right Column: Security Audit Trail */}
        <div className="lg:col-span-7 min-w-0">
          <div className="sm:rounded-[24px] sm:border sm:border-white/70 sm:bg-white/85 sm:p-6 sm:shadow-xs sm:backdrop-blur-xl bg-transparent border-0 p-0 shadow-none">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.06] gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
                  <History className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-admin-ink truncate">
                    Recent admin activity
                  </h3>
                  <p className="text-[10.5px] sm:text-[11.5px] text-admin-ink-3 truncate">
                    Audit trail of administrative actions
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-black/[0.08] bg-white px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-admin-ink-2 shadow-2xs">
                {activityList.length} events
              </span>
            </div>

            {/* Timeline Feed */}
            <div className="space-y-2.5">
              {activityList.length ? (
                activityList.map((a) => {
                  const meta = getActionMeta(a.action);
                  const IconComponent = meta.icon;

                  return (
                    <div
                      key={a.id}
                      className="group rounded-[18px] sm:rounded-[20px] border border-white/80 bg-white/90 p-3 sm:p-3.5 shadow-2xs backdrop-blur-sm transition hover:bg-white"
                    >
                      {/* Top Row: Icon + Label + Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.bgTone} ${meta.iconColor}`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-[12.5px] sm:text-[13px] font-bold text-admin-ink truncate capitalize">
                              {meta.label}
                            </div>
                            <div className="text-[11px] text-admin-ink-3 truncate">
                              by <span className="font-semibold text-admin-ink-2">{a.adminUsername}</span>
                              {a.target && (
                                <span className="ml-1.5 rounded bg-admin-brand/10 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-admin-brand">
                                  {a.target}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Badge tone={meta.badgeTone} className="shrink-0 text-[9px] py-0 px-1.5">
                          Logged
                        </Badge>
                      </div>

                      {/* Bottom Row: Clean Clock Icon + Timestamp (No overlapping text) */}
                      <div className="mt-2 pt-1.5 border-t border-black/[0.04] flex items-center gap-1.5 text-[10.5px] text-admin-ink-3 font-mono">
                        <Clock className="h-3 w-3 shrink-0 text-admin-ink-3" />
                        <span className="truncate">{formatDateTime(a.createdAt)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState icon="🛡️" compact>
                  <div className="text-[13px] font-medium text-admin-ink-2">No security events logged yet.</div>
                </EmptyState>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
