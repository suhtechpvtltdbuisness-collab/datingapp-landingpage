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
      // One canonical host: https://vellora.my (non-www).
      { source: "/:path*", has: [{ type: "host", value: "www.vellora.my" }], destination: "https://vellora.my/:path*", permanent: true },
    ];
  },
};
export default nextConfig;
