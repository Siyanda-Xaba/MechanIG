import { id, now } from "../data/store.js";

import { normalizeLocation } from "../utils/location.js";

import {
  badRequest,
  notFound,
} from "../utils/http.js";


const MAX_LOCATION_HISTORY = 200;

export const VALID_STATUSES = new Set([
  "SEARCHING",
  "ASSIGNED",
  "EN_ROUTE",
  "ARRIVED",
  "COMPLETED",
  "CANCELLED",
]);


export class TrackingService {

  constructor() {
    this.sessions = new Map();
  }


  start({
    requestId = id(),
    driverId,
    customerId,
    initialLocation,
    status = "ASSIGNED",
  }) {

    if (!driverId || !customerId) {
      throw badRequest(
        "driverId and customerId are required"
      );
    }


    if (!VALID_STATUSES.has(status)) {
      throw badRequest(
        "Invalid tracking status"
      );
    }


    const location =
      initialLocation
        ? normalizeLocation(initialLocation)
        : null;


    const timestamp = now();


    const session = {
      requestId: String(requestId),

      driverId: String(driverId),

      customerId: String(customerId),

      status,

      latestLocation: location,

      locationHistory: location
        ? [location]
        : [],

      createdAt: timestamp,

      updatedAt: timestamp,
    };


    this.sessions.set(
      session.requestId,
      session
    );


    return this.snapshot(session);
  }


  updateLocation(
    requestId,
    location
  ) {

    const session =
      this.requireSession(requestId);


    if (
      ["COMPLETED", "CANCELLED"]
        .includes(session.status)
    ) {
      throw badRequest(
        "Tracking has already ended"
      );
    }


    const normalized =
      normalizeLocation(location);


    session.latestLocation =
      normalized;


    session.locationHistory.push(
      normalized
    );


    if (
      session.locationHistory.length >
      MAX_LOCATION_HISTORY
    ) {
      session.locationHistory.splice(
        0,
        session.locationHistory.length -
          MAX_LOCATION_HISTORY
      );
    }


    session.updatedAt = now();


    return this.snapshot(session);
  }


  setStatus(
    requestId,
    status
  ) {

    const session =
      this.requireSession(requestId);


    if (!VALID_STATUSES.has(status)) {
      throw badRequest(
        "Invalid tracking status"
      );
    }


    session.status = status;

    session.updatedAt = now();


    return this.snapshot(session);
  }


  get(requestId) {

    return this.snapshot(
      this.requireSession(requestId)
    );
  }


  requireSession(requestId) {

    const session =
      this.sessions.get(
        String(requestId)
      );


    if (!session) {
      throw notFound(
        "Tracking session was not found"
      );
    }


    return session;
  }


  snapshot(session) {

    return {
      ...session,

      locationHistory: [
        ...session.locationHistory,
      ],
    };
  }
}


const trackingService =
  new TrackingService();


export default trackingService;