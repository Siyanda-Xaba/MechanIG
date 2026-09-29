import * as driverService from "../services/driverService.js";
import { forbidden } from "../utils/http.js";

export function createDriver(req, res, next) {
  try {
    const driver = driverService.createDriver({ ...req.body, userId: req.user.id });
    return res.status(201).json({ success: true, data: driver });
  } catch (error) { return next(error); }
}

export function getDrivers(req, res, next) {
  try { return res.json({ success: true, data: driverService.listDrivers(req.query) }); } catch (error) { return next(error); }
}

export function updateMyDriver(req, res, next) {
  try {
    const driver = driverService.listDrivers().find((candidate) => candidate.userId === req.user.id);
    if (!driver) throw forbidden("Create a driver profile before updating it");
    return res.json({ success: true, data: driverService.updateDriver(driver.id, req.body) });
  } catch (error) { return next(error); }
}
