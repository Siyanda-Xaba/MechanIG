import {
  createVehicle,
  listVehicles,
} from "../repositories/diagnosticsRepository.js";

export async function createCustomerVehicle(req, res, next) {
  try {
    const vehicle = await createVehicle(req.actor.id, req.body);
    return res.status(201).json({ data: vehicle, requestId: req.requestId });
  } catch (error) {
    return next(error);
  }
}

export async function getCustomerVehicles(req, res, next) {
  try {
    const vehicles = await listVehicles(req.actor.id);
    return res.json({ data: vehicles, requestId: req.requestId });
  } catch (error) {
    return next(error);
  }
}
