import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { id, now, store } from "../data/store.js";
import { badRequest, notFound } from "../utils/http.js";

const ROLES = new Set(["CUSTOMER", "DRIVER", "STATION_OWNER", "ADMIN"]);
const hashPassword = (password, salt = randomBytes(16).toString("hex")) => ({ salt, hash: scryptSync(password, salt, 64).toString("hex") });

function publicUser(user) {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

function requirePassword(password) {
  if (typeof password !== "string" || password.length < 8) throw badRequest("password must contain at least 8 characters");
}

export function register({ name, email, password, role = "CUSTOMER" }) {
  
  if (!name?.trim()) throw badRequest("name is required");
  
  if (!email?.trim() || !email.includes("@")) throw badRequest("A valid email is required");
  
  requirePassword(password);
  
  const normalizedEmail = email.trim().toLowerCase();
  
  if (store.users.has(normalizedEmail)) throw badRequest("An account with this email already exists");
  
  if (!ROLES.has(role)) throw badRequest("Invalid user role");
  
  const credentials = hashPassword(password);
  const user = { id: id(), name: name.trim(), email: normalizedEmail, role, passwordHash: credentials.hash, passwordSalt: credentials.salt, createdAt: now() };
  store.users.set(normalizedEmail, user);
  
  return createSession(user);
}

export function login({ email, password }) {

  const user = store.users.get(email?.trim().toLowerCase());
  
  if (!user || typeof password !== "string") throw badRequest("Invalid email or password");
  
  
  const candidate = scryptSync(password, user.passwordSalt, 64);
  const stored = Buffer.from(user.passwordHash, "hex");

  if (candidate.length !== stored.length || !timingSafeEqual(candidate, stored)) throw badRequest("Invalid email or password");

  return createSession(user);
}

export function createSession(user) {
  const token = randomBytes(32).toString("base64url");
  store.sessions.set(token, { userId: user.id, createdAt: now() });
  return { token, user: publicUser(user) };
}

export function getUserByToken(token) {
  const session = store.sessions.get(token);
  if (!session) return null;
  const user = [...store.users.values()].find((candidate) => candidate.id === session.userId);
  return user ? publicUser(user) : null;
}

export function getUser(idValue) {
  const user = [...store.users.values()].find((candidate) => candidate.id === idValue);
  if (!user) throw notFound("User was not found");
  return publicUser(user);
}
