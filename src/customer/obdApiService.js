import { auth } from '../firebase/firebase';

const configuredObdUrl = process.env.EXPO_PUBLIC_OBD_API_URL?.replace(/\/$/, '');
const obdCandidates = [
  configuredObdUrl,
  'http://127.0.0.1:5002',
  'http://192.168.137.1:5002',
  'http://172.16.41.210:5002',
].filter(Boolean);

let activeObdUrl = configuredObdUrl || 'http://127.0.0.1:5002';

(async () => {
  for (const candidate of obdCandidates) {
    try {
      const res = await fetch(`${candidate}/health/ready`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        activeObdUrl = candidate;
        break;
      }
    } catch {}
  }
})();

async function request(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in before connecting to the OBD adapter.');
  const token = await user.getIdToken();
  let response;
  const targetUrls = [activeObdUrl, ...obdCandidates.filter((u) => u !== activeObdUrl)];
  let lastError;

  for (const baseUrl of targetUrls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        signal: controller.signal,
      });
      activeObdUrl = baseUrl;
      lastError = null;
      break;
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timeout);
    }
  }

  if (!response) {
    throw new Error('Cannot reach the OBD API. Check that the API is running and your phone and computer use the same Wi-Fi network.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || `The OBD API returned HTTP ${response.status}.`);
  }
  return body.data;
}

async function getOrCreateApiVehicle(vehicle) {
  const year = Number(vehicle?.year);
  if (!vehicle?.make?.trim() || !vehicle?.model?.trim() || !Number.isInteger(year) || year < 1900 || !vehicle?.registration?.trim() || vehicle.registration === 'N/A') {
    throw new Error('Complete the vehicle make, model, year, and registration in your vehicle profile before connecting to OBD.');
  }
  const vehicles = await request('/api/v1/vehicles');
  const existing = vehicles.find((item) =>
    item.make?.toLowerCase() === vehicle.make?.toLowerCase()
    && item.model?.toLowerCase() === vehicle.model?.toLowerCase()
    && Number(item.year) === year
    && (!vehicle.registration || item.nickname === vehicle.registration),
  );
  if (existing) return existing;
  return request('/api/v1/vehicles', {
    method: 'POST',
    body: JSON.stringify({
      make: vehicle.make,
      model: vehicle.model,
      year,
      nickname: vehicle.registration || undefined,
    }),
  });
}

export async function saveObdScan(vehicle, obdResponses) {
  const apiVehicle = await getOrCreateApiVehicle(vehicle);
  return request('/api/v1/diagnostics/scans', {
    method: 'POST',
    body: JSON.stringify({
      vehicleId: apiVehicle.id,
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: Number(vehicle.year),
      },
      rawDtcResponse: obdResponses.rawDtcResponse || undefined,
      rawResponses: obdResponses.rawResponses,
      unsupportedPids: obdResponses.unsupportedPids,
    }),
  });
}

export async function getSavedObdScan(scanId) {
  return request(`/api/v1/diagnostics/scans/${encodeURIComponent(scanId)}`);
}

export async function deleteSavedObdScan(scanId) {
  return request(`/api/v1/diagnostics/scans/${encodeURIComponent(scanId)}`, { method: 'DELETE' });
}

export async function getSavedObdScanHistory(vehicle) {
  const apiVehicle = await getOrCreateApiVehicle(vehicle);
  const query = new URLSearchParams({ vehicleId: apiVehicle.id });
  return request(`/api/v1/diagnostics/scans?${query.toString()}`);
}
