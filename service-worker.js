import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.origin === 'https://admindemo.paraisohuatulco.com/admin' &&
                url.pathname === '/products/getProductsMovil',
  new NetworkFirst({
    cacheName: 'tours-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
        headers: {
          'content-type': 'text/html; charset=UTF-8',
        },
      }),
    ],
  })
);
