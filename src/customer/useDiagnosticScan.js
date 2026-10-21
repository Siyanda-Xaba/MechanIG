import { useCallback, useEffect, useRef, useState } from 'react';
import { startCustomerDiagnosticScan } from './diagnosticScanService';
import { useVehicle } from '../vehicles/VehicleContext';

export function useDiagnosticScan() {
  const { selectedVehicle } = useVehicle();
  const [scanResult, setScanResult] = useState(null);
  const [isStartingScan, setIsStartingScan] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveReadings, setLiveReadings] = useState([]);
  const [liveCapturedAt, setLiveCapturedAt] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [connectionState, setConnectionState] = useState('idle');
  const [currentOperation, setCurrentOperation] = useState(null);
  const sessionRef = useRef(null);
  const pendingAbortRef = useRef(null);
  const mountedRef = useRef(true);
  const vehicleId = selectedVehicle?.id ?? null;

  const stopLive = useCallback(async () => {
    pendingAbortRef.current?.abort();
    pendingAbortRef.current = null;
    const session = sessionRef.current;
    sessionRef.current = null;
    if (mountedRef.current) setIsLive(false);
    if (mountedRef.current) {
      setConnectionState('idle');
      setCurrentOperation(null);
    }
    if (session) await session.stop();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session) void session.stop();
    };
  }, []);

  useEffect(() => {
    const session = sessionRef.current;
    if (session && session.vehicleId && session.vehicleId !== vehicleId) void stopLive();
  }, [vehicleId, stopLive]);

  const startScan = useCallback(async ({ authorized = false, selectAdapter } = {}) => {
    if (!vehicleId) {
      const result = {
        status: 'unavailable',
        resultId: null,
        message: 'Select a vehicle before connecting to the OBD adapter.',
      };
      setScanResult(result);
      setScanError(null);
      return result;
    }
    const controller = new AbortController();
    try {
      await stopLive();
      pendingAbortRef.current = controller;
      setIsStartingScan(true);
      setScanError(null);
      setLiveReadings([]);
      setLiveCapturedAt(null);
      const result = await startCustomerDiagnosticScan(
        { vehicleId, source: 'obd', vehicle: selectedVehicle, authorized },
        {
          signal: controller.signal,
          selectAdapter,
          onState: (state) => { if (mountedRef.current) setConnectionState(state); },
          onOperation: (operation) => { if (mountedRef.current) setCurrentOperation(operation); },
          onConnected: (session) => {
            session.vehicleId = vehicleId;
            sessionRef.current = session;
            if (mountedRef.current) setIsLive(true);
          },
          onUpdate: (snapshot) => {
            if (!mountedRef.current) return;
            setLiveReadings(snapshot.readings);
            setLiveCapturedAt(snapshot.capturedAt);
          },
          onError: (error) => {
            sessionRef.current = null;
            if (!mountedRef.current) return;
            setIsLive(false);
            setScanError(error instanceof Error ? error.message : 'The live OBD connection stopped.');
          },
        },
      );
      const { liveSession, ...visibleResult } = result;
      sessionRef.current = liveSession;
      if (mountedRef.current) setScanResult(visibleResult);
      return visibleResult;
    } catch (error) {
      sessionRef.current = null;
      if (mountedRef.current) {
        setIsLive(false);
        setScanResult(null);
        const cancelled = controller.signal.aborted || error?.name === 'AbortError';
        setConnectionState(cancelled ? 'idle' : 'error');
        setScanError(cancelled ? null : error instanceof Error ? error.message : 'Unable to connect to the OBD adapter.');
      }
      return null;
    } finally {
      pendingAbortRef.current = null;
      if (mountedRef.current) setIsStartingScan(false);
    }
  }, [selectedVehicle, stopLive, vehicleId]);

  const clearScanResult = useCallback(() => {
    setScanResult(null);
    setScanError(null);
  }, []);

  return {
    scanResult,
    isStartingScan,
    isLive,
    liveReadings,
    liveCapturedAt,
    scanError,
    connectionState,
    currentOperation,
    startScan,
    stopLive,
    clearScanResult,
  };
}
