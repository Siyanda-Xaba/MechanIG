import { startObdLiveSession } from './obdBleService';
import { saveObdScan } from './obdApiService';

export async function startCustomerDiagnosticScan(request, callbacks = {}) {
  const liveSession = await startObdLiveSession({ ...callbacks, authorized: request.authorized === true });
  try {
    const firstReadings = await liveSession.firstReadings;
    let savedScan = null;
    try {
      savedScan = await saveObdScan(request.vehicle, {
        adapterName: liveSession.adapterName,
        rawDtcResponse: liveSession.rawDtcResponse,
        rawResponses: firstReadings.rawResponses,
        unsupportedPids: firstReadings.unsupportedPids,
      });
    } catch (saveError) {
      console.warn('Scan history could not be saved to backend API (offline or unreachable):', saveError?.message || saveError);
    }
    return {
      status: 'ready',
      resultId: savedScan?.id ?? null,
      adapterName: liveSession.adapterName,
      dtcProblems: savedScan?.interpretation?.problems ?? [],
      liveSession,
      message: `Connected to ${liveSession.adapterName}. Live readings are updating until you stop the connection.${savedScan ? '' : ' (Local car live mode)'}`,
    };
  } catch (error) {
    await liveSession.stop();
    throw error;
  }
}
