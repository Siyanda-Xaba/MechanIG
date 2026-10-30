import { addDoc, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { auth, database, db } from '../../firebase/firebase';
import { get, onValue, ref, update } from 'firebase/database';

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

function values(data) {
  return Object.values(data || {}).filter((record) => record && typeof record === 'object');
}

function getUniquePlatformUsers(profileData, mechanicData) {
  const accounts = new Map();
  for (const [key, profile] of Object.entries(profileData || {})) {
    if (!profile || typeof profile !== 'object') continue;
    const id = String(profile.uid || profile.id || key);
    const role = String(profile.role || 'customer').trim().toLowerCase();
    if (role === 'customer' || role === 'mechanic') accounts.set(id, { ...profile, role });
  }
  for (const [key, profile] of Object.entries(mechanicData || {})) {
    if (!profile || typeof profile !== 'object') continue;
    const id = String(profile.uid || profile.ownerUid || profile.id || key);
    accounts.set(id, { ...accounts.get(id), ...profile, role: 'mechanic' });
  }
  return [...accounts.values()];
}

function isActiveAccount(profile) {
  const status = String(profile.accountStatus || profile.status || 'active').trim().toLowerCase();
  return profile.isActive !== false
    && profile.isDisabled !== true
    && profile.disabled !== true
    && !['pending', 'suspended', 'inactive', 'disabled', 'deleted', 'blocked', 'rejected'].includes(status);
}

function countStatuses(records, statuses) {
  return values(records).filter((record) => statuses.includes(String(record.status || '').trim().toLowerCase())).length;
}

function buildDashboardStats(profileData, mechanicData, bookingData, serviceRequestData, fuelDeliveryData, administrators, products, stores) {
  const accounts = getUniquePlatformUsers(profileData, mechanicData);
  const customers = accounts.filter((account) => account.role === 'customer');
  const mechanics = accounts.filter((account) => account.role === 'mechanic');
  const activeUsers = accounts.filter(isActiveAccount).length;
  const deletedUsers = accounts.filter((account) => String(account.accountStatus || account.status || '').trim().toLowerCase() === 'deleted').length;
  const bookingCount = values(bookingData).length;
  const serviceRequestCount = values(serviceRequestData).length;
  const fuelDeliveryCount = values(fuelDeliveryData).length;
  const adminList = Array.isArray(administrators) ? administrators : [];
  const productList = Array.isArray(products) ? products : [];
  const storeList = Array.isArray(stores) ? stores : [];
  return {
    totalUsers: accounts.length,
    totalUsersChange: 'Unique customer and mechanic accounts',
    activeUsers,
    activeUsersChange: 'Not pending, suspended, or disabled',
    deletedUsers,
    customers: customers.length,
    customerChange: 'Customer accounts',
    mechanics: mechanics.length,
    mechanicsChange: 'Unique mechanic accounts',
    totalBookings: bookingCount,
    bookingsChange: `${countStatuses(bookingData, ['requested', 'pending'])} pending · ${countStatuses(bookingData, ['completed'])} completed`,
    serviceRequests: serviceRequestCount,
    serviceRequestsChange: `${countStatuses(serviceRequestData, ['requested', 'pending'])} pending`,
    fuelDeliveries: fuelDeliveryCount,
    fuelDeliveriesChange: `${countStatuses(fuelDeliveryData, ['requested', 'pending'])} pending`,
    revenue: null,
    revenueChange: 'No payment ledger is stored in Firebase yet',
    administratorCount: adminList.length,
    activeAdministrators: countStatuses(adminList, ['active']),
    pendingAdministrators: countStatuses(adminList, ['pending']),
    productCount: productList.length,
    activeProductCount: countStatuses(productList, ['active', 'approved', 'published']),
    storeCount: storeList.length,
    activeStoreCount: countStatuses(storeList, ['active', 'approved', 'published']),
    systemStatus: 'Live Firebase records',
  };
}

export async function getDashboardStats() {
  const [profileSnapshot, mechanicSnapshot, bookingSnapshot, serviceRequestSnapshot, fuelDeliverySnapshot, admins, products, stores] = await Promise.all([
    get(ref(database, 'users')),
    get(ref(database, 'mechanics')),
    get(ref(database, 'bookings')),
    get(ref(database, 'serviceRequests')),
    get(ref(database, 'fuelDeliveries')),
    getDocs(col('administrators')),
    getDocs(col('marketplaceProducts')),
    getDocs(col('marketplaceStores')),
  ]);
  return buildDashboardStats(
    profileSnapshot.val(), mechanicSnapshot.val(), bookingSnapshot.val(), serviceRequestSnapshot.val(),
    fuelDeliverySnapshot.val(), rows(admins), rows(products), rows(stores),
  );
}

export function subscribeDashboardStats(onData, onError) {
  const current = {
    profiles: null, mechanics: null, bookings: null, serviceRequests: null, fuelDeliveries: null,
    administrators: null, products: null, stores: null,
  };
  const emit = () => {
    if (Object.values(current).some((value) => value === null)) return;
    onData(buildDashboardStats(
      current.profiles, current.mechanics, current.bookings, current.serviceRequests, current.fuelDeliveries,
      current.administrators, current.products, current.stores,
    ));
  };
  const reportError = (error) => onError?.(error);
  const unsubscribeProfiles = onValue(ref(database, 'users'), (snapshot) => {
    current.profiles = snapshot.val() || {};
    emit();
  }, reportError);
  const unsubscribeMechanics = onValue(ref(database, 'mechanics'), (snapshot) => {
    current.mechanics = snapshot.val() || {};
    emit();
  }, reportError);
  const unsubscribeBookings = onValue(ref(database, 'bookings'), (snapshot) => {
    current.bookings = snapshot.val() || {};
    emit();
  }, reportError);
  const unsubscribeServiceRequests = onValue(ref(database, 'serviceRequests'), (snapshot) => {
    current.serviceRequests = snapshot.val() || {};
    emit();
  }, reportError);
  const unsubscribeFuelDeliveries = onValue(ref(database, 'fuelDeliveries'), (snapshot) => {
    current.fuelDeliveries = snapshot.val() || {};
    emit();
  }, reportError);
  const unsubscribeAdministrators = onSnapshot(col('administrators'), (snapshot) => {
    current.administrators = rows(snapshot);
    emit();
  }, reportError);
  const unsubscribeProducts = onSnapshot(col('marketplaceProducts'), (snapshot) => {
    current.products = rows(snapshot);
    emit();
  }, reportError);
  const unsubscribeStores = onSnapshot(col('marketplaceStores'), (snapshot) => {
    current.stores = rows(snapshot);
    emit();
  }, reportError);
  return () => {
    unsubscribeProfiles();
    unsubscribeMechanics();
    unsubscribeBookings();
    unsubscribeServiceRequests();
    unsubscribeFuelDeliveries();
    unsubscribeAdministrators();
    unsubscribeProducts();
    unsubscribeStores();
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
function mapManagedProfiles(users, mechanics) {
  const customerRows = Object.entries(users || {}).map(([id, profile]) => ({
    id,
    ...profile,
    role: profile?.role || 'customer',
    status: profile?.accountStatus || profile?.status || 'Active',
  }));
  const mechanicRows = Object.entries(mechanics || {}).map(([id, profile]) => ({
    id,
    ...profile,
    role: 'mechanic',
    firstName: profile?.firstName || profile?.publicName || '',
    status: profile?.accountStatus || profile?.status || 'Active',
  }));
  return [...customerRows, ...mechanicRows].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function getManagedUsers() {
  const [users, mechanics] = await Promise.all([
    get(ref(database, 'users')),
    get(ref(database, 'mechanics')),
  ]);
  return mapManagedProfiles(users.val(), mechanics.val());
}

export function subscribeManagedUsers(onData, onError) {
  const current = { users: null, mechanics: null };
  const emit = () => {
    if (current.users === null || current.mechanics === null) return;
    onData(mapManagedProfiles(current.users, current.mechanics));
  };
  const unsubscribeUsers = onValue(ref(database, 'users'), (snapshot) => {
    current.users = snapshot.val() || {};
    emit();
  }, onError);
  const unsubscribeMechanics = onValue(ref(database, 'mechanics'), (snapshot) => {
    current.mechanics = snapshot.val() || {};
    emit();
  }, onError);
  return () => {
    unsubscribeUsers();
    unsubscribeMechanics();
  };
}

/** Mark a customer's or mechanic's profile deleted and block future app sign-ins. */
export async function deleteManagedUser(userId) {
  const currentAdminId = auth.currentUser?.uid;
  if (!currentAdminId) throw new Error('Sign in as an administrator to delete a user.');
  if (typeof userId !== 'string' || !userId.trim() || userId === currentAdminId) {
    throw new Error('Select a valid user account to delete.');
  }

  const userRef = ref(database, `users/${userId}`);
  const mechanicRef = ref(database, `mechanics/${userId}`);
  const [userSnapshot, mechanicSnapshot] = await Promise.all([get(userRef), get(mechanicRef)]);
  const updates = {};
  if (userSnapshot.exists()) updates[`users/${userId}/accountStatus`] = 'Deleted';
  if (mechanicSnapshot.exists()) updates[`mechanics/${userId}/accountStatus`] = 'Deleted';
  if (!Object.keys(updates).length) throw new Error('This user profile no longer exists. Refresh the list and try again.');
  if (auth.currentUser?.uid !== currentAdminId) throw new Error('The administrator account changed. Sign in and try again.');

  await update(ref(database), updates);
  await writeAuditLog({ action: 'DELETE', details: `Marked user ${userId} deleted and blocked MechanIQ sign-in`, targetId: userId, targetType: 'user' })
    .catch((error) => console.warn('User deletion was applied but its audit entry could not be saved:', error?.message || 'unknown error'));
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
