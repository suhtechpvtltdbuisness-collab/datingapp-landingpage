export type FeatureIcon =
  | "camera" | "idCard" | "sparkles" | "shieldBan" | "share" | "video" | "messageCheck" | "eyeOff";

export interface Feature {
  id: string;
  icon: FeatureIcon;
  title: string;
  description: string;
  href: string;
}

export const features: Feature[] = [
  {
    id: "photo-verification",
    icon: "camera",
    title: "Photo Verification",
    description: "Take a quick selfie and we check that it matches your photos. Verified profiles get a badge, so you know who's real.",
    href: "#faq",
  },
  {
    id: "id-verification",
    icon: "idCard",
    title: "ID Verification",
    description: "Confirm your identity with a government ID. We use it to verify you, and it never appears on your profile.",
    href: "#faq",
  },
  {
    id: "scam-detector",
    icon: "sparkles",
    title: "Scam Detector",
    description: "Automated checks look for signs of fake profiles and romance scams, and a human reviewer checks anything it flags.",
    href: "#faq",
  },
  {
    id: "block-report",
    icon: "shieldBan",
    title: "Block, Report, Unmatch",
    description: "One tap from any chat or profile. They don't find out who reported them, and our team reviews every report.",
    href: "#faq",
  },
  {
    id: "share-date",
    icon: "share",
    title: "Share Your Date",
    description: "Send a trusted friend who you're meeting, where, and when, straight from the chat.",
    href: "#faq",
  },
  {
    id: "calls",
    icon: "video",
    title: "Call Before You Meet",
    description: "Voice and video calls happen in the app, so you can check the vibe without sharing your number.",
    href: "#faq",
  },
  {
    id: "review-nudge",
    icon: "messageCheck",
    title: "Kindness Check",
    description: "If a message looks hurtful, we gently ask “Are you sure?” before it sends. Being kind works better anyway.",
    href: "#faq",
  },
  {
    id: "blur-images",
    icon: "eyeOff",
    title: "Auto-Blur Images",
    description: "Photos that may be explicit arrive blurred. You choose whether to view, reply, or report.",
    href: "#faq",
  },
];
