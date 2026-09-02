import { id, now, store } from "../data/store.js";
import { distanceInKm } from "../utils/distance.js";
import { badRequest, notFound } from "../utils/http.js";
import { normalizeLocation } from "../utils/location.js";

export function createDriver({ userId, vehicleRegistration, fuelTypes = ["PETROL_95"], location }) {
  
  if (!userId || !vehicleRegistration?.trim()) throw badRequest("userId and vehicleRegistration are required");
  if ([...store.drivers.values()].some((driver) => driver.userId === userId)) throw badRequest("A driver profile already exists for this user");
  
  const driver = { id: id(), userId, vehicleRegistration: vehicleRegistration.trim().toUpperCase(), fuelTypes, isAvailable: false, location: location ? normalizeLocation(location) : null, createdAt: now(), updatedAt: now() };
  store.drivers.set(driver.id, driver);
  
  return driver;
}

export function listDrivers({ available } = {}) {
  return [...store.drivers.values()].filter((driver) => available == null || driver.isAvailable === (String(available) === "true"));
}

export function updateDriver(driverId, { isAvailable, location } = {}) {
  
  const driver = getDriver(driverId);
  
  if (isAvailable != null) driver.isAvailable = Boolean(isAvailable);
  if (location) driver.location = normalizeLocation(location);
  driver.updatedAt = now();
  
  return driver;
}

export function findNearestDriver(location, fuelType) {
  
  const origin = normalizeLocation(location);
  const matches = listDrivers({ available: true }).filter((driver) => driver.location && driver.fuelTypes.includes(fuelType)).map((driver) => ({ driver, distanceKm: distanceInKm(origin, driver.location) })).sort((a, b) => a.distanceKm - b.distanceKm);
  
  return matches[0] ? { ...matches[0].driver, distanceKm: Number(matches[0].distanceKm.toFixed(2)) } : null;
}

export function getDriver(driverId) {
  
  const driver = store.drivers.get(driverId);
  
  if (!driver) throw notFound("Driver was not found");
  
  return driver;
}
