/** Shared Tailwind building blocks for the admin panel. */

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/** Buttons, inputs and selects use the browser's default control font, as the panel always has. */
export const nativeControl = "[font-family:revert] [line-height:revert]";
/** Plus the browser's default text and placeholder colours, for controls that don't set their own. */
export const nativeControlColors = "[color:revert] placeholder:[color:revert]";

const glass = "rounded-[22px] border border-white/55 shadow-admin-glass backdrop-blur-[18px]";

export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={cx(glass, "mb-[22px] bg-white/60 px-6 py-[22px] max-[860px]:px-4 max-[860px]:py-[18px]")}>{children}</div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="m-0 mb-4 flex items-center justify-between text-[16px] font-bold">{children}</div>;
}

const statBackgrounds = {
  1: "bg-admin-stat-1",
  2: "bg-admin-stat-2",
  3: "bg-admin-stat-3",
  4: "bg-admin-stat-4",
  5: "bg-admin-stat-5",
  6: "bg-admin-stat-6",
} as const;

export function StatCard({ tone, icon, value, label }: { tone: keyof typeof statBackgrounds; icon: string; value: number; label: string }) {
  return (
    <div className={cx(glass, statBackgrounds[tone], "relative overflow-hidden p-5 text-white max-[560px]:p-4")}>
      <div className="absolute right-3.5 top-3.5 text-[26px] opacity-[0.45] max-[560px]:right-2.5 max-[560px]:top-2.5 max-[560px]:text-[22px]">{icon}</div>
      <div className="text-[28px] font-extrabold max-[560px]:text-[24px]">{value}</div>
      <div className="mt-0.5 text-[12.5px] font-semibold opacity-90">{label}</div>
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[26px] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 max-[560px]:mb-5 max-[560px]:grid-cols-2 max-[560px]:gap-3">
      {children}
    </div>
  );
}

export function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-[22px] max-[980px]:grid-cols-[minmax(0,1fr)]">{children}</div>
  );
}

// ------------------------------------------------------------------ tables
export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                className="border-b border-black/[0.06] px-3 py-2.5 text-left text-[12px] font-semibold uppercase tracking-[0.4px] text-admin-ink-3 max-[860px]:whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:last-child>td]:border-b-0">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <td className={cx("border-b border-black/5 p-3 align-middle max-[860px]:whitespace-nowrap", className)}>{children}</td>;
}

/* eslint-disable @next/next/no-img-element */
export function Avatar({ src }: { src: string }) {
  return <img className="h-9 w-9 max-w-none rounded-[50%] bg-[#eee] object-cover align-baseline" src={src} alt="" />;
}

export const userCell = "flex items-center gap-2.5";
export const nameText = "font-semibold";
export const emailText = "text-[12px] text-admin-ink-3";
export const nameLink = "font-semibold text-admin-ink";

// ------------------------------------------------------------------ badges & buttons
const badgeTones = {
  success: "bg-admin-success/15 text-admin-success-ink",
  danger: "bg-admin-danger/[0.14] text-admin-primary-dark",
  warning: "bg-admin-gold/20 text-admin-warning-ink",
  info: "bg-admin-info/15 text-admin-info-ink",
  neutral: "bg-admin-ink-2/[0.12] text-admin-ink-2",
} as const;

export function Badge({ tone, className, children }: { tone: keyof typeof badgeTones; className?: string; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

const buttonVariants = {
  outline: "border border-black/10 bg-white text-admin-ink hover:border-admin-primary hover:text-admin-primary",
  danger: "bg-admin-grad-danger text-white",
  success: "bg-admin-grad-success text-white",
  ghost: "bg-transparent text-admin-ink-2 hover:text-admin-primary",
  "ghost-danger": "bg-transparent text-admin-danger",
} as const;

/** `padding` replaces the default button padding (e.g. the larger "Update password" button). */
export function buttonClass(variant: keyof typeof buttonVariants, padding = "px-3.5 py-[7px]") {
  return cx(
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full text-[12.5px] font-bold",
    nativeControl,
    padding,
    buttonVariants[variant],
  );
}

// ------------------------------------------------------------------ misc
export function EmptyState({ icon, compact, children }: { icon?: string; compact?: boolean; children: React.ReactNode }) {
  return (
    <div className={cx("text-center text-admin-ink-2", compact ? "p-6" : "px-5 py-[60px]")}>
      {icon && <div className="mb-2.5 text-[40px]">{icon}</div>}
      {children}
    </div>
  );
}

export function KvRow({ label, valueClassName = "font-semibold", children }: { label: React.ReactNode; valueClassName?: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-dashed border-black/[0.08] py-2.5 text-[13.5px] last:border-b-0 max-[560px]:gap-4">
      <span className="shrink-0 text-admin-ink-2">{label}</span>
      <span className={cx(valueClassName, "max-[560px]:text-right max-[560px]:[overflow-wrap:anywhere]")}>{children}</span>
    </div>
  );
}

export const field = "mb-[18px]";
export const fieldLabel = "mb-1.5 block text-[13px] font-semibold opacity-90";
