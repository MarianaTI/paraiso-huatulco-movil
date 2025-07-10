import { openDB } from "idb";

export const getOfflineDB = () =>
  openDB("offline-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("reservas")) {
        db.createObjectStore("reservas", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

export const saveOfflineBooking = async (bookingData) => {
  const db = await getOfflineDB();
  await db.add("reservas", bookingData);

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await registration.sync.register("sync-bookings");
      console.log("Sync registrado");
    } catch (error) {
      console.error("Error al registrar sync:", error);
    }
  } else {
    console.warn("SyncManager no soportado");
  }
};

export const getAllOfflineBookings = async () => {
  const db = await getOfflineDB();
  return await db.getAll("reservas");
};

export const deleteOfflineBookings = async () => {
  const db = await getOfflineDB();
  await db.delete("reservas", id);
};
