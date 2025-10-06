const fs = require("fs");
const path = require("path");

let dynamicEntries = [];
try {
  const filePath = path.join(__dirname, "data", "pwa-entries.json");
  if (fs.existsSync(filePath)) {
    dynamicEntries = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
} catch (err) {
  console.error("❌ No se pudieron cargar las rutas dinámicas para PWA");
}

const withPWA = require("next-pwa")({
  dest: 'public',
  swSrc: 'public/service-worker.js',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /dynamic-css-manifest\.json$/],
  disable: false,
  additionalManifestEntries: [
    {url: '/', revision: null},
    {url: '/tour/', revision: null},
    {url: '/transfer/', revision: null},
    {url: '/rent/', revision: null},
    {url: '/booking/', revision: null},
    {url: '/sales/', revision: null},
    {url: '/pending-sales/', revision: null},
    {url: '/confirmation/', revision: null},
    {url: '/report/', revision: null},
    {url: '/agency/', revision: null},
    {url: '/disponibilidad/', revision: null},
    {url: '/calendar/', revision: null},
    ...dynamicEntries
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  trailingSlash: true, //Esta opción genera las carpetas index.html de cada ruta dinamica
  images: {
    unoptimized: true,
    domains: ["content.r9cdn.net"],
  },
};

module.exports = withPWA(nextConfig);
