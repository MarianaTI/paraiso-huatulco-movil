module.exports = {
  globDirectory: "out/",
  globPatterns: ["**/*.{html,js,css,json,ico,png,svg}"],
  swDest: "public/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/admindemo\.paraisohuatulco\.com\/admin\/products\/getProductsMovil/,
      handler: "CacheFirst",
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
      handler: "CacheFirst",
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
      handler: "CacheFirst",
      options: {
        cacheName: "pages",
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
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, 
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 24 * 60 * 60, 
        },
      },
    }
  ],
};