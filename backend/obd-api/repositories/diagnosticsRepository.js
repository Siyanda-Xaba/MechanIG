import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

let writeQueue = Promise.resolve();

function isFirebaseStorage() {
  return (process.env.OBD_STORAGE || (process.env.NODE_ENV === "production" ? "firebase" : "local")) === "firebase";
}

async function getFirebaseDatabase() {
  const { firebaseDb } = await import("../config/firebase.js");
  return firebaseDb;
}

function databasePath() {
  return path.join(process.env.MECHANIQ_DATA_DIR || path.join(process.cwd(), "data"), "mechaniq.json");
}

async function readLocalDatabase() {
  try {
    const database = JSON.parse(await readFile(databasePath(), "utf8"));
    return { vehicles: Array.isArray(database.vehicles) ? database.vehicles : [], scans: Array.isArray(database.scans) ? database.scans : [] };
  } catch (error) {
    if (error.code === "ENOENT") return { vehicles: [], scans: [] };
    throw error;
  }
}

function updateLocalDatabase(mutator) {
  const operation = writeQueue.then(async () => {
    const database = await readLocalDatabase();
    const result = await mutator(database);
    const target = databasePath();
    await mkdir(path.dirname(target), { recursive: true });
    const temporary = `${target}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(database, null, 2), "utf8");
    await rename(temporary, target);
    return result;
  });
  writeQueue = operation.catch(() => undefined);
  return operation;
}

async function readLocalDatabaseAfterWrites() {
  await writeQueue;
  return readLocalDatabase();
}

export async function createVehicle(ownerId, vehicle) {
  const record = {
    id: `veh_${randomUUID()}`,
    ownerId,
    createdAt: new Date().toISOString(),
    make: vehicle.make.trim(),
    model: vehicle.model.trim(),
    year: vehicle.year,
    nickname: vehicle.nickname?.trim() || null,
  };
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    await db.ref(`vehicles/${record.id}`).set(record);
    return record;
  }
  return updateLocalDatabase((database) => {
    database.vehicles.push(record);
    return record;
  });
}

export async function listVehicles(ownerId) {
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    const snapshot = await db.ref("vehicles").orderByChild("ownerId").equalTo(ownerId).get();
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  }
  const database = await readLocalDatabaseAfterWrites();
  return database.vehicles.filter((vehicle) => vehicle.ownerId === ownerId);
}

export async function findVehicleForOwner(vehicleId, ownerId) {
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    const snapshot = await db.ref(`vehicles/${vehicleId}`).get();
    if (!snapshot.exists()) return null;
    const vehicle = snapshot.val();
    return vehicle.ownerId === ownerId ? vehicle : null;
  }
  const database = await readLocalDatabaseAfterWrites();
  return database.vehicles.find((vehicle) => vehicle.id === vehicleId && vehicle.ownerId === ownerId) || null;
}

export async function createDiagnosticScan(ownerId, vehicleId, raw, interpretation) {
  const record = { id: `scan_${randomUUID()}`, ownerId, vehicleId, createdAt: new Date().toISOString(), raw, interpretation };
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    await db.ref(`diagnosticScans/${record.id}`).set(record);
    return record;
  }
  return updateLocalDatabase((database) => {
    database.scans.push(record);
    return record;
  });
}

export async function listDiagnosticScans(ownerId, vehicleId) {
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    const snapshot = await db.ref("diagnosticScans").orderByChild("vehicleId").equalTo(vehicleId).get();
    const records = snapshot.exists() ? Object.values(snapshot.val()) : [];
    return records.filter((scan) => scan.ownerId === ownerId).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
  const database = await readLocalDatabaseAfterWrites();
  return database.scans
    .filter((scan) => scan.ownerId === ownerId && scan.vehicleId === vehicleId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function findDiagnosticScanForOwner(scanId, ownerId) {
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    const snapshot = await db.ref(`diagnosticScans/${scanId}`).get();
    if (!snapshot.exists()) return null;
    const scan = snapshot.val();
    return scan.ownerId === ownerId ? scan : null;
  }
  const database = await readLocalDatabaseAfterWrites();
  return database.scans.find((scan) => scan.id === scanId && scan.ownerId === ownerId) || null;
}

export async function deleteDiagnosticScanForOwner(scanId, ownerId) {
  if (isFirebaseStorage()) {
    const db = await getFirebaseDatabase();
    const scanRef = db.ref(`diagnosticScans/${scanId}`);
    const result = await scanRef.transaction((scan) => {
      if (!scan || scan.ownerId !== ownerId) return;
      return null;
    });
    return result.committed && !result.snapshot.exists();
  }
  return updateLocalDatabase((database) => {
    const index = database.scans.findIndex((scan) => scan.id === scanId && scan.ownerId === ownerId);
    if (index < 0) return false;
    database.scans.splice(index, 1);
    return true;
  });
}
