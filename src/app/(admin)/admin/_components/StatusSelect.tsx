"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cx, nativeControl, nativeControlColors } from "./ui";

const options = [
  { value: "all", label: "All statuses" },
  { value: "verified", label: "Verified" },
  { value: "banned", label: "Banned" },
  { value: "premium", label: "Premium" },
];

export default function StatusSelect({ status }: { status: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <select
      name="status"
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      className={cx(
        nativeControl,
        nativeControlColors,
        "rounded-full border border-black/[0.08] bg-white px-4 py-[11px] text-[13.5px] outline-none transition focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15 max-[860px]:w-full cursor-pointer shadow-2xs",
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
