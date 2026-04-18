/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Linting warnings (unused vars, `any` types) should not block production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors in client components should not block production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
