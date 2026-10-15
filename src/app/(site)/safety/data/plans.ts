/** Mirrors the Subscription screen in the Vellora app. Keep prices in sync with the store listings. */
export interface Plan {
  id: string;
  label: string;
  /** Price in INR, shown per week */
  pricePerWeek: number;
  badge?: string;
  /** Shown instead of a savings line (e.g. for the baseline plan) */
  note?: string;
}

export interface Perk {
  title: string;
  description: string;
}

export const CURRENCY = "INR";

export const plans: Plan[] = [
  { id: "3-months", label: "3 Months", pricePerWeek: 99.99, badge: "Best value" },
  { id: "1-month", label: "1 Month", pricePerWeek: 119.99 },
  { id: "1-week", label: "1 Week", pricePerWeek: 149.99, note: "Flexibility first" },
];

export const defaultPlanId = "3-months";

export const perks: Perk[] = [
  { title: "Unlimited likes", description: "Like as many people as you want." },
  { title: "Incognito mode", description: "Only be shown to people you've liked." },
];

/** Savings are calculated from the prices against the weekly plan, so the claim always matches the numbers. */
export function savingsPercent(plan: Plan): number {
  const base = Math.max(...plans.map((p) => p.pricePerWeek));
  return Math.round((1 - plan.pricePerWeek / base) * 100);
}
