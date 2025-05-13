import { openDB } from "idb";

const DB_NAME = "offline-db";
const STORE_NAME = "reservas";

export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveOfflineReserva = async (reserva) => {
  const db = await getDB();
  await db.add(STORE_NAME, reserva);
};

export const getAllReservas = async () => {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
};

export const clearReservas = async () => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.clear();
  await tx.done;
};
