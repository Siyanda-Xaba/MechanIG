const PID_NAMES = {
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

export const LIVE_DATA_PIDS = Object.keys(PID_NAMES);

export function decodePidResponse(rawResponse) {
  const bytes = rawResponse.trim().split(/\s+/).map((byte) => Number.parseInt(byte, 16));
  if (bytes[0] !== 0x41 || bytes.length < 3) return null;
  const pid = bytes[1].toString(16).padStart(2, '0').toUpperCase();
  const data = bytes.slice(2);
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
    "42": [word == null ? null : word / 1000, "V"],
  };
  if (!PID_NAMES[pid]) {
    return { pid, name: `Unsupported PID ${pid}`, value: null, unit: null, supported: false, rawResponse };
  }
  const [value, unit] = readings[pid];
  if (value == null || !Number.isFinite(value)) return null;
  return { pid, name: PID_NAMES[pid], value, unit, supported: true, rawResponse };
}

export function unavailablePidReadings(pids) {
  return pids
    .map((pid) => pid.toUpperCase())
    .filter((pid) => PID_NAMES[pid])
    .map((pid) => ({
      pid,
      name: PID_NAMES[pid],
      value: null,
      unit: null,
      supported: false,
      rawResponse: null,
    }));
}

export function decodeLiveResponses(rawResponses, unsupportedPids = []) {
  const decoded = rawResponses.map(decodePidResponse).filter(Boolean);
  const readPids = new Set(decoded.map((reading) => reading.pid));
  return [
    ...decoded,
    ...unavailablePidReadings(unsupportedPids.filter((pid) => !readPids.has(pid.toUpperCase()))),
  ];
}
