const withPWA = require("next-pwa")({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  additionalManifestEntries: [
    {url: '/', revision: null}
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
    domains: ["content.r9cdn.net"],
  },
};

module.exports = withPWA(nextConfig);
