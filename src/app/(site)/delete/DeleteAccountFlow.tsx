"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { company } from "@/lib/company";
import { brand, EASE } from "../safety/theme";

type Method = "email" | "phone";
type Step = 0 | 1 | 2 | 3;

interface Verified {
  token: string;
  userId: string;
  email: string;
}

const steps = ["Verify", "Review", "Confirm", "Done"];
const CONFIRM_WORD = "DELETE";
const RESEND_SECONDS = 30;

const removed = [
  { icon: UserRound, text: "Your profile, bio, interests and preferences" },
  { icon: ImageIcon, text: "All photos and verification selfies" },
  { icon: Heart, text: "Your likes, matches and discovery history" },
  { icon: MessageCircle, text: "Your conversations with other members" },
];

async function post<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong. Please try again.");
  return json as T;
}

/** "98765 43210" -> "+919876543210"; numbers already starting with + or 00 are kept. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `+${digits.slice(1).replace(/\+/g, "")}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  return digits;
}

export default function DeleteAccountFlow() {
  const [step, setStep] = useState<Step>(0);
  const [verified, setVerified] = useState<Verified | null>(null);

  const goTo = (next: Step) => {
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-10">
      <Stepper current={step} />
      <div className="mt-6 overflow-hidden rounded-card border border-brand-magenta/10 bg-white shadow-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === 0 && (
              <VerifyStep
                onVerified={(v) => {
                  setVerified(v);
                  goTo(1);
                }}
              />
            )}
            {step === 1 && verified && <ReviewStep verified={verified} onBack={() => { setVerified(null); goTo(0); }} onNext={() => goTo(2)} />}
            {step === 2 && verified && (
              <ConfirmStep
                verified={verified}
                onBack={() => goTo(1)}
                onDeleted={() => {
                  setVerified(null);
                  goTo(3);
                }}
                onExpired={() => {
                  setVerified(null);
                  goTo(0);
                }}
              />
            )}
            {step === 3 && <DoneStep />}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-6 text-center text-sm text-brand-ink-soft">
        Having trouble? Email{" "}
        <a href={`mailto:${company.supportEmail}`} className="font-semibold text-brand-magenta underline-offset-2 hover:underline">
          {company.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}

/* ───────────── Stepper ───────────── */

