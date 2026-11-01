import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { writeAuditLog } from './adminApi';
const ref = (name) => collection(db, name);
const rows = (snap) => snap.docs.map((item) => ({ id: item.id, ...item.data() }));
const actor = () => ({ uid: auth.currentUser?.uid ?? null, email: auth.currentUser?.email ?? null });

export async function createAdmin(payload) {
  const email = payload.email.trim().toLowerCase();
  const created = await addDoc(ref('administrators'), { ...payload, email, status: 'Pending', lastActive: 'Never', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'CREATE', details: `Created administrator invitation for ${email}`, targetId: created.id, targetType: 'administrator' });
  return { id: created.id, ...payload, email, status: 'Pending' };
}
export async function createRole(payload) {
  const created = await addDoc(ref('roles'), { ...payload, status: 'Active', users: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'CREATE', details: `Created role ${payload.name}`, targetId: created.id, targetType: 'role' });
  return { id: created.id, ...payload, status: 'Active', users: 0 };
}
export async function login(email, password) { throw new Error('Use Firebase Authentication sign-in in the login screen.'); }
export async function logout() { return signOut(auth); }
export async function getSupportRequests() {
  const items = rows(await getDocs(ref('supportRequests')));
  return { open: items.filter((x) => x.status === 'Open').length, inProgress: items.filter((x) => x.status === 'In Progress').length, resolved: items.filter((x) => x.status === 'Resolved').length, items };
}
export async function updateSupportStatus(id, status) {
  await updateDoc(doc(db, 'supportRequests', id), { status, updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'UPDATE', details: `Changed support request ${id} to ${status}`, targetId: id, targetType: 'support' });
  return { success: true, id, status };
}
export async function getMarketplaceOverview() {
  const [products, stores] = await Promise.all([getDocs(ref('marketplaceProducts')), getDocs(ref('marketplaceStores'))]);
  const items = rows(products).map((item) => ({ ...item, name: item.name || item.title || 'Unnamed product', price: Number(item.price || 0), store: item.storeName || item.store || 'Unknown store' }));
  return { totalProducts: items.length, stores: stores.size, pendingApproval: items.filter((x) => x.status === 'Pending').length, items };
}
export async function updateListingStatus(id, status) {
  await updateDoc(doc(db, 'marketplaceProducts', id), { status, updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'UPDATE', details: `Marketplace listing ${id} marked ${status}`, targetId: id, targetType: 'marketplace' });
  return { success: true, id, status };
}
export async function deleteListing(id) {
  await deleteDoc(doc(db, 'marketplaceProducts', id));
  await writeAuditLog({ action: 'DELETE', details: `Deleted marketplace listing ${id}`, targetId: id, targetType: 'marketplace' });
}
export async function getPlatformSettings() {
  const snapshot = await getDoc(doc(db, 'platform', 'settings'));
  return snapshot.exists() ? snapshot.data() : { maintenanceMode: false, allowNewSignups: true, emailNotifications: true, requireTwoFactor: false };
}
export async function updatePlatformSettings(settings) {
  await setDoc(doc(db, 'platform', 'settings'), { ...settings, updatedAt: new Date().toISOString(), updatedBy: actor().uid }, { merge: true });
  await writeAuditLog({ action: 'UPDATE', details: 'Updated platform settings', targetType: 'settings' });
  return settings;
}
export async function getCurrentAdmin() {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in with a Firebase administrator account first.');
  const profile = await getDoc(doc(db, 'administrators', user.uid));
  return profile.exists() ? { id: profile.id, ...profile.data() } : { id: user.uid, email: user.email, name: user.displayName || user.email, role: 'Super Admin', status: 'Active' };
}
