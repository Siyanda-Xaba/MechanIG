const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const appDirectory = path.resolve(__dirname, '..');
const localEnvironmentPath = path.join(appDirectory, '.env.local');
if (fs.existsSync(localEnvironmentPath)) {
  for (const line of fs.readFileSync(localEnvironmentPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[2].startsWith('#') || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
const bundledApiDirectory = path.join(appDirectory, 'backend');
const apiDirectory = process.env.MECHANIQ_PICTURE_SEARCH_BACKEND_DIR || bundledApiDirectory;
const pictureSearchPort = process.env.PICTURE_SEARCH_PORT || '3002';
const obdApiPort = process.env.OBD_PORT || '5002';
const soundDetectionPort = process.env.SOUND_DETECTION_PORT || '8000';
const apiUrl = process.env.MECHANIQ_PICTURE_SEARCH_HEALTH_URL ?? `http://127.0.0.1:${pictureSearchPort}/health`;
const obdApiDirectory = path.join(appDirectory, 'backend', 'obd-api');
const obdApiHealthUrl = process.env.MECHANIQ_OBD_HEALTH_URL ?? `http://127.0.0.1:${obdApiPort}/health/ready`;
const soundDetectionDirectory = process.env.MECHANIQ_SOUND_DETECTION_BACKEND_DIR || path.join(appDirectory, 'backend', 'sound-detection');
const soundDetectionHealthUrl = process.env.MECHANIQ_SOUND_DETECTION_HEALTH_URL ?? `http://127.0.0.1:${soundDetectionPort}/health/ready`;
const expoCli = require.resolve('expo/bin/cli');
const serviceProcesses = [];
let expoProcess;

async function serviceIsRunning(url) {
  try {
    return (await fetch(url,
      { signal: AbortSignal.timeout(1000) })).ok;
  }
  catch { return false; }
}
async function waitForService(url, attempts = 30) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await serviceIsRunning(url)) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}
function stop() {
  expoProcess?.kill('SIGINT');
  for (const child of serviceProcesses) child.kill('SIGINT');
}
function reportSpawnError(name, process) {
  process.on('error', (error) => {
    console.error(`Unable to start ${name}: ${error.message}`);
  });
}
function getLanAddress() {
  const candidates = [];
  for (const [name, addresses] of Object.entries(os.networkInterfaces())) {
    for (const address of addresses || []) {
      const isIpv4 = address.family === 'IPv4' || address.family === 4;
      if (!isIpv4 || address.internal) continue;
      const virtual = /virtual|vethernet|docker|wsl|vmware|virtualbox/i.test(name);
      candidates.push({ address: address.address, score: virtual ? 0 : /wi-?fi|wireless|ethernet/i.test(name) ? 2 : 1 });
    }
  }
  candidates.sort((left, right) => right.score - left.score);
  return candidates[0]?.address || '127.0.0.1';
}
function getGradleOptions(buildPlatform) {
  const currentOptions = process.env.GRADLE_OPTS || '';
  if (buildPlatform !== 'android' || !process.env.JAVA_HOME) return currentOptions;

  try {
    const releaseFile = path.join(process.env.JAVA_HOME, 'release');
    const release = fs.readFileSync(releaseFile, 'utf8');
    const javaMajor = Number(release.match(/^JAVA_VERSION="(\d+)/m)?.[1]);
    if (javaMajor >= 24 && !currentOptions.includes('--enable-native-access')) {
      console.log(`Enabling Gradle native access for JDK ${javaMajor} Android builds.`);
      return `${currentOptions} --enable-native-access=ALL-UNNAMED`.trim();
    }
  } catch {
    // Keep the user's Gradle configuration unchanged if Java's release file is unavailable.
  }
  return currentOptions;
}
function getJavaToolOptions(buildPlatform) {
  const currentOptions = process.env.JAVA_TOOL_OPTIONS || '';
  if (buildPlatform !== 'android' || !process.env.JAVA_HOME) return currentOptions;

  try {
    const releaseFile = path.join(process.env.JAVA_HOME, 'release');
    const release = fs.readFileSync(releaseFile, 'utf8');
    const javaMajor = Number(release.match(/^JAVA_VERSION="(\d+)/m)?.[1]);
    if (javaMajor >= 24 && !currentOptions.includes('--enable-native-access')) {
      return `${currentOptions} --enable-native-access=ALL-UNNAMED`.trim();
    }
  } catch {
    // Keep the user's Java configuration unchanged if Java's release file is unavailable.
  }
  return currentOptions;
}
async function main() {
  const launchArgs = process.argv.slice(2);
  const buildPlatform = launchArgs.includes('--build-android') ? 'android' :
    launchArgs.includes('--build-ios') ? 'ios' : null;
  const expoArgs = launchArgs.filter((arg) => arg !== '--build-android' && arg !== '--build-ios');
  const isWebLaunch = expoArgs.includes('--web');
  if (!await serviceIsRunning(apiUrl)) {
    if (apiDirectory && fs.existsSync(apiDirectory)) {
      console.log('Starting MechanIQ picture-search service...');
      const bundledServer = path.join(apiDirectory, 'server.js');
      const command = fs.existsSync(bundledServer) ? process.execPath : (process.platform === 'win32' ? process.env.ComSpec : 'npm');
      const args = fs.existsSync(bundledServer) ? [bundledServer] : (process.platform === 'win32' ? ['/d', '/s', '/c', 'npm.cmd start'] : ['start']);
      const child = spawn(command, args, {
        cwd: apiDirectory,
        stdio: 'inherit',
        env: {
          ...process.env,
          PICTURE_SEARCH_HOST: process.env.PICTURE_SEARCH_HOST || '0.0.0.0',
          PICTURE_SEARCH_PORT: pictureSearchPort,
        },
      });
      serviceProcesses.push(child);
      reportSpawnError('the picture-search service', child);
      if (!await waitForService(apiUrl)) throw new Error('Picture-search service did not start. Check its configuration.');
    } else {
      console.warn('Picture-search service is not configured; continuing with Expo. Set MECHANIQ_PICTURE_SEARCH_BACKEND_DIR to enable it.');
    }
  }
  if (!await serviceIsRunning(obdApiHealthUrl)) {
    console.log('Starting MechanIQ OBD diagnostics API...');
    const obdProcess = spawn(process.execPath, [path.join(obdApiDirectory, 'server.js')], {
      cwd: obdApiDirectory,
      stdio: 'inherit',
      env: {
        ...process.env,
        HOST: process.env.OBD_HOST || '0.0.0.0',
        PORT: obdApiPort,
        OBD_STORAGE: process.env.OBD_STORAGE || 'local',
        OBD_AUTH_MODE: process.env.OBD_AUTH_MODE || 'development',
      },
    });
    serviceProcesses.push(obdProcess);
    reportSpawnError('the OBD diagnostics API', obdProcess);
    if (!await waitForService(obdApiHealthUrl)) throw new Error('OBD diagnostics API did not start. Check the backend logs.');
  }
  if (!await serviceIsRunning(soundDetectionHealthUrl)) {
    if (!fs.existsSync(path.join(soundDetectionDirectory, 'src', 'api.py'))) {
      throw new Error(`Sound detection backend is missing: ${soundDetectionDirectory}`);
    }
    const soundPython = process.env.MECHANIQ_SOUND_PYTHON || 'python';
    const soundProcess = spawn(soundPython, [
      '-m', 'uvicorn', 'src.api:app', '--host', '0.0.0.0', '--port', soundDetectionPort,
    ], {
      cwd: soundDetectionDirectory,
      stdio: 'inherit',
      env: { ...process.env },
    });
    serviceProcesses.push(soundProcess);
    reportSpawnError('the sound-detection service', soundProcess);
    if (!await waitForService(soundDetectionHealthUrl, 120)) {
      throw new Error('Sound detection API did not become ready. Confirm the trained model and Python dependencies are installed.');
    }
  }
  console.log(buildPlatform ? `Building and starting the ${buildPlatform} app...` : 'Starting Expo development client...');
  const pictureSearchUrl = process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL || `http://${getLanAddress()}:${pictureSearchPort}`;
  const messagingApiUrl = process.env.EXPO_PUBLIC_MESSAGING_API_URL || `${pictureSearchUrl}/api/v1/messaging`;
  const fuelDeliveryApiUrl = process.env.EXPO_PUBLIC_FUEL_DELIVERY_API_URL || `${pictureSearchUrl}/api/v1/fuel-deliveries`;
  const obdApiUrl = process.env.EXPO_PUBLIC_OBD_API_URL || `http://${getLanAddress()}:${obdApiPort}`;
  const soundDiagnosisApiUrl = process.env.EXPO_PUBLIC_SOUND_DIAGNOSIS_API_URL || `http://${getLanAddress()}:${soundDetectionPort}`;
  console.log(`Picture-search API for the app: ${pictureSearchUrl}`);
  console.log(`Messaging API for the app: ${messagingApiUrl}`);
  console.log(`Fuel delivery API for the app: ${fuelDeliveryApiUrl}`);
  console.log(`OBD diagnostics API for the app: ${obdApiUrl}`);
  console.log(`Sound diagnosis API for the app: ${soundDiagnosisApiUrl}`);
  const expoCommandArgs = buildPlatform
    ? ['run', buildPlatform, ...expoArgs]
    : ['start', ...(isWebLaunch ? [] : ['--dev-client']), ...expoArgs];
  expoProcess = spawn(process.execPath, [expoCli, ...expoCommandArgs], {
    cwd: appDirectory,
    stdio: 'inherit',
    env: {
      ...process.env,
      GRADLE_OPTS: getGradleOptions(buildPlatform),
      JAVA_TOOL_OPTIONS: getJavaToolOptions(buildPlatform),
      EXPO_PUBLIC_PICTURE_SEARCH_API_URL: pictureSearchUrl,
      EXPO_PUBLIC_MESSAGING_API_URL: messagingApiUrl,
      EXPO_PUBLIC_FUEL_DELIVERY_API_URL: fuelDeliveryApiUrl,
      EXPO_PUBLIC_OBD_API_URL: obdApiUrl,
      EXPO_PUBLIC_SOUND_DIAGNOSIS_API_URL: soundDiagnosisApiUrl,
    },
  });
  reportSpawnError('Expo', expoProcess);
  expoProcess.on('exit', (code) => { stop(); process.exit(code ?? 0); });
}
process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
main().catch((error) => { console.error(error.message); stop(); process.exit(1); });
