import { auth } from '../firebase/firebase';

const configuredUrl = process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL?.replace(/\/$/, '');
const candidates = [
  configuredUrl,
  'http://127.0.0.1:3002',
  'http://192.168.137.1:3002',
  'http://172.16.41.210:3002',
].filter(Boolean);

let activeBaseUrl = configuredUrl || 'http://127.0.0.1:3002';

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
  const base = activeBaseUrl || configuredUrl || 'http://127.0.0.1:3002';
  return `${base}${path}`;
}

export async function fetchWithPictureSearchFallback(path, options = {}) {
  const targetUrls = [activeBaseUrl, ...candidates.filter((u) => u !== activeBaseUrl)];
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
  throw lastError || new Error('Cannot reach the Picture Search backend. Check that the service is running.');
}

export async function getPictureSearchAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to use this service.');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

