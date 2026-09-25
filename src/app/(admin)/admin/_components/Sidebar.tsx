"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

const items = [
  { href: "/admin", label: "📊 Dashboard", match: (p: string) => p === "/admin" || p === "/admin/" },
  { href: "/admin/users", label: "👤 Users", match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/reports", label: "🚩 Reports", match: (p: string) => p.startsWith("/admin/reports") },
  { href: "/admin/matches", label: "💘 Matches", match: (p: string) => p.startsWith("/admin/matches") },
  { href: "/admin/settings", label: "⚙️ Settings", match: (p: string) => p.startsWith("/admin/settings") },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className={cx(
        "sticky top-0 flex h-screen w-[240px] shrink-0 flex-col overflow-y-auto border-r border-white/60 bg-white/55 px-[18px] py-[26px] backdrop-blur-[20px]",
        // Tablet & phone: a sticky top bar with a swipeable pill nav
        "max-[860px]:z-50 max-[860px]:h-auto max-[860px]:w-full max-[860px]:flex-row max-[860px]:flex-wrap max-[860px]:items-center max-[860px]:gap-2.5 max-[860px]:overflow-visible max-[860px]:border-b max-[860px]:border-r-0 max-[860px]:px-4 max-[860px]:pb-2.5 max-[860px]:pt-3 max-[860px]:shadow-admin-bar",
      )}
    >
      <div className="mb-[30px] bg-admin-brand bg-clip-text pl-2.5 text-[19px] font-extrabold text-transparent max-[860px]:order-1 max-[860px]:m-0 max-[860px]:pl-0 max-[860px]:text-[17px]">
        DatingApp Admin
      </div>
      <nav className="max-[860px]:order-3 max-[860px]:-mx-4 max-[860px]:flex max-[860px]:flex-[1_1_100%] max-[860px]:snap-x max-[860px]:snap-proximity max-[860px]:gap-1.5 max-[860px]:overflow-x-auto max-[860px]:px-4 max-[860px]:pb-1 max-[860px]:pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "mb-1 flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[14px] font-semibold",
                "max-[860px]:mb-0 max-[860px]:shrink-0 max-[860px]:snap-start max-[860px]:whitespace-nowrap max-[860px]:py-2 max-[860px]:text-[13px]",
                active
                  ? "bg-admin-brand text-white shadow-admin-nav"
                  : "text-admin-ink-2 hover:bg-white/70 hover:text-admin-ink max-[860px]:bg-white/60 max-[860px]:hover:bg-white/70",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto max-[860px]:order-2 max-[860px]:m-0 max-[860px]:ml-auto">
        {/* Plain link: a prefetch must never sign the admin out. */}
        <a
          className="flex items-center gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] font-semibold text-admin-danger hover:bg-admin-danger/10 max-[860px]:px-3 max-[860px]:py-2"
          href="/admin/logout"
        >
          ↩ Sign out
        </a>
      </div>
    </aside>
  );
}
