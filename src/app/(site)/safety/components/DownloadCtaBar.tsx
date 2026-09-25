"use client";
import { Apple, Play } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function DownloadCtaBar() {
  return (
    <div id="download" className="scroll-mt-20 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-card bg-brand-gradient p-8 text-white shadow-glow sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Ready when you are</h2>
          <p className="mt-2 text-white/90">Download Vellora and turn on photo verification. It takes under a minute.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <MagneticButton href="#" variant="white" size="sm"><Apple className="h-4 w-4" aria-hidden /> App Store</MagneticButton>
          <MagneticButton href="#" variant="white" size="sm"><Play className="h-4 w-4" aria-hidden /> Google Play</MagneticButton>
        </div>
      </div>
    </div>
  );
}
