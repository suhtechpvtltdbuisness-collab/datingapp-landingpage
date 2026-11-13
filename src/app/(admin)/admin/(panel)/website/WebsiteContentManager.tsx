"use client";

import { useState } from "react";
import {
  Globe,
  Sparkles,
  Smartphone,
  Building2,
  HelpCircle,
  ShieldCheck,
  Megaphone,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Crown,
  Heart,
  Shield,
  FileText,
} from "lucide-react";
import SubmitButton from "../../_components/SubmitButton";
import { cx } from "../../_components/ui";
import { saveWebsiteContent } from "../../actions";
import type {
  SiteContentData,
  SitePlansHeader,
  SitePerk,
  SiteKinderTogether,
  SiteSafetyTips,
  SiteRealTalk,
} from "@/lib/siteContent";
import type { Faq } from "@/app/(site)/safety/data/faqs";
import type { Feature } from "@/app/(site)/safety/data/features";
import type { Campaign } from "@/app/(site)/safety/data/campaigns";

interface Props {
  initialContent: SiteContentData;
}

export default function WebsiteContentManager({ initialContent }: Props) {
  const [tab, setTab] = useState<
    "hero" | "company" | "plans" | "faqs" | "features" | "campaigns"
  >("hero");

  const [campaignSubView, setCampaignSubView] = useState<
    "cards" | "kinder" | "safety" | "realtalk"
  >("cards");

  // State for editable lists
  const [faqs, setFaqs] = useState<Faq[]>(initialContent.faqs || []);
  const [features, setFeatures] = useState<Feature[]>(
    initialContent.features || [],
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    initialContent.campaigns || [],
  );
  const [plansHeader, setPlansHeader] = useState<SitePlansHeader>(
    initialContent.plansHeader || {
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
  );

  const [kinderTogether, setKinderTogether] = useState<SiteKinderTogether>(
    initialContent.kinderTogether,
  );
  const [safetyTips, setSafetyTips] = useState<SiteSafetyTips>(
    initialContent.safetyTips,
  );
  const [realTalk, setRealTalk] = useState<SiteRealTalk>(
    initialContent.realTalk,
  );

  // Kinder Together handlers
  const handleAddKinderPrinciple = () => {
    setKinderTogether({
      ...kinderTogether,
      principles: [
        ...kinderTogether.principles,
        {
          id: `principle-${Date.now()}`,
          title: "New Community Principle",
          lead: "Guidelines for respect...",
          items: ["Add your guidelines here..."],
        },
      ],
    });
  };

  const handleUpdateKinderPrinciple = (
    index: number,
    field: "title" | "lead",
    value: string,
  ) => {
    const updated = [...kinderTogether.principles];
    updated[index] = { ...updated[index], [field]: value };
    setKinderTogether({ ...kinderTogether, principles: updated });
  };

  const handleUpdateKinderItems = (index: number, multilineText: string) => {
    const updated = [...kinderTogether.principles];
    updated[index] = {
      ...updated[index],
      items: multilineText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setKinderTogether({ ...kinderTogether, principles: updated });
  };

  const handleDeleteKinderPrinciple = (index: number) => {
    setKinderTogether({
      ...kinderTogether,
      principles: kinderTogether.principles.filter((_, i) => i !== index),
    });
  };

  // Safety Tips handlers
  const handleAddSafetySection = () => {
    setSafetyTips({
      ...safetyTips,
      sections: [
        ...safetyTips.sections,
        {
          id: `section-${Date.now()}`,
          title: "New Safety Tip Category",
          lead: "Summary advice...",
          intro: "More details...",
          items: ["Safety checklist item..."],
        },
      ],
    });
  };

  const handleUpdateSafetySection = (
    index: number,
    field: "title" | "lead" | "intro",
    value: string,
  ) => {
    const updated = [...safetyTips.sections];
    updated[index] = { ...updated[index], [field]: value };
    setSafetyTips({ ...safetyTips, sections: updated });
  };

  const handleUpdateSafetyItems = (index: number, multilineText: string) => {
    const updated = [...safetyTips.sections];
    updated[index] = {
      ...updated[index],
      items: multilineText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setSafetyTips({ ...safetyTips, sections: updated });
  };

  const handleDeleteSafetySection = (index: number) => {
    setSafetyTips({
      ...safetyTips,
      sections: safetyTips.sections.filter((_, i) => i !== index),
    });
  };

  // Real Talk handlers
  const handleAddRealTopic = () => {
    setRealTalk({
      ...realTalk,
      topics: [
        ...realTalk.topics,
        {
          id: `topic-${Date.now()}`,
          emoji: "💡",
          title: "New Topic Title",
          text: "Advice and insights...",
        },
      ],
    });
  };

  const handleUpdateRealTopic = (
    index: number,
    field: "title" | "emoji" | "text",
    value: string,
  ) => {
    const updated = [...realTalk.topics];
    updated[index] = { ...updated[index], [field]: value };
    setRealTalk({ ...realTalk, topics: updated });
  };

  const handleDeleteRealTopic = (index: number) => {
    setRealTalk({
      ...realTalk,
      topics: realTalk.topics.filter((_, i) => i !== index),
    });
  };

  // Perks helpers
  const handleAddPerk = () => {
    setPlansHeader({
      ...plansHeader,
      perks: [
        ...plansHeader.perks,
        { title: "New Perk", description: "Description of the perk..." },
      ],
    });
  };

  const handleUpdatePerk = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    const updated = [...plansHeader.perks];
    updated[index] = { ...updated[index], [field]: value };
    setPlansHeader({ ...plansHeader, perks: updated });
  };

  const handleDeletePerk = (index: number) => {
    setPlansHeader({
      ...plansHeader,
      perks: plansHeader.perks.filter((_, i) => i !== index),
    });
  };

  // FAQ helpers
  const handleAddFaq = () => {
    const newFaq: Faq = {
      id: `faq-${Date.now()}`,
      question: "New Question?",
      answer: "Write the answer here...",
    };
    setFaqs([...faqs, newFaq]);
  };

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Feature helpers
  const handleAddFeature = () => {
    const newFeat: Feature = {
      id: `feat-${Date.now()}`,
      icon: "camera",
      title: "New Feature Title",
      description: "Briefly explain this feature to visitors...",
      href: "#faq",
    };
    setFeatures([...features, newFeat]);
  };

  const handleUpdateFeature = (
    index: number,
    field: "title" | "description" | "icon",
    value: string,
  ) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const handleDeleteFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Campaign helpers
  const handleAddCampaign = () => {
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      eyebrow: "Spotlight",
      title: "New Safety Campaign",
      description: "Describe the campaign or workshop initiative...",
      cta: "Learn more",
      href: "/safety-tips",
      art: "from-[#FF3D77] to-[#8B2FC9]",
      image: "/illustrations/campaign-workshop.svg",
      imageAlt: "Campaign illustration",
    };
    setCampaigns([...campaigns, newCamp]);
  };

  const handleUpdateCampaign = (
    index: number,
    field: "eyebrow" | "title" | "description" | "cta" | "href",
    value: string,
  ) => {
    const updated = [...campaigns];
    updated[index] = { ...updated[index], [field]: value };
    setCampaigns(updated);
  };

  const handleDeleteCampaign = (index: number) => {
    setCampaigns(campaigns.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/5 p-4 sm:p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-pink-600">
              <Globe className="h-3.5 w-3.5" />
              <span>Live Website CMS</span>
            </div>
            <h2 className="mt-1 text-[20px] font-bold tracking-tight text-admin-ink">
              Website Content &amp; Media Management
            </h2>
            <p className="mt-0.5 text-[13px] text-admin-ink-2">
              All changes saved here will immediately update on the live website.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-admin-ink shadow-sm hover:bg-gray-50 transition"
          >
            <span>View Live Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-pink-600" />
          </a>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-pink-500/10 pt-4">
          {[
            { id: "hero" as const, label: "Hero & App Links", icon: Smartphone },
            { id: "company" as const, label: "Company & Contact", icon: Building2 },
            { id: "plans" as const, label: "Plans & Perks", icon: Crown },
            { id: "faqs" as const, label: `FAQs (${faqs.length})`, icon: HelpCircle },
            { id: "features" as const, label: `Features (${features.length})`, icon: ShieldCheck },
            { id: "campaigns" as const, label: `Campaigns (${campaigns.length})`, icon: Megaphone },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cx(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                  tab === t.id
                    ? "bg-white text-admin-ink shadow-sm"
                    : "text-admin-ink-2 hover:bg-white/40",
                )}
              >
                <Icon className="h-4 w-4 text-pink-500" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CMS Form */}
      <form action={saveWebsiteContent} className="space-y-6">
        {/* Hidden inputs transmitting JSON for dynamic arrays */}
        <input type="hidden" name="faqs_json" value={JSON.stringify(faqs)} />
        <input
          type="hidden"
          name="features_json"
          value={JSON.stringify(features)}
        />
        <input
          type="hidden"
          name="campaigns_json"
          value={JSON.stringify(campaigns)}
        />
        <input
          type="hidden"
          name="plans_header_json"
          value={JSON.stringify(plansHeader)}
        />
        <input
          type="hidden"
          name="kinder_together_json"
          value={JSON.stringify(kinderTogether)}
        />
        <input
          type="hidden"
          name="safety_tips_json"
          value={JSON.stringify(safetyTips)}
        />
        <input
          type="hidden"
          name="real_talk_json"
          value={JSON.stringify(realTalk)}
        />

        {/* TAB 1: HERO & DOWNLOAD LINKS */}
        {tab === "hero" && (
          <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
            <h3 className="text-base font-bold text-admin-ink border-b border-gray-100 pb-3">
              Hero Section &amp; Store Links
            </h3>

            <div>
              <label className="block text-[12.5px] font-semibold text-admin-ink">
                Hero Badge Text
              </label>
              <input
                type="text"
                name="hero_badge"
                defaultValue={initialContent.hero.badge}
                placeholder="e.g. Find Your Connection"
                className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  name="hero_headline_1"
                  defaultValue={initialContent.hero.headline[0] ?? "Meet someone."}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Headline Line 2 (Gradient Highlight)
                </label>
                <input
                  type="text"
                  name="hero_headline_2"
                  defaultValue={initialContent.hero.headline[1] ?? "Feel something."}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Headline Line 3
                </label>
                <input
                  type="text"
                  name="hero_headline_3"
                  defaultValue={initialContent.hero.headline[2] ?? "Make it meaningful."}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-admin-ink">
                Hero Subtitle / Description
              </label>
              <textarea
                name="hero_subtitle"
                rows={3}
                defaultValue={initialContent.hero.subtitle}
                className="mt-1 w-full rounded-[14px] border border-gray-200 p-3.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Google Play Store URL
                </label>
                <input
                  type="url"
                  name="googlePlayUrl"
                  defaultValue={initialContent.hero.googlePlayUrl}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Apple App Store URL
                </label>
                <input
                  type="url"
                  name="appStoreUrl"
                  defaultValue={initialContent.hero.appStoreUrl}
                  placeholder="https://apps.apple.com/app/..."
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-3">
              <h4 className="text-sm font-bold text-admin-ink">
                Safety Handbook Banner
              </h4>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-semibold text-admin-ink">
                    Handbook Title
                  </label>
                  <input
                    type="text"
                    name="handbook_title"
                    defaultValue={initialContent.handbook.title}
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-admin-ink">
                    Handbook Button Label
                  </label>
                  <input
                    type="text"
                    name="handbook_cta"
                    defaultValue={initialContent.handbook.ctaText}
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-admin-ink">
                  Handbook Description
                </label>
                <textarea
                  name="handbook_desc"
                  rows={2}
                  defaultValue={initialContent.handbook.description}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 p-3 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPANY & CONTACT */}
        {tab === "company" && (
          <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
            <h3 className="text-base font-bold text-admin-ink border-b border-gray-100 pb-3">
              Corporate &amp; Contact Details (Shown in Footers &amp; Legal Pages)
            </h3>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  name="legalName"
                  defaultValue={initialContent.company.legalName}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Corporate Identity Number (CIN)
                </label>
                <input
                  type="text"
                  name="cin"
                  defaultValue={initialContent.company.cin}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-mono text-[12.5px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Official Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  defaultValue={initialContent.company.supportEmail}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-admin-ink">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  name="supportPhone"
                  defaultValue={initialContent.company.supportPhone}
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-admin-ink">
                Registered Office Address
              </label>
              <textarea
                name="registeredOffice"
                rows={2}
                defaultValue={initialContent.company.registeredOffice}
                className="mt-1 w-full rounded-[14px] border border-gray-200 p-3.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-sm font-bold text-admin-ink mb-3">
                Social Media Handles (URLs)
              </h4>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <div>
                  <label className="block text-[12px] font-semibold text-admin-ink">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    defaultValue={initialContent.company.instagram}
                    placeholder="https://instagram.com/..."
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-admin-ink">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    defaultValue={initialContent.company.youtube}
                    placeholder="https://youtube.com/@..."
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-admin-ink">
                    X (Twitter) Profile URL
                  </label>
                  <input
                    type="url"
                    name="x"
                    defaultValue={initialContent.company.x}
                    placeholder="https://x.com/..."
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLANS & PERKS SECTION */}
        {tab === "plans" && (
          <div className="space-y-6">
            {/* Quick Links Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-pink-500/20 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent p-4 sm:p-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600">
                  <Crown className="h-4 w-4" />
                  <span>Subscription Tiers &amp; Pricing Management</span>
                </div>
                <p className="mt-1 text-xs sm:text-[13px] text-admin-ink-2">
                  The plan pricing cards (1 Week, 1 Month, 3 Months, Best Value badge) on the right are managed in the <strong>Subscription Plans</strong> section.
                </p>
              </div>
              <a
                href="/admin/plans"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-pink-600 shadow-sm hover:bg-gray-50 transition"
              >
                <span>Edit Pricing &amp; Plans in Plan Manager</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Left-Side Content Settings */}
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
              <h3 className="text-base font-bold text-admin-ink border-b border-gray-100 pb-3">
                Plans Section Header (Left Side on Landing Page)
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-admin-ink">
                    Eyebrow / Category Tag
                  </label>
                  <input
                    type="text"
                    value={plansHeader.eyebrow}
                    onChange={(e) =>
                      setPlansHeader({ ...plansHeader, eyebrow: e.target.value })
                    }
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder="e.g. Vellora Premium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-admin-ink">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={plansHeader.title}
                    onChange={(e) =>
                      setPlansHeader({ ...plansHeader, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder="e.g. Want a little extra?"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-admin-ink">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={plansHeader.subtitle}
                  onChange={(e) =>
                    setPlansHeader({ ...plansHeader, subtitle: e.target.value })
                  }
                  className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g. Premium adds a few perks on top..."
                />
              </div>

              {/* Perks List */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-admin-ink">
                      Premium Perks Cards
                    </h4>
                    <p className="text-xs text-admin-ink-2">
                      Bullet points shown below the headline with checkmarks
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPerk}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 hover:bg-pink-100 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Perk</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {plansHeader.perks.map((perk, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-[16px] border border-gray-100 bg-white p-3.5 shadow-sm"
                    >
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pink-500/10 text-pink-600 text-xs font-bold mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-semibold text-admin-ink-2">
                            Perk Title
                          </label>
                          <input
                            type="text"
                            value={perk.title}
                            onChange={(e) =>
                              handleUpdatePerk(index, "title", e.target.value)
                            }
                            className="mt-0.5 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            placeholder="e.g. Unlimited likes"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-admin-ink-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={perk.description}
                            onChange={(e) =>
                              handleUpdatePerk(index, "description", e.target.value)
                            }
                            className="mt-0.5 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            placeholder="e.g. Like as many people as you want."
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePerk(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition cursor-pointer mt-2"
                        title="Delete Perk"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Note Card */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-admin-ink mb-1">
                  Safety Note Banner (Bottom Card with Shield)
                </h4>
                <p className="text-xs text-admin-ink-2 mb-3">
                  Reassures users that essential safety features remain 100% free
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold text-admin-ink-2">
                      Safety Card Title
                    </label>
                    <input
                      type="text"
                      value={plansHeader.safetyNoteTitle}
                      onChange={(e) =>
                        setPlansHeader({
                          ...plansHeader,
                          safetyNoteTitle: e.target.value,
                        })
                      }
                      className="mt-0.5 w-full rounded-[12px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Safety is never a paid feature"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-admin-ink-2">
                      Safety Card Description
                    </label>
                    <input
                      type="text"
                      value={plansHeader.safetyNoteDesc}
                      onChange={(e) =>
                        setPlansHeader({
                          ...plansHeader,
                          safetyNoteDesc: e.target.value,
                        })
                      }
                      className="mt-0.5 w-full rounded-[12px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Verification, blocking, reporting..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAQS MANAGER */}
        {tab === "faqs" && (
          <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-admin-ink">
                  Frequently Asked Questions (Landing Page FAQ)
                </h3>
                <p className="text-xs text-admin-ink-2">
                  Edit questions and answers shown in the landing page accordion.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3.5 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-500/20 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-pink-600">
                      Question #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(index)}
                      className="cursor-pointer text-gray-400 hover:text-red-600 p-1 rounded-full transition"
                      title="Delete FAQ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      handleUpdateFaq(index, "question", e.target.value)
                    }
                    placeholder="Question..."
                    className="w-full rounded-[10px] border border-gray-200 px-3 py-2 text-[13.5px] font-semibold text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />

                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) =>
                      handleUpdateFaq(index, "answer", e.target.value)
                    }
                    placeholder="Answer..."
                    className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY FEATURES GRID */}
        {tab === "features" && (
          <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-admin-ink">
                  Safety Tools &amp; Features Grid
                </h3>
                <p className="text-xs text-admin-ink-2">
                  Highlight features such as Photo Verification, Shield Ban, Protected Calls, etc.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFeature}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3.5 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-500/20 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feat, index) => (
                <div
                  key={feat.id || index}
                  className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-purple-600">
                        Feature #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeature(index)}
                        className="cursor-pointer text-gray-400 hover:text-red-600 p-1 rounded-full transition"
                        title="Delete Feature"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) =>
                        handleUpdateFeature(index, "title", e.target.value)
                      }
                      placeholder="Feature Title..."
                      className="w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13.5px] font-bold text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />

                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) =>
                        handleUpdateFeature(index, "description", e.target.value)
                      }
                      placeholder="Feature Description..."
                      className="w-full rounded-[10px] border border-gray-200 p-2.5 text-[12.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-admin-ink-2">
                    <span>Icon: {feat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CAMPAIGNS & STORIES */}
        {tab === "campaigns" && (
          <div className="space-y-6">
            {/* Sub-navigation for Campaign Carousel vs Linked Landing Pages */}
            <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-white/80 bg-white/70 p-2 shadow-xs backdrop-blur-md">
              {[
                { id: "cards" as const, label: `Homepage Carousel (${campaigns.length})`, icon: Megaphone },
                { id: "kinder" as const, label: "Kinder Together (/kinder-together)", icon: Heart },
                { id: "safety" as const, label: "Safety Tips (/safety-tips)", icon: Shield },
                { id: "realtalk" as const, label: "Real Talk Month (/real-talk)", icon: FileText },
              ].map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setCampaignSubView(sub.id)}
                    className={cx(
                      "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all",
                      campaignSubView === sub.id
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                        : "text-admin-ink-2 hover:bg-white/60",
                    )}
                  >
                    <SubIcon className="h-3.5 w-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-VIEW 1: CAMPAIGN CAROUSEL CARDS */}
            {campaignSubView === "cards" && (
              <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-admin-ink">
                      Campaigns &amp; Community Initiatives (Carousel Cards)
                    </h3>
                    <p className="text-xs text-admin-ink-2">
                      Cards shown in the carousel banner on the homepage. Click on any page button to edit its linked landing page content!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCampaign}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3.5 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-500/20 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Campaign</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {campaigns.map((camp, index) => (
                    <div
                      key={camp.id || index}
                      className="rounded-[16px] border border-gray-200 bg-white p-4 sm:p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-purple-600">
                          Campaign Card #{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {camp.href?.includes("kinder") && (
                            <button
                              type="button"
                              onClick={() => setCampaignSubView("kinder")}
                              className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full hover:bg-pink-100 transition"
                            >
                              <span>Edit /kinder-together Page Content &rarr;</span>
                            </button>
                          )}
                          {camp.href?.includes("safety-tips") && (
                            <button
                              type="button"
                              onClick={() => setCampaignSubView("safety")}
                              className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full hover:bg-pink-100 transition"
                            >
                              <span>Edit /safety-tips Page Content &rarr;</span>
                            </button>
                          )}
                          {camp.href?.includes("real-talk") && (
                            <button
                              type="button"
                              onClick={() => setCampaignSubView("realtalk")}
                              className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full hover:bg-pink-100 transition"
                            >
                              <span>Edit /real-talk Page Content &rarr;</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(index)}
                            className="cursor-pointer text-gray-400 hover:text-red-600 p-1 rounded-full transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-admin-ink">
                            Eyebrow Tag (e.g. Workshops, Community)
                          </label>
                          <input
                            type="text"
                            value={camp.eyebrow}
                            onChange={(e) =>
                              handleUpdateCampaign(index, "eyebrow", e.target.value)
                            }
                            className="mt-1 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-admin-ink">
                            Campaign Title
                          </label>
                          <input
                            type="text"
                            value={camp.title}
                            onChange={(e) =>
                              handleUpdateCampaign(index, "title", e.target.value)
                            }
                            className="mt-1 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] font-bold text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-admin-ink">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={camp.description}
                          onChange={(e) =>
                            handleUpdateCampaign(index, "description", e.target.value)
                          }
                          className="mt-1 w-full rounded-[10px] border border-gray-200 p-2.5 text-[12.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-admin-ink">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={camp.cta}
                            onChange={(e) =>
                              handleUpdateCampaign(index, "cta", e.target.value)
                            }
                            className="mt-1 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[12.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-admin-ink">
                            CTA Link (e.g. /safety-tips, /kinder-together, /real-talk)
                          </label>
                          <input
                            type="text"
                            value={camp.href || ""}
                            onChange={(e) =>
                              handleUpdateCampaign(index, "href", e.target.value)
                            }
                            className="mt-1 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[12.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: KINDER TOGETHER PAGE CONTENT */}
            {campaignSubView === "kinder" && (
              <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-pink-600">
                      <Heart className="h-3.5 w-3.5" />
                      <span>Linked Campaign Landing Page</span>
                    </div>
                    <h3 className="text-base font-bold text-admin-ink mt-0.5">
                      Kinder Together Page Content (/kinder-together)
                    </h3>
                  </div>
                  <a
                    href="/kinder-together"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-admin-ink shadow-xs hover:bg-gray-50 transition"
                  >
                    <span>View Live /kinder-together</span>
                    <ExternalLink className="h-3.5 w-3.5 text-pink-600" />
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-admin-ink">
                      Page Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={kinderTogether.eyebrow}
                      onChange={(e) =>
                        setKinderTogether({ ...kinderTogether, eyebrow: e.target.value })
                      }
                      className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Community"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-admin-ink">
                      Page Headline / Title
                    </label>
                    <input
                      type="text"
                      value={kinderTogether.title}
                      onChange={(e) =>
                        setKinderTogether({ ...kinderTogether, title: e.target.value })
                      }
                      className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Kinder Together"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-admin-ink">
                    Headline Subtitle
                  </label>
                  <input
                    type="text"
                    value={kinderTogether.subtitle}
                    onChange={(e) =>
                      setKinderTogether({ ...kinderTogether, subtitle: e.target.value })
                    }
                    className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder="e.g. A kinder dating community starts with how we treat each other."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-admin-ink">
                    Intro Paragraph / Description
                  </label>
                  <textarea
                    rows={2}
                    value={kinderTogether.description}
                    onChange={(e) =>
                      setKinderTogether({ ...kinderTogether, description: e.target.value })
                    }
                    className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                {/* Principles List */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-admin-ink">
                        Community Principles &amp; Pledge Cards
                      </h4>
                      <p className="text-xs text-admin-ink-2">
                        Pledge cards users tap to agree with on /kinder-together
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddKinderPrinciple}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Principle Card</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {kinderTogether.principles.map((pr, pIdx) => (
                      <div
                        key={pr.id || pIdx}
                        className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-600">
                            Principle #{pIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteKinderPrinciple(pIdx)}
                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition"
                            title="Delete Principle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-admin-ink-2">
                              Principle Title
                            </label>
                            <input
                              type="text"
                              value={pr.title}
                              onChange={(e) =>
                                handleUpdateKinderPrinciple(pIdx, "title", e.target.value)
                              }
                              className="mt-0.5 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                              placeholder="e.g. Treat People With Respect"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-admin-ink-2">
                              Lead / Subtext
                            </label>
                            <input
                              type="text"
                              value={pr.lead || ""}
                              onChange={(e) =>
                                handleUpdateKinderPrinciple(pIdx, "lead", e.target.value)
                              }
                              className="mt-0.5 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                              placeholder="e.g. Consent and comfort matter at every step."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-admin-ink-2">
                            Pledge Checkbox Items (One rule per line)
                          </label>
                          <textarea
                            rows={3}
                            value={pr.items.join("\n")}
                            onChange={(e) =>
                              handleUpdateKinderItems(pIdx, e.target.value)
                            }
                            className="mt-0.5 w-full rounded-[10px] border border-gray-200 p-2.5 text-[12.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                            placeholder="Line 1: Be respectful...&#10;Line 2: Accept no without pressuring..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: SAFETY TIPS PAGE CONTENT */}
            {campaignSubView === "safety" && (
              <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-pink-600">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Linked Campaign Landing Page</span>
                    </div>
                    <h3 className="text-base font-bold text-admin-ink mt-0.5">
                      Safety Tips Page Content (/safety-tips)
                    </h3>
                  </div>
                  <a
                    href="/safety-tips"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-admin-ink shadow-xs hover:bg-gray-50 transition"
                  >
                    <span>View Live /safety-tips</span>
                    <ExternalLink className="h-3.5 w-3.5 text-pink-600" />
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-admin-ink">
                      Page Main Title
                    </label>
                    <input
                      type="text"
                      value={safetyTips.title}
                      onChange={(e) =>
                        setSafetyTips({ ...safetyTips, title: e.target.value })
                      }
                      className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Safety Tips"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-admin-ink">
                      Intro Lead Summary
                    </label>
                    <input
                      type="text"
                      value={safetyTips.lead}
                      onChange={(e) =>
                        setSafetyTips({ ...safetyTips, lead: e.target.value })
                      }
                      className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* Safety Sections Editor */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-admin-ink">
                        Safety Tip Categories &amp; Checklists
                      </h4>
                      <p className="text-xs text-admin-ink-2">
                        Sections shown with interactive checkmarks on /safety-tips
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSafetySection}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {safetyTips.sections.map((sec, sIdx) => (
                      <div
                        key={sec.id || sIdx}
                        className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-600">
                            Category #{sIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSafetySection(sIdx)}
                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition"
                            title="Delete Section"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-[11px] font-semibold text-admin-ink-2">
                              Category Title
                            </label>
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) =>
                                handleUpdateSafetySection(sIdx, "title", e.target.value)
                              }
                              className="mt-0.5 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                              placeholder="e.g. Plan Your First Date Safely"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-admin-ink-2">
                              Lead Highlight
                            </label>
                            <input
                              type="text"
                              value={sec.lead}
                              onChange={(e) =>
                                handleUpdateSafetySection(sIdx, "lead", e.target.value)
                              }
                              className="mt-0.5 w-full rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                              placeholder="e.g. Choose a public place."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-admin-ink-2">
                            Checklist Items (One tip per line)
                          </label>
                          <textarea
                            rows={3}
                            value={sec.items.join("\n")}
                            onChange={(e) =>
                              handleUpdateSafetyItems(sIdx, e.target.value)
                            }
                            className="mt-0.5 w-full rounded-[10px] border border-gray-200 p-2.5 text-[12.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                            placeholder="Line 1: Meet at a busy café...&#10;Line 2: Arrange your own transportation..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: REAL TALK MONTH PAGE CONTENT */}
            {campaignSubView === "realtalk" && (
              <div className="rounded-[24px] border border-white/80 bg-white/70 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-pink-600">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Linked Campaign Landing Page</span>
                    </div>
                    <h3 className="text-base font-bold text-admin-ink mt-0.5">
                      Real Talk Month Page Content (/real-talk)
                    </h3>
                  </div>
                  <a
                    href="/real-talk"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-admin-ink shadow-xs hover:bg-gray-50 transition"
                  >
                    <span>View Live /real-talk</span>
                    <ExternalLink className="h-3.5 w-3.5 text-pink-600" />
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-admin-ink">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={realTalk.title}
                      onChange={(e) =>
                        setRealTalk({ ...realTalk, title: e.target.value })
                      }
                      className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Real Talk Month"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-admin-ink">
                      Italic Subtitle
                    </label>
                    <input
                      type="text"
                      value={realTalk.subtitle}
                      onChange={(e) =>
                        setRealTalk({ ...realTalk, subtitle: e.target.value })
                      }
                      className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Real conversations. Safer connections."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-admin-ink">
                    Main Description
                  </label>
                  <textarea
                    rows={2}
                    value={realTalk.description}
                    onChange={(e) =>
                      setRealTalk({ ...realTalk, description: e.target.value })
                    }
                    className="mt-1 w-full rounded-[12px] border border-gray-200 px-3 py-2 text-sm text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                {/* Topics List */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-admin-ink">
                        Topic Explorer Cards ({realTalk.topics.length})
                      </h4>
                      <p className="text-xs text-admin-ink-2">
                        Interactive topic tabs users click to read advice on /real-talk
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddRealTopic}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Topic</span>
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {realTalk.topics.map((top, tIdx) => (
                      <div
                        key={top.id || tIdx}
                        className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-600">
                            Topic #{tIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteRealTopic(tIdx)}
                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition"
                            title="Delete Topic"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={top.emoji}
                            onChange={(e) =>
                              handleUpdateRealTopic(tIdx, "emoji", e.target.value)
                            }
                            className="w-12 text-center rounded-[10px] border border-gray-200 py-1.5 text-lg text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            title="Topic Emoji"
                          />
                          <input
                            type="text"
                            value={top.title}
                            onChange={(e) =>
                              handleUpdateRealTopic(tIdx, "title", e.target.value)
                            }
                            className="flex-1 rounded-[10px] border border-gray-200 px-3 py-1.5 text-[13px] font-bold text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            placeholder="e.g. Healthy Communication"
                          />
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={top.text}
                            onChange={(e) =>
                              handleUpdateRealTopic(tIdx, "text", e.target.value)
                            }
                            className="w-full rounded-[10px] border border-gray-200 p-2 text-[12px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            placeholder="Topic explanation and advice..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global Save Changes Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-[20px] border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-semibold text-admin-ink">
              Ready to publish changes to the live website
            </span>
          </div>

          <SubmitButton
            idleText="Save &amp; Publish Website"
            loadingText="Saving &amp; Publishing..."
            className="cursor-pointer rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all"
          />
        </div>
      </form>
    </div>
  );
}
