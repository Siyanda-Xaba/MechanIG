import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { auth, database, db } from '../../firebase/firebase';
import { get, onValue, ref } from 'firebase/database';

const col = (name) => collection(db, name);
const rows = (snapshot) => snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
const actor = () => ({ uid: auth.currentUser?.uid ?? null, email: auth.currentUser?.email ?? null });

export async function writeAuditLog({ action, details, targetId = null, targetType = 'platform' }) {
  const current = actor();
  return addDoc(col('auditLogs'), {
    action, details, targetId, targetType, actorId: current.uid, actorEmail: current.email,
    timestamp: new Date().toISOString(), createdAt: new Date().toISOString(),
  });
}

function buildDashboardStats(profileData, administratorCount, productCount) {
  const profiles = Object.values(profileData || {}).filter((profile) => profile && typeof profile === 'object');
  const countRole = (role) => profiles.filter((profile) => String(profile.role || '').trim().toLowerCase() === role).length;
  return {
    totalUsers: countRole('customer'),
    totalUsersChange: 'Customer role only',
    mechanics: countRole('mechanic'),
    mechanicsChange: 'Mechanic role only',
    totalBookings: null,
    bookingsChange: 'Booking backend not connected',
    revenue: null,
    revenueChange: 'Payment ledger not connected',
    administratorCount,
    productCount,
    systemStatus: 'Realtime Database + Firestore connected',
  };
}

export async function getDashboardStats() {
  const [profileSnapshot, admins, products] = await Promise.all([
    get(ref(database, 'users')),
    getDocs(col('administrators')),
    getDocs(col('marketplaceProducts')),
  ]);
  return buildDashboardStats(profileSnapshot.val(), admins.size, products.size);
}

export function subscribeDashboardStats(onData, onError) {
  const current = { profiles: null, administrators: null, products: null };
  const emit = () => {
    if (current.profiles === null || current.administrators === null || current.products === null) return;
    onData(buildDashboardStats(current.profiles, current.administrators, current.products));
  };
  const reportError = (error) => onError?.(error);
  const unsubscribeProfiles = onValue(ref(database, 'users'), (snapshot) => {
    current.profiles = snapshot.val() || {};
    emit();
  }, reportError);
  const unsubscribeAdministrators = onSnapshot(col('administrators'), (snapshot) => {
    current.administrators = snapshot.size;
    emit();
  }, reportError);
  const unsubscribeProducts = onSnapshot(col('marketplaceProducts'), (snapshot) => {
    current.products = snapshot.size;
    emit();
  }, reportError);
  return () => {
    unsubscribeProfiles();
    unsubscribeAdministrators();
    unsubscribeProducts();
  };
}

export async function getRecentActivity() {
  const snapshot = await getDocs(query(col('auditLogs'), orderBy('timestamp', 'desc'), limit(5)));
  return rows(snapshot).map((item) => ({ id: item.id, type: item.targetType || 'system', title: item.action || 'Activity', details: item.details || '', time: item.timestamp || item.createdAt }));
}

export function subscribeRecentActivity(onData, onError) {
  return onSnapshot(query(col('auditLogs'), orderBy('timestamp', 'desc'), limit(5)),
    (snapshot) => onData(rows(snapshot).map((item) => ({ id: item.id, type: item.targetType || 'system', title: item.action || 'Activity', details: item.details || '', time: item.timestamp || item.createdAt }))), onError);
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  return { id: user?.uid ?? '', name: user?.displayName || user?.email || 'Super Admin', email: user?.email || '', role: 'Super Admin', status: 'Active', initials: (user?.displayName || user?.email || 'SA').slice(0, 2).toUpperCase() };
}

