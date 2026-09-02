import { id, now, store } from "../data/store.js";
import { distanceInKm } from "../utils/distance.js";
import { badRequest, notFound } from "../utils/http.js";
import { normalizeLocation } from "../utils/location.js";

export function createStation({ name, address, location, fuelTypes = ["PETROL_95"], isOperational = true }) {
  
  if (!name?.trim() || !address?.trim()) throw badRequest("name and address are required");
  
  if (!Array.isArray(fuelTypes) || fuelTypes.length === 0) throw badRequest("fuelTypes must contain at least one fuel type");
  
  const station = { id: id(), name: name.trim(), address: address.trim(), location: normalizeLocation(location), fuelTypes, isOperational: Boolean(isOperational), createdAt: now(), updatedAt: now() };
  store.petrolStations.set(station.id, station);
  
  return station;
}

export function listStations({ latitude, longitude, radiusKm } = {}) {
  
  const stations = [...store.petrolStations.values()];
  
  if (latitude == null || longitude == null) return stations;
  
  const origin = normalizeLocation({ latitude, longitude });
  const radius = radiusKm == null ? 25 : Number(radiusKm);
  
  if (!Number.isFinite(radius) || radius <= 0) throw badRequest("radiusKm must be a positive number");
  
  return stations.map((station) => ({ ...station, distanceKm: Number(distanceInKm(origin, station.location).toFixed(2)) })).filter((station) => station.distanceKm <= radius).sort((a, b) => a.distanceKm - b.distanceKm);
}

export function getStation(stationId) {
  
  const station = store.petrolStations.get(stationId);
  
  if (!station) throw notFound("Petrol station was not found");
  
  return station;
}
