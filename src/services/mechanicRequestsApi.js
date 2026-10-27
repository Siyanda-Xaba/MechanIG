import { auth } from '../firebase/firebase';
import { getFuelDeliveryApiUrl } from './fuelDeliveryApi';
export async function mechanicRequestsApi(path = '', options = {}) {
  const user = auth.currentUser; if (!user) throw new Error('You must be signed in to use mechanic requests.');
  const baseUrl = getFuelDeliveryApiUrl().replace(/\/fuel-deliveries$/, '/mechanic-requests');
  const response = await fetch(path ? `${baseUrl}/${String(path).replace(/^\/+/, '')}` : baseUrl, { method: options.method || 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${await user.getIdToken()}`, ...(options.body ? { 'Content-Type': 'application/json' } : {}) }, body: options.body ? JSON.stringify(options.body) : undefined });
  const text = await response.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) throw new Error(data?.error || data?.message || `Mechanic request failed (${response.status}).`);
  return data;
}