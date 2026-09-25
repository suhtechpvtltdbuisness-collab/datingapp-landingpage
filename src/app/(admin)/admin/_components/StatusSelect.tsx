"use client";
import { cx, nativeControl, nativeControlColors } from "./ui";

const options = [
  { value: "all", label: "All statuses" },
  { value: "verified", label: "Verified" },
  { value: "banned", label: "Banned" },
  { value: "premium", label: "Premium" },
];

/** Status filter that submits its form as soon as it changes. */
export default function StatusSelect({ status }: { status: string }) {
  return (
    <select
      name="status"
      defaultValue={status}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={cx(nativeControl, nativeControlColors, "rounded-full border border-black/[0.08] bg-white px-4 py-[11px] text-[13.5px] outline-none focus:border-admin-primary max-[860px]:flex-auto")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
