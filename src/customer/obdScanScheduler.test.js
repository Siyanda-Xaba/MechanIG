const assert = require('node:assert/strict');
const test = require('node:test');
const { createPidReadQueue } = require('./obdScanScheduler');

test('a cancelled sequential scan sends no later queued PID requests', async () => {
  let cancelled = false;
  const requested = [];
  const queue = createPidReadQueue({
    read: async (pid) => { requested.push(pid); cancelled = true; return `41 ${pid} 01`; },
    normalize: (response) => response,
    isCancelled: () => cancelled,
  });
  await queue.readPids(['04', '05', '0C']);
  assert.deepEqual(requested, ['04']);
});

test('a timed-out PID is unavailable while the queue continues other approved PIDs', async () => {
  const requested = [];
  const queue = createPidReadQueue({
    read: async (pid) => {
      requested.push(pid);
      if (pid === '04') { const error = new Error('timeout'); error.code = 'OBD_REQUEST_TIMEOUT'; throw error; }
      return `41 ${pid} 01`;
    },
    normalize: (response) => response,
    isCancelled: () => false,
  });
  const result = await queue.readPids(['04', '05']);
  assert.deepEqual(requested, ['04', '05']);
  assert.deepEqual(result.unavailablePids, ['04']);
  assert.deepEqual(result.rawResponses, ['41 05 01']);
});

test('repeated timeout failures stop requests for that PID after the configured limit', async () => {
  let attempts = 0;
  const queue = createPidReadQueue({
    read: async () => { attempts += 1; const error = new Error('timeout'); error.code = 'OBD_REQUEST_TIMEOUT'; throw error; },
    normalize: (response) => response,
    isCancelled: () => false,
  });
  for (let index = 0; index < 6; index += 1) await queue.readPids(['04']);
  assert.equal(attempts, 3);
  assert.deepEqual((await queue.readPids(['04'])).unavailablePids, ['04']);
});

test('connection failures stop the request queue instead of retrying or falling through', async () => {
  const requested = [];
  const queue = createPidReadQueue({
    read: async (pid) => { requested.push(pid); throw new Error('disconnected'); },
    normalize: (response) => response,
    isCancelled: () => false,
  });
  await assert.rejects(queue.readPids(['04', '05']), /disconnected/);
  assert.deepEqual(requested, ['04']);
});
