import { Phone, HeartHandshake } from "lucide-react";

export default function EmergencyNotice() {
  return (
    <aside aria-labelledby="emergency-title" className="flex h-full flex-col rounded-card border border-brand-accent/25 bg-[#FFF7EF] p-8 shadow-card">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-accent-soft text-brand-accent">
        <HeartHandshake className="h-6 w-6" aria-hidden />
      </span>
      <h3 id="emergency-title" className="mt-5 font-display text-xl font-bold text-brand-ink">If you're in danger right now</h3>
      <p className="mt-2 flex-1 leading-relaxed text-brand-ink-soft">
        We can't provide emergency response. If you feel unsafe, contact your local emergency services first. When you're safe, report the person in the app and our team will take it from there.
      </p>
      <a
        href="tel:112"
        className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 font-semibold text-brand-ink shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/40"
      >
        <Phone className="h-4 w-4 text-brand-accent" aria-hidden /> Call 112 (India / EU)
      </a>
    </aside>
  );
}
