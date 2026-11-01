const problems = {
  P0101: [
    "Mass air flow sensor range/performance problem",
    "Air intake",
    "warning",
    "The air-flow reading does not match what the engine computer expects.",
    ["Reduced power", "Rough idle", "Poor fuel economy"],
    "Inspect the air filter, intake leaks, mass air flow sensor, and its wiring.",
  ],
  P0118: [
    "Engine coolant temperature sensor circuit high input",
    "Engine cooling",
    "warning",
    "The coolant-temperature signal is higher than its normal electrical range.",
    ["Hard starting", "Cooling fan may run continuously", "Check-engine light"],
    "Inspect the coolant-temperature sensor connector and wiring, then test the sensor.",
  ],
  P0128: [
    "Coolant temperature below thermostat regulating temperature",
    "Engine cooling",
    "warning",
    "The engine is taking too long to reach normal operating temperature.",
    ["Poor heater performance", "Reduced fuel economy", "Check-engine light"],
    "Check coolant level and thermostat operation; replace a thermostat that is stuck open.",
  ],
  P0133: [
    "Oxygen sensor slow response (Bank 1 Sensor 1)",
    "Emissions",
    "warning",
    "The upstream oxygen sensor is reacting more slowly than expected.",
    ["Poor fuel economy", "Rough idle", "Increased emissions"],
    "Test the oxygen sensor, exhaust leaks, fuel trim, and sensor wiring.",
  ],
  P0135: [
    "Oxygen sensor heater circuit malfunction (Bank 1 Sensor 1)",
    "Emissions",
    "warning",
    "The heater inside the upstream oxygen sensor is not operating correctly.",
    ["Check-engine light", "Poor cold-start emissions", "Poor fuel economy"],
    "Check the sensor heater fuse, wiring, connector, and oxygen sensor.",
  ],
  P0171: [
    "System too lean (Bank 1)",
    "Fuel and air",
    "warning",
    "The engine computer is adding extra fuel because it detects too much air or too little fuel.",
    ["Rough idle", "Hesitation", "Loss of power"],
    "Inspect for vacuum leaks, intake leaks, low fuel pressure, and a contaminated mass air flow sensor.",
  ],
  P0300: [
    "Random or multiple-cylinder misfire detected",
    "Ignition and engine",
    "urgent",
    "One or more cylinders are misfiring, which can damage the catalytic converter if driving continues.",
    ["Engine shaking", "Flashing check-engine light", "Loss of power"],
    "Avoid hard driving. Inspect spark plugs, ignition coils, fuel delivery, and engine compression promptly.",
  ],
  P0420: [
    "Catalyst system efficiency below threshold (Bank 1)",
    "Emissions",
    "warning",
    "The catalytic converter is not cleaning exhaust gases as effectively as expected.",
    ["Check-engine light", "Failed emissions test", "Possible sulfur smell"],
    "Check for exhaust leaks, misfires, and oxygen-sensor faults before replacing the catalytic converter.",
  ],
  P0442: [
    "Evaporative emissions system small leak detected",
    "Evaporative emissions",
    "information",
    "The fuel-vapour containment system has a small leak.",
    ["Check-engine light", "Fuel smell near vehicle"],
    "Tighten or replace the fuel cap, then inspect EVAP hoses and valves for small leaks.",
  ],
  P0455: [
    "Evaporative emissions system gross leak detected",
    "Evaporative emissions",
    "warning",
    "The fuel-vapour containment system has a large leak or is open.",
    ["Check-engine light", "Fuel smell near vehicle"],
    "Check that the fuel cap is present and tight; inspect EVAP hoses, purge valve, and vent valve.",
  ],
  P0500: [
    "Vehicle speed sensor malfunction",
    "Vehicle speed",
    "warning",
    "The vehicle-speed signal is missing or unreliable.",
    [
      "Speedometer may fail",
      "Transmission shift issues",
      "ABS or traction-control warning",
    ],
    "Inspect the speed sensor, wheel-speed sensors where applicable, wiring, and connectors.",
  ],
  P0562: [
    "System voltage low",
    "Electrical charging",
    "urgent",
    "The vehicle electrical system voltage is below its expected operating range.",
    ["Slow cranking", "Dim lights", "Multiple warning lights"],
    "Test the battery, alternator output, battery terminals, and ground connections.",
  ],
};

