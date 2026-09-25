import { partners } from "../data/partners";

function Logo({ name, initials, hue }: { name: string; initials: string; hue: string }) {
  return (
    <li className="group flex shrink-0 items-center gap-3 rounded-full bg-white px-5 py-3 shadow-card grayscale transition duration-500 hover:grayscale-0">
      <span className="grid h-9 w-9 place-items-center rounded-full font-display text-sm font-bold text-white" style={{ background: hue }} aria-hidden>
        {initials}
      </span>
      <span className="whitespace-nowrap font-display font-semibold text-brand-ink">{name}</span>
    </li>
  );
}

export default function PartnerLogoMarquee() {
  return (
    <section aria-labelledby="partners-title" className="py-12">
      <h2 id="partners-title" className="px-4 text-center text-sm font-bold uppercase tracking-widest text-brand-ink-soft">
        Working with safety partners 
      </h2>
      <div className="group/marquee relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="flex w-max animate-marquee gap-4 py-2 group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
          {[...partners, ...partners].map((p, i) => (
            <Logo key={`${p.id}-${i}`} {...p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
