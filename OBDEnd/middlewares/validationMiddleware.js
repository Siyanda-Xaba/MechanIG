const DTC_CODE_PATTERN = /^[PCBU][0-3][0-9A-F]{3}$/i;

function isStringArray(value) {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

export function validateDiagnosticPayload(req, res, next) {
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== "object") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Request body must be a JSON object.",
      requestId: req.requestId,
    });
  }

  const hasDtcInput =
    body.dtcs !== undefined ||
    body.rawDtcResponse !== undefined ||
    body.rawDTCResponse !== undefined;
  const hasReadingInput =
    body.rawResponses !== undefined || body.readings !== undefined;
  if (!hasDtcInput && !hasReadingInput) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Provide dtcs, rawDtcResponse, rawResponses, or readings.",
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
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: `${field} must be a hexadecimal response string.`,
        requestId: req.requestId,
      });
    }
  }
  if (body.rawResponses !== undefined && !isStringArray(body.rawResponses)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "rawResponses must be an array of hexadecimal response strings.",
      requestId: req.requestId,
    });
  }
  return next();
}

export function validatePersistedScan(req, res, next) {
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
  return validateDiagnosticPayload(req, res, next);
}

export function validateVehicleIdQuery(req, res, next) {
  if (!req.query.vehicleId || typeof req.query.vehicleId !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "vehicleId is required.",
      requestId: req.requestId,
    });
  }
  return next();
}

export function validateVehicle(req, res, next) {
  const { make, model, year, vin, nickname } = req.body || {};
  const validYear =
    Number.isInteger(year) &&
    year >= 1886 &&
    year <= new Date().getFullYear() + 1;
  const optionalStringsValid = [vin, nickname].every(
    (value) => value === undefined || typeof value === "string",
  );

  if (
    typeof make !== "string" ||
    !make.trim() ||
    typeof model !== "string" ||
    !model.trim() ||
    !validYear ||
    !optionalStringsValid
  ) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Vehicle make, model, and a valid numeric year are required.",
      requestId: req.requestId,
    });
  }
  return next();
}
