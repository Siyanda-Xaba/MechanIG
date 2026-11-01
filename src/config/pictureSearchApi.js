import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { auth } from '../firebase/firebase';

const configuredUrl = process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL?.replace(/\/$/, '');
const isPhysicalDevice = Constants.isDevice === true;
const isWeb = Platform.OS === 'web';
const isLoopbackUrl = (value) => {
  if (!value) return false;
  try {
    return ['127.0.0.1', 'localhost', '::1', '0.0.0.0'].includes(new URL(value).hostname);
  } catch {
    return false;
  }
};
const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];
const runtimeHostUrl = metroHost ? `http://${metroHost}:3002` : null;
const candidates = [...new Set([
  configuredUrl && (!isPhysicalDevice || isWeb || !isLoopbackUrl(configuredUrl)) ? configuredUrl : null,
  isPhysicalDevice && !isWeb ? runtimeHostUrl : null,
  !isPhysicalDevice && Platform.OS === 'android' ? 'http://10.0.2.2:3002' : null,
  !isPhysicalDevice || isWeb ? (configuredUrl || 'http://127.0.0.1:3002') : null,
].filter(Boolean))];

let activeBaseUrl = candidates[0] || null;

(async () => {
  for (const candidate of candidates) {
    try {
      const res = await fetch(`${candidate}/health`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        activeBaseUrl = candidate;
        break;
      }
    } catch {}
  }
})();

export const pictureSearchApiUrl = activeBaseUrl;

export function getPictureSearchEndpoint(path) {
  const base = activeBaseUrl || candidates[0];
  if (!base) throw new Error('The vehicle image service address is missing. Start the app with npm start or configure its API URL.');
  return `${base}${path}`;
}

export async function fetchWithPictureSearchFallback(path, options = {}) {
  const targetUrls = [activeBaseUrl, ...candidates.filter((u) => u !== activeBaseUrl)].filter(Boolean);
  if (!targetUrls.length) {
    throw new Error('The vehicle image service has no address for this device. Start the app with npm start or configure a reachable API URL.');
  }
  let lastError;
  for (const baseUrl of targetUrls) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      activeBaseUrl = baseUrl;
      return response;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Cannot reach the vehicle image service. Start the app with npm start and keep the phone and computer on the same network.');
}

export async function getPictureSearchAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to use this service.');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

