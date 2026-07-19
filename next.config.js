/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  serverExternalPackages: ['@vercel/blob'],
};

module.exports = nextConfig;
