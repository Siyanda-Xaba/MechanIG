// Mock admin API. Replace each function body with a real fetch() call to your
// backend when it's ready — the shape of the returned data is what the screens expect.

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

const ADMINISTRATORS = [
  { id: '1', name: 'Tashlyn Mitchell', email: 'tashlyn@mechaniq.co.za', role: 'Super Admin', status: 'Active', lastActive: 'Today 09:12' },
  { id: '2', name: 'Alicia Naidoo', email: 'alicia@mechaniq.co.za', role: 'Super Admin', status: 'Active', lastActive: 'Today 08:45' },
  { id: '3', name: 'Thabo Dlamini', email: 'thabo@mechaniq.co.za', role: 'Admin', status: 'Active', lastActive: 'Yesterday 16:20' },
  { id: '4', name: 'Lerato Radebe', email: 'lerato@mechaniq.co.za', role: 'Admin', status: 'Pending', lastActive: '2 days ago 14:18' },
  { id: '5', name: 'Jason Williams', email: 'jason@mechaniq.co.za', role: 'Admin', status: 'Active', lastActive: 'Today 11:05' },
  { id: '6', name: 'Siphokazi Ndlovu', email: 'sipho@mechaniq.co.za', role: 'Admin', status: 'Suspended', lastActive: '5 days ago 09:30' },
  { id: '7', name: 'Daniel Cooper', email: 'daniel@mechaniq.co.za', role: 'Admin', status: 'Active', lastActive: 'Today 07:50' },
  { id: '8', name: 'Mpho Phiri', email: 'mpho@mechaniq.co.za', role: 'Admin', status: 'Pending', lastActive: '1 day ago 13:12' },
];

const AUDIT_LOGS = [
  { id: '1', date: '14 Sep 2025', time: '09:12', user: 'Tashlyn Mitchell', role: 'Super Admin', action: 'CREATE', details: 'Created admin account (Alicia Naidoo)' },
  { id: '2', date: '14 Sep 2025', time: '08:45', user: 'Alicia Naidoo', role: 'Super Admin', action: 'UPDATE', details: 'Updated role permissions (Content Manager)' },
  { id: '3', date: '13 Sep 2025', time: '16:20', user: 'Thabo Dlamini', role: 'Admin', action: 'LOGIN', details: 'User logged in (IP: 196.22.10.5)' },
  { id: '4', date: '13 Sep 2025', time: '14:18', user: 'Lerato Radebe', role: 'Admin', action: 'DELETE', details: 'Removed user access (Mechanic Support)' },
  { id: '5', date: '12 Sep 2025', time: '11:05', user: 'Jason Williams', role: 'Admin', action: 'UPDATE', details: 'Modified store settings (ZK Auto Care)' },
  { id: '6', date: '12 Sep 2025', time: '09:30', user: 'Siphokazi Ndlovu', role: 'Admin', action: 'ASSIGN', details: 'Assigned role (Store Manager)' },
  { id: '7', date: '11 Sep 2025', time: '16:42', user: 'Daniel Cooper', role: 'Admin', action: 'UPDATE', details: 'Updated marketplace settings' },
  { id: '8', date: '11 Sep 2025', time: '10:15', user: 'Mpho Phiri', role: 'Admin', action: 'LOGIN', details: 'User logged in (IP: 196.22.11.8)' },
  { id: '9', date: '10 Sep 2025', time: '13:27', user: 'Tashlyn Mitchell', role: 'Super Admin', action: 'UPDATE', details: 'Updated system configuration' },
  { id: '10', date: '10 Sep 2025', time: '11:03', user: 'Alicia Naidoo', role: 'Super Admin', action: 'EXPORT', details: 'Exported audit logs (Last 30 days)' },
];

