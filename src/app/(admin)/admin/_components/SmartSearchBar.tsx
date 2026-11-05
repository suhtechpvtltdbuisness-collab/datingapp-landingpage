"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import StatusSelect from "./StatusSelect";
import { cx, nativeControl, nativeControlColors } from "./ui";

interface SmartSearchBarProps {
  initialQuery?: string;
  status: string;
}

export default function SmartSearchBar({
  initialQuery = "",
  status,
}: SmartSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);

  // Sync state if URL changes externally
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Debounced live smart search (280ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === initialQuery) return;

      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.set("page", "1"); // reset to page 1 on new search

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 280);

    return () => clearTimeout(timer);
  }, [query, initialQuery, pathname, router, searchParams]);

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="mb-[18px] flex items-center gap-2.5 max-[860px]:flex-wrap">
      {/* Search Input Container */}
      <div className="relative flex flex-1 items-center max-[860px]:basis-full">
        {/* Search Icon */}
        <span className="pointer-events-none absolute left-4 text-[15px] opacity-45">
          🔍
        </span>

        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Smart search by name, email, phone, or ID (e.g. USR-00053)…"
          className={cx(
            nativeControl,
            nativeControlColors,
            "w-full rounded-full border border-black/[0.08] bg-white py-[11px] pl-10 pr-10 text-[13.5px] outline-none transition-all placeholder:text-black/40 focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/15",
          )}
        />

        {/* Clear (✕) or Loading indicator */}
        <div className="absolute right-3.5 flex items-center">
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-admin-primary border-t-transparent" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[11px] font-bold text-black/60 transition hover:bg-black/20 hover:text-black"
              title="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <StatusSelect status={status} />
    </div>
  );
}

