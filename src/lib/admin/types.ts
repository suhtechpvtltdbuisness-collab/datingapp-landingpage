/** Row shapes of the admin SQLite database. */
export interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export interface UserRow {
  id: number;
  full_name: string;
  email: string;
  gender: string | null;
  age: number | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  photo_url: string | null;
  is_verified: number;
  is_banned: number;
  is_online: number;
  plan: string;
  created_at: string;
}

export interface MatchRow {
  id: number;
  user_a_id: number;
  user_b_id: number;
  status: string;
  created_at: string;
}

export interface ReportRow {
  id: number;
  reporter_id: number | null;
  reported_id: number;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

export interface ActivityRow {
  id: number;
  admin_username: string;
  action: string;
  target: string | null;
  created_at: string;
}
