const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildApprovedDiagnosticRequest,
  validateApprovedResponse,
  requireScanAuthorization,
  isProtocolNegotiationFailure,
  negotiateSupportedPidRange,
  OBD_PROTOCOL_ATTEMPTS,
  obdDiagnosticPolicy,
} = require('./obdOperationPolicy');

test('allows only approved read operations and PID parameters', () => {
  assert.equal(buildApprovedDiagnosticRequest('readLivePid', { pid: '0C' }, 'connected').command, '010C');
  assert.equal(buildApprovedDiagnosticRequest('readStoredEmissionDtcs', {}, 'connected').command, '03');
  assert.equal(buildApprovedDiagnosticRequest('readSupportedPidRange', { pid: '20' }, 'connected').command, '0120');
  assert.throws(() => buildApprovedDiagnosticRequest('sendRawCommand', { command: '04' }, 'connected'));
  assert.throws(() => buildApprovedDiagnosticRequest('readLivePid', { pid: '0C;04' }, 'connected'));
  assert.throws(() => buildApprovedDiagnosticRequest('readLivePid', { pid: '99' }, 'connected'));
  assert.throws(() => buildApprovedDiagnosticRequest('readSupportedPidRange', { pid: '60' }, 'connected'));
  assert.throws(() => buildApprovedDiagnosticRequest('readLivePid', { pid: '0C' }, 'disconnected'));
  assert.throws(() => buildApprovedDiagnosticRequest('readStoredEmissionDtcs', { pid: '00' }, 'connected'));
});

test('validates expected service, PID, byte count, and bounded responses', () => {
  const rpm = buildApprovedDiagnosticRequest('readLivePid', { pid: '0C' }, 'connected');
  assert.equal(validateApprovedResponse('010C\r41 0C 1A F8>', rpm), '41 0C 1A F8');
  assert.equal(validateApprovedResponse('SEARCHING...\rBUS INIT: OK\r41 0C 1A F8>', rpm), '41 0C 1A F8');
  assert.equal(validateApprovedResponse('SEARCHING...\r010C\rNO DATA>', rpm), null);
  assert.equal(validateApprovedResponse('SEARCHING...>', rpm), null);
  assert.throws(() => validateApprovedResponse('41 0C 1A', rpm), /incomplete/);
  assert.throws(() => validateApprovedResponse('44 0C 1A F8', rpm), /outside the approved/);
  assert.equal(validateApprovedResponse('NO DATA>', rpm), null);
  assert.throws(() => validateApprovedResponse('41 0C 1A F8 00', rpm), /incomplete/);
  assert.equal(validateApprovedResponse('41 0C 1A F8 41 0C 1A F9>', rpm), '41 0C 1A F8');
  assert.throws(() => validateApprovedResponse('41 0C 1A F8 22 00 00 00>', rpm), /incomplete/);
  assert.throws(() => validateApprovedResponse('adapter says 41 0C 1A F8', rpm), /malformed/);
  assert.throws(
    () => validateApprovedResponse('A'.repeat(obdDiagnosticPolicy.limits.responseCharacters + 1), rpm),
    /invalid or too large/,
  );

  const dtcReq = buildApprovedDiagnosticRequest('readStoredEmissionDtcs', {}, 'connected');
  assert.equal(validateApprovedResponse('43 00>', dtcReq), '43 00');
  assert.equal(validateApprovedResponse('03\r43 01 03 00 00 00>', dtcReq), '43 01 03 00 00 00');
  assert.equal(validateApprovedResponse('43 03 00 04 20>', dtcReq), '43 03 00 04 20');
});