const ROLES = [
  { id: '1', name: 'Super Admin', description: 'Full system access and control', users: 2, status: 'Active', icon: 'crown', color: '#A855F7' },
  { id: '2', name: 'Admin', description: 'Manage platform operations', users: 5, status: 'Active', icon: 'settings', color: '#3B82F6' },
  { id: '3', name: 'Content Manager', description: 'Manage marketplace content', users: 8, status: 'Active', icon: 'user', color: '#22C55E' },
  { id: '4', name: 'Store Manager', description: 'Manage store accounts and listings', users: 10, status: 'Active', icon: 'shopping-bag', color: '#F59E0B' },
  { id: '5', name: 'Mechanic Support', description: 'Support mechanic accounts', users: 12, status: 'Active', icon: 'tool', color: '#EF4444' },
  { id: '6', name: 'Read Only', description: 'View only access', users: 9, status: 'Inactive', icon: 'eye', color: '#8A9BA8' },
];

const RECENT_PERMISSION_CHANGES = [
  { id: '1', type: 'add', title: 'New permission assigned', details: 'Marketplace Content → Content Manager', time: '2 hours ago' },
  { id: '2', type: 'update', title: 'Role updated', details: 'Store Manager permissions modified', time: '6 hours ago' },
  { id: '3', type: 'remove', title: 'Permission revoked', details: 'User access removed → Mechanic Support', time: '1 day ago' },
];

const RECENT_ACTIVITY = [
  { id: '1', type: 'user', title: 'New customer registered', details: 'john.doe@example.com', time: '2 minutes ago' },
  { id: '2', type: 'mechanic', title: 'Mechanic approved', details: 'Elite Auto Garage', time: '15 minutes ago' },
  { id: '3', type: 'booking', title: 'New booking created', details: 'BMW 320i • Engine Diagnosis', time: '32 minutes ago' },
  { id: '4', type: 'product', title: 'New product listed', details: 'Brake Pads (Front)', time: '1 hour ago' },
  { id: '5', type: 'support', title: 'Support request received', details: '#SR-2025-0042', time: '2 hours ago' },
];

export async function getDashboardStats() {
  await delay();
  return {
    totalUsers: 2548, totalUsersChange: '+12%',
    mechanics: 342, mechanicsChange: '+8%',
    totalBookings: 1124, totalBookingsChange: '+20%',
    revenue: 128450, revenueChange: '+15%',
    systemStatus: 'All systems operational',
  };
}

export async function getRecentActivity() {
  await delay();
  return RECENT_ACTIVITY;
}

export async function getCurrentUserProfile() {
  await delay();
  return {
    id: '1',
    name: 'Tashlyn Mitchell',
    email: 'tashlyn@mechaniq.co.za',
    role: 'Super Admin',
    status: 'Active',
    initials: 'KM',
  };
}

export async function getAdministrators({ search = '', page = 1, pageSize = 8 } = {}) {
  await delay();
  const filtered = ADMINISTRATORS.filter((a) =>
    `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    totalAdministrators: ADMINISTRATORS.length,
    active: ADMINISTRATORS.filter((a) => a.status === 'Active').length,
    pending: ADMINISTRATORS.filter((a) => a.status === 'Pending').length,
    suspended: ADMINISTRATORS.filter((a) => a.status === 'Suspended').length,
    page,
    pageSize,
  };
}

export async function getRolesAndPermissions() {
  await delay();
  return {
    roles: ROLES,
    totalRoles: ROLES.length,
    totalPermissions: 48,
    assignedUsers: 36,
    pendingChanges: 12,
  };
}

export async function getRecentPermissionChanges() {
  await delay();
  return RECENT_PERMISSION_CHANGES;
}

export async function getAuditLogs({ search = '', page = 1, pageSize = 10 } = {}) {
  await delay();
  const filtered = AUDIT_LOGS.filter((l) =>
    `${l.user} ${l.details} ${l.action}`.toLowerCase().includes(search.toLowerCase())
  );
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: 1248,
    userActions: 320,
    systemChanges: 216,
    securityEvents: 12,
    page,
    pageSize,
  };
}

export async function exportAuditLogs() {
  await delay(500);
  return { success: true };
}