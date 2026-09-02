import { listStations } from "./petrolStationService.js";
import { calculateDistance, validateLocation } from "./locationServices.js";

export function nearbyStations(location, radiusKm) {
  const normalized = validateLocation(location);
  return listStations({ ...normalized, radiusKm });
}

export function routeSummary(origin, destination) {
  const distanceKm = calculateDistance(origin, destination);
  return { origin: validateLocation(origin), destination: validateLocation(destination), distanceKm, estimatedMinutes: Math.max(1, Math.round((distanceKm / 35) * 60)), provider: "straight-line-estimate" };
}
