import { randomUUID } from "node:crypto";

export const store = {
  users: new Map(),
  sessions: new Map(),
  drivers: new Map(),
  fuelRequests: new Map(),
  petrolStations: new Map()
};

export const now = () => new Date().toISOString();
export const id = () => randomUUID();
