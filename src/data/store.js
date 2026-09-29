import { randomUUID } from "node:crypto";
import { db } from "../config/firebase.js";

export const collections = Object.freeze({
  users: db.collection("users"),
  drivers: db.collection("drivers"),
  fuelRequests: db.collection("fuelRequests"),
  petrolStations: db.collection("petrolStations"),
  trackingSessions: db.collection("trackingSessions")
});

export const now = () => new Date().toISOString();
export const id = () => randomUUID();
export const document = (snapshot) => snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() }) : null;
