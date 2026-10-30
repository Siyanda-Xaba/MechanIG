const policy = require('../../diagnostic-policy.json');

const ranges = new Set(policy.operations.readSupportedPidRange.allowedPids);
const livePids = new Set(Object.keys(policy.operations.readLivePid.allowedPids));
const OBD_PROTOCOL_ATTEMPTS = Object.freeze([
  null, // ELM327 automatic detection
  'ATSP6', 'ATSP7', 'ATSP8', 'ATSP9', // ISO 15765-4 CAN
  'ATSP3', 'ATSP4', 'ATSP5', // ISO 9141-2 and ISO 14230-4 KWP
  'ATSP1', 'ATSP2', // SAE J1850
]);

function isProtocolNegotiationFailure(error) {
  const message = typeof error === 'string' ? error : error?.message || '';
  return error?.code === 'OBD_PROTOCOL_NEGOTIATION'
    || error?.code === 'OBD_REQUEST_TIMEOUT'
    || /CAN ERROR|CAN bus communication error|UNABLE TO CONNECT|BUS INIT|could not reach the car's computer|NO DATA|NO RESPONSE|TIMEOUT|timed out|STOPPED|communication was interrupted/i.test(message);
}

function protocolError(message, adapterResponse) {
  const error = new Error(message);
  error.code = 'OBD_PROTOCOL_NEGOTIATION';
  if (adapterResponse) error.adapterResponse = adapterResponse;
  return error;
}

async function negotiateSupportedPidRange({
  attempts = OBD_PROTOCOL_ATTEMPTS,
  setProtocol = async () => {},
  readSupportedPidRange,
  isCancelled = () => false,
  onProtocol = () => {},
}) {
  let lastError = null;
  let consecutiveTimeouts = 0;
  for (const protocol of attempts) {
    if (isCancelled()) {
      const error = new Error('The OBD protocol search was cancelled.');
      error.name = 'AbortError';
      throw error;
    }
    if (protocol) {
      onProtocol(protocol);
      try {
        await setProtocol(protocol);
      } catch (error) {
        if (isCancelled()) throw error;
        // The following ECU request determines whether this protocol works.
      }
    }
    try {
      const response = await readSupportedPidRange();
      if (response) return { response, lastError };
      lastError = protocolError('The ECU returned no supported-PID response.', 'NO DATA or empty response');
      consecutiveTimeouts = 0;
    } catch (error) {
      lastError = error;
      if (!isProtocolNegotiationFailure(error)) throw error;
      consecutiveTimeouts = error?.code === 'OBD_REQUEST_TIMEOUT' ? consecutiveTimeouts + 1 : 0;
      // A silent adapter is usually a transport/device problem, not a reason
      // to wait through every remaining vehicle protocol timeout.
      if (consecutiveTimeouts >= 2) break;
    }
  }
  return { response: null, lastError };
}

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
  const echoedCommand = new RegExp(`^\\s*${request.command}\\b`, 'i');
  const noDataResponse = response
    .replace(/SEARCHING\.\.\./gi, '')
    .replace(/[>\r\n]/g, ' ')
    .replace(echoedCommand, '')
    .replace(/\bNO DATA\b/gi, '')
    .replace(/BUS\s*INIT:\s*(?:OK|\.\.\.)/gi, '')
    .replace(/\bOK\b/gi, '')
    .trim();
  if (!noDataResponse) return null;
  let cleaned = response
    .replace(/SEARCHING\.\.\./gi, '')
    .replace(/\bNO DATA\b/gi, '');

  // Strip echoed command only from the start of the response string
  const cmdRegex = new RegExp(`^\\s*${request.command}\\b|^\\s*${request.command.split('').join('\\s*')}\\b`, 'i');
  cleaned = cleaned.replace(cmdRegex, ' ');

  // Allow successful bus init status messages from ELM327 without false-positive error
  cleaned = cleaned.replace(/BUS\s*INIT:\s*(?:OK|\.\.\.)/gi, ' ');
  cleaned = cleaned.replace(/\bOK\b/gi, '');
  cleaned = cleaned.replace(/[\r\n\t>]/g, ' ').trim();

  if (/STOPPED|UNABLE TO CONNECT|CAN ERROR|BUS INIT:?\s*ERROR|BUS BUSY|BUFFER FULL|DATA ERROR|FB ERROR|\bERROR\b|\?/i.test(cleaned)) {
    const token = cleaned.match(/STOPPED|UNABLE TO CONNECT|CAN ERROR|BUS INIT:?\s*ERROR|BUS BUSY|BUFFER FULL|DATA ERROR|FB ERROR|\bERROR\b|\?/i)?.[0] || 'ECU communication error';
    if (/STOPPED/i.test(token)) {
      throw protocolError('Vehicle communication was interrupted while reading the ECU.', token);
    }
    if (/UNABLE TO CONNECT|BUS INIT/i.test(token)) {
      throw protocolError('The adapter could not initialize communication with the vehicle ECU.', token);
    }
    if (/CAN ERROR/i.test(token)) {
      throw protocolError('The adapter reported a CAN bus initialization error while contacting the vehicle ECU.', token);
    }
    throw protocolError(`The adapter could not complete ECU communication (${token}).`, token);
  }

  // Strip any remaining harmless bus init text before hex validation
  cleaned = cleaned.replace(/BUS\s*INIT[^\r\n]*/gi, '').trim();

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
  const responseLength = bytes.length - index;
  if (request.dataBytes != null && responseLength < requiredLength) {
    throw new Error('The adapter returned an incomplete diagnostic response.');
  }
  if (request.dataBytes != null && responseLength > requiredLength) {
    const extraLength = responseLength - requiredLength;
    const repeatedFrames = extraLength % requiredLength === 0
      && Array.from({ length: extraLength / requiredLength }, (_, frameIndex) => {
        const frameStart = index + requiredLength * (frameIndex + 1);
        return bytes[frameStart] === request.responseService
          && (request.pid == null || bytes[frameStart + 1] === request.pid);
      }).every(Boolean);
    if (!repeatedFrames) throw new Error('The adapter returned an incomplete diagnostic response.');
  }
  if (request.maxResponseBytes && bytes.length - index < 2) {
    throw new Error('The adapter returned an incomplete diagnostic response.');
  }
  return bytes.slice(index, request.dataBytes == null ? undefined : index + requiredLength).join(' ');
}

function getDiagnosticOperationList() {
  return Object.entries(policy.operations).map(([name, definition]) => ({ name, ...definition }));
}

module.exports = {
  buildApprovedDiagnosticRequest,
  validateApprovedResponse,
  getDiagnosticOperationList,
  requireScanAuthorization,
  isProtocolNegotiationFailure,
  negotiateSupportedPidRange,
  OBD_PROTOCOL_ATTEMPTS,
  obdDiagnosticPolicy: policy,
};
