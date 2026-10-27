import { auth } from '../firebase/firebase';

export function getFuelDeliveryApiUrl() {
  const configured =
    process.env.EXPO_PUBLIC_FUEL_DELIVERY_API_URL?.trim() ||
    (process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL
      ? `${process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL.replace(/\/+$/, '')}/api/v1/fuel-deliveries`
      : null) ||
    (process.env.EXPO_PUBLIC_MESSAGING_API_URL
      ? `${process.env.EXPO_PUBLIC_MESSAGING_API_URL.replace(/\/messaging\/?$/, '')}/fuel-deliveries`
      : null);

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  // Fallback for local development
  return 'http://127.0.0.1:3002/api/v1/fuel-deliveries';
}

export async function fuelDeliveryApiRequest(path = '', options = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to perform this action.');
  }

  const token = await user.getIdToken();
  const baseUrl = getFuelDeliveryApiUrl();
  const subPath = String(path).replace(/^\/+/, '');
  const url = subPath ? `${baseUrl}/${subPath}` : baseUrl;

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const message =
      json?.error ||
      json?.message ||
      `Fuel delivery request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    error.code = json?.code || null;
    throw error;
  }

  return json;
}

