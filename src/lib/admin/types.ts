/** Shapes returned by the backend's /admin API (new_dating_app_backend). */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Paged<T> {
  items: T[];
  pagination: Pagination;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  isBanned: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: number | null;
  city?: string;
  country?: string;
  bio: string;
  photoUrl: string | null;
  isVerified: boolean;
  isBanned: boolean;
  isOnline: boolean;
  plan: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  bannedUsers: number;
  premiumUsers: number;
  totalMatches: number;
  pendingReports: number;
}

export interface AdminReport {
  id: string;
  reason: string;
  details: string;
  status: "pending" | "resolved" | "dismissed";
  reporter: UserSummary | null;
  reportedUser: UserSummary | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface AdminMatch {
  id: string;
  userA: UserSummary | null;
  userB: UserSummary | null;
  status: string;
  matchedAt: string;
}

export interface UserDetail {
  user: AdminUser;
  matches: { id: string; matchedUser: UserSummary | null; matchedAt: string }[];
  reports: AdminReport[];
}

export interface ActivityEntry {
  id: string;
  adminUsername: string;
  action: string;
  target: string | null;
  createdAt: string;
}
