const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildApprovedDiagnosticRequest,
  validateApprovedResponse,
  requireScanAuthorization,
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
  assert.throws(() => validateApprovedResponse('41 0C 1A', rpm), /incomplete/);
  assert.throws(() => validateApprovedResponse('44 0C 1A F8', rpm), /outside the approved/);
  assert.equal(validateApprovedResponse('NO DATA>', rpm), null);
  assert.throws(() => validateApprovedResponse('41 0C 1A F8 00', rpm), /incomplete/);
  assert.throws(() => validateApprovedResponse('adapter says 41 0C 1A F8', rpm), /malformed/);
  assert.throws(
    () => validateApprovedResponse('A'.repeat(obdDiagnosticPolicy.limits.responseCharacters + 1), rpm),
    /invalid or too large/,
  );
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