export async function getAdministrators({ search = '', page = 1, pageSize = 8 } = {}) {
  const snapshot = await getDocs(query(col('administrators'), orderBy('createdAt', 'desc')));
  const all = rows(snapshot).filter((a) => `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase()));
  const start = (page - 1) * pageSize;
  return { items: all.slice(start, start + pageSize), total: all.length, totalAdministrators: all.length,
    active: all.filter((a) => a.status === 'Active').length, pending: all.filter((a) => a.status === 'Pending').length,
    suspended: all.filter((a) => a.status === 'Suspended').length, page, pageSize };
}

export function subscribeAdministrators(onData, onError) {
  return onSnapshot(query(col('administrators'), orderBy('createdAt', 'desc')), (snapshot) => onData(rows(snapshot)), onError);
}

export async function getRolesAndPermissions() {
  const [roleSnap, adminSnap] = await Promise.all([getDocs(query(col('roles'), orderBy('name'))), getDocs(col('administrators'))]);
  const roles = rows(roleSnap);
  const totalPermissions = new Set(roles.flatMap((role) => role.permissions || [])).size;
  return { roles, totalRoles: roles.length, totalPermissions, assignedUsers: adminSnap.size, pendingChanges: 0 };
}
export async function getRecentPermissionChanges() {
  const snapshot = await getDocs(query(col('auditLogs'), orderBy('timestamp', 'desc'), limit(30)));
  return rows(snapshot).filter((item) => item.targetType === 'role').slice(0, 5)
    .map((item) => ({ id: item.id, type: item.action === 'DELETE' ? 'remove' : item.action === 'CREATE' ? 'add' : 'update', title: item.action, details: item.details, time: item.timestamp }));
}
export async function getAuditLogs({ search = '', page = 1, pageSize = 10 } = {}) {
  const snapshot = await getDocs(query(col('auditLogs'), orderBy('timestamp', 'desc')));
  const all = rows(snapshot).filter((log) => `${log.actorEmail} ${log.details} ${log.action}`.toLowerCase().includes(search.toLowerCase()));
  const items = all.slice((page - 1) * pageSize, page * pageSize);
  return { items, total: all.length, userActions: all.filter((x) => x.targetType === 'user').length,
    systemChanges: all.filter((x) => x.targetType !== 'user').length, securityEvents: all.filter((x) => /LOGIN|SECURITY|AUTH/.test(x.action || '')).length, page, pageSize };
}
export function subscribeAuditLogs(onData, onError) {
  return onSnapshot(query(col('auditLogs'), orderBy('timestamp', 'desc')), (snapshot) => onData(rows(snapshot)), onError);
}
export async function exportAuditLogs() { return getAuditLogs({ pageSize: 10000 }); }

export async function createAdministrator(payload) {
  const now = new Date().toISOString();
  const reference = await addDoc(col('administrators'), { ...payload, email: payload.email.trim().toLowerCase(), status: 'Pending', lastActive: 'Never', createdAt: now, updatedAt: now });
  await writeAuditLog({ action: 'CREATE', details: `Created administrator invitation for ${payload.email}`, targetId: reference.id, targetType: 'administrator' });
  return { id: reference.id, ...payload, status: 'Pending', lastActive: 'Never' };
}
export async function updateAdministrator(id, updates) {
  await updateDoc(doc(db, 'administrators', id), { ...updates, updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'UPDATE', details: `Updated administrator ${id}`, targetId: id, targetType: 'administrator' });
}
export async function deleteAdministrator(id) {
  await deleteDoc(doc(db, 'administrators', id));
  await writeAuditLog({ action: 'DELETE', details: `Deleted administrator ${id}`, targetId: id, targetType: 'administrator' });
}
export async function getManagedUsers({ search = '' } = {}) {
  const all = rows(await getDocs(query(col('users'), orderBy('createdAt', 'desc'))));
  return all.filter((user) => `${user.firstName || ''} ${user.lastName || ''} ${user.fullName || ''} ${user.email || ''}`.toLowerCase().includes(search.toLowerCase()));
}
export function subscribeManagedUsers(onData, onError) {
  return onSnapshot(query(col('users'), orderBy('createdAt', 'desc')), (snapshot) => onData(rows(snapshot)), onError);
}
export async function updateManagedUser(id, updates) {
  await updateDoc(doc(db, 'users', id), { ...updates, updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'UPDATE', details: `Updated user ${id}`, targetId: id, targetType: 'user' });
}
export async function deleteManagedUser(id) {
  await deleteDoc(doc(db, 'users', id));
  await writeAuditLog({ action: 'DELETE', details: `Removed user profile ${id}`, targetId: id, targetType: 'user' });
}
export async function createRole(payload) {
  const reference = await addDoc(col('roles'), { ...payload, status: 'Active', users: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'CREATE', details: `Created role ${payload.name}`, targetId: reference.id, targetType: 'role' });
  return { id: reference.id, ...payload, status: 'Active', users: 0 };
}
export async function updateRole(id, updates) {
  await updateDoc(doc(db, 'roles', id), { ...updates, updatedAt: new Date().toISOString() });
  await writeAuditLog({ action: 'UPDATE', details: `Updated role ${id}`, targetId: id, targetType: 'role' });
}
export async function deleteRole(id) {
  await deleteDoc(doc(db, 'roles', id));
  await writeAuditLog({ action: 'DELETE', details: `Deleted role ${id}`, targetId: id, targetType: 'role' });
}
