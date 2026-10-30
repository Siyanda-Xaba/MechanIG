const fs = require('node:fs');
const { spawn } = require('node:child_process');
const path = require('node:path');

const appDirectory = path.resolve(__dirname, '..');
const apiDirectory = process.env.MECHANIQ_BACKEND_DIR || path.resolve(appDirectory, '..', 'backend');
const configuredApiUrl = process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL || 'http://127.0.0.1:3001';
const healthUrl = configuredApiUrl.replace(/\/$/, '') + '/health';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
let apiProcess;
let expoProcess;

async function apiIsRunning() {
  try {
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForApi() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (await apiIsRunning()) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

function stop() {
  expoProcess?.kill('SIGINT');
  apiProcess?.kill('SIGINT');
}

async function main() {
  const isRunning = await apiIsRunning();
  if (isRunning) {
    console.log(`Backend service is already running at ${configuredApiUrl}`);
  } else if (fs.existsSync(apiDirectory)) {
    console.log(`Starting backend service from ${apiDirectory}...`);
    try {
      apiProcess = spawn(npm, ['start'], { cwd: apiDirectory, stdio: 'inherit', shell: process.platform === 'win32' });
      const ready = await waitForApi();
      if (!ready) {
        console.warn('Backend service did not respond on /health yet, proceeding with Expo...');
      }
    } catch (err) {
      console.warn(`Could not start backend service: ${err.message}. Proceeding with Expo...`);
    }
  } else {
    console.log(`Local backend folder not found at ${apiDirectory}. Running Expo with configured API URL (${configuredApiUrl}).`);
  }

  console.log('Starting Expo...');
  expoProcess = spawn(npx, ['expo', 'start', ...process.argv.slice(2)], {
    cwd: appDirectory,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  expoProcess.on('exit', (code) => {
    apiProcess?.kill('SIGINT');
    process.exit(code ?? 0);
  });
}

process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
main().catch((error) => {
  console.error(error.message);
  stop();
  process.exit(1);
});