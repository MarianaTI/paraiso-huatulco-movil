importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// Precaching
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  // console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // console.log('[SW] Activado');
  return self.clients.claim();
});

// Manejo del evento de sincronización de fondo
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    // console.log('[SW] Evento de sincronización recibido');
    event.waitUntil(sendOfflineBookingsToServer());
  }
});

// Manejo de mensaje manual desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'force-sync-bookings') {
    // console.log('[SW] 🔄 Forzando sincronización manual');
    event.waitUntil(sendOfflineBookingsToServer());
  }
});

// Función para enviar reservas offline
const sendOfflineBookingsToServer = async () => {
  // console.log('[SW] Enviando reservas offline al servidor...');
  const db = await getOfflineDB();
  const tx = db.transaction('reservas', 'readonly');
  const store = tx.objectStore('reservas');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = async () => {
    const all = getAllRequest.result;
    // console.log(`[SW] ${all.length} reservas encontradas`);

    for (const reserva of all) {
      try {
        const formData = new FormData();
        for (const key in reserva) {
          if (reserva[key] !== undefined && reserva[key] !== null) {
            formData.append(key, reserva[key]);
          }
        }

        const res = await fetch('https://portaldemo.paraisohuatulco.com/rents/booking', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          // 🔁 Crear NUEVA transacción para eliminar
          const deleteTx = db.transaction('reservas', 'readwrite');
          const deleteStore = deleteTx.objectStore('reservas');
          deleteStore.delete(reserva.id);
          // console.log(`[SW] ✅ Reserva enviada y eliminada: ${reserva.id}`);

          // Notificación 
          self.registration.showNotification("Reserva enviada", {
            body: "Tu reserva offline fue enviada correctamente.",
            icon: "/icon512_rounded.png", 
          });
        } else {
          console.warn('[SW] ⚠️ Error del servidor al reenviar reserva');
        }
      } catch (error) {
        console.error('[SW] ❌ Error de red:', error);
      }
    }
  };

  getAllRequest.onerror = () => {
    console.error('[SW] ❌ Error al leer reservas de IndexedDB');
  };
};


// IndexedDB setup
const getOfflineDB = async () => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('offline-db', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('reservas')) {
        db.createObjectStore('reservas', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
