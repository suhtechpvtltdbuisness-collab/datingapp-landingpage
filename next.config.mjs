/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  async redirects() {
    return [{ source: "/", destination: "/safety", permanent: false }];
  },
};
export default nextConfig;
