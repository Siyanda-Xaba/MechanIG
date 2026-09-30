// POST /administrators  { name, email, role }
export async function createAdmin(payload) {
  if (!USE_MOCK) return request('/administrators', { method: 'POST', body: JSON.stringify(payload) });
  await wait();
  return { id: Date.now(), status: 'Pending', lastActive: 'Never', ...payload };
}

// POST /roles  { name, description, permissions: string[] }
export async function createRole(payload) {
  if (!USE_MOCK) return request('/roles', { method: 'POST', body: JSON.stringify(payload) });
  await wait();
  return { id: Date.now(), status: 'Active', users: 0, ...payload };
}

// POST /auth/login  { email, password } -> { token, user }
export async function login(email, password) {
  if (!USE_MOCK) {
    const res = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setAuthToken(res.token);
    return res;
  }
  await wait();
  setAuthToken('mock-token');
  return { token: 'mock-token', user: { name: 'Tashlyn Mitchell', role: 'Super Admin' } };
}

// POST /auth/logout
export async function logout() {
  if (!USE_MOCK) await request('/auth/logout', { method: 'POST' });
  setAuthToken(null);
}