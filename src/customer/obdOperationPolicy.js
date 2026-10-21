const policy = require('../../diagnostic-policy.json');

const ranges = new Set(policy.operations.readSupportedPidRange.allowedPids);
const livePids = new Set(Object.keys(policy.operations.readLivePid.allowedPids));

function buildApprovedDiagnosticRequest(operation, parameters = {}, sessionState) {
  if (sessionState !== 'connected') {
    throw new Error('A connected OBD session is required before a diagnostic request.');
  }
  if (!parameters || typeof parameters !== 'object' || Array.isArray(parameters)) {
    throw new Error('Diagnostic parameters must be an object.');
  }
  if (operation === 'readSupportedPidRange') {
    if (Object.keys(parameters).some((key) => key !== 'pid')) throw new Error('Unsupported diagnostic parameters were supplied.');
    if (!ranges.has(parameters.pid)) throw new Error('This supported-PID range is not allowed.');
    return { command: '01' + parameters.pid, responseService: '41', pid: parameters.pid, dataBytes: 4 };
  }
  if (operation === 'readLivePid') {
    if (Object.keys(parameters).some((key) => key !== 'pid')) throw new Error('Unsupported diagnostic parameters were supplied.');
    const pid = typeof parameters.pid === 'string' ? parameters.pid.toUpperCase() : '';
    if (!livePids.has(pid)) throw new Error('This live-data PID is not approved.');
    return {
      command: '01' + pid,
      responseService: '41',
      pid,
      dataBytes: policy.operations.readLivePid.allowedPids[pid].dataBytes,
    };
  }
  if (operation === 'readStoredEmissionDtcs' && Object.keys(parameters).length === 0) {
    return { command: '03', responseService: '43', pid: null, maxResponseBytes: policy.operations.readStoredEmissionDtcs.maxResponseBytes };
  }
  throw new Error('This diagnostic operation is not approved.');
}

function requireScanAuthorization(authorized) {
  if (authorized !== true) throw new Error('Confirm that you are authorized to scan this vehicle before connecting.');
}

function validateApprovedResponse(response, request) {
  if (typeof response !== 'string' || response.length > policy.limits.responseCharacters) {
    throw new Error('The adapter response is invalid or too large.');
  }
  const noDataResponse = response.replace(/SEARCHING\.\.\./gi, '').replace(/[>\r\n]/g, ' ').trim().toUpperCase();
  if (noDataResponse === 'NO DATA' || noDataResponse === request.command + ' NO DATA') return null;
  const cleaned = response
    .replace(/SEARCHING\.\.\./gi, '')
    .replace(/\bNO DATA\b/gi, '')
    .replace(/\bOK\b/gi, '')
    .replace(new RegExp(`(^|\\s)${request.command}(?=\\s|$)`, 'i'), ' ')
    .replace(/[\r\n\t>]/g, ' ')
    .trim();
  if (/STOPPED|UNABLE TO CONNECT|CAN ERROR|BUS INIT|\?/i.test(cleaned)) {
    throw new Error('The adapter or vehicle did not complete the approved read request.');
  }
  if (!/^[0-9A-F]{2}(?:\s+[0-9A-F]{2})*$/i.test(cleaned)) {
    throw new Error('The adapter response contains malformed diagnostic data.');
  }
  const bytes = cleaned.match(/[0-9A-F]{2}/gi)?.map((byte) => byte.toUpperCase()) || [];
  const index = bytes.findIndex((byte, position) =>
    byte === request.responseService && (request.pid == null || bytes[position + 1] === request.pid));
  if (index < 0) throw new Error('The adapter returned a response outside the approved diagnostic service.');
  const prefixLength = request.pid == null ? 1 : 2;
  const requiredLength = prefixLength + (request.dataBytes ?? 0);
  if (request.maxResponseBytes && bytes.length - index > request.maxResponseBytes) {
    throw new Error('The adapter returned an oversized diagnostic response.');
  }
  if (request.dataBytes != null && bytes.length - index !== requiredLength) {
    throw new Error('The adapter returned an incomplete diagnostic response.');
  }
  if (request.maxResponseBytes && ((bytes.length - index - 1) % 2 !== 0)) {
    throw new Error('The adapter returned malformed stored diagnostic data.');
  }
  return bytes.slice(index, request.dataBytes == null ? undefined : index + requiredLength).join(' ');
}

function getDiagnosticOperationList() {
  return Object.entries(policy.operations).map(([name, definition]) => ({ name, ...definition }));
}

module.exports = { buildApprovedDiagnosticRequest, validateApprovedResponse, getDiagnosticOperationList, requireScanAuthorization, obdDiagnosticPolicy: policy };
