# MechanIQ OBD diagnostics API

Node.js REST API for translating OBD-II adapter responses, saving vehicle scans, and returning diagnostic history. The mobile app owns Bluetooth/OBD adapter communication: it reads the adapter and sends the ECU responses to this API. This service does not connect to a vehicle or Bluetooth adapter itself.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm ci
cp .env.example .env
npm start
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`. Local storage writes diagnostic data to `data/mechaniq.json`. Protected routes always require a Firebase ID token; development no longer accepts a client-chosen user ID. `npm test` runs the API tests.

The server binds to `0.0.0.0:5000`, so a phone on the same network can reach it through the computer's LAN IP. Set `EXPO_PUBLIC_OBD_API_URL` in the frontend to `http://<computer-lan-ip>:5000`; `localhost` on a phone means the phone itself. The phone and computer must be on the same network and the computer firewall must allow port 5000.

### Installed Android car-test build

The car-test APK uses `http://localhost:3002` for picture search, fuel, and nearby-store requests, and `http://localhost:5002` for OBD scan history. Cleartext HTTP is allowed only for `localhost`. From the project folder, run `npm start` and leave it open; it starts both APIs. Connect the phone by USB with USB debugging enabled, then run `scripts/start-car-test.ps1` in a second PowerShell window. The script checks both API health endpoints, creates `adb reverse` tunnels for ports 3002 and 5002, and installs or updates the release APK. Keep the USB cable and the `npm start` window active during testing. Bluetooth from the phone to the OBD adapter remains separate.

## Frontend connection

Base URL: `EXPO_PUBLIC_OBD_API_URL` (for example, `http://192.168.1.25:5000`). JSON responses use `{ "data": ..., "requestId": "..." }`; errors use `{ "error": "...", "message": "...", "requestId": "..." }`.

For a signed-in Firebase user, get a fresh ID token with the frontend Firebase Auth SDK and send it as `Authorization: Bearer <id-token>` to protected routes. Production checks token revocation and requires Firebase-backed storage and authentication configuration.

The Bluetooth app uses one shared `diagnostic-policy.json` allowlist. It sends only Mode 01 supported-PID/live-data reads and Mode 03 stored emissions-code reads. The API independently rejects other service/PID response data and unknown scan fields. It cannot enforce vehicle commands that never pass through this backend; the native adapter service also validates every operation before sending it.

```js
const response = await fetch(`${OBD_API_URL}/api/v1/diagnostics/translate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    vehicle: { make: 'BMW', model: '320i', year: 2015 },
    rawDtcResponse: '43 03 00 04 20',
    rawResponses: ['41 0C 1A F8', '41 0D 3C', '41 05 7B'],
  }),
});
const body = await response.json();
if (!response.ok) throw new Error(body.message || 'OBD request failed');
const diagnostics = body.data;
```

For persisted scans: create/list the user's vehicle, post a scan with its returned `vehicleId`, then read scan history or a scan/repair guide. Persisted routes require authentication. Keep the same Firebase UID for all vehicle and scan requests; the API takes that UID from the verified token, never from a request body.

## Routes

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health/live` | No | Process liveness |
| `GET` | `/health/ready` | No | API configuration and storage mode |
| `GET` | `/api/v1/diagnostics/problems` | No | Supported DTC catalogue |
| `GET` | `/api/v1/diagnostics/problems/:code` | No | One supported code |
| `POST` | `/api/v1/diagnostics/translate` | No | Decode DTC and live PID responses without saving |
| `GET` | `/api/v1/vehicles` | Yes | List the caller's vehicles |
| `POST` | `/api/v1/vehicles` | Yes | Create a vehicle |
| `POST` | `/api/v1/diagnostics/scans` | Yes | Translate and save a scan for a vehicle |
| `GET` | `/api/v1/diagnostics/scans?vehicleId=...` | Yes | Scan history for a vehicle |
| `GET` | `/api/v1/diagnostics/scans/:scanId` | Yes | Full saved scan |
| `DELETE` | `/api/v1/diagnostics/scans/:scanId` | Yes | Delete the caller's saved scan |
| `GET` | `/api/v1/diagnostics/scans/:scanId/repair-guide` | Yes | Conservative next-step guidance |

