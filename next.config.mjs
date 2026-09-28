/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  outputFileTracingRoot: import.meta.dirname,
  async redirects() {
    return [{ source: "/", destination: "/safety", permanent: false }];
  },
};
export default nextConfig;
