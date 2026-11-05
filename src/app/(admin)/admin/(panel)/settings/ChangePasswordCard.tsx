"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck, Check, AlertCircle } from "lucide-react";
import SubmitButton from "../../_components/SubmitButton";
import { changePassword } from "../../actions";

export default function ChangePasswordCard() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const isMinLength = newPass.length >= 8;
  const isMatch = newPass.length > 0 && confirmPass.length > 0 && newPass === confirmPass;
  const isMismatch = confirmPass.length > 0 && newPass !== confirmPass;

  return (
    <div className="sm:rounded-[24px] sm:border sm:border-white/70 sm:bg-white/85 sm:p-6 sm:shadow-xs sm:backdrop-blur-xl bg-transparent border-0 p-0 shadow-none">
      <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06]">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF3D77] to-purple-600 text-white shadow-md">
          <KeyRound className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-admin-ink truncate">
            Change Password
          </h2>
          <p className="text-[11px] sm:text-[12px] text-admin-ink-3 truncate">
            Update administrator access credentials
          </p>
        </div>
      </div>

      <form action={changePassword} className="mt-3.5 sm:mt-4 space-y-3.5">
        {/* Current Password */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-admin-ink-2 mb-1">
            Current Password
          </label>
          <div className="relative flex items-center">
            <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-admin-ink-3" />
            <input
              type={showCurrent ? "text" : "password"}
              name="current_password"
              required
              placeholder="Enter current password"
              className="w-full rounded-[14px] sm:rounded-[16px] border border-black/10 bg-white py-2.5 pl-10 pr-10 text-[13px] text-admin-ink outline-none transition focus:border-admin-brand focus:ring-2 focus:ring-pink-500/15"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 p-1 text-admin-ink-3 hover:text-admin-ink transition cursor-pointer"
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-admin-ink-2 mb-1">
            New Password
          </label>
          <div className="relative flex items-center">
            <KeyRound className="pointer-events-none absolute left-3.5 h-4 w-4 text-admin-ink-3" />
            <input
              type={showNew ? "text" : "password"}
              name="new_password"
              required
              minLength={8}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-[14px] sm:rounded-[16px] border border-black/10 bg-white py-2.5 pl-10 pr-10 text-[13px] text-admin-ink outline-none transition focus:border-admin-brand focus:ring-2 focus:ring-pink-500/15"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 p-1 text-admin-ink-3 hover:text-admin-ink transition cursor-pointer"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {newPass.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-[10.5px]">
              {isMinLength ? (
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <Check className="h-3 w-3 shrink-0" /> 8+ characters met
                </span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-amber-600">
                  <AlertCircle className="h-3 w-3 shrink-0" /> Needs {8 - newPass.length} more char{8 - newPass.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-admin-ink-2 mb-1">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <ShieldCheck className="pointer-events-none absolute left-3.5 h-4 w-4 text-admin-ink-3" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm_password"
              required
              minLength={8}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-[14px] sm:rounded-[16px] border border-black/10 bg-white py-2.5 pl-10 pr-10 text-[13px] text-admin-ink outline-none transition focus:border-admin-brand focus:ring-2 focus:ring-pink-500/15"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 p-1 text-admin-ink-3 hover:text-admin-ink transition cursor-pointer"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPass.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-[10.5px]">
              {isMatch ? (
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <Check className="h-3 w-3 shrink-0" /> Passwords match
                </span>
              ) : isMismatch ? (
                <span className="flex items-center gap-1 font-medium text-red-500">
                  <AlertCircle className="h-3 w-3 shrink-0" /> Passwords do not match
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <SubmitButton
            idleText="Update Password"
            loadingText="Saving..."
            className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:scale-[1.01] active:scale-95"
          />
        </div>
      </form>
    </div>
  );
}
