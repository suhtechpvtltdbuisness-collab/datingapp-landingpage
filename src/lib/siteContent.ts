import { backendUrl } from "./backend";
import { company as defaultCompany, storeLinks as defaultStoreLinks, socialLinks as defaultSocialLinks } from "./company";
import { faqs as defaultFaqs, type Faq } from "@/app/(site)/safety/data/faqs";
import { features as defaultFeatures, type Feature } from "@/app/(site)/safety/data/features";
import { campaigns as defaultCampaigns, type Campaign } from "@/app/(site)/safety/data/campaigns";

export interface SiteHero {
  badge: string;
  headline: string[];
  subtitle: string;
  googlePlayUrl: string;
  appStoreUrl: string;
}

export interface SiteCompany {
  legalName: string;
  cin: string;
  gstin?: string;
  registeredOffice: string;
  supportEmail: string;
  supportPhone: string;
  domain: string;
  instagram?: string;
  youtube?: string;
  x?: string;
}

export interface SiteHandbook {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface SitePerk {
  title: string;
  description: string;
}

export interface SitePlansHeader {
  eyebrow: string;
  title: string;
  subtitle: string;
  perks: SitePerk[];
  safetyNoteTitle: string;
  safetyNoteDesc: string;
}

export interface SiteKinderTogether {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  principles: {
    id: string;
    title: string;
    lead?: string;
    items: string[];
  }[];
}

export interface SiteSafetyTips {
  title: string;
  lead: string;
  sections: {
    id: string;
    title: string;
    lead: string;
    intro?: string;
    items: string[];
    note?: string;
  }[];
}

export interface SiteRealTalk {
  title: string;
  subtitle: string;
  description: string;
  topics: {
    id: string;
    emoji: string;
    title: string;
    text: string;
  }[];
}

export interface SiteContentData {
  hero: SiteHero;
  company: SiteCompany;
  handbook: SiteHandbook;
  plansHeader: SitePlansHeader;
  features: Feature[];
  faqs: Faq[];
  campaigns: Campaign[];
  kinderTogether: SiteKinderTogether;
  safetyTips: SiteSafetyTips;
  realTalk: SiteRealTalk;
}

export const FALLBACK_SITE_CONTENT: SiteContentData = {
  hero: {
    badge: "Find Your Connection",
    headline: ["Meet someone.", "Feel something.", "Make it meaningful."],
    subtitle:
      "Discover genuine people who share your interests, values, and vibe — and start a connection that feels real.",
    googlePlayUrl: defaultStoreLinks.googlePlay || "",
    appStoreUrl: defaultStoreLinks.appStore || "",
  },
  company: {
    legalName: defaultCompany.legalName,
    cin: defaultCompany.cin,
    gstin: defaultCompany.gstin || "",
    registeredOffice: defaultCompany.registeredOffice,
    supportEmail: defaultCompany.supportEmail,
    supportPhone: defaultCompany.supportPhone,
    domain: defaultCompany.domain,
    instagram: defaultSocialLinks.instagram || "",
    youtube: defaultSocialLinks.youtube || "",
    x: defaultSocialLinks.x || "",
  },
  handbook: {
    title: "Safety Handbook",
    description:
      "Practical guidance on meeting online, setting boundaries, and trusting your instincts.",
    ctaText: "Read Safety Handbook",
    ctaHref: "#handbook",
  },
  plansHeader: {
    eyebrow: "Vellora Premium",
    title: "Want a little extra?",
    subtitle:
      "Premium adds a few perks on top. Every safety tool on this page stays free for everyone, whether you subscribe or not.",
    perks: [
      { title: "Unlimited likes", description: "Like as many people as you want." },
      { title: "Incognito mode", description: "Only be shown to people you've liked." },
    ],
    safetyNoteTitle: "Safety is never a paid feature",
    safetyNoteDesc:
      "Verification, blocking, reporting and image blur are free on every account.",
  },
  features: defaultFeatures,
  faqs: defaultFaqs,
  campaigns: defaultCampaigns,
  kinderTogether: {
    eyebrow: "Community",
    title: "Kinder Together",
    subtitle: "A kinder dating community starts with how we treat each other.",
    description:
      "Vellora is built around respectful connections. Everyone deserves to feel comfortable, heard, and free to set their own boundaries.",
    principles: [
      {
        id: "respect",
        title: "Treat People With Respect",
        lead: "Every interaction shapes our community.",
        items: [
          "Be respectful, even when you're not interested.",
          "Accept “no” without arguing or pressuring.",
          "Avoid harassment, insults, threats, or hateful behavior.",
          "Remember that there is a real person behind every profile.",
        ],
      },
      {
        id: "boundaries",
        title: "Respect Boundaries",
        lead: "Consent and comfort matter at every step.",
        items: [
          "Don't pressure someone to share personal information.",
          "Don't pressure someone to meet, continue chatting, or share photos.",
          "Respect someone's decision to end a conversation or date.",
          "Give others the same space and respect you expect.",
        ],
      },
    ],
  },
  safetyTips: {
    title: "Safety Tips",
    lead:
      "A simple guide to meeting new people, protecting your privacy, and knowing what to do if something feels wrong.",
    sections: [
      {
        id: "before-you-meet",
        title: "Before You Meet",
        lead: "Take your time.",
        intro: "Get to know someone through the app before deciding to meet in person.",
        items: [
          "Keep your first conversations on Vellora.",
          "Don't feel pressured to share personal information.",
          "Look for consistent and genuine profile information.",
          "Be cautious if someone asks for money, financial information, or favors.",
        ],
      },
      {
        id: "plan-your-date",
        title: "Plan Your First Date Safely",
        lead: "Choose a public place.",
        intro: "Public venues with good lighting are always safest for first meets.",
        items: [
          "Meet at a busy café, restaurant, mall, or other public location.",
          "Arrange your own transportation whenever possible.",
          "Tell a trusted friend or family member where you're going.",
          "Share your planned meeting location and expected return time.",
        ],
      },
      {
        id: "during-the-date",
        title: "During the Date",
        lead: "Stay in control.",
        intro: "Your comfort and personal boundaries always come first.",
        items: [
          "Keep your personal belongings and drinks with you.",
          "Don't leave drinks unattended.",
          "Have an exit plan if you feel uncomfortable.",
          "You have the right to leave at any time for any reason.",
        ],
      },
    ],
  },
  realTalk: {
    title: "Real Talk Month",
    subtitle: "Real conversations. Safer connections.",
    description:
      "Stories, tips, and myth-busting about consent, catfishing, and online scams, in your feed and in the app.",
    topics: [
      {
        id: "communication",
        emoji: "💬",
        title: "Healthy Communication",
        text: "Learn how to communicate honestly, handle rejection respectfully, and have conversations about boundaries.",
      },
      {
        id: "red-flags",
        emoji: "🛡️",
        title: "Spot the Red Flags",
        text: "Understand common warning signs such as rushing intimacy, inconsistent stories, pressure, controlling behavior, or requests for money.",
      },
      {
        id: "catfishing",
        emoji: "🎭",
        title: "Catfishing & Fake Profiles",
        text: "Learn how to identify suspicious profiles and why you should take your time before trusting someone you've met online.",
      },
      {
        id: "scams",
        emoji: "💰",
        title: "Dating & Online Scams",
        text: "Know the warning signs when someone asks for money, financial information, gifts, or urgent help.",
      },
      {
        id: "privacy",
        emoji: "🔐",
        title: "Protect Your Privacy",
        text: "Tips for protecting your photos, personal information, passwords, OTPs, location, and other sensitive details.",
      },
      {
        id: "consent",
        emoji: "❤️",
        title: "Boundaries & Consent",
        text: "Understand that everyone has the right to set boundaries, change their mind, and say no without pressure.",
      },
    ],
  },
};

export async function getSiteContent(): Promise<SiteContentData> {
  try {
    const res = await fetch(`${backendUrl()}/site-content`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return FALLBACK_SITE_CONTENT;
    }
    const json = await res.json();
    const data = json.data;
    if (!data) return FALLBACK_SITE_CONTENT;

    return {
      hero: {
        badge: data.hero?.badge || FALLBACK_SITE_CONTENT.hero.badge,
        headline:
          Array.isArray(data.hero?.headline) && data.hero.headline.length > 0
            ? data.hero.headline
            : FALLBACK_SITE_CONTENT.hero.headline,
        subtitle: data.hero?.subtitle || FALLBACK_SITE_CONTENT.hero.subtitle,
        googlePlayUrl:
          data.hero?.googlePlayUrl !== undefined
            ? data.hero.googlePlayUrl
            : FALLBACK_SITE_CONTENT.hero.googlePlayUrl,
        appStoreUrl:
          data.hero?.appStoreUrl !== undefined
            ? data.hero.appStoreUrl
            : FALLBACK_SITE_CONTENT.hero.appStoreUrl,
      },
      company: {
        legalName: data.company?.legalName || FALLBACK_SITE_CONTENT.company.legalName,
        cin: data.company?.cin || FALLBACK_SITE_CONTENT.company.cin,
        gstin: data.company?.gstin || FALLBACK_SITE_CONTENT.company.gstin,
        registeredOffice:
          data.company?.registeredOffice || FALLBACK_SITE_CONTENT.company.registeredOffice,
        supportEmail:
          data.company?.supportEmail || FALLBACK_SITE_CONTENT.company.supportEmail,
        supportPhone:
          data.company?.supportPhone || FALLBACK_SITE_CONTENT.company.supportPhone,
        domain: data.company?.domain || FALLBACK_SITE_CONTENT.company.domain,
        instagram: data.company?.instagram || FALLBACK_SITE_CONTENT.company.instagram,
        youtube: data.company?.youtube || FALLBACK_SITE_CONTENT.company.youtube,
        x: data.company?.x || FALLBACK_SITE_CONTENT.company.x,
      },
      handbook: {
        title: data.handbook?.title || FALLBACK_SITE_CONTENT.handbook.title,
        description:
          data.handbook?.description || FALLBACK_SITE_CONTENT.handbook.description,
        ctaText: data.handbook?.ctaText || FALLBACK_SITE_CONTENT.handbook.ctaText,
        ctaHref: data.handbook?.ctaHref || FALLBACK_SITE_CONTENT.handbook.ctaHref,
      },
      plansHeader: {
        eyebrow: data.plansHeader?.eyebrow || FALLBACK_SITE_CONTENT.plansHeader.eyebrow,
        title: data.plansHeader?.title || FALLBACK_SITE_CONTENT.plansHeader.title,
        subtitle: data.plansHeader?.subtitle || FALLBACK_SITE_CONTENT.plansHeader.subtitle,
        perks:
          Array.isArray(data.plansHeader?.perks) && data.plansHeader.perks.length > 0
            ? data.plansHeader.perks
            : FALLBACK_SITE_CONTENT.plansHeader.perks,
        safetyNoteTitle:
          data.plansHeader?.safetyNoteTitle || FALLBACK_SITE_CONTENT.plansHeader.safetyNoteTitle,
        safetyNoteDesc:
          data.plansHeader?.safetyNoteDesc || FALLBACK_SITE_CONTENT.plansHeader.safetyNoteDesc,
      },
      features:
        Array.isArray(data.features) && data.features.length > 0
          ? data.features
          : FALLBACK_SITE_CONTENT.features,
      faqs:
        Array.isArray(data.faqs) && data.faqs.length > 0
          ? data.faqs
          : FALLBACK_SITE_CONTENT.faqs,
      campaigns:
        Array.isArray(data.campaigns) && data.campaigns.length > 0
          ? data.campaigns
          : FALLBACK_SITE_CONTENT.campaigns,
      kinderTogether: {
        eyebrow: data.kinderTogether?.eyebrow || FALLBACK_SITE_CONTENT.kinderTogether.eyebrow,
        title: data.kinderTogether?.title || FALLBACK_SITE_CONTENT.kinderTogether.title,
        subtitle: data.kinderTogether?.subtitle || FALLBACK_SITE_CONTENT.kinderTogether.subtitle,
        description: data.kinderTogether?.description || FALLBACK_SITE_CONTENT.kinderTogether.description,
        principles:
          Array.isArray(data.kinderTogether?.principles) && data.kinderTogether.principles.length > 0
            ? data.kinderTogether.principles
            : FALLBACK_SITE_CONTENT.kinderTogether.principles,
      },
      safetyTips: {
        title: data.safetyTips?.title || FALLBACK_SITE_CONTENT.safetyTips.title,
        lead: data.safetyTips?.lead || FALLBACK_SITE_CONTENT.safetyTips.lead,
        sections:
          Array.isArray(data.safetyTips?.sections) && data.safetyTips.sections.length > 0
            ? data.safetyTips.sections
            : FALLBACK_SITE_CONTENT.safetyTips.sections,
      },
      realTalk: {
        title: data.realTalk?.title || FALLBACK_SITE_CONTENT.realTalk.title,
        subtitle: data.realTalk?.subtitle || FALLBACK_SITE_CONTENT.realTalk.subtitle,
        description: data.realTalk?.description || FALLBACK_SITE_CONTENT.realTalk.description,
        topics:
          Array.isArray(data.realTalk?.topics) && data.realTalk.topics.length > 0
            ? data.realTalk.topics
            : FALLBACK_SITE_CONTENT.realTalk.topics,
      },
    };
  } catch (error) {
    console.error("Failed to load site content from backend, using fallbacks:", error);
    return FALLBACK_SITE_CONTENT;
  }
}
