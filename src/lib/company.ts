/**
 * Legal entity and contact details, shown on /about, /terms, /privacy and in every footer.
 * Fields marked TODO must be replaced with the real registered details before deploying.
 * Any link set to null (store URLs, socials) is simply not rendered.
 */
export const company = {
  legalName: "Suh Tech Private Limited", // as registered with the MCA
  cin: "U70200UP2024PTC197468",
  gstin: null as string | null, // TODO: set if registered, otherwise leave null
  registeredOffice: "D-052/GF, Sector-32 PI, Eldeco Residency, Noida, Gautam Buddha Nagar, Uttar Pradesh - 201301",
  supportEmail: "suhtechpvtltdbuisness@gmail.com",
  supportPhone: "+91 75968 18126",
  domain: "vellora.my",
} as const;

export const storeLinks = {
  appStore: null as string | null, // TODO: App Store listing URL
  googlePlay: null as string | null, // TODO: Google Play listing URL
};

export const socialLinks = {
  instagram: null as string | null, // TODO: full profile URL
  youtube: null as string | null, // TODO
  x: null as string | null, // TODO
};

export const copyrightLine = `© 2026 ${company.legalName}. All rights reserved.`;
