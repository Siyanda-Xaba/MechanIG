import { badRequest } from "./http.js";

export function normalizeLocation(location) {
  
  if (!location || typeof location !== "object") throw badRequest("location is required");
  
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw badRequest("location.latitude and location.longitude must be numbers");
  
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw badRequest("location coordinates are out of range");
  
  return {
    latitude,
    longitude,
    ...(location.accuracy == null ? {} : { accuracy: Number(location.accuracy) }),
    ...(location.heading == null ? {} : { heading: Number(location.heading) }),
    ...(location.speed == null ? {} : { speed: Number(location.speed) }),
    recordedAt: location.recordedAt ? new Date(location.recordedAt).toISOString() : new Date().toISOString()
  };
}
