import { Router } from "express";
import {
  createDiagnosticScan,
  deleteDiagnosticScan,
  getDiagnosticHistory,
  getDiagnosticRepairGuide,
  getDiagnosticScan,
  getProblemByCode,
  getSupportedProblems,
  translateDiagnosticData,
} from "../controllers/obdController.js";
import { requireActor } from "../middlewares/identityMiddleware.js";
import {
  validateDiagnosticPayload,
  validatePersistedScan,
  validateScanIdParam,
  validateVehicleIdQuery,
} from "../middlewares/validationMiddleware.js";

const router = Router();
router.get("/problems", getSupportedProblems);
router.get("/problems/:code", getProblemByCode);
router.post("/translate", validateDiagnosticPayload, translateDiagnosticData);
router.post(
  "/scans",
  requireActor,
  validatePersistedScan,
  createDiagnosticScan,
);
router.get(
  "/scans",
  requireActor,
  validateVehicleIdQuery,
  getDiagnosticHistory,
);
router.get("/scans/:scanId", requireActor, validateScanIdParam, getDiagnosticScan);
router.delete("/scans/:scanId", requireActor, validateScanIdParam, deleteDiagnosticScan);
router.get(
  "/scans/:scanId/repair-guide",
  requireActor,
  validateScanIdParam,
  getDiagnosticRepairGuide,
);

export default router;
