import { Badge } from "./ui";
import type { AdminUser } from "@/lib/admin/types";

export function ReportStatusBadge({ status }: { status: string }) {
  if (status === "pending") return <Badge tone="warning">Pending</Badge>;
  if (status === "resolved") return <Badge tone="success">Resolved</Badge>;
  return <Badge tone="neutral">Dismissed</Badge>;
}

export function MatchStatusBadge({ status }: { status: string }) {
  return status === "active" ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Unmatched</Badge>;
}

export function AccountStatusBadge({ user }: { user: Pick<AdminUser, "isBanned" | "isVerified"> }) {
  if (user.isBanned) return <Badge tone="danger">Banned</Badge>;
  if (user.isVerified) return <Badge tone="success">Verified</Badge>;
  return <Badge tone="neutral">Unverified</Badge>;
}

export function location(user: Pick<AdminUser, "city" | "country">) {
  return [user.city, user.country].filter(Boolean).join(", ") || "—";
}
