## MechanIQ OBD-II diagnostics API

The mobile frontend reads the Bluetooth adapter and sends its OBD-II responses to this API. The API converts raw hex data into readable live readings and diagnostic problem cards.

Start it with `npm start`. The API runs on `http://localhost:5000`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | API health check |
| `GET` | `/api/v1/diagnostics/problems` | List the supported code catalogue |
| `GET` | `/api/v1/diagnostics/problems/P0300` | Look up one supported trouble code |
| `POST` | `/api/v1/diagnostics/translate` | Convert adapter output into frontend-ready diagnostics |
| `POST` | `/api/v1/vehicles` | Create a vehicle for the current development user |
| `GET` | `/api/v1/vehicles` | List vehicles for the current development user |
| `POST` | `/api/v1/diagnostics/scans` | Save a vehicle-owned scan and return its result ID |
| `GET` | `/api/v1/diagnostics/scans?vehicleId=...` | Read diagnostic history for one vehicle |
| `GET` | `/api/v1/diagnostics/scans/:scanId` | Read one complete stored diagnostic result |
| `GET` | `/api/v1/diagnostics/scans/:scanId/repair-guide` | Return safe next steps for one result |

Send a scan to `POST /api/v1/diagnostics/translate`:

```json
{
  "vehicle": { "vin": "optional-vin", "make": "Optional" },
  "rawDtcResponse": "43 03 00 04 20",
  "rawResponses": ["41 0C 1A F8", "41 0D 3C", "41 05 7B"]
}
```

`rawDtcResponse` is the response to OBD-II Mode 03. `rawResponses` contains Mode 01 PID responses. The API also accepts a decoded `dtcs` array such as `["P0300", "P0420"]` when the frontend already has the codes.

The current catalogue covers P0101, P0118, P0128, P0133, P0135, P0171, P0300, P0420, P0442, P0455, P0500, and P0562. Unknown codes remain visible in the response with `supported: false`, rather than being discarded.

### Persisted scan flow

Create a vehicle first, then submit a scan using its returned `id` as `vehicleId`. Saved scans have stable `scan_...` IDs and keep both `raw` adapter responses and the separate `interpretation` produced by the backend.

Until the real authentication module is connected, protected endpoints require an `x-mechaniq-user-id` header for local development. It is only a temporary identity seam: production must replace it with verified access-token or server-session middleware, never trust an arbitrary client header.
