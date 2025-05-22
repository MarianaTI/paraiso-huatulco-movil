const withPWA = require("next-pwa")({
  dest: 'public',
  swSrc: 'public/service-worker.js',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /dynamic-css-manifest\.json$/],
  disable: false,
  additionalManifestEntries: [
    {url: '/', revision: null},
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["content.r9cdn.net"],
  },
};

module.exports = withPWA(nextConfig);
