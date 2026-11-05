"use client";

import { useState } from "react";
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Check,
  Crown,
  Eye,
  EyeOff,
  X,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import SubmitButton from "../../_components/SubmitButton";
import { cx } from "../../_components/ui";
import { createPlan, deletePlan, togglePlan, updatePlan } from "../../actions";
import type { AdminPlan } from "@/lib/admin/types";

interface Props {
  plans: AdminPlan[];
}

export default function PlanManager({ plans }: Props) {
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);

  const activePlans = plans.filter((p) => p.isActive);
  const bestValuePlan = plans.find((p) => p.isBest || p.badge?.includes("BEST"));

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner / Metrics & Action Bar */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/5 p-4 sm:p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-pink-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Revenue &amp; Premium Engine</span>
            </div>
            <h2 className="mt-1.5 text-[18px] sm:text-[21px] font-bold tracking-tight text-admin-ink">
              Subscription Plans
            </h2>
            <p className="mt-0.5 text-[12px] sm:text-[13px] text-admin-ink-2">
              Configure real-time VIP &amp; Premium tiers displayed directly inside the mobile app.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-4 py-2 sm:px-5 sm:py-2.5 text-[12.5px] sm:text-[13px] font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Plan</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
          <div className="rounded-[16px] sm:rounded-[18px] border border-white/80 bg-white/70 p-2.5 sm:p-3.5 backdrop-blur-md">
            <div className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-admin-ink-3">Total Plans</div>
            <div className="mt-0.5 sm:mt-1 text-[18px] sm:text-[20px] font-bold text-admin-ink">{plans.length}</div>
          </div>
          <div className="rounded-[16px] sm:rounded-[18px] border border-white/80 bg-white/70 p-2.5 sm:p-3.5 backdrop-blur-md">
            <div className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-admin-ink-3">Active on App</div>
            <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5">
              <span className="text-[18px] sm:text-[20px] font-bold text-emerald-600">{activePlans.length}</span>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="rounded-[16px] sm:rounded-[18px] border border-white/80 bg-white/70 p-2.5 sm:p-3.5 backdrop-blur-md">
            <div className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-admin-ink-3">Best Value</div>
            <div className="mt-0.5 sm:mt-1 truncate text-[13px] sm:text-[15px] font-bold text-admin-ink">
              {bestValuePlan ? bestValuePlan.title : "None set"}
            </div>
          </div>
          <div className="rounded-[16px] sm:rounded-[18px] border border-white/80 bg-white/70 p-2.5 sm:p-3.5 backdrop-blur-md">
            <div className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-admin-ink-3">Sync Status</div>
            <div className="mt-0.5 sm:mt-1 flex items-center gap-1 text-[11.5px] sm:text-[13px] font-semibold text-admin-brand">
              <Zap className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Live WebSocket</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Plans Cards on Left, Mobile Preview on Right */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-12">
        {/* Left: Plans List */}
        <div className="space-y-3.5 sm:space-y-4 xl:col-span-7 2xl:col-span-8 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-1 px-1">
            <div className="text-[14px] font-bold tracking-tight text-admin-ink">
              Configured Plans ({plans.length})
            </div>
            <span className="text-[11.5px] text-admin-ink-3">Click Edit to modify details</span>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-gray-300 bg-white/40 p-8 sm:p-12 text-center">
              <Crown className="mx-auto h-12 w-12 text-pink-400" />
              <div className="mt-3 text-[16px] font-bold text-admin-ink">No subscription plans yet</div>
              <p className="mt-1 text-[13px] text-admin-ink-3">
                Create your first plan to start offering premium memberships on the app.
              </p>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FF3D77] px-4 py-2 text-[13px] font-bold text-white shadow-sm hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add Plan
              </button>
            </div>
          ) : (
            plans.map((p) => {
              const isBest = p.isBest || p.badge?.includes("BEST");
              return (
                <div
                  key={p.id}
                  className={cx(
                    "group relative overflow-hidden rounded-[22px] border border-white/70 bg-white/80 p-3.5 sm:p-5 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    !p.isActive && "opacity-60 bg-gray-50/70",
                    isBest && "ring-2 ring-[#FF3D77]/20 border-pink-200",
                  )}
                >
                  {/* Decorative Gradient Edge Accent */}
                  <div
                    className={cx(
                      "absolute left-0 top-0 h-full w-1.5",
                      p.isActive
                        ? isBest
                          ? "bg-gradient-to-b from-[#FF3D77] to-purple-600"
                          : "bg-gradient-to-b from-pink-400 to-pink-500"
                        : "bg-gray-300",
                    )}
                  />

                  <div className="pl-1.5 sm:pl-2">
                    {/* Top: Title & Badges */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[15px] sm:text-[16px] font-bold tracking-tight text-admin-ink">
                          {p.title}
                        </span>

                        {p.badge ? (
                          <span className="rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-white shadow-2xs">
                            {p.badge}
                          </span>
                        ) : isBest ? (
                          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-[#FF3D77]">
                            BEST VALUE
                          </span>
                        ) : null}

                        {p.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-medium text-gray-500">
                            <EyeOff className="h-3 w-3" />
                            Disabled
                          </span>
                        )}
                      </div>

                      {p.subtitle ? (
                        <p className="text-[12.5px] text-admin-ink-2">{p.subtitle}</p>
                      ) : (
                        <p className="text-[11.5px] italic text-admin-ink-3">Standard tier</p>
                      )}

                      {/* Feature pills */}
                      {p.features && p.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.features.slice(0, 3).map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="inline-flex items-center gap-1 rounded-[8px] bg-black/[0.04] px-1.5 py-0.5 text-[10.5px] font-normal text-admin-ink-2"
                            >
                              <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[120px]">{feat}</span>
                            </span>
                          ))}
                          {p.features.length > 3 && (
                            <span className="rounded-[8px] bg-black/[0.04] px-1.5 py-0.5 text-[10px] text-admin-ink-3 font-medium">
                              +{p.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Pricing & Action buttons (Responsive & Wrapped) */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-black/[0.05]">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-admin-ink">
                          {p.price}
                        </span>
                        <span className="text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-wider text-admin-ink-3">
                          / {p.period || "PER WEEK"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setEditingPlan(p)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11.5px] font-medium text-admin-ink shadow-2xs transition hover:border-pink-300 hover:bg-pink-50/50 hover:text-[#FF3D77]"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        <form className="inline" action={togglePlan.bind(null, p.id)}>
                          <SubmitButton
                            idleText={p.isActive ? "Hide" : "Show"}
                            loadingText="..."
                            className="cursor-pointer rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11.5px] font-medium text-admin-ink-2 transition hover:bg-gray-50 shadow-2xs"
                          />
                        </form>

                        <form className="inline" action={deletePlan.bind(null, p.id)}>
                          <SubmitButton
                            idleText="Delete"
                            loadingText="..."
                            className="cursor-pointer rounded-full border border-transparent px-2 py-1 text-[11.5px] font-medium text-red-500 transition hover:bg-red-50"
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Realistic iPhone Screen Mockup (Live Flutter App Preview) */}
        <div className="xl:col-span-5 2xl:col-span-4 min-w-0">
          <div className="rounded-[24px] sm:rounded-[28px] border border-white/70 bg-white/70 p-3.5 sm:p-5 shadow-sm backdrop-blur-xl xl:sticky xl:top-6 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2 min-w-0">
                <Crown className="h-4 w-4 text-[#FF3D77] shrink-0" />
                <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-admin-ink truncate">
                  Mobile App Live View
                </span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 shrink-0">
                Pixel-Perfect
              </span>
            </div>

            {/* iPhone Chassis Mockup */}
            <div className="mx-auto mt-4 w-full max-w-[270px] sm:max-w-[320px] overflow-hidden rounded-[32px] sm:rounded-[38px] border-[5px] sm:border-[6px] border-slate-900 bg-[#E7D9FF] p-3 sm:p-4 shadow-xl ring-1 ring-black/10">
              {/* iPhone Notch / Speaker */}
              <div className="mx-auto mb-2 h-3.5 w-20 sm:w-24 rounded-full bg-slate-900" />

              {/* Mobile Header */}
              <div className="px-1 pt-1 pb-2">
                <div className="inline-block rounded-full bg-[#FF3D77]/15 px-2 py-0.5 text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider text-[#FF3D77]">
                  EXCLUSIVE TIER
                </div>
                <h3 className="mt-1 text-[17px] sm:text-[20px] font-bold leading-tight text-slate-900">
                  Elevate your<br />experience.
                </h3>
                <p className="mt-1 text-[10.5px] sm:text-[11px] text-slate-600">
                  Premium is designed for those who want to skip the line.
                </p>
              </div>

              {/* Mobile Top Feature Card */}
              <div className="rounded-[14px] sm:rounded-[16px] bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] p-2.5 sm:p-3 text-white shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 fill-white shrink-0" />
                  <span className="text-[12px] sm:text-[13px] font-bold">See who liked you</span>
                </div>
                <p className="mt-0.5 text-[9.5px] sm:text-[10px] text-white/80">
                  Like them back and match instantly.
                </p>
              </div>

              {/* Dynamic Select Plan Cards list */}
              <div className="mt-3">
                <div className="mb-2 text-[10.5px] sm:text-[11px] font-bold text-slate-900">
                  Select Your Plan
                </div>

                <div className="space-y-2">
                  {activePlans.length === 0 ? (
                    <div className="rounded-[14px] border border-dashed border-purple-300 p-3 text-center text-[10.5px] text-purple-700">
                      No active plans. Activate a plan from the list to show it here.
                    </div>
                  ) : (
                    activePlans.map((plan, idx) => {
                      const isSelected = selectedPreviewIndex === idx;
                      const hasBadge = plan.isBest || (plan.badge && plan.badge.trim().length > 0);

                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPreviewIndex(idx)}
                          className={cx(
                            "cursor-pointer rounded-[18px] sm:rounded-[20px] p-2.5 sm:p-3 transition-all duration-200 border",
                            isSelected
                              ? "bg-[#FF3D77] text-white shadow-md border-transparent scale-[1.01]"
                              : "bg-white/85 text-slate-800 border-white/60 hover:bg-white",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5 min-w-0 pr-1">
                              {hasBadge && (
                                <div
                                  className={cx(
                                    "inline-block rounded-[5px] px-1.5 py-0.5 text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider",
                                    isSelected
                                      ? "bg-[#B80046] text-white"
                                      : "bg-[#FF3D77] text-white",
                                  )}
                                >
                                  {plan.badge || "BEST VALUE"}
                                </div>
                              )}
                              <div className="text-[12.5px] sm:text-[13.5px] font-bold leading-tight truncate">
                                {plan.title}
                              </div>
                              {plan.subtitle ? (
                                <div
                                  className={cx(
                                    "text-[9.5px] sm:text-[10px] truncate",
                                    isSelected ? "text-white/80" : "text-slate-500",
                                  )}
                                >
                                  {plan.subtitle}
                                </div>
                              ) : null}
                            </div>

                            <div className="text-right shrink-0 pl-1.5">
                              <div className="text-[14px] sm:text-[15px] font-bold tracking-tight leading-none">
                                {plan.price}
                              </div>
                              <div
                                className={cx(
                                  "mt-1 text-[7.5px] sm:text-[8px] font-semibold uppercase tracking-wider",
                                  isSelected ? "text-white/80" : "text-slate-400",
                                )}
                              >
                                {plan.period || "PER WEEK"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Mobile Preview Bottom Button */}
                <div className="mt-3 pt-2">
                  <div className="w-full rounded-full bg-gradient-to-r from-[#FF3D77] to-purple-600 py-2.5 text-center text-[12px] font-bold text-white shadow-md">
                    Continue with VIP
                  </div>
                  <div className="mt-1.5 text-center text-[8.5px] sm:text-[9px] text-slate-500">
                    Recurring billing • Cancel anytime in store settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ✏️ EDIT PLAN MODAL */}
      {/* ========================================================================= */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setEditingPlan(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] border border-white/60 bg-white/95 p-4 sm:p-7 shadow-2xl backdrop-blur-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.06] gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF3D77] to-purple-600 text-white shadow-sm">
                  <Edit3 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-[17px] font-bold text-admin-ink truncate">
                    Edit Plan: {editingPlan.title}
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-admin-ink-3 truncate">
                    Changes will sync to the mobile app immediately.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="rounded-full p-1.5 text-admin-ink-3 hover:bg-black/[0.05] hover:text-admin-ink transition cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form action={updatePlan.bind(null, editingPlan.id)} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Plan Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={editingPlan.title}
                    required
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Display Price *
                  </label>
                  <input
                    name="price"
                    type="text"
                    defaultValue={editingPlan.price}
                    required
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Billing Period Label
                  </label>
                  <input
                    name="period"
                    type="text"
                    defaultValue={editingPlan.period || "PER WEEK"}
                    placeholder="PER WEEK, PER MONTH, TOTAL"
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Badge Text
                  </label>
                  <input
                    name="badge"
                    type="text"
                    defaultValue={editingPlan.badge || ""}
                    placeholder="e.g. BEST VALUE, POPULAR"
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                  Subtitle / Promo Text
                </label>
                <input
                  name="subtitle"
                  type="text"
                  defaultValue={editingPlan.subtitle || ""}
                  placeholder="e.g. Save 65% compared to monthly"
                  className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Sort Order
                  </label>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={editingPlan.sortOrder}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-2 pt-1 sm:pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      name="isBest"
                      type="checkbox"
                      defaultChecked={editingPlan.isBest}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF3D77] focus:ring-[#FF3D77]"
                    />
                    <span className="text-[12.5px] sm:text-[13px] font-medium text-admin-ink">
                      Highlight as &quot;Best Value&quot;
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={editingPlan.isActive}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF3D77] focus:ring-[#FF3D77]"
                    />
                    <span className="text-[12.5px] sm:text-[13px] font-medium text-admin-ink">
                      Active inside mobile app
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                  Features (One per line)
                </label>
                <textarea
                  name="features"
                  rows={3}
                  defaultValue={editingPlan.features?.join("\n") || ""}
                  className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20 font-mono text-[12px]"
                />
              </div>

              <div className="mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="rounded-full px-5 py-2 text-[13px] font-medium text-admin-ink-2 hover:bg-black/[0.05] transition text-center cursor-pointer"
                >
                  Cancel
                </button>
                <SubmitButton
                  idleText="💾 Save Changes"
                  loadingText="Saving..."
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md transition hover:scale-[1.02] active:scale-95"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ➕ CREATE PLAN MODAL */}
      {/* ========================================================================= */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] border border-white/60 bg-white/95 p-4 sm:p-7 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.06] gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF3D77] to-purple-600 text-white shadow-sm">
                  <Plus className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-[17px] font-bold text-admin-ink truncate">
                    Create New Subscription Plan
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-admin-ink-3 truncate">
                    Add a new tier to the mobile subscription screen.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-full p-1.5 text-admin-ink-3 hover:bg-black/[0.05] hover:text-admin-ink transition cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={createPlan} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Plan Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    placeholder="e.g. 6 Months, 1 Year VIP"
                    required
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Price *
                  </label>
                  <input
                    name="price"
                    type="text"
                    placeholder="e.g. ₹199.99, $19.99"
                    required
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13.5px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Billing Period Label
                  </label>
                  <input
                    name="period"
                    type="text"
                    defaultValue="PER WEEK"
                    placeholder="PER WEEK, PER MONTH, TOTAL"
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Badge Text (Optional)
                  </label>
                  <input
                    name="badge"
                    type="text"
                    placeholder="e.g. BEST VALUE, POPULAR"
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                  Subtitle / Discount Offer
                </label>
                <input
                  name="subtitle"
                  type="text"
                  placeholder="e.g. Save 50% on annual billing"
                  className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                    Sort Order
                  </label>
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={plans.length}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20"
                  />
                </div>

                <div className="flex items-center pt-2 sm:pt-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      name="isBest"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#FF3D77] focus:ring-[#FF3D77]"
                    />
                    <span className="text-[12.5px] sm:text-[13px] font-medium text-admin-ink">
                      Highlight as &quot;Best Value&quot;
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-admin-ink-2 mb-1">
                  Features (One per line)
                </label>
                <textarea
                  name="features"
                  rows={3}
                  defaultValue={"See who liked you\nUnlimited Likes\nIncognito Mode"}
                  className="w-full rounded-[14px] border border-black/10 bg-white px-3.5 py-2 text-[13px] text-admin-ink focus:border-[#FF3D77] focus:outline-none focus:ring-2 focus:ring-[#FF3D77]/20 font-mono text-[12px]"
                />
              </div>

              <div className="mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-full px-5 py-2 text-[13px] font-medium text-admin-ink-2 hover:bg-black/[0.05] transition text-center cursor-pointer"
                >
                  Cancel
                </button>
                <SubmitButton
                  idleText="➕ Create Plan"
                  loadingText="Creating..."
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md transition hover:scale-[1.02] active:scale-95"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}