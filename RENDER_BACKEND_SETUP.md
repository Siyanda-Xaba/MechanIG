# MechanIQ backend on Render

This repository is a monorepo. The Render Blueprint at the repository root creates three new services:

| Service | Folder | Health check | Use |
| --- | --- | --- | --- |
| `mechaniq-parts-api` | `backend/` | `/health` | Marketplace, picture search, warning-light scans, vehicle images, mechanic requests and fuel requests |
| `mechaniq-obd-api` | `backend/obd-api/` | `/health/ready` | OBD scan history and diagnostic API |
| `mechaniq-sound-api` | `backend/sound-detection/` | `/health/ready` | Sound diagnosis |

The OBD adapter still connects directly from the phone to the vehicle over Bluetooth. Render hosts the scan-history API; it does not relay Bluetooth.

## Create the new Render services

1. Make sure `render.yaml`, `backend/package.json`, `backend/package-lock.json`, and the backend code are on the Git branch you want Render to deploy. Do not add `.env`, `.env.local`, `.env.backend.local`, or a Firebase service-account JSON file to Git.
2. In Render, choose **New → Blueprint**, connect the MechanIG repository, and select the branch containing `render.yaml`.
3. Review the three services. The Blueprint sets the region to Frankfurt and explicitly selects the Free plan to avoid creating paid instances automatically.
4. Enter the secret API keys when Render prompts for the `sync: false` variables:
   - `GEMINI_API_KEY` for part/photo recognition.
   - `SERPAPI_API_KEY` for nearby stores, fuel stations, and live offers.
   - `ROBOFLOW_API_KEY` for dashboard warning-light recognition.
   - `POLLINATIONS_API_KEY` for registered-vehicle images.

Use the secret values from the backend's private environment setup. Do not paste secrets into `render.yaml`, commit them, or send them in chat.

## Firebase Admin credentials

The parts API and OBD API both need a Firebase service-account key to verify Firebase sign-in tokens and access the app's Firebase databases.

1. In Firebase Console, open **Project settings → Service accounts** and create/download a private key for project `mechaniq-3a0f2`.
2. In Render, add the JSON as a **Secret File** to both `mechaniq-parts-api` and `mechaniq-obd-api`. Use the filename `firebase-service-account.json`.
3. The Blueprint sets `GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/firebase-service-account.json` for both services.
4. Never put that JSON in the repository or a normal environment variable. Keep a secure backup outside the project.

The `FIREBASE_DATABASE_URL` and `GOOGLE_CLOUD_PROJECT` values are already in the Blueprint. The OBD service is configured to use Firebase authentication and storage in production; it will not save user scans to Render's temporary disk.

## Confirm the deployment

After the deploys finish, open each service's URL with its health path:

- Parts API: `https://mechaniq-parts-api.onrender.com/health`
- OBD API: `https://mechaniq-obd-api.onrender.com/health/ready`
- Sound API: `https://mechaniq-sound-api.onrender.com/health/ready`

The parts health response should show the required provider integrations as configured. The OBD response should say `ready`, `firebase`, and `firebase`. The sound response should say `ready`. If Render assigns a different service URL because a name is unavailable, use the URL shown in the Render dashboard.

## Point the Android app at Render

After the service URLs are live, set these **public API base URLs** in the environment used to build the Android app. These URLs are not secrets:

```text
EXPO_PUBLIC_PICTURE_SEARCH_API_URL=https://<parts-api-host>
EXPO_PUBLIC_OBD_API_URL=https://<obd-api-host>
EXPO_PUBLIC_SOUND_DIAGNOSIS_API_URL=https://<sound-api-host>
```

For an EAS internal test build, set the values in the EAS environment used by the `preview` profile, then build with:

```powershell
eas build --platform android --profile preview
```

Download the resulting APK. In Firebase Console, open **App Distribution → Releases**, select the Android app registered with the same package name (`com.anonymous.mechaniq`), upload the APK, select testers, add release notes, and distribute it. Firebase App Distribution shares the built app; the app's API URLs must already point to Render before the build.

## Free-plan limitations

Render Free web services spin down after 15 minutes without traffic and can take about a minute to start again. They have an ephemeral filesystem, so app data must stay in Firebase. This app's saved OBD scans use Firebase in production.

The sound service loads TensorFlow and the sound model. If its health check fails or the logs show an out-of-memory restart on the Free plan, the sound service will need a larger paid instance. The Blueprint keeps all services on Free until you deliberately upgrade a service in Render.