function Stepper({ current }: { current: Step }) {
  return (
    <ol aria-label="Progress" className="flex items-center">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`} aria-current={active ? "step" : undefined}>
            <span className="flex items-center gap-2">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors ${
                  done || active ? "bg-brand-gradient text-white shadow-glow" : "bg-white text-brand-ink-soft ring-1 ring-brand-magenta/20"
                }`}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              <span className={`hidden text-sm font-semibold sm:inline ${active ? "text-brand-ink" : "text-brand-ink-soft"}`}>{label}</span>
            </span>
            {i < steps.length - 1 && <span aria-hidden className={`mx-3 h-0.5 flex-1 rounded-full ${done ? "bg-brand-magenta" : "bg-brand-magenta/15"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────── Step 1: verify ───────────── */

function VerifyStep({ onVerified }: { onVerified: (v: Verified) => void }) {
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState<"otp" | "login" | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const switchMethod = (next: Method) => {
    setMethod(next);
    setError("");
    setInfo("");
  };

  const sendOtp = async () => {
    setError("");
    setInfo("");
    const number = normalizePhone(phone);
    if (!/^\+\d{8,15}$/.test(number)) return setError("Enter a valid phone number, e.g. +91 98765 43210.");
    setBusy("otp");
    try {
      await post("/api/account/otp", { phone: number });
      setOtpSent(true);
      setCooldown(RESEND_SECONDS);
      setInfo(`We sent a code to ${number}.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (method === "email") {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter the email you signed up with.");
      if (!password) return setError("Enter your password.");
    } else {
      if (!otpSent) return setError("Request a code first.");
      if (!/^\d{4,8}$/.test(otp.trim())) return setError("Enter the code we sent you.");
    }

    setBusy("login");
    try {
      const body = method === "email" ? { email: email.trim(), password } : { phone: normalizePhone(phone), otp: otp.trim() };
      const res = await post<Verified>("/api/account/login", body);
      onVerified({ ...res, email: res.email || email.trim() });
    } catch (e) {
      setError((e as Error).message);
      setBusy(null);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <CardHeader icon={ShieldCheck} title="Verify it's you" subtitle={`Sign in with the details you use for ${brand.name}. We only use this to confirm account ownership.`} />
      <div className="grid gap-5 p-6 sm:p-8">
        <div role="tablist" aria-label="Verification method" className="grid grid-cols-2 gap-1 rounded-full bg-brand-bg p-1">
          {([
            ["email", "Email", Mail],
            ["phone", "Phone", Phone],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={method === id}
              onClick={() => switchMethod(id)}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-full font-display text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30 ${
                method === id ? "bg-white text-brand-magenta shadow-card" : "text-brand-ink-soft hover:text-brand-ink"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </button>
          ))}
        </div>

        {method === "email" ? (
          <>
            <Field label="Email address" htmlFor="del-email">
              <input id="del-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
            </Field>
            <Field label="Password" htmlFor="del-password">
              <span className="relative block">
                <input
                  id="del-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={`${inputClass} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-brand-ink-soft hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                </button>
              </span>
            </Field>
          </>
        ) : (
          <>
            <Field label="Phone number" htmlFor="del-phone" hint="Include your country code. 10-digit numbers are treated as +91.">
              <div className="flex gap-2">
                <input
                  id="del-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setOtpSent(false);
                    setOtp("");
                  }}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={busy !== null || cooldown > 0}
                  className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl border border-brand-magenta/25 bg-white px-4 font-display text-sm font-semibold text-brand-magenta transition hover:bg-brand-magenta/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30"
                >
                  {busy === "otp" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  {cooldown > 0 ? `Resend in ${cooldown}s` : otpSent ? "Resend code" : "Send code"}
                </button>
              </div>
            </Field>
            {otpSent && (
              <Field label="Verification code" htmlFor="del-otp">
                <input
                  id="del-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className={`${inputClass} text-center font-display text-2xl tracking-[0.5em]`}
                />
              </Field>
            )}
          </>
        )}

        <Notice kind="error" message={error} />
        <Notice kind="info" message={!error ? info : ""} />

        <button type="submit" disabled={busy !== null || (method === "phone" && !otpSent)} className={primaryButton}>
          {busy === "login" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
          {busy === "login" ? "Verifying…" : "Verify and continue"}
        </button>
        <p className="text-center text-xs text-brand-ink-soft">Signed up with Google? Contact support and we&apos;ll verify you by email.</p>
      </div>
    </form>
  );
}

/* ───────────── Step 2: review ───────────── */

function ReviewStep({ verified, onBack, onNext }: { verified: Verified; onBack: () => void; onNext: () => void }) {
  return (
    <div>
      <CardHeader icon={Trash2} title="What happens when you delete" subtitle={verified.email ? `Verified as ${verified.email}` : "Your identity is verified."} tone="danger" />
      <div className="grid gap-6 p-6 sm:p-8">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-brand-ink-soft">This will permanently remove</h3>
          <ul className="mt-3 grid gap-2.5">
            {removed.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 rounded-2xl bg-brand-bg/70 px-4 py-3 text-brand-ink">
                <Icon className="h-5 w-5 shrink-0 text-brand-magenta" aria-hidden />
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 rounded-2xl border border-brand-accent/30 bg-brand-accent-soft/60 p-4 text-sm text-brand-ink">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" aria-hidden />
          <div className="space-y-2">
            <p className="font-semibold">This can&apos;t be undone.</p>
            <p className="text-brand-ink-soft">
              Your matches will lose access to your profile and chats. If you have a paid plan, cancel it in the App Store or Google Play separately, as deleting your account does not cancel store subscriptions.
            </p>
            <p className="text-brand-ink-soft">
              Some information may be kept where needed for legal compliance, fraud prevention, dispute resolution or security. See our{" "}
              <Link href="/privacy" className="font-semibold text-brand-magenta underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-brand-magenta/10 pt-6 sm:flex-row sm:justify-between">
          <button type="button" onClick={onBack} className={secondaryButton}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Use a different account
          </button>
          <button type="button" onClick={onNext} className={primaryButton}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Step 3: confirm ───────────── */

function ConfirmStep({ verified, onBack, onDeleted, onExpired }: { verified: Verified; onBack: () => void; onDeleted: () => void; onExpired: () => void }) {
  const [typed, setTyped] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitted = useRef(false);
  const ready = typed.trim().toUpperCase() === CONFIRM_WORD && understood;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready || submitted.current) return;
    submitted.current = true;
    setBusy(true);
    setError("");
    try {
      await post("/api/account/delete", { token: verified.token, userId: verified.userId });
      onDeleted();
    } catch (e) {
      submitted.current = false;
      setBusy(false);
      const message = (e as Error).message;
      if (/session|expired|unauthor/i.test(message)) return onExpired();
      setError(message);
    }
  };

  return (
    <form onSubmit={submit}>
      <CardHeader icon={AlertTriangle} title="Final confirmation" subtitle="One last check before your account is deleted." tone="danger" />
      <div className="grid gap-5 p-6 sm:p-8">
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-bg/70 p-4 text-sm text-brand-ink">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand-magenta)]"
          />
          <span>I understand my {brand.name} account and data will be permanently deleted and can&apos;t be recovered.</span>
        </label>

        <Field label={`Type ${CONFIRM_WORD} to confirm`} htmlFor="del-confirm">
          <input
            id="del-confirm"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={CONFIRM_WORD}
            className={`${inputClass} font-display font-bold tracking-widest`}
          />
        </Field>

        <Notice kind="error" message={error} />

        <div className="flex flex-col-reverse gap-3 border-t border-brand-magenta/10 pt-6 sm:flex-row sm:justify-between">
          <button type="button" onClick={onBack} disabled={busy} className={secondaryButton}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Go back
          </button>
          <button
            type="submit"
            disabled={!ready || busy}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-7 font-display font-semibold text-white shadow-[0_12px_32px_-8px_rgba(220,38,38,0.55)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/30"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
            {busy ? "Deleting…" : "Delete my account"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ───────────── Step 4: done ───────────── */

function DoneStep() {
  return (
    <div className="px-6 py-12 text-center sm:px-8">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-white shadow-glow">
        <CheckCircle2 className="h-8 w-8" aria-hidden />
      </span>
      <h2 className="mt-6 font-display text-2xl font-extrabold text-brand-ink">Your account has been deleted</h2>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-brand-ink-soft">
        Thanks for spending time on {brand.name}. You can uninstall the app now. If you ever want to come back, you&apos;re welcome to create a new account.
      </p>
      <Link href="/safety" className={`${primaryButton} mt-8 inline-flex`}>
        Back to {brand.name}
      </Link>
    </div>
  );
}

/* ───────────── Shared bits ───────────── */

const inputClass =
  "h-14 w-full rounded-2xl border border-brand-magenta/15 bg-white px-4 text-brand-ink outline-none transition placeholder:text-brand-ink-soft/60 focus:border-brand-magenta focus:ring-4 focus:ring-brand-magenta/15";
const primaryButton =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-7 font-display font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30";
const secondaryButton =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-magenta/20 bg-white px-6 font-display font-semibold text-brand-ink transition hover:border-brand-magenta/40 hover:text-brand-magenta disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30";

function CardHeader({ icon: Icon, title, subtitle, tone }: { icon: typeof KeyRound; title: string; subtitle: string; tone?: "danger" }) {
  return (
    <div className="flex items-start gap-4 border-b border-brand-magenta/10 bg-brand-gradient-soft px-6 py-5 sm:px-8">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-card ${tone === "danger" ? "text-red-600" : "text-brand-magenta"}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <h2 className="font-display text-xl font-extrabold text-brand-ink">{title}</h2>
        <p className="mt-1 text-sm text-brand-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-display text-sm font-bold text-brand-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-2 text-xs text-brand-ink-soft">{hint}</p> : null}
    </div>
  );
}

function Notice({ kind, message }: { kind: "error" | "info"; message: string }) {
  if (!message) return null;
  const error = kind === "error";
  return (
    <p
      role={error ? "alert" : "status"}
      className={`rounded-2xl px-4 py-3 text-sm font-medium ${error ? "bg-red-50 text-red-700" : "bg-brand-bg text-brand-ink-soft"}`}
    >
      {message}
    </p>
  );
}
