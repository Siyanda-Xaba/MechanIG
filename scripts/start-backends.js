const { spawn } = require('node:child_process');
const fs = require('node:fs');
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

const pictureSearchPort = process.env.PICTURE_SEARCH_PORT || '3002';
const obdApiPort = process.env.OBD_PORT || '5002';
const soundDetectionPort = process.env.SOUND_DETECTION_PORT || '8000';

const pictureSearchDir = path.join(appDirectory, 'backend');
const obdApiDirectory = path.join(appDirectory, 'backend', 'obd-api');
const soundDetectionDirectory = path.join(appDirectory, 'backend', 'sound-detection');

const pictureHealthUrl = `http://127.0.0.1:${pictureSearchPort}/health`;
const obdHealthUrl = `http://127.0.0.1:${obdApiPort}/health/ready`;
const soundHealthUrl = `http://127.0.0.1:${soundDetectionPort}/health/ready`;

async function serviceIsRunning(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForService(url, name, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await serviceIsRunning(url)) {
      console.log(`[READY] ${name} is responsive at ${url}`);
      return true;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error(`[TIMEOUT] ${name} failed to respond at ${url}`);
  return false;
}

const children = [];

function cleanup() {
  console.log('Shutting down background services...');
  for (const child of children) {
    try {
      child.kill('SIGINT');
    } catch {}
  }
}

process.on('SIGINT', () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

async function main() {
  // 1. Picture search
  if (await serviceIsRunning(pictureHealthUrl)) {
    console.log(`Picture search is already running on port ${pictureSearchPort}`);
  } else {
    console.log(`Starting Picture Search API on port ${pictureSearchPort}...`);
    const proc = spawn(process.execPath, [path.join(pictureSearchDir, 'server.js')], {
      cwd: pictureSearchDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        PICTURE_SEARCH_HOST: '0.0.0.0',
        PICTURE_SEARCH_PORT: pictureSearchPort,
      },
    });
    children.push(proc);
    proc.on('error', (err) => console.error('Picture search error:', err.message));
  }

  // 2. OBD API
  if (await serviceIsRunning(obdHealthUrl)) {
    console.log(`OBD API is already running on port ${obdApiPort}`);
  } else {
    console.log(`Starting OBD API on port ${obdApiPort}...`);
    const proc = spawn(process.execPath, [path.join(obdApiDirectory, 'server.js')], {
      cwd: obdApiDirectory,
      stdio: 'inherit',
      env: {
        ...process.env,
        HOST: '0.0.0.0',
        PORT: obdApiPort,
        OBD_STORAGE: process.env.OBD_STORAGE || 'local',
        OBD_AUTH_MODE: process.env.OBD_AUTH_MODE || 'development',
      },
    });
    children.push(proc);
    proc.on('error', (err) => console.error('OBD API error:', err.message));
  }

  // 3. Sound detection
  if (await serviceIsRunning(soundHealthUrl)) {
    console.log(`Sound detection API is already running on port ${soundDetectionPort}`);
  } else {
    console.log(`Starting Sound Detection API on port ${soundDetectionPort}...`);
    const soundPython = process.env.MECHANIQ_SOUND_PYTHON || 'python';
    const proc = spawn(soundPython, [
      '-m', 'uvicorn', 'src.api:app', '--host', '0.0.0.0', '--port', soundDetectionPort,
    ], {
      cwd: soundDetectionDirectory,
      stdio: 'inherit',
      env: { ...process.env },
    });
    children.push(proc);
    proc.on('error', (err) => console.error('Sound detection error:', err.message));
  }

  const [pOk, oOk, sOk] = await Promise.all([
    waitForService(pictureHealthUrl, 'Picture Search', 20),
    waitForService(obdHealthUrl, 'OBD API', 20),
    waitForService(soundHealthUrl, 'Sound Detection', 80),
  ]);

  if (pOk && oOk && sOk) {
    console.log('ALL THREE BACKEND SERVICES ARE OPERATIONAL AND LISTENING ON 0.0.0.0');
  } else {
    console.warn('Some services failed to report ready.');
  }

  // Keep process alive
  await new Promise(() => {});
}

main().catch((err) => {
  console.error('Fatal error in start-backends:', err);
  cleanup();
  process.exit(1);
});
