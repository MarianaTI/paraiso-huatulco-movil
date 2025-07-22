import { openDB } from "idb";

export const getOfflineDB = () =>
  openDB("offline-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("reservas")) {
        db.createObjectStore("reservas", {
          keyPath: "uuid",
        });
      }
    },
  });

export const saveOfflineBooking = async (bookingData) => {
  const db = await getOfflineDB();
  bookingData.uuid = crypto.randomUUID();
  await db.add("reservas", bookingData);

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    const tags = await registration.sync.getTags();

    if (!tags.includes("sync-bookings")) {
      try {
        await registration.sync.register("sync-bookings");
        console.log("✅ Sync registrado");
      } catch (error) {
        console.error("❌ Error al registrar sync:", error);
      }
    } else {
      console.log("🔁 Sync ya estaba registrado");
    }
  }
};

export const getAllOfflineBookings = async () => {
  const db = await getOfflineDB();
  return await db.getAll("reservas");
};

export const deleteOfflineBookings = async () => {
  const db = await getOfflineDB();
  await db.delete("reservas", uuid);
};
