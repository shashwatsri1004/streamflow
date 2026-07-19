/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    // Prevent Next.js from bundling @vercel/blob (and its undici dependency),
    // which fails to parse under the Next 13.5 webpack config.
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
};

module.exports = nextConfig;
