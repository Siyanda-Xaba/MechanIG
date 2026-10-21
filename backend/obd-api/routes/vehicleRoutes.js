import { Router } from "express";
import {
  createCustomerVehicle,
  getCustomerVehicles,
} from "../controllers/vehicleController.js";
import { requireActor } from "../middlewares/identityMiddleware.js";
import { validateVehicle } from "../middlewares/validationMiddleware.js";

const router = Router();
router.use(requireActor);
router.get("/", getCustomerVehicles);
router.post("/", validateVehicle, createCustomerVehicle);

export default router;
