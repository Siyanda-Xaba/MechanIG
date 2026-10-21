# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

Requirements: Node.js 22.13 or newer.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

`npm start` launches the local APIs and the Expo development-client server.
Bluetooth is unavailable in Expo Go. Install the native development client
  first with `npm run android:dev` or, on macOS, `npm run ios:dev`. These
  commands start the local APIs before building and launching the native app.

## Picture search setup

The picture-search backend is included in `backend/server.js` and starts automatically with `npm start`. The launcher uses paths relative to this project and detects the current computer's LAN address, so the backend does not depend on the original developer's folder or IP address.

Install dependencies and create a local secrets file:

```powershell
npm install
Copy-Item .env.local.example .env.local
```

Add your own Google AI Studio Gemini key and SerpAPI key to `.env.local`. Gemini enables image recognition; SerpAPI enables nearby parts shops, nearby fuel stations, and online offers. These keys stay on the backend and must not be committed to GitHub. `.env.local` is ignored by Git. A fresh GitHub clone therefore needs valid keys added to `.env.local`; installing Node modules alone cannot authenticate to either provider. For phone testing, keep the phone and computer on the same Wi-Fi network and allow Node.js through Windows Firewall if prompted. The startup script supplies Expo with the current computer's LAN address automatically. Use `npm start` rather than `npx expo start` so the backend and app start together.

Use the installed development build to open the app. Expo Go cannot load the
native BLE module used by the OBD connection.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# OBD-II diagnostics (BLE)

The Diagnostics screen connects to a Bluetooth Low Energy ELM327-compatible
adapter, requests stored trouble codes and the RPM, speed, and coolant
temperature PIDs, then sends the ECU responses to the bundled OBD API for
translation and scan history. The API source is in `backend/obd-api`.

Install the app dependencies once with `npm install`, then run `npm start`.
The start script launches the picture-search service, OBD API, and Expo using
the development-client workflow. The phone and computer must be on the same
Wi-Fi network. Plug the adapter into the vehicle, turn the ignition on, enable
Bluetooth, and tap **Connect to OBD**. The local development API stores data in
`backend/obd-api/data` and uses the signed-in Firebase UID for local ownership.

Bluetooth native code is not available in Expo Go. Build and install the
development client after installing dependencies:

```sh
  npm run android:dev
  npm run ios:dev
```

`expo run:ios` requires macOS with Xcode. On Windows, create/install an iOS
  development build on macOS or through EAS Build, then use `npm start` to start
  both local APIs and serve the JavaScript bundle to that client. The BLE config plugin adds the iOS
Bluetooth usage text and Android BLE permissions. This BLE package requires
iOS 16.4 or newer and Android API 24 or newer.

This integration supports BLE ELM327-style adapters. Bluetooth Classic and
USB adapters are not supported by the BLE connector. The app requests Mode 03
trouble codes plus Mode 01 PIDs 0C, 0D, and 05; the backend catalogue and PID
coverage are documented in `backend/obd-api/README.md`.

The local API uses HTTP for same-network development. Production API endpoints
should use HTTPS.
# Sound diagnosis (local development)

The Diagnostic screen's sound recorder uploads its `.m4a` recording to the bundled Python service at `backend/sound-detection`. On first setup, run `scripts/setup-sound-detection.ps1` to create a private Python environment and install its requirements. Then run `npm start`; the launcher starts the sound API on port 8000 and waits for its trained model to pass `/health/ready` before starting Expo.

For the installed Android car-test APK, keep the phone connected over USB and run `scripts/start-car-test.ps1` after `npm start`. It forwards the sound API on port 8000 alongside the existing APIs. Sound predictions are estimates from the included training dataset and are not a confirmed mechanical diagnosis.
