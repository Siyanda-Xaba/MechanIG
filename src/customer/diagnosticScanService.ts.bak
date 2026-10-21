import {
  DiagnosticScanRequest,
  DiagnosticScanStartResult,
} from './diagnosticScanTypes'

export async function startCustomerDiagnosticScan(
  request: DiagnosticScanRequest
): Promise<DiagnosticScanStartResult> {
  // This service is intentionally separate from
  // getCustomerDiagnosticsData().
  //
  // Refreshing diagnostics data is NOT the same thing as
  // performing a new vehicle scan.
  //
  // Later this function will delegate to the dedicated OBD
  // layer, which will be responsible for:
  // - BLE/device connection
  // - capability discovery
  // - read-only PID requests
  // - authoritative sensor readings
  // - scan lifecycle/error handling
  //
  // AI may interpret readings returned by that layer, but
  // must never fabricate sensor values.

  void request.vehicleId
  void request.source

  // No OBD device is currently connected in the
  // development frontend, so we must not manufacture
  // a successful scan or diagnostic result.
  return {
    status: 'obd-not-connected',
    resultId: null,
    message:
      'Connect a supported OBD device before starting a vehicle scan.',
  }
}