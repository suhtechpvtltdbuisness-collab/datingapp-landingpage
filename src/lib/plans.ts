import { backendUrl } from "./backend";
import { plans as fallbackPlans, type Plan } from "@/app/(site)/safety/data/plans";

function parsePrice(raw: string | number | undefined): number {
  if (typeof raw === "number") return raw;
  if (!raw) return 99.99;
  const cleaned = String(raw).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 99.99 : num;
}

export async function getPublicPlans(opts: { revalidate?: number } = {}): Promise<Plan[]> {
  try {
    const res = await fetch(
      `${backendUrl()}/plans`,
      opts.revalidate ? { next: { revalidate: opts.revalidate } } : { cache: "no-store" },
    );
    if (!res.ok) return fallbackPlans;
    const json = await res.json();
    const data = Array.isArray(json.data) ? json.data : [];
    if (data.length === 0) return fallbackPlans;

    return data.map((p: any) => ({
      id: String(p.id || p._id),
      label: p.title || "Plan",
      pricePerWeek: parsePrice(p.price),
      badge: p.badge || (p.isBest ? "Best value" : undefined),
      note: p.subtitle || undefined,
    }));
  } catch (err) {
    console.error("Failed to fetch public plans, using fallback:", err);
    return fallbackPlans;
  }
}
