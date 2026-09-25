# Velora Safety Centre (Next.js)

The standalone Trust & Safety landing page for the dating app. It is a separate
Next.js app (React + Tailwind). It includes the admin panel at `/admin` (see below).

## Run
```bash
npm install
npm run dev        # http://localhost:3000/safety  (/ redirects to /safety)
npm run build && npm start
```

## Structure
```
src/app/safety/
  page.tsx            composes the sections only   (lives under src/app/(site)/safety/)
  theme.ts            design tokens (colors, radii, shadows, EASE curve)
  components/         one component per file (Nav, Hero, FeatureGrid/Card, Handbook, EmergencyNotice,
                      CampaignCarousel/Card, PartnerLogoMarquee, Faq, Footer, DownloadCtaBar,
                      plus shared MagneticButton and SectionHeading)
  data/               all copy: features, campaigns, faqs, partners
  hooks/              useScrollReveal, useParallax, useMagnetic
```
CSS variables live in `src/app/globals.css`, and `tailwind.config.ts` maps them
to classes such as `bg-brand-gradient`, `shadow-card` and `rounded-card`. To
change content, edit `data/*` only.

## Before launch
- **Brand**: the Velora name, tagline and logo paths live in `theme.ts` (`brand`), and the logo files are in `public/brand/`.
- **Plans**: prices and perks are in `data/plans.ts`. Keep them in sync with the store listings. The savings % is calculated from the prices.
- **Partners**: the names in `data/partners.ts` are made up. Replace them with real organisations once you have signed partnerships.
- **Links**: the store buttons and footer links point to `#`. The emergency button dials 112; change it for your markets.
- **Accuracy**: `features.ts` and `faqs.ts` describe features like ID verification, the scam detector and image blur. Remove any your Flutter app doesn't ship yet.

## Admin panel at /admin
Built with React + Tailwind, like the rest of the site, and it runs with `npm run dev`.

```
src/app/(admin)/            admin root layout (Poppins, page background) + Tailwind entry
  admin/theme.ts            admin colour, gradient and shadow tokens (Tailwind `admin-*` classes)
  admin/login/              sign-in
  admin/(panel)/            dashboard, users, users/[id], reports, matches, settings
  admin/_components/        ui.tsx (cards, tables, badges, buttons), Sidebar, AdminPage, FlashStack, form helpers
  admin/actions.ts          server actions: login, ban/unban/verify/delete, resolve/dismiss, change password
  admin/logout, admin/api/stats   route handlers
src/lib/admin/              SQLite (node:sqlite), password hashing, session cookie, flash messages, seed data
src/middleware.ts           sends signed-out visitors to /admin/login?next=...
```

- **Data**: `data/dating_admin.db` holds the SQLite database for users, matches, reports, admins and the activity log.
  If it's missing, it's created and filled with demo data. The default login is `admin` / `ChangeMe!123`
  (printed in the terminal); change it in Settings.
- **Settings**: `ADMIN_DB_PATH` (database file), `ADMIN_SECRET_KEY` (session signing key; locally one is
  saved in `data/secret_key`). On Vercel the database lives in `/tmp` and is reset on each cold start,
  so use a hosted database for real data.
- Needs Node 22.13 or newer (for the built-in `node:sqlite`).

## Images
All illustrations are custom SVGs in `public/illustrations/`: the hero profile cards, the three
community cards and the handbook. The logo files are in `public/brand/`. Replace any of them
with photos by changing the paths in `SafetyHero.tsx`, `data/campaigns.ts` or `SafetyHandbookBanner.tsx`.
