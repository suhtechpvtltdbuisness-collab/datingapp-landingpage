/**
 * UTC timestamp in the shape the existing rows use ("2026-09-24T16:37:20.226000"),
 * so dates sort consistently and slice cleanly to "YYYY-MM-DD" / "YYYY-MM-DD HH:MM".
 */
export function utcNowIso(date: Date = new Date()): string {
  return date.toISOString().slice(0, 23) + "000";
}
