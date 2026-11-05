"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  MessageSquare,
  ShieldAlert,
  User,
  X,
  XCircle,
} from "lucide-react";
import { ReportStatusBadge } from "../../_components/Badges";
import SubmitButton from "../../_components/SubmitButton";
import { Badge, EmptyState, SectionCard, Table, Td, buttonClass, nameLink } from "../../_components/ui";
import { dismissReport, resolveReport } from "../../actions";
import { formatDate, formatDateTime } from "@/lib/admin/time";
import type { AdminReport } from "@/lib/admin/types";

interface Props {
  reports: AdminReport[];
}

function formatPublicId(publicUserId?: string | null, id?: string | null): string {
  if (publicUserId && publicUserId.trim().length > 0) return publicUserId;
  if (id && id.trim().length > 0) {
    const cleaned = id.replace(/[^a-zA-Z0-9]/g, "");
    return `USR-${cleaned.slice(-5).toUpperCase()}`;
  }
  return "N/A";
}

export default function ReportsTable({ reports }: Props) {
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);

  if (!reports.length) {
    return <EmptyState icon="🎉">Nothing here. No reports found in this queue.</EmptyState>;
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: Responsive Queue Cards (Visible on screens < 640px) */}
      {/* ========================================================================= */}
      <div className="space-y-3 sm:hidden mb-6">
        {reports.map((r) => {
          const hasDetails = Boolean(r.details && r.details.trim().length > 0);
          const reportedPublicId = formatPublicId(
            r.reportedUser?.publicUserId,
            r.reportedUser?.id || r.reportedUserId,
          );
          const reporterPublicId = formatPublicId(
            r.reporter?.publicUserId,
            r.reporter?.id || r.reporterId,
          );
          const reportedName = r.reportedUser?.name || r.reportedUserName || "Unknown user";
          const reporterName = r.reporter?.name || (r.reporterId ? "Anonymous" : "Anonymous user");

          return (
            <div
              key={r.id}
              className="rounded-[22px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-md transition hover:shadow-md"
            >
              {/* Card Header: User & Status Badge */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-black/[0.05]">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-admin-ink-3">
                    Reported User
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    {r.reportedUser?.id || r.reportedUserId ? (
                      <Link
                        href={`/admin/users/${r.reportedUser?.id || r.reportedUserId}`}
                        className="font-bold text-[14px] text-admin-ink hover:text-admin-brand truncate"
                      >
                        {reportedName}
                      </Link>
                    ) : (
                      <span className="font-bold text-[14px] text-admin-ink">{reportedName}</span>
                    )}
                    {r.reportedUser?.isBanned ? <Badge tone="danger">Banned</Badge> : null}
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-admin-brand">
                    {reportedPublicId}
                  </div>
                </div>

                <div className="shrink-0">
                  <ReportStatusBadge status={r.status} />
                </div>
              </div>

              {/* Card Meta: Reporter & Reason */}
              <div className="py-2.5 space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between gap-2 text-admin-ink-2">
                  <span className="text-admin-ink-3">Reported by:</span>
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <span>{reporterName}</span>
                    <span className="font-mono text-[10.5px] text-admin-brand font-semibold">
                      ({reporterPublicId})
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-admin-ink-3 shrink-0">Reason:</span>
                  <span className="font-semibold text-admin-ink text-right">{r.reason}</span>
                </div>

                {hasDetails && (
                  <button
                    type="button"
                    onClick={() => setSelectedReport(r)}
                    className="w-full flex items-center justify-between rounded-lg bg-pink-500/5 px-2.5 py-1.5 text-left text-[11px] text-admin-ink-2 hover:bg-pink-500/10 transition"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MessageSquare className="h-3 w-3 shrink-0 text-pink-500" />
                      <span className="truncate italic">&quot;{r.details}&quot;</span>
                    </div>
                    <span className="shrink-0 text-[10.5px] font-bold text-pink-600 underline ml-1">
                      Read
                    </span>
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] text-admin-ink-3 pt-1">
                  <span>Filed: {formatDate(r.createdAt)}</span>
                  {r.resolvedAt && <span>Resolved: {formatDate(r.resolvedAt)}</span>}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(r)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-black/10 bg-white py-1.5 text-[12px] font-semibold text-admin-ink hover:border-pink-300 hover:bg-pink-50/50 hover:text-admin-brand transition shadow-2xs cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>

                {r.status === "pending" && (
                  <>
                    <form action={resolveReport.bind(null, r.id)} className="flex-1">
                      <SubmitButton
                        idleText="Resolve"
                        loadingText="..."
                        className="w-full inline-flex cursor-pointer items-center justify-center rounded-full bg-emerald-600 py-1.5 text-[12px] font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
                      />
                    </form>
                    <form action={dismissReport.bind(null, r.id)} className="flex-1">
                      <SubmitButton
                        idleText="Dismiss"
                        loadingText="..."
                        className="w-full inline-flex cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white py-1.5 text-[12px] font-semibold text-admin-ink shadow-2xs hover:bg-gray-50 transition"
                      />
                    </form>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: Full Table (Visible on screens >= 640px) */}
      {/* ========================================================================= */}
      <div className="hidden sm:block">
        <SectionCard>
          <Table head={["Reported user", "Reported by", "Reason", "Filed", "Status", "Action"]}>
            {reports.map((r) => {
            const hasDetails = Boolean(r.details && r.details.trim().length > 0);
            const reportedPublicId = formatPublicId(
              r.reportedUser?.publicUserId,
              r.reportedUser?.id || r.reportedUserId,
            );
            const reporterPublicId = formatPublicId(
              r.reporter?.publicUserId,
              r.reporter?.id || r.reporterId,
            );

            return (
              <tr key={r.id} className="transition-colors hover:bg-black/[0.015]">
                {/* Reported User */}
                <Td>
                  {r.reportedUser ? (
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/admin/users/${r.reportedUser.id}`} className={nameLink}>
                          {r.reportedUser.name}
                        </Link>
                        {r.reportedUser.isBanned ? <Badge tone="danger">Banned</Badge> : null}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        <span className="font-semibold text-admin-brand">{reportedPublicId}</span>
                      </div>
                    </div>
                  ) : r.reportedUserId ? (
                    <div>
                      <Link href={`/admin/users/${r.reportedUserId}`} className={nameLink}>
                        {r.reportedUserName || "Unknown user"}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        <span className="font-semibold text-admin-brand">{reportedPublicId}</span>
                      </div>
                    </div>
                  ) : r.reportedUserName ? (
                    <div>
                      <span className="text-admin-ink-3">{r.reportedUserName} (account deleted)</span>
                    </div>
                  ) : (
                    <span className="text-admin-ink-3">Unknown user</span>
                  )}
                </Td>

                {/* Reported By */}
                <Td>
                  {r.reporter ? (
                    <div>
                      <Link href={`/admin/users/${r.reporter.id}`} className={nameLink}>
                        {r.reporter.name}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        <span className="font-semibold text-admin-brand">{reporterPublicId}</span>
                      </div>
                    </div>
                  ) : r.reporterId ? (
                    <div>
                      <Link href={`/admin/users/${r.reporterId}`} className={nameLink}>
                        Anonymous
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3">
                        <span className="font-semibold text-admin-brand">{reporterPublicId}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-admin-ink-3">Anonymous</span>
                  )}
                </Td>

                {/* Reason & Details */}
                <Td>
                  <div className="space-y-1">
                    <div className="font-semibold text-admin-ink">{r.reason}</div>
                    {hasDetails ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReport(r)}
                        className="group flex max-w-[240px] cursor-pointer items-center gap-1.5 rounded-lg bg-pink-500/5 px-2 py-1 text-left text-[11px] text-admin-ink-2 transition hover:bg-pink-500/10 hover:text-pink-600"
                      >
                        <MessageSquare className="h-3 w-3 shrink-0 text-pink-500" />
                        <span className="truncate">&quot;{r.details}&quot;</span>
                        <span className="shrink-0 text-[10px] font-bold text-pink-600 underline opacity-0 group-hover:opacity-100">
                          View
                        </span>
                      </button>
                    ) : null}
                  </div>
                </Td>

                {/* Filed Date */}
                <Td className="whitespace-nowrap font-medium text-admin-ink-2">
                  {formatDate(r.createdAt)}
                </Td>

                {/* Status */}
                <Td>
                  <ReportStatusBadge status={r.status} />
                </Td>

                {/* Action Column */}
                <Td className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedReport(r)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[12px] font-bold text-admin-ink shadow-sm transition hover:border-pink-300 hover:bg-pink-50/50 hover:text-admin-brand"
                      title="View Full Report Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </button>

                    {r.status === "pending" ? (
                      <>
                        <form className="inline" action={resolveReport.bind(null, r.id)}>
                          <SubmitButton
                            idleText="Resolve"
                            loadingText="Resolving..."
                            className={buttonClass("success")}
                          />
                        </form>{" "}
                        <form className="inline" action={dismissReport.bind(null, r.id)}>
                          <SubmitButton
                            idleText="Dismiss"
                            loadingText="Dismissing..."
                            className={buttonClass("outline")}
                          />
                        </form>
                      </>
                    ) : (
                      <span className="text-[12px] text-admin-ink-3 font-mono">
                        {r.resolvedAt ? formatDate(r.resolvedAt) : ""}
                      </span>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </Table>
        </SectionCard>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 REPORT DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedReport(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-[580px] max-h-[92vh] overflow-y-auto rounded-[24px] sm:rounded-[30px] border border-white/70 bg-white/95 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-black/[0.06] gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF3D77] to-purple-600 text-white shadow-md">
                  <ShieldAlert className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-admin-ink truncate">
                      Report #{selectedReport.id.slice(-6).toUpperCase()}
                    </h3>
                    <ReportStatusBadge status={selectedReport.status} />
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-admin-ink-3 truncate">
                    Submitted by community user for review
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-full p-1.5 text-admin-ink-3 hover:bg-black/[0.05] hover:text-admin-ink transition shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4">
              {/* Reason Highlight */}
              <div className="rounded-[18px] border border-pink-100 bg-gradient-to-r from-pink-500/5 to-purple-500/5 p-3.5 sm:p-4">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-admin-ink-3">
                  Report Reason
                </div>
                <div className="mt-1 text-[15px] sm:text-[16px] font-bold text-admin-brand">
                  {selectedReport.reason}
                </div>
              </div>

              {/* User Description / Comments */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-admin-ink-2 mb-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                  <span>Reporter Details &amp; Comments</span>
                </div>

                <div className="rounded-[18px] border border-black/[0.07] bg-black/[0.02] p-3.5 sm:p-4 text-[13px] sm:text-[13.5px] leading-relaxed text-admin-ink [overflow-wrap:anywhere] break-words">
                  {selectedReport.details && selectedReport.details.trim().length > 0 ? (
                    <blockquote className="italic text-admin-ink [overflow-wrap:anywhere] break-words">
                      &quot;{selectedReport.details}&quot;
                    </blockquote>
                  ) : (
                    <div className="italic text-admin-ink-3">
                      No additional written description was provided with this report.
                    </div>
                  )}
                </div>
              </div>

              {/* Profiles comparison grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Reported User Card */}
                <div className="rounded-[18px] border border-black/[0.07] bg-white/70 p-3.5 sm:p-4">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-red-500 mb-1">
                    Accused / Reported User
                  </div>
                  <div className="font-bold text-[14px] sm:text-[14.5px] text-admin-ink truncate">
                    {selectedReport.reportedUser?.name ||
                      selectedReport.reportedUserName ||
                      "Unknown user"}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3 truncate">
                    ID:{" "}
                    <span className="font-semibold text-admin-brand">
                      {formatPublicId(
                        selectedReport.reportedUser?.publicUserId,
                        selectedReport.reportedUser?.id || selectedReport.reportedUserId,
                      )}
                    </span>
                  </div>
                  {selectedReport.reportedUser?.isBanned && (
                    <div className="mt-1">
                      <Badge tone="danger">Currently Banned</Badge>
                    </div>
                  )}

                  {(selectedReport.reportedUser?.id || selectedReport.reportedUserId) && (
                    <Link
                      href={`/admin/users/${selectedReport.reportedUser?.id || selectedReport.reportedUserId}`}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] sm:text-[12px] font-semibold text-admin-brand hover:underline"
                    >
                      <span>Inspect Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Reporter Card */}
                <div className="rounded-[18px] border border-black/[0.07] bg-white/70 p-3.5 sm:p-4">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-admin-ink-3 mb-1">
                    Filed By (Reporter)
                  </div>
                  <div className="font-bold text-[14px] sm:text-[14.5px] text-admin-ink truncate">
                    {selectedReport.reporter?.name || "Anonymous User"}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-admin-ink-3 truncate">
                    ID:{" "}
                    <span className="font-semibold text-admin-brand">
                      {formatPublicId(
                        selectedReport.reporter?.publicUserId,
                        selectedReport.reporter?.id || selectedReport.reporterId,
                      )}
                    </span>
                  </div>

                  {(selectedReport.reporter?.id || selectedReport.reporterId) && (
                    <Link
                      href={`/admin/users/${selectedReport.reporter?.id || selectedReport.reporterId}`}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] sm:text-[12px] font-semibold text-admin-brand hover:underline"
                    >
                      <span>Inspect Reporter</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="rounded-[16px] bg-black/[0.02] p-3 text-[11.5px] sm:text-[12px] text-admin-ink-2 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 text-admin-ink-3 shrink-0">
                    <Clock className="h-3.5 w-3.5" /> Filed At:
                  </span>
                  <span className="font-mono font-medium truncate">{formatDateTime(selectedReport.createdAt)}</span>
                </div>
                {selectedReport.resolvedAt && (
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/[0.04]">
                    <span className="flex items-center gap-1 text-admin-ink-3 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Resolved At:
                    </span>
                    <span className="font-mono font-medium truncate">{formatDateTime(selectedReport.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-full sm:w-auto rounded-full px-4 py-2 text-[13px] font-semibold text-admin-ink-2 hover:bg-black/[0.05] transition text-center cursor-pointer"
              >
                Close
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {selectedReport.status === "pending" ? (
                  <>
                    <form action={resolveReport.bind(null, selectedReport.id)} className="w-full sm:w-auto">
                      <SubmitButton
                        idleText="✅ Mark Resolved"
                        loadingText="Resolving..."
                        className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                      />
                    </form>

                    <form action={dismissReport.bind(null, selectedReport.id)} className="w-full sm:w-auto">
                      <SubmitButton
                        idleText="Dismiss Report"
                        loadingText="Dismissing..."
                        className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2.5 text-[13px] font-semibold text-admin-ink shadow-sm hover:bg-gray-50 transition"
                      />
                    </form>
                  </>
                ) : (
                  <span className="text-[12.5px] font-medium text-admin-ink-3 text-center sm:text-right">
                    Report is already {selectedReport.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
