# MechanIQ live tracking

The backend provides a single live-tracking contract for browser React and React Native clients. Both platforms can use `socket.io-client`; React Native needs no browser-only APIs for this feature.

## HTTP snapshot API

Start a tracking session with `POST /api/tracking`:

```json
{
  "requestId": "fuel-request-123",
  "driverId": "driver-42",
  "customerId": "customer-77",
  "initialLocation": { "latitude": -26.2041, "longitude": 28.0473 }
}
```

Use `GET /api/tracking/:requestId` to hydrate the map on app launch or reconnect. Update through `PATCH /api/tracking/:requestId/location` with `{ "location": { "latitude": -26.2041, "longitude": 28.0473 } }`, or `PATCH /api/tracking/:requestId/status` with `{ "status": "EN_ROUTE" }`.

## Socket events

1. Subscribe: `socket.emit("tracking:subscribe", { requestId }, acknowledgement)`.
2. A driver publishes: `socket.emit("tracking:location:update", { requestId, location }, acknowledgement)`.
3. Customers receive `tracking:location` with `{ requestId, location, status, updatedAt }`.
4. Status changes use `tracking:status:update` and arrive as `tracking:status`.

Every acknowledgement has either `{ ok: true, data }` or `{ ok: false, error }`. Location values are plain JSON: `latitude`, `longitude`, optional `accuracy`, `heading`, `speed`, and `recordedAt`.

## Client connection

```js
import { io } from "socket.io-client";

const socket = io(API_URL, { transports: ["websocket"] });
socket.emit("tracking:subscribe", { requestId });
socket.on("tracking:location", ({ location }) => updateDriverMarker(location));
```

For React Native, provide an address reachable from the phone or emulator; `localhost` refers to the device, not your development computer. Set `CORS_ORIGIN` to a comma-separated allowlist before production deployment. Authentication and persistent storage should be added before exposing driver location updates publicly.
