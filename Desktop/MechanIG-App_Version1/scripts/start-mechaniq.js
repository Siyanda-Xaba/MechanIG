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
const apiUrl = process.env.MECHANIQ_PICTURE_SEARCH_HEALTH_URL ?? 'http://127.0.0.1:3001/health';
const expoCli = require.resolve('expo/bin/cli');
let apiProcess;
let expoProcess;

async function apiIsRunning() {
  try {
    return (await fetch(apiUrl,
      { signal: AbortSignal.timeout(1000) })).ok;
  }
  catch { return false; }
}
async function waitForApi() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await apiIsRunning()) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}
function stop() { expoProcess?.kill('SIGINT'); apiProcess?.kill('SIGINT'); }
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
async function main() {
  if (!await apiIsRunning()) {
    if (apiDirectory && fs.existsSync(apiDirectory)) {
      console.log('Starting MechanIQ picture-search service...');
      const bundledServer = path.join(apiDirectory, 'server.js');
      const command = fs.existsSync(bundledServer) ? process.execPath : (process.platform === 'win32' ? process.env.ComSpec : 'npm');
      const args = fs.existsSync(bundledServer) ? [bundledServer] : (process.platform === 'win32' ? ['/d', '/s', '/c', 'npm.cmd start'] : ['start']);
      apiProcess = spawn(command, args, { cwd: apiDirectory, stdio: 'inherit', env: process.env });
      reportSpawnError('the picture-search service', apiProcess);
      if (!await waitForApi()) throw new Error('Picture-search service did not start. Check its configuration.');
    } else {
      console.warn('Picture-search service is not configured; continuing with Expo. Set MECHANIQ_PICTURE_SEARCH_BACKEND_DIR to enable it.');
    }
  }
  console.log('Starting Expo Go...');
  const pictureSearchUrl = process.env.EXPO_PUBLIC_PICTURE_SEARCH_API_URL || `http://${getLanAddress()}:3001`;
  console.log(`Picture-search API for the app: ${pictureSearchUrl}`);
  expoProcess = spawn(process.execPath, [expoCli, 'start', '--go', ...process.argv.slice(2)], {
    cwd: appDirectory,
    stdio: 'inherit',
    env: { ...process.env, EXPO_PUBLIC_PICTURE_SEARCH_API_URL: pictureSearchUrl },
  });
  reportSpawnError('Expo', expoProcess);
  expoProcess.on('exit', (code) => { apiProcess?.kill('SIGINT'); process.exit(code ?? 0); });
}
process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
main().catch((error) => { console.error(error.message); stop(); process.exit(1); });
