const { spawn } = require('node:child_process');
const path = require('node:path');

const appDirectory = path.resolve(__dirname, '..');
const apiDirectory = 'C:\\Users\\Xsiya\\OneDrive\\Desktop\\MechanIG-search-with-picture\\backend';
const apiUrl = 'http://127.0.0.1:3001/health';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
let apiProcess;
let expoProcess;

async function apiIsRunning() {
  try { return (await fetch(apiUrl, { signal: AbortSignal.timeout(1000) })).ok; }
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
async function main() {
  if (!await apiIsRunning()) {
    console.log('Starting MechanIQ picture-search service...');
    apiProcess = spawn(npm, ['start'], { cwd: apiDirectory, stdio: 'inherit', shell: process.platform === 'win32' });
    if (!await waitForApi()) throw new Error('Picture-search service did not start. Check its .env configuration.');
  }
  console.log('Starting Expo Go...');
  expoProcess = spawn(npx, ['expo', 'start', '--go', ...process.argv.slice(2)], { cwd: appDirectory, stdio: 'inherit', shell: process.platform === 'win32' });
  expoProcess.on('exit', (code) => { apiProcess?.kill('SIGINT'); process.exit(code ?? 0); });
}
process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
main().catch((error) => { console.error(error.message); stop(); process.exit(1); });