const withPWA = require("next-pwa")({
  dest: 'public',
  swSrc: 'public/service-worker.js',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /dynamic-css-manifest\.json$/],
  disable: false,
  additionalManifestEntries: [
    {url: '/', revision: null},
    {url: '/1/', revision: null},
    {url: '/tour/', revision: null},
    {url: '/transfer/', revision: null},
    {url: '/rent/', revision: null},
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["content.r9cdn.net"],
  },
};

module.exports = withPWA(nextConfig);
