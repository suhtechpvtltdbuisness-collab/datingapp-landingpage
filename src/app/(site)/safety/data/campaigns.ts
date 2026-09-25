export interface Campaign {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  /** Tailwind gradient classes shown behind the illustration while it loads */
  art: string;
  image: string;
  imageAlt: string;
}

export const campaigns: Campaign[] = [
  {
    id: "first-date-workshops",
    eyebrow: "Workshops",
    title: "First Date, Safe Date",
    description: "Free evening sessions in partner cafés on spotting red flags, planning a safe first meet, and trusting your gut.",
    cta: "Find a session",
    art: "from-[#FF3D77] to-[#FF8A3D]",
    image: "/illustrations/campaign-workshop.svg",
    imageAlt: "Two coffee cups on a café table under a warm lamp, with steam rising into a heart",
  },
  {
    id: "community-partners",
    eyebrow: "Community",
    title: "Kinder Together",
    description: "We're building relationships with local non-profits that support survivors and teach digital safety. Partner announcements are coming soon.",
    cta: "Partner with us",
    art: "from-[#E0299B] to-[#8B2FC9]",
    image: "/illustrations/campaign-community.svg",
    imageAlt: "Three smiling friends standing together in front of a large heart",
  },
  {
    id: "awareness",
    eyebrow: "Awareness",
    title: "Real Talk Month",
    description: "Stories, tips, and myth-busting about consent, catfishing, and online scams, in your feed and in the app.",
    cta: "Read the stories",
    art: "from-[#8B2FC9] to-[#FF3D77]",
    image: "/illustrations/campaign-awareness.svg",
    imageAlt: "A phone showing a chat with a safety badge, next to a shield with a check mark",
  },
];
