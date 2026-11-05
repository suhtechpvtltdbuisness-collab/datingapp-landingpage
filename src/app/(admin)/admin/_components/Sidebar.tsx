"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Gem,
  ShieldAlert,
  HeartHandshake,
  Settings,
  LogOut,
} from "lucide-react";
import { cx } from "./ui";
import type { AdminSession } from "@/lib/admin/session";

interface Props {
  admin?: AdminSession | null;
}

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/admin" || p === "/admin/" },
  { href: "/admin/users", label: "Users", icon: Users, match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/plans", label: "Plans", icon: Gem, match: (p: string) => p.startsWith("/admin/plans") },
  { href: "/admin/reports", label: "Reports", icon: ShieldAlert, match: (p: string) => p.startsWith("/admin/reports") },
  { href: "/admin/matches", label: "Matches", icon: HeartHandshake, match: (p: string) => p.startsWith("/admin/matches") },
  { href: "/admin/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/admin/settings") },
];

export default function Sidebar({ admin }: Props) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  // Close drawer & clear pending state on navigation
  useEffect(() => {
    setPending(null);
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 MOBILE TOP APP-BAR (< 860px) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/60 bg-white/85 px-3 backdrop-blur-[20px] shadow-xs min-[860px]:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 text-admin-ink shadow-2xs transition hover:bg-white active:scale-95 cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="bg-admin-brand bg-clip-text text-[15px] sm:text-[17px] font-bold tracking-tight text-transparent whitespace-nowrap truncate">
            DatingApp Admin
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {admin?.username ? (
            <div className="flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 py-1 pl-1.5 pr-2.5 text-[11.5px] font-semibold shadow-2xs max-[380px]:pr-1.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-admin-brand text-[11px] font-bold text-white shadow-2xs">
                {admin.username[0].toUpperCase()}
              </div>
              <span className="truncate max-w-[65px] max-[380px]:hidden">{admin.username}</span>
            </div>
          ) : null}

          <a
            href="/admin/logout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-admin-danger hover:bg-admin-danger/10 transition"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 📱 MOBILE SLIDE-OVER DRAWER (< 860px) */}
      {/* ========================================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 min-[860px]:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Chassis */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-[285px] max-w-[85vw] flex-col border-r border-white/60 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out">
            {/* Drawer Top Branding & Close */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <span className="bg-admin-brand bg-clip-text text-[18px] font-bold tracking-tight text-transparent">
                DatingApp Admin
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-1.5 text-admin-ink-3 hover:bg-black/5 hover:text-admin-ink transition"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Admin Profile Details */}
            {admin?.username && (
              <div className="my-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/5 p-3.5 border border-pink-100/70">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-admin-brand text-[15px] font-bold text-white shadow-sm">
                  {admin.username[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-bold text-admin-ink">
                    {admin.username}
                  </div>
                  <div className="text-[11px] font-medium text-admin-ink-3">
                    Super Administrator
                  </div>
                </div>
              </div>
            )}

            {/* Vertical Menu Navigation */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto py-2">
              {items.map((item) => {
                const active = pending ? pending === item.href : item.match(pathname);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setPending(item.href);
                      setDrawerOpen(false);
                    }}
                    className={cx(
                      "flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[14px] font-semibold transition-all",
                      active
                        ? "bg-admin-brand text-white shadow-admin-nav"
                        : "text-admin-ink-2 hover:bg-black/[0.04] hover:text-admin-ink",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Sign Out */}
            <div className="pt-3 border-t border-black/[0.06]">
              <a
                href="/admin/logout"
                className="flex items-center gap-2.5 rounded-[14px] bg-red-500/5 px-3.5 py-2.5 text-[13px] font-semibold text-admin-danger hover:bg-admin-danger/10 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP PERMANENT SIDEBAR (>= 860px) */}
      {/* ========================================================================= */}
      <aside
        className={cx(
          "sticky top-0 hidden min-[860px]:flex h-screen w-[240px] shrink-0 flex-col overflow-y-auto border-r border-white/60 bg-white/55 px-[18px] py-[26px] backdrop-blur-[20px]",
        )}
      >
        <div className="mb-[30px] bg-admin-brand bg-clip-text pl-2.5 text-[18px] font-bold tracking-tight text-transparent">
          DatingApp Admin
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const active = pending ? pending === item.href : item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setPending(item.href)}
                className={cx(
                  "flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-[14px] font-semibold transition-all",
                  active
                    ? "bg-admin-brand text-white shadow-admin-nav"
                    : "text-admin-ink-2 hover:bg-white/70 hover:text-admin-ink",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-black/[0.04]">
          <a
            className="flex items-center gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] font-semibold text-admin-danger hover:bg-admin-danger/10 transition"
            href="/admin/logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </a>
        </div>
      </aside>
    </>
  );
}
