import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const diagnosticPolicy = require("../../../diagnostic-policy.json");
const DTC_CODE_PATTERN = /^[PCBU][0-3][0-9A-F]{3}$/i;
const LIVE_PID_LENGTHS = diagnosticPolicy.operations.readLivePid.allowedPids;
const SUPPORTED_RESPONSE_KEYS = new Set([
  "dtcs", "rawDtcResponse", "rawDTCResponse", "rawResponses",
  "readings", "unsupportedPids", "vehicle",
]);

function reject(res, req, message) {
  return res.status(400).json({
    error: "VALIDATION_ERROR",
    message,
    requestId: req.requestId,
  });
}

function isStringArray(value) {
  return Array.isArray(value)
    && value.length <= 100
    && value.every((item) => typeof item === "string" && item.length <= 256);
}

export function validateDiagnosticPayload(req, res, next, { allowVehicleId = false } = {}) {
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== "object") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Request body must be a JSON object.",
      requestId: req.requestId,
    });
  }
  if (Object.keys(body).some((key) => !SUPPORTED_RESPONSE_KEYS.has(key) && !(allowVehicleId && key === "vehicleId"))) {
    return reject(res, req, "Unsupported diagnostic fields or operations were supplied.");
  }
  if (body.vehicle !== undefined) {
    const allowedVehicleFields = new Set(["make", "model", "year"]);
    if (!body.vehicle || typeof body.vehicle !== "object" || Array.isArray(body.vehicle)
      || Object.keys(body.vehicle).some((key) => !allowedVehicleFields.has(key))) {
      return reject(res, req, "Vehicle data may include only make, model, and year.");
    }
  }

  const hasDtcInput =
    body.dtcs !== undefined ||
    body.rawDtcResponse !== undefined ||
    body.rawDTCResponse !== undefined;
  const hasReadingInput =
    body.rawResponses !== undefined || body.readings !== undefined || body.unsupportedPids !== undefined;
  if (!hasDtcInput && !hasReadingInput) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Provide dtcs, rawDtcResponse, rawResponses, readings, or unsupportedPids.",
      requestId: req.requestId,
    });
  }
  if (
    body.dtcs !== undefined &&
    (!isStringArray(body.dtcs) ||
      !body.dtcs.every((code) => DTC_CODE_PATTERN.test(code.trim())))
  ) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message:
        "dtcs must be an array of valid five-character OBD-II codes, for example P0300.",
      requestId: req.requestId,
    });
  }
  for (const field of ["rawDtcResponse", "rawDTCResponse"]) {
    if (body[field] !== undefined && (typeof body[field] !== "string" || body[field].length > 256)) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: `${field} must be a hexadecimal response string.`,
        requestId: req.requestId,
      });
    }
    if (body[field] !== undefined) {
      const bytes = body[field].trim().split(/\s+/);
      if (bytes.length < 2 || bytes.length > diagnosticPolicy.operations.readStoredEmissionDtcs.maxResponseBytes
        || !bytes.every((byte) => /^[0-9A-F]{2}$/i.test(byte)) || bytes[0].toUpperCase() !== "43") {
        return reject(res, req, "Stored DTC data must be a bounded Mode 03 response from the approved read service.");
      }
    }
  }
  for (const field of ["rawResponses", "readings"]) {
    if (body[field] !== undefined && !isStringArray(body[field])) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: `${field} must be an array of at most 100 hexadecimal response strings (each up to 256 characters).`,
        requestId: req.requestId,
      });
    }
    if (body[field] !== undefined) {
      for (const response of body[field]) {
        const bytes = response.trim().split(/\s+/);
        const pid = bytes[1]?.toUpperCase();
        const definition = LIVE_PID_LENGTHS[pid];
        if (!definition || bytes[0].toUpperCase() !== "41"
          || bytes.length !== 2 + definition.dataBytes
          || !bytes.every((byte) => /^[0-9A-F]{2}$/i.test(byte))) {
          return reject(res, req, "Live data must contain only complete, allowlisted Mode 01 PID responses.");
        }
      }
    }
  }
  if (
    body.unsupportedPids !== undefined &&
    (!isStringArray(body.unsupportedPids) ||
      !body.unsupportedPids.every((pid) => /^[0-9A-F]{2}$/i.test(pid)))
  ) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "unsupportedPids must be an array of two-character hexadecimal PID values.",
      requestId: req.requestId,
    });
  }
  if (body.unsupportedPids?.some((pid) => !LIVE_PID_LENGTHS[pid.toUpperCase()])) {
    return reject(res, req, "Only approved live-data PIDs may be marked unsupported.");
  }
  if (body.rawDtcResponse?.length > 256 || body.rawDTCResponse?.length > 256) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "The raw DTC response cannot exceed 256 characters.",
      requestId: req.requestId,
    });
  }
  return next();
}

export function validatePersistedScan(req, res, next) {
  const persistedFields = new Set(["vehicleId", "vehicle", "rawDtcResponse", "rawDTCResponse", "rawResponses", "unsupportedPids"]);
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)
    || Object.keys(req.body).some((key) => !persistedFields.has(key))) {
    return reject(res, req, "Unsupported scan fields and operation requests are not accepted.");
  }
  if (
    !req.body?.vehicleId ||
    typeof req.body.vehicleId !== "string" ||
    !req.body.vehicleId.trim()
  ) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "vehicleId is required to save a diagnostic scan.",
      requestId: req.requestId,
    });
  }
  return validateDiagnosticPayload(req, res, next, { allowVehicleId: true });
}

export function validateVehicleIdQuery(req, res, next) {
  if (!/^veh_[a-f0-9-]{36}$/i.test(req.query.vehicleId || "")) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "vehicleId is required.",
      requestId: req.requestId,
    });
  }
  return next();
}

export function validateScanIdParam(req, res, next) {
  if (!/^scan_[a-f0-9-]{36}$/i.test(req.params.scanId || "")) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "A valid diagnostic scan ID is required.",
      requestId: req.requestId,
    });
  }
  return next();
}

export function validateVehicle(req, res, next) {
  const body = req.body;
  const { make, model, year, nickname } = body || {};
  const validYear =
    Number.isInteger(year) &&
    year >= 1886 &&
    year <= new Date().getFullYear() + 1;
  const optionalStringsValid = nickname === undefined
    || (typeof nickname === "string" && nickname.length <= 80);

  if (
    !body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).some((key) => !["make", "model", "year", "nickname"].includes(key))
    ||
    typeof make !== "string" ||
    !make.trim() ||
    make.length > 80 ||
    typeof model !== "string" ||
    !model.trim() ||
    model.length > 80 ||
    !validYear ||
    !optionalStringsValid
  ) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Provide only make, model, year, and an optional short nickname. VIN and unknown fields are not collected.",
      requestId: req.requestId,
    });
  }
  return next();
}