const hexBytePattern = /^[0-9A-F]{2}$/i;

function makeProblem(code, details) {
  const [title, system, severity, summary, symptoms, recommendedAction] =
    details;
  return {
    code,
    supported: true,
    title,
    system,
    severity,
    summary,
    symptoms,
    recommendedAction,
  };
}

function translationError(message) {
  const error = new Error(message);
  error.status = 422;
  error.code = "TRANSLATION_ERROR";
  return error;
}

function bytesFrom(rawResponse) {
  const bytes = rawResponse.trim().split(/\s+/);
  if (!bytes.length || !bytes.every((byte) => hexBytePattern.test(byte))) {
    throw translationError(
      "OBD responses must contain space-separated hexadecimal bytes.",
    );
  }
  return bytes.map((byte) => byte.toUpperCase());
}

const livePidNames = {
  "04": "Calculated engine load",
  "05": "Engine coolant temperature",
  "06": "Short-term fuel trim (Bank 1)",
  "07": "Long-term fuel trim (Bank 1)",
  "08": "Short-term fuel trim (Bank 2)",
  "09": "Long-term fuel trim (Bank 2)",
  "0A": "Fuel pressure",
  "0B": "Intake manifold pressure",
  "0C": "Engine RPM",
  "0D": "Vehicle speed",
  "0E": "Ignition timing advance",
  "0F": "Intake air temperature",
  "10": "Mass air flow",
  "11": "Throttle position",
  "2F": "Fuel level",
  "32": "EVAP system vapor pressure",
  "33": "Barometric pressure",
  "5E": "Fuel consumption (engine fuel rate)",
  "42": "Control module voltage",
};

function decodePidResponse(rawResponse) {
  const bytes = bytesFrom(rawResponse);
  if (bytes[0] !== "41" || bytes.length < 3) {
    throw translationError(
      "A live-data response must begin with 41 and include a PID and data bytes.",
    );
  }
  const pid = bytes[1];
  const data = bytes.slice(2).map((byte) => Number.parseInt(byte, 16));
  const first = data[0];
  const word = data.length >= 2 ? data[0] * 256 + data[1] : null;
  const readings = {
    "04": [first * 100 / 255, "%"],
    "05": [first - 40, "°C"],
    "06": [(first - 128) * 100 / 128, "%"],
    "07": [(first - 128) * 100 / 128, "%"],
    "08": [(first - 128) * 100 / 128, "%"],
    "09": [(first - 128) * 100 / 128, "%"],
    "0A": [first * 3, "kPa"],
    "0B": [first, "kPa"],
    "0C": [word == null ? null : word / 4, "rpm"],
    "0D": [first, "km/h"],
    "0E": [first / 2 - 64, "°"],
    "0F": [first - 40, "°C"],
    "10": [word == null ? null : word / 100, "g/s"],
    "11": [first * 100 / 255, "%"],
    "2F": [first * 100 / 255, "%"],
    "32": [word == null ? null : word / 4000, "kPa"],
    "33": [first, "kPa"],
    "5E": [word == null ? null : word * 0.05, "L/h"],
    "42": ["Control module voltage", word == null ? null : word / 1000, "V"],
  };
  const decoded = readings[pid];
  const [name, value, unit] = decoded
    ? decoded.length === 2
      ? [livePidNames[pid], decoded[0], decoded[1]]
      : decoded
    : [`Unsupported PID ${pid}`, null, null];
  return { pid, name, value, unit, supported: value != null, rawResponse };
}

