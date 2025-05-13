importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('[SW] Workbox is loaded');

  // Pre-cache assets (esto es lo que Workbox usa para caché)
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  self.addEventListener('install', (event) => {
    console.log('[SW] Instalando...');
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    console.log('[SW] Activado');
  });

//   self.addEventListener('fetch', (event) => {
//     console.log('[SW] Interceptando fetch: holaaa', event.request.url);
//   });
} else {
  console.log('[SW] Workbox no pudo ser cargado');
}
