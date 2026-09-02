import { distanceInKm } from "../utils/distance.js";
import { normalizeLocation } from "../utils/location.js";

export function validateLocation(location) {
  return normalizeLocation(location);
}

export function calculateDistance(from, to) {
  return Number(distanceInKm(normalizeLocation(from), normalizeLocation(to)).toFixed(2));
}