function unavailablePidReadings(pids) {
  return pids
    .map((pid) => pid.toUpperCase())
    .filter((pid) => livePidNames[pid])
    .map((pid) => ({
      pid,
      name: livePidNames[pid],
      value: null,
      unit: null,
      supported: false,
      rawResponse: null,
    }));
}

function decodeDtcResponse(rawResponse) {
  const bytes = bytesFrom(rawResponse);
  if (bytes[0] !== "43" || bytes.length < 2) {
    throw translationError(
      "A Mode 03 trouble-code response must begin with 43 and include at least one byte pair or count byte.",
    );
  }
  if (bytes.length === 2) {
    return [];
  }
  const families = ["P", "C", "B", "U"];
  const dtcs = [];
  // Standard CAN bus Mode 03 has format 43 [count] [DTC1] [DTC2]... (even length)
  // Legacy ISO 9141 / J1850 Mode 03 has format 43 [DTC1] [DTC2]... (odd length)
  const startIndex = bytes.length % 2 === 0 ? 2 : 1;
  for (let index = startIndex; index + 1 < bytes.length; index += 2) {
    const first = Number.parseInt(bytes[index], 16);
    const second = Number.parseInt(bytes[index + 1], 16);
    if (first === 0 && second === 0) continue;
    dtcs.push(
      `${families[(first >> 6) & 3]}${(first >> 4) & 3}${(first & 15).toString(16).toUpperCase()}${((second >> 4) & 15).toString(16).toUpperCase()}${(second & 15).toString(16).toUpperCase()}`,
    );
  }
  return dtcs;
}

function describeCode(code) {
  const normalizedCode = code.toUpperCase();
  if (problems[normalizedCode])
    return makeProblem(normalizedCode, problems[normalizedCode]);
  return {
    code: normalizedCode,
    supported: false,
    title: "Unrecognised diagnostic trouble code",
    system: "Unknown",
    severity: "information",
    summary:
      "This code was read successfully but is not yet in the MechanIQ knowledge base.",
    symptoms: [],
    recommendedAction:
      "Use the vehicle manufacturer's service information or expand the backend code catalogue.",
  };
}

export function getProblem(code) {
  const normalizedCode = code?.toUpperCase();
  return problems[normalizedCode]
    ? makeProblem(normalizedCode, problems[normalizedCode])
    : null;
}

export function getSupportedProblems() {
  return Object.keys(problems).sort().map(getProblem);
}

export function translatePayload(payload) {
  const rawDtcResponse = payload.rawDtcResponse ?? payload.rawDTCResponse;
  const decodedCodes = rawDtcResponse ? decodeDtcResponse(rawDtcResponse) : [];
  const codes = [
    ...new Set(
      [...(payload.dtcs || []), ...decodedCodes].map((code) =>
        code.trim().toUpperCase(),
      ),
    ),
  ];
  const readings = (payload.rawResponses || payload.readings || []).map(decodePidResponse).filter(Boolean);
  const readingPids = new Set(readings.map((reading) => reading.pid));
  readings.push(...unavailablePidReadings(
    (payload.unsupportedPids || []).filter((pid) => !readingPids.has(pid.toUpperCase())),
  ));
  const severities = codes.map((code) => problems[code]?.[2]);
  const highestSeverity = severities.includes("urgent")
    ? "urgent"
    : severities.includes("warning")
      ? "warning"
      : "information";

  return {
    scannedAt: new Date().toISOString(),
    vehicle: payload.vehicle || null,
    summary: {
      troubleCodeCount: codes.length,
      supportedProblemCount: codes.filter((code) => Boolean(problems[code]))
        .length,
      highestSeverity,
    },
    problems: codes.map(describeCode),
    readings,
    source: {
      rawDtcResponse: rawDtcResponse || null,
      rawResponseCount: (payload.rawResponses || payload.readings || []).length,
      unavailableReadingCount: readings.filter((reading) => !reading.supported).length,
    },
  };
}