test('ELM protocol failures are retryable and expose the full standard protocol list', () => {
  for (const response of ['ERROR>', 'BUFFER FULL>', 'BUS BUSY>', 'CAN ERROR>', 'UNABLE TO CONNECT>']) {
    assert.throws(
      () => validateApprovedResponse(response, buildApprovedDiagnosticRequest('readSupportedPidRange', { pid: '00' }, 'connected')),
      (error) => error.code === 'OBD_PROTOCOL_NEGOTIATION' && isProtocolNegotiationFailure(error),
    );
  }
  assert.equal(isProtocolNegotiationFailure(new Error('The adapter returned malformed diagnostic data.')), false);
  assert.deepEqual(OBD_PROTOCOL_ATTEMPTS, [null, 'ATSP6', 'ATSP7', 'ATSP8', 'ATSP9', 'ATSP3', 'ATSP4', 'ATSP5', 'ATSP1', 'ATSP2']);
});

test('protocol negotiation continues after NO DATA and retryable adapter protocol errors', async () => {
  const attempted = [];
  let request = 0;
  const result = await negotiateSupportedPidRange({
    attempts: [null, 'ATSP6', 'ATSP7'],
    setProtocol: async (protocol) => { attempted.push(protocol); },
    readSupportedPidRange: async () => {
      request += 1;
      if (request === 1) return null; // ELM returned NO DATA.
      if (request === 2) {
        const error = new Error('The adapter could not complete ECU communication (BUFFER FULL).');
        error.code = 'OBD_PROTOCOL_NEGOTIATION';
        throw error;
      }
      return '41 00 98 18 00 00';
    },
  });
  assert.deepEqual(attempted, ['ATSP6', 'ATSP7']);
  assert.equal(result.response, '41 00 98 18 00 00');
});

test('protocol negotiation stops on malformed data and cancels before another ECU request', async () => {
  let requestCount = 0;
  await assert.rejects(
    negotiateSupportedPidRange({
      attempts: [null, 'ATSP6'],
      readSupportedPidRange: async () => {
        requestCount += 1;
        throw new Error('The adapter returned malformed diagnostic data.');
      },
    }),
    /malformed/,
  );
  assert.equal(requestCount, 1);

  let cancelled = false;
  let requestsBeforeCancel = 0;
  await assert.rejects(
    negotiateSupportedPidRange({
      attempts: [null, 'ATSP6'],
      isCancelled: () => cancelled,
      readSupportedPidRange: async () => { requestsBeforeCancel += 1; cancelled = true; return null; },
    }),
    { name: 'AbortError' },
  );
  assert.equal(requestsBeforeCancel, 1);
});

test('an exhausted NO DATA search retains its adapter result for a useful final error', async () => {
  const result = await negotiateSupportedPidRange({
    attempts: [null, 'ATSP6'],
    readSupportedPidRange: async () => null,
  });
  assert.equal(result.response, null);
  assert.equal(result.lastError.adapterResponse, 'NO DATA or empty response');
});

test('protocol search stops after consecutive silent ECU request timeouts', async () => {
  let requests = 0;
  const result = await negotiateSupportedPidRange({
    attempts: [null, 'ATSP6', 'ATSP7', 'ATSP8'],
    readSupportedPidRange: async () => {
      requests += 1;
      const error = new Error('The adapter request timed out.');
      error.code = 'OBD_REQUEST_TIMEOUT';
      throw error;
    },
  });
  assert.equal(requests, 2);
  assert.equal(result.response, null);
  assert.equal(result.lastError.code, 'OBD_REQUEST_TIMEOUT');
});

test('rejects restricted operations, raw command injection, and extra parameters', () => {
  for (const operation of ['clearCodes', 'ecuReset', 'activeTest', 'securityAccess', 'manufacturerService']) {
    assert.throws(() => buildApprovedDiagnosticRequest(operation, { command: '04' }, 'connected'));
  }
  assert.throws(() => buildApprovedDiagnosticRequest('readLivePid', { pid: '0C', command: '04' }, 'connected'));
  assert.throws(() => buildApprovedDiagnosticRequest('readLivePid', { pid: '0C' }, 'disconnected'));
});

test('requires explicit scan authorization', () => {
  assert.throws(() => requireScanAuthorization(false), /authorized/);
  assert.throws(() => requireScanAuthorization(undefined), /authorized/);
  assert.doesNotThrow(() => requireScanAuthorization(true));
});
