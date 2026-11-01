import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

let writeQueue = Promise.resolve();

function databasePath() {
  const directory =
    process.env.MECHANIQ_DATA_DIR || path.join(process.cwd(), "data");
  return path.join(directory, "mechaniq.json");
}

async function readDatabase() {
  try {
    return JSON.parse(await readFile(databasePath(), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { vehicles: [], scans: [] };
    throw error;
  }
}

function updateDatabase(mutator) {
  const operation = writeQueue.then(async () => {
    const database = await readDatabase();
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

export async function createVehicle(ownerId, vehicle) {
  return updateDatabase((database) => {
    const record = {
      id: `veh_${randomUUID()}`,
      ownerId,
      createdAt: new Date().toISOString(),
      make: vehicle.make.trim(),
      model: vehicle.model.trim(),
      year: vehicle.year,
      vin: vehicle.vin?.trim() || null,
      nickname: vehicle.nickname?.trim() || null,
    };
    database.vehicles.push(record);
    return record;
  });
}

export async function listVehicles(ownerId) {
  const database = await readDatabase();
  return database.vehicles.filter((vehicle) => vehicle.ownerId === ownerId);
}

export async function findVehicleForOwner(vehicleId, ownerId) {
  const database = await readDatabase();
  return (
    database.vehicles.find(
      (vehicle) => vehicle.id === vehicleId && vehicle.ownerId === ownerId,
    ) || null
  );
}

export async function createDiagnosticScan(
  ownerId,
  vehicleId,
  raw,
  interpretation,
) {
  return updateDatabase((database) => {
    const record = {
      id: `scan_${randomUUID()}`,
      ownerId,
      vehicleId,
      createdAt: new Date().toISOString(),
      raw,
      interpretation,
    };
    database.scans.push(record);
    return record;
  });
}

export async function listDiagnosticScans(ownerId, vehicleId) {
  const database = await readDatabase();
  return database.scans
    .filter((scan) => scan.ownerId === ownerId && scan.vehicleId === vehicleId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function findDiagnosticScanForOwner(scanId, ownerId) {
  const database = await readDatabase();
  return (
    database.scans.find(
      (scan) => scan.id === scanId && scan.ownerId === ownerId,
    ) || null
  );
}
