importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.routing.registerRoute(
  /^https:\/\/admindemo\.paraisohuatulco\.com\/admin\/products\/getProductsMovil/,
  new workbox.strategies.CacheFirst({
    cacheName: "products-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/pwa\.paraisohuatulco\.com\/[a-zA-Z0-9_-]+\/$/,
  new workbox.strategies.CacheFirst({
    cacheName: "dynamic-pages",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.CacheFirst({
    cacheName: "pages",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "static-resources",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener("install", (event) => {
  // console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // console.log('[SW] Activado');
  return self.clients.claim();
});

// Manejo del evento de sincronización de fondo
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'sync-bookings') {
//     console.log('[SW] Evento de sincronización recibido');
//     event.waitUntil(sendOfflineBookingsToServer());
//   }
// });

// // Manejo de mensaje manual desde la app
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.action === "force-sync-bookings") {
//     console.log("[SW] 🔄 Forzando sincronización manual");
//     event.waitUntil(sendOfflineBookingsToServer());
//   }
// });

// Función para enviar reservas offline
// const sendOfflineBookingsToServer = async () => {
//   // console.log('[SW] Enviando reservas offline al servidor...');
//   const db = await getOfflineDB();
//   const tx = db.transaction('reservas', 'readwrite');
//   const store = tx.objectStore('reservas');
//   const reservas = await store.getAll();

//   console.log(`[SW] Reservas encontradas para enviar: ${reservas.length}`, reservas);

//   reservas.onsuccess = async () => {
//     const all = reservas.result;
//     // console.log(`[SW] ${all.length} reservas encontradas`);
//     console.log(`[SW] Reservas encontradas para enviar: ${all.length}`, all);
//     for (const reserva of all) {
//       try {
//         const formData = new FormData();
//         for (const key in reserva) {
//           if (reserva[key] !== undefined && reserva[key] !== null) {
//             formData.append(key, reserva[key]);
//           }
//         }

//         console.log("data en el service worker", formData);

//         const res = await fetch('https://portaldemo.paraisohuatulco.com/rents/booking', {
//           method: 'POST',
//           body: formData,
//         });

//         if (res.ok) {
//           // 🔁 Crear NUEVA transacción para eliminar
//           const deleteTx = db.transaction('reservas', 'readwrite');
//           const deleteStore = deleteTx.objectStore('reservas');
//           await deleteStore.delete(reserva.uuid);
//           await deleteTx.done;
//           console.log(`[SW] Reserva ${reserva.uuid} eliminada de IndexedDB`);
//           // console.log(`[SW] ✅ Reserva enviada y eliminada: ${reserva.id}`);

//           // Notificación
//           self.registration.showNotification("Reserva enviada", {
//             body: "Tu reserva offline fue enviada correctamente.",
//             icon: "/icon512_rounded.png",
//           });
//         } else {
//           console.warn('[SW] ⚠️ Error del servidor al reenviar reserva');
//         }
//       } catch (error) {
//         console.error('[SW] ❌ Error de red:', error);
//       }
//     }
//   };

//   reservas.onerror = () => {
//     console.error('[SW] ❌ Error al leer reservas de IndexedDB');
//   };
// };

// IndexedDB setup
const getOfflineDB = async () => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("offline-db", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("reservas")) {
        db.createObjectStore("reservas", {
          keyPath: "uuid",
          // autoIncrement: true,
        });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Función para enviar reservas offline
let syncInProgress = false;

const sendOfflineBookingsToServer = async () => {
  if (syncInProgress) {
    console.log("[SW] ⏳ Sincronización ya en curso");
    return;
  }
  syncInProgress = true;

  try {
    console.log("[SW] Enviando reservas offline al servidor...");
    const db = await getOfflineDB();

    // Paso 1: Obtener TODAS las reservas en una transacción de SOLO LECTURA
    let reservas = [];
    try {
      const readTx = db.transaction("reservas", "readonly");
      const readStore = readTx.objectStore("reservas");
      const request = readStore.getAll();
      reservas = await new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
      });
      // No necesitamos await readTx.done aquí porque es readonly y se completa sola.
    } catch (error) {
      console.error("[SW] ❌ Error al leer reservas de IndexedDB:", error);
      return;
    }

    console.log(
      `[SW] Reservas encontradas para enviar: ${reservas.length}`,
      reservas
    );

    if (reservas.length === 0) {
      console.log("[SW] No hay reservas offline para enviar.");
      return;
    }

    // Paso 2: Iterar sobre cada reserva y procesarla individualmente
    for (const reserva of reservas) {
      try {
        const formData = new FormData();
        for (const key in reserva) {
          if (reserva[key] !== undefined && reserva[key] !== null) {
            formData.append(key, reserva[key]);
          }
        }

        console.log(`[SW] Intentando enviar reserva con UUID: ${reserva.uuid}`);
        console.log(
          "data en el service worker",
          Array.from(formData.entries())
        );

        const res = await fetch(
          "https://portaldemo.paraisohuatulco.com/rents/booking",
          {
            method: "POST",
            body: formData,
          }
        );

        if (res.ok) {
          // Paso 3: Si el envío es exitoso, abrir UNA NUEVA TRANSACCIÓN para eliminar
          try {
            const deleteTx = db.transaction("reservas", "readwrite");
            const deleteStore = deleteTx.objectStore("reservas");
            const deleteRequest = deleteStore.delete(reserva.uuid);

            await new Promise((resolve, reject) => {
              deleteRequest.onsuccess = () => resolve();
              deleteRequest.onerror = (event) => reject(event.target.error);
            });
            await deleteTx.done; // Esperar a que esta transacción de eliminación se complete.

            console.log(
              `[SW] Reserva ${reserva.uuid} eliminada de IndexedDB exitosamente.`
            );

            self.registration.showNotification("Reserva enviada", {
              body: "Tu reserva offline fue enviada correctamente.",
              icon: "/icon512_rounded.png",
            });
          } catch (deleteError) {
            console.error(
              `[SW] ❌ Error al eliminar reserva ${reserva.uuid} de IndexedDB:`,
              deleteError
            );
            // Si falla la eliminación, la reserva seguirá allí y se reintentará, lo cual no es ideal pero es seguro.
          }
        } else {
          console.warn(
            `[SW] ⚠️ Error del servidor al reenviar reserva ${reserva.uuid}:`,
            res.status,
            res.statusText
          );
          // NO ELIMINAR: Si hay un error del servidor, la reserva debe permanecer para un reintento futuro.
        }
      } catch (networkError) {
        console.error(
          `[SW] ❌ Error de red al enviar reserva ${reserva.uuid}:`,
          networkError
        );
        // NO ELIMINAR: Si hay un error de red, la reserva debe permanecer para que Background Sync la reintente.
      }
    }
    console.log("[SW] Procesamiento de reservas offline completado.");
  } finally {
    syncInProgress = false;
  }
};

self.addEventListener("message", (event) => {
  if (event.data?.action === "force-sync-bookings") {
    console.log("[SW] 🔄 Forzando sincronización manual");
    event.waitUntil(sendOfflineBookingsToServer());
  }
});