import {
  createDiagnosticScan,
  deleteDiagnosticScanForOwner,
  findDiagnosticScanForOwner,
  findVehicleForOwner,
  listDiagnosticScans,
} from "../repositories/diagnosticsRepository.js";
import { translatePayload } from "./diagnosticService.js";

function notFound(message) {
  const error = new Error(message);
  error.status = 404;
  error.code = "NOT_FOUND";
  return error;
}

export async function saveScan(ownerId, payload) {
  const vehicle = await findVehicleForOwner(payload.vehicleId, ownerId);
  if (!vehicle)
    throw notFound("Vehicle was not found for the authenticated user.");

  const rawDtcResponse =
    payload.rawDtcResponse ?? payload.rawDTCResponse ?? null;
  const raw = {
    receivedAt: new Date().toISOString(),
    dtcResponse: rawDtcResponse,
    pidResponses: payload.rawResponses || [],
    unsupportedPids: payload.unsupportedPids || [],
    suppliedDtcs: payload.dtcs || [],
  };
  const interpretation = translatePayload({ ...payload, vehicle });
  return createDiagnosticScan(ownerId, vehicle.id, raw, interpretation);
}

export async function getScan(ownerId, scanId) {
  const scan = await findDiagnosticScanForOwner(scanId, ownerId);
  if (!scan) throw notFound("Diagnostic result was not found.");
  return scan;
}

export async function deleteScan(ownerId, scanId) {
  const deleted = await deleteDiagnosticScanForOwner(scanId, ownerId);
  if (!deleted) throw notFound("Diagnostic result was not found.");
}

export async function getScanHistory(ownerId, vehicleId) {
  const vehicle = await findVehicleForOwner(vehicleId, ownerId);
  if (!vehicle)
    throw notFound("Vehicle was not found for the authenticated user.");

  const scans = await listDiagnosticScans(ownerId, vehicleId);
  return scans.map((scan) => ({
    id: scan.id,
    vehicleId: scan.vehicleId,
    scannedAt: scan.interpretation.scannedAt,
    summary: scan.interpretation.summary,
    problemCodes: scan.interpretation.problems.map((problem) => problem.code),
  }));
}

export function getRepairGuide(scan) {
  const problems = scan.interpretation.problems;
  const canCheckFuelCap = problems.length === 1 && problems[0].code === "P0442";

  if (canCheckFuelCap) {
    return {
      outcome: "limited-diy-check",
      safetyNotice:
        "Only perform the check with the vehicle safely parked and the engine switched off.",
      steps: [
        "Check that the fuel cap is present.",
        "Tighten the cap until it clicks.",
        "Inspect the cap seal for visible cracking.",
      ],
      mechanicRequired: false,
    };
  }

  return {
    outcome: "mechanic-required",
    safetyNotice:
      "This result does not provide repair instructions because the reported fault may require diagnosis, specialised tools, or safety precautions.",
    mechanicRequired: true,
    reasons: problems.map((problem) => `${problem.code}: ${problem.title}`),
  };
}
