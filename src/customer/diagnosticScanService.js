import { startObdLiveSession } from './obdBleService';
import { saveObdScan } from './obdApiService';

export async function startCustomerDiagnosticScan(request, callbacks = {}) {
  const liveSession = await startObdLiveSession({ ...callbacks, authorized: request.authorized === true });
  try {
    const firstReadings = await liveSession.firstReadings;
    const savedScan = await saveObdScan(request.vehicle, {
      adapterName: liveSession.adapterName,
      rawDtcResponse: liveSession.rawDtcResponse,
      rawResponses: firstReadings.rawResponses,
      unsupportedPids: firstReadings.unsupportedPids,
    });
    return {
      status: 'ready',
      resultId: savedScan.id,
      adapterName: liveSession.adapterName,
      dtcProblems: savedScan.interpretation?.problems ?? [],
      liveSession,
      message: `Connected to ${liveSession.adapterName}. Live readings are updating until you stop the connection.`,
    };
  } catch (error) {
    await liveSession.stop();
    throw error;
  }
}
