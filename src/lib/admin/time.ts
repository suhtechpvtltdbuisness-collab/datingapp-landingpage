/** The backend sends UTC ISO strings; the admin team reads them in India time. */
const ZONE = "Asia/Kolkata";

function parts(iso: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, hourCycle: "h23", ...options })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  return p;
}

/** 2026-10-22 */
export function formatDate(iso: string): string {
  const p = parts(iso, { year: "numeric", month: "2-digit", day: "2-digit" });
  return p ? `${p.year}-${p.month}-${p.day}` : iso.slice(0, 10);
}

/** 2026-10-22 14:13 IST */
export function formatDateTime(iso: string): string {
  const p = parts(iso, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  return p ? `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute} IST` : iso.slice(0, 16).replace("T", " ");
}
