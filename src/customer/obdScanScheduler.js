const policy = require('../../diagnostic-policy.json');

function createPidReadQueue({ read, normalize, isCancelled, maxConsecutiveFailures = policy.limits.maximumConsecutivePidFailures }) {
  const failures = new Map();

  async function readPids(pids) {
    const rawResponses = [];
    const unavailablePids = [];
    for (const pid of pids) {
      if (isCancelled()) break;
      if ((failures.get(pid) || 0) >= maxConsecutiveFailures) {
        unavailablePids.push(pid);
        continue;
      }
      try {
        const response = await read(pid);
        if (isCancelled()) break;
        const normalized = response ? normalize(response, pid) : null;
        if (normalized) {
          rawResponses.push(normalized);
          failures.delete(pid);
        } else {
          unavailablePids.push(pid);
          failures.set(pid, (failures.get(pid) || 0) + 1);
        }
      } catch (error) {
        if (isCancelled()) break;
        if (error?.code !== 'OBD_REQUEST_TIMEOUT') throw error;
        unavailablePids.push(pid);
        failures.set(pid, (failures.get(pid) || 0) + 1);
      }
    }
    return { rawResponses, unavailablePids };
  }

  return { readPids };
}

module.exports = { createPidReadQueue };
