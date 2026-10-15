import Image from "next/image";
import { brand } from "../theme";

interface Props {
  size?: "sm" | "lg";
  withTagline?: boolean;
}

/** Round Vellora emblem + serif wordmark, matching the app logo. */
export default function BrandLogo({ size = "sm", withTagline = false }: Props) {
  const px = size === "sm" ? 38 : 60;
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={brand.emblem}
        alt=""
        width={px}
        height={px}
        priority={size === "sm"}
        className="rounded-full shadow-[0_6px_16px_-6px_rgba(26,15,46,0.6)]"
      />
      <span className="flex flex-col leading-none">
        <span className={`bg-brand-wordmark bg-clip-text font-brand font-bold text-transparent ${size === "sm" ? "text-[1.7rem]" : "text-4xl"}`}>
          {brand.name}
        </span>
        {withTagline && (
          <span className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">{brand.tagline}</span>
        )}
      </span>
    </span>
  );
}
