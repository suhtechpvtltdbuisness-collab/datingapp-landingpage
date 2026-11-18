/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: import.meta.dirname,
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  async redirects() {
    return [
      // The homepage now lives at "/". Keep the old /safety URL working (and consolidate its ranking signals) with a 308.
      { source: "/safety", destination: "/", permanent: true },
      // www -> apex is configured at the Vercel domain level (Project > Settings > Domains), not here:
      // a code-level rule loops with a domain-level apex -> www redirect.
    ];
  },
};
export default nextConfig;
