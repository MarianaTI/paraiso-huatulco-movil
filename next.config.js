const withPWA = require("next-pwa")({
  dest: "public",
  // disable: process.env.NODE_ENV === 'development',
  disable: false,
  register: true,
  skipWaiting: true,
  swSrc: "service-worker.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/pwa",
  output: "export",
  images: {
    unoptimized: true,
    domains: ["content.r9cdn.net"],
  },
};

module.exports = withPWA(nextConfig);
