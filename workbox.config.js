module.exports = {
  globDirectory: "out/",
  globPatterns: ["**/*.{html,js,css,json,ico,png,svg}"],
  swDest: "public/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/admindemo\.paraisohuatulco\.com\/admin\/products\/getProductsMovil/,
      handler: "NetworkFirst",
      options: {
        cacheName: "products-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/pwa\.paraisohuatulco\.com\/[a-zA-Z0-9_-]+\/$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "dynamic-pages",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
      },
    },
  ],
};