The machine-readable contract is in [`openapi.yaml`](./openapi.yaml).

### Request bodies

Vehicle create:

```json
{ "make": "BMW", "model": "320i", "year": 2015, "nickname": "optional" }
```

VIN is not collected or stored by this API. Only the record owner can review or delete saved scans.

Translate or scan:

```json
{
  "vehicleId": "required only for POST /scans",
  "vehicle": { "make": "BMW", "model": "320i", "year": 2015 },
  "dtcs": ["P0300"],
  "rawDtcResponse": "43 03 00 04 20",
  "rawResponses": ["41 0C 1A F8", "41 0D 3C", "41 05 7B"]
}
```

At least one of `dtcs`, `rawDtcResponse`, `rawResponses`, or `readings` is required. `readings` is an alias for `rawResponses`. Raw DTC input is an OBD Mode 03 response; live values are Mode 01 responses. Values are space-separated hex bytes (for example `41 0C 1A F8`). Send decoded five-character codes in `dtcs` if the frontend already parsed the adapter response.

## Configuration and production

- Local: `OBD_STORAGE=local`, `OBD_AUTH_MODE=development`.
- Production: set `NODE_ENV=production`, `OBD_STORAGE=firebase`, and `OBD_AUTH_MODE=firebase`.
- Firebase Admin uses Application Default Credentials. On Google-hosted infrastructure, use its service identity; locally, set `GOOGLE_APPLICATION_CREDENTIALS` to a service-account file stored outside source control. The service account needs Firebase Authentication token verification and Realtime Database access.
- Set `FIREBASE_DATABASE_URL` and `GOOGLE_CLOUD_PROJECT` for the target Firebase project.
- Apply [`database.rules.json`](./database.rules.json) to the Realtime Database to keep client-side reads/writes closed and add the query indexes used by the API.
- Set `OBD_CORS_ORIGINS` to a comma-separated allowlist of deployed web origins. Native apps do not use browser CORS. Development defaults allow all origins; production defaults to no cross-origin browser access.
- Keep API credentials on the server. The frontend only sends its user's Firebase ID token, never a service-account credential.

Vehicles and scans use the same selected store: a single local JSON database in development or Firebase Realtime Database in production. Local JSON storage is for development/testing only; it is not suitable for multiple server instances.

## Current scope and limits

- The exact BLE operation allowlist is in the shared root `diagnostic-policy.json`: Service 01 supported-PID bitmap requests for `00`, `20`, and `40`; Service 01 live PIDs `04`, `05`, `06`, `07`, `08`, `09`, `0A`, `0B`, `0C`, `0D`, `0E`, `0F`, `10`, `11`, `2F`, `32`, `33`, `42`, `5E`; and Service 03 stored emissions DTC reads. Only ECU-supported PIDs are polled. There is no command endpoint.
- The adapter layer sends no initialization, clearing, reset, coding, active-test, security-access, or manufacturer-specific commands. It does not auto-switch protocol, reconnect, or resume a stopped scan.
- The Android/iOS app keeps polling the supported live PIDs while the diagnostics screen remains open and the adapter stays connected. PIDs the vehicle does not provide are shown as unavailable; a missing PID does not stop the remaining reads.
- Fuel consumption is shown as the OBD engine fuel-rate reading (L/h) when PID 5E is supported. PID availability varies by vehicle; manufacturer-specific data and full live logging remain out of scope.
- Repair guidance is informational and is not a substitute for vehicle-specific service information.
- Local JSON storage is unencrypted development/test storage and is not suitable for production or shared-machine use. Production must use Firebase-backed storage, deployed database rules, verified credentials, and HTTPS at the remote endpoint.
- A BLE advertised name and OS pairing cannot prove the adapter is genuine or trustworthy. KW903 firmware, GATT behavior, vehicle support, and interruption behavior still require controlled physical testing; the app cannot authenticate the adapter cryptographically.
