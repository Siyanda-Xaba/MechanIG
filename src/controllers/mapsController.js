import { nearbyStations, routeSummary } from "../services/mapsService.js";

export function getNearbyStations(req, res, next) {
  try {
    const { latitude, longitude, radiusKm } = req.query;
    return res.json({ success: true, data: nearbyStations({ latitude, longitude }, radiusKm) });
  } catch (error) { return next(error); }
}

export function getRouteSummary(req, res, next) {
  try {
    return res.json({ success: true, data: routeSummary(req.body.origin, req.body.destination) });
  } catch (error) { return next(error); }
}
