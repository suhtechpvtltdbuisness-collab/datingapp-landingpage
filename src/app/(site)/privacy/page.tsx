import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brand } from "../safety/theme";
import { company } from "@/lib/company";
import LegalFooter from "../safety/components/LegalFooter";

export const metadata: Metadata = {
  title: `Privacy Policy | ${brand.name}`,
  description: `How ${brand.name} collects, uses, shares and protects your personal information, and the choices you have.`,
};

const LAST_UPDATED = "1 November 2026";

const linkClass = "font-semibold text-brand-magenta underline-offset-2 hover:underline";
const Mail = ({ to }: { to: string }) => (
  <a href={`mailto:${to}`} className={linkClass}>
    {to}
  </a>
);

type Section = { id: string; title: string; body: ReactNode };

// Sections cross-reference each other by number ("see Section 4"), so keep that in mind when reordering.
const sections: Section[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    body: (
      <>
        <p>
          {brand.name} is a dating app operated by <strong>{company.legalName}</strong> (CIN {company.cin}), with its registered office at {company.registeredOffice}, India (&ldquo;{brand.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
        </p>
        <p>
          We are the &ldquo;Data Fiduciary&rdquo; (data controller) for the personal data described in this policy. This policy applies to the {brand.name} mobile app, the website at {company.domain}, and any support we provide (together, the &ldquo;Service&rdquo;).
        </p>
        <p>By creating an account or using the Service, you agree to the collection and use of your information as described here. If you do not agree, please do not use {brand.name}.</p>
      </>
    ),
  },
  {
    id: "information-you-give",
    title: "Information You Give Us",
    body: (
      <ul>
        <li><strong>Account details:</strong> your name, email address, mobile phone number, date of birth and a password (stored only in hashed form). If you sign in with Google, we receive your name, email address and Google account ID from Google.</li>
        <li><strong>Dating profile:</strong> your gender, who you are interested in, what you are looking for, photos, bio, interests, prompts and opening moves, and any optional details you choose to add, such as height, work, education, hometown, languages, star sign, drinking, smoking, exercise, children and pronouns.</li>
        <li><strong>Discovery preferences:</strong> age range, distance, the genders you want to see and similar filters.</li>
        <li><strong>Messages:</strong> the text and any photos or files you send to your matches.</li>
        <li><strong>Selfie for verification:</strong> if you choose to verify your profile, a live selfie (see Section 4).</li>
        <li><strong>Reports and blocks:</strong> details you provide when you report or block another member.</li>
        <li><strong>Support requests:</strong> your email address, the issue type, your description and any screenshots or files you attach when you contact support.</li>
        <li><strong>Account deletion requests:</strong> the email or phone number and one-time code you use to confirm a deletion request on our website.</li>
      </ul>
    ),
  },
  {
    id: "sensitive-information",
    title: "Sensitive Information You Choose to Share",
    body: (
      <>
        <p>
          Some profile details can reveal sensitive information about you, such as your <strong>sexual orientation</strong> (through your gender and who you are interested in), <strong>religion</strong>, <strong>political views</strong> or interests that relate to your <strong>health</strong>.
        </p>
        <p>
          Apart from gender and who you are interested in, which we need in order to show you relevant matches, these fields are <strong>optional</strong>. If you add them, you give us your explicit consent to process them to run your profile and matching, and you understand that they will be visible to other members. You can edit or remove them at any time in <em>Edit Profile</em>.
        </p>
      </>
    ),
  },
  {
    id: "selfie-verification",
    title: "Selfie Verification and Facial Data",
    body: (
      <>
        <p>Verification is <strong>optional</strong>. If you choose to verify your profile:</p>
        <ul>
          <li>You take a live selfie in the app. Our verification service creates a mathematical representation of the face (a &ldquo;face template&rdquo;) from the selfie and from your profile photos, and compares them to check that your photos are really you.</li>
          <li>The selfie is processed in memory and is <strong>not saved</strong>. Face templates are created only for the comparison and are <strong>not stored</strong> afterwards.</li>
          <li>We keep only the outcome: whether verification passed, the similarity score, which profile photo matched and when the check happened.</li>
          <li>If verification passes, your profile shows a verified badge. We do not use facial data for any other purpose, such as advertising or identifying you elsewhere.</li>
        </ul>
      </>
    ),
  },
  {
    id: "information-collected-automatically",
    title: "Information Collected Automatically",
    body: (
      <>
        <ul>
          <li><strong>Location:</strong> with your permission, your device&rsquo;s precise location (latitude and longitude), used to show people near you and the distance between you. See Section 9.</li>
          <li><strong>App activity:</strong> your likes, passes, matches, when you were last active, online status, and message delivery and read status.</li>
          <li><strong>Device and technical data:</strong> your IP address, device and operating system type, app version, login sessions and error logs.</li>
          <li><strong>Notifications:</strong> your notification preferences and the in-app notifications we generate for you, such as new likes, matches and messages.</li>
        </ul>
        <p>We do <strong>not</strong> use third-party advertising or analytics SDKs in the {brand.name} app.</p>
      </>
    ),
  },
  {
    id: "information-from-others",
    title: "Information From Other People",
    body: (
      <ul>
        <li><strong>Other members</strong> may send you messages or submit reports about you, which may include information about you.</li>
        <li><strong>Google</strong> provides your basic profile details if you choose Google Sign-In.</li>
      </ul>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Create, secure and manage your account, including sending one-time codes by email.</li>
          <li>Build and show your dating profile to other members.</li>
          <li>Suggest people to you based on your location, preferences and activity.</li>
          <li>Enable likes, matches, real-time chat and notifications.</li>
          <li>Verify profiles that choose selfie verification.</li>
          <li>Keep {brand.name} safe: detect fake accounts, spam, fraud and abuse; review reports; and enforce our Terms and Community Guidelines, including banning accounts.</li>
          <li>Respond to support requests and send you important service messages.</li>
          <li>Maintain, troubleshoot and improve the Service.</li>
          <li>Comply with legal obligations and respond to lawful requests from authorities.</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal information, and we do not use your messages or profile to show you third-party ads.</p>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Why We Are Allowed to Use Your Information",
    body: (
      <>
        <p>Under India&rsquo;s Digital Personal Data Protection Act, 2023 and other applicable laws, we process your personal data on the following grounds:</p>
        <ul>
          <li><strong>Your consent</strong>, which you give when you sign up, grant app permissions (such as location or camera), add optional profile details, or choose selfie verification. You can withdraw consent at any time (see Section 14). Withdrawing consent does not affect processing that took place before you withdrew it.</li>
          <li><strong>Legitimate uses permitted by law</strong>, such as keeping the Service safe, preventing fraud, and complying with legal obligations, court orders or requests from government authorities.</li>
        </ul>
      </>
    ),
  },
  {
    id: "location",
    title: "Location Information",
    body: (
      <>
        <p>{brand.name} asks for permission to use your device&rsquo;s location. We store your coordinates to find members within your chosen distance.</p>
        <p>
          Other members see only an <strong>approximate distance</strong> (for example, &ldquo;5 km away&rdquo;) and, if you add them, your city and country. We never show your exact location to other members.
        </p>
        <p>You can turn off location access in your device settings at any time. Without location, discovery features may not work properly.</p>
      </>
    ),
  },
  {
    id: "what-others-see",
    title: "What Other Members Can See",
    body: (
      <>
        <ul>
          <li>Your first name, age, photos, bio, interests, the profile details you have added, your verified badge (if any) and your approximate distance.</li>
          <li>Your online status and last active time, unless you turn them off in your settings.</li>
          <li>Messages you send are seen by the member you send them to.</li>
        </ul>
        <p>
          Your email address, phone number, date of birth (other than your age), exact location and IP address are <strong>never</strong> shown to other members.
        </p>
        <p>
          You can hide your profile from discovery at any time with <em>Hide my profile</em> or <em>Take a break</em>. Please remember that other members can take screenshots, so only share what you are comfortable with.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How We Share Information",
    body: (
      <>
        <p>We share personal information only in the following situations:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who host and run {brand.name} on our behalf, under contracts that require them to protect your data and use it only to provide their services to us:
            <ul>
              <li>Cloud hosting and servers (Railway)</li>
              <li>Database hosting (MongoDB)</li>
              <li>Photo and file storage (Vercel Blob)</li>
              <li>Email delivery for one-time codes and service emails (Resend or our email provider)</li>
              <li>Sign-in (Google, if you choose Google Sign-In)</li>
              <li>Real-time messaging infrastructure (Supabase, where enabled)</li>
            </ul>
          </li>
          <li><strong>Other members</strong>, as described in Section 10.</li>
          <li><strong>Law enforcement and authorities</strong>, when required by law, court order or lawful government request, or when we believe in good faith that disclosure is necessary to prevent harm, investigate fraud or protect someone&rsquo;s safety.</li>
          <li><strong>Business transfers</strong>, if {company.legalName} is involved in a merger, acquisition or sale of assets. Your information would remain protected by this policy, and we would notify you of any change in control.</li>
        </ul>
      </>
    ),
  },
  {
    id: "international",
    title: "Where Your Information Is Stored",
    body: (
      <p>
        Our service providers may store and process your information on servers located outside India. Where we transfer data abroad, we do so only as permitted by Indian law and we take steps to make sure it receives an appropriate level of protection.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How Long We Keep Your Information",
    body: (
      <>
        <ul>
          <li><strong>Account and profile:</strong> for as long as your account is active.</li>
          <li><strong>Messages, likes and matches:</strong> for as long as your account is active. Messages you have sent may remain visible to the people you sent them to.</li>
          <li><strong>Selfie and face templates:</strong> not stored. They are discarded as soon as the verification check finishes.</li>
          <li><strong>One-time codes:</strong> automatically deleted within 30 minutes.</li>
          <li><strong>Login sessions:</strong> deleted automatically when they expire.</li>
          <li><strong>Support tickets:</strong> up to 2 years after the ticket is closed, so we can handle follow-ups.</li>
          <li><strong>Safety reports and ban records:</strong> up to 3 years, to stop banned users from returning and to defend legal claims.</li>
        </ul>
        <p>
          When you delete your account, we delete your account and profile and remove them from discovery. We delete or anonymise the related data (photos, likes, matches and messages) within <strong>30 days</strong>. The exception is information we must keep for longer to meet legal obligations, resolve disputes, prevent fraud or enforce a ban, which we keep only as long as necessary. Copies in backups are overwritten in the normal backup cycle, within 90 days.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights and Choices",
    body: (
      <>
        <p>Subject to applicable law, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> a summary of the personal data we hold about you and how we use it.</li>
          <li><strong>Correct or update</strong> your information. Most of it can be edited directly in the app under <em>Edit Profile</em>.</li>
          <li><strong>Erase</strong> your personal data by deleting your account (see Section 15).</li>
          <li><strong>Withdraw consent</strong>, for example by turning off location or notification permissions in your device settings, or by removing optional profile details.</li>
          <li><strong>Raise a grievance</strong> with our Grievance Officer (see Section 19). If you are not satisfied with our response, you may complain to the Data Protection Board of India.</li>
          <li><strong>Nominate</strong> another person to exercise your rights if you die or are unable to exercise them yourself.</li>
        </ul>
        <p>
          To exercise any of these rights, email <Mail to={company.supportEmail} /> from the email address linked to your account. We may need to verify your identity before acting on your request, and we will respond within the time required by law.
        </p>
      </>
    ),
  },
  {
    id: "account-deletion",
    title: "Deleting Your Account",
    body: (
      <>
        <p>You can delete your {brand.name} account at any time:</p>
        <ul>
          <li><strong>In the app:</strong> open your <em>Profile</em> and choose <em>Delete account</em>.</li>
          <li>
            <strong>On the web:</strong> visit{" "}
            <Link href="/delete" className={linkClass}>
              {company.domain}/delete
            </Link>
            , confirm your identity with a one-time code, and confirm the deletion. You do not need the app installed.
          </li>
          <li><strong>By email:</strong> write to <Mail to={company.supportEmail} /> from the email address linked to your account.</li>
        </ul>
        <p>Deletion is permanent and cannot be undone. Section 13 explains what happens to your data afterwards. If you only want a break, you can hide your profile instead.</p>
      </>
    ),
  },
  {
    id: "permissions",
    title: "App Permissions",
    body: (
      <>
        <p>The {brand.name} app may ask for the following permissions. You can change them at any time in your device settings:</p>
        <ul>
          <li><strong>Location:</strong> to show people near you and calculate distance.</li>
          <li><strong>Camera:</strong> to take profile photos and the live selfie for verification.</li>
          <li><strong>Photos and files:</strong> to upload profile photos, send photos in chat and attach screenshots to support requests. We access only the items you select.</li>
          <li><strong>Notifications:</strong> to alert you about new likes, matches and messages.</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "How We Protect Your Information",
    body: (
      <>
        <p>
          We use reasonable security measures to protect your information. These include encryption in transit (HTTPS/TLS), hashed passwords, short-lived access tokens, access controls that limit staff access to people who need it for safety or support, and logging of administrative actions.
        </p>
        <p>
          No online service is completely secure, so we cannot guarantee absolute security. If a personal data breach affects you, we will notify you and the Data Protection Board of India as required by law.
        </p>
      </>
    ),
  },
  {
    id: "age-requirement",
    title: "Age Requirement",
    body: (
      <>
        <p>
          <strong>{brand.name} is only for adults aged 18 and over.</strong> We do not knowingly collect personal data from anyone under 18. You must confirm your date of birth when you sign up.
        </p>
        <p>
          If we learn that an account belongs to someone under 18, we will remove the account and delete their data. If you believe a minor is using {brand.name}, please report the profile in the app or email <Mail to={company.supportEmail} />.
        </p>
      </>
    ),
  },
  {
    id: "grievance-officer",
    title: "Grievance Officer and Contact",
    body: (
      <>
        <p>If you have questions, concerns or complaints about this policy or how we handle your data, please contact our Grievance Officer:</p>
        <ul>
          {company.grievanceOfficer.name && (
            <li><strong>Name:</strong> {company.grievanceOfficer.name}</li>
          )}
          <li><strong>Company:</strong> {company.legalName}</li>
          <li><strong>Email:</strong> <Mail to={company.grievanceOfficer.email} /></li>
          <li><strong>Phone:</strong> {company.supportPhone}</li>
          <li><strong>Address:</strong> {company.registeredOffice}</li>
        </ul>
        <p>We aim to acknowledge complaints within 24 hours and resolve them within 15 days.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: (
      <p>
        We may update this policy from time to time. If we make significant changes, we will notify you in the app or by email before they take effect. The &ldquo;Last updated&rdquo; date at the top of this page shows when the policy was last changed. If you continue to use {brand.name} after an update, the updated policy applies.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-bg px-4 py-16 text-brand-ink sm:px-6">
        <article className="mx-auto max-w-3xl rounded-card bg-white p-6 shadow-card sm:p-10">
          <Link
            href="/safety"
            className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-4 py-2 text-sm font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Safety Centre
          </Link>
          <h1 className="mt-6 font-display text-4xl font-extrabold">Privacy Policy</h1>
          <p className="mt-2 text-sm font-semibold text-brand-ink-soft">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 leading-relaxed text-brand-ink-soft">
            Your privacy matters, especially on a dating app. This policy explains in plain language what information {brand.name} collects, why we collect it, who can see it, and how you can control or delete it.
          </p>

          <nav aria-label="Contents" className="mt-8 rounded-2xl bg-brand-bg p-5">
            <p className="text-sm font-bold text-brand-ink">Contents</p>
            <ol className="mt-3 grid list-decimal gap-x-6 gap-y-1.5 pl-5 text-sm text-brand-ink-soft sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-brand-magenta">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-8">
              <h2 className="font-display text-xl font-bold text-brand-ink">
                {i + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-brand-ink-soft [&_strong]:text-brand-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul_ul]:mt-1.5 [&_ul_ul]:list-[circle]">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </main>
      <LegalFooter />
    </>
  );
}
