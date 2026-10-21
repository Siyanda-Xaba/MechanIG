import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { decodeLiveResponses, LIVE_DATA_PIDS } from './obdPidDecoder';
import obdOperationPolicy from './obdOperationPolicy';
import obdScanScheduler from './obdScanScheduler';
const { buildApprovedDiagnosticRequest, obdDiagnosticPolicy, requireScanAuthorization, validateApprovedResponse } = obdOperationPolicy;
const { createPidReadQueue } = obdScanScheduler;

const OBD_NAME = /(obd|elm|kw903|konnwei|v[- ]?link|veepeak|viecar|obdlink|carista|carly|vlink|vgate|icar|scanner)/i;
const OPERATION_LABELS = {
  readSupportedPidRange: 'Checking ECU-supported readings',
  readStoredEmissionDtcs: 'Reading stored emissions trouble codes',
  readLivePid: 'Reading supported live data',
};
let BleState;
let manager;
let classicModule;

async function ensureBleModule() {
  if (manager) return;
  try {
    const ble = await import('@sfourdrinier/react-native-ble-plx');
    BleState = ble.State;
    manager = new ble.BleManager();
  } catch (error) {
    const detail = error instanceof Error ? ` (${error.message})` : '';
    const buildCommand = Platform.OS === 'ios' ? 'npm run ios:dev (on macOS)' : 'npm run android:dev';
    throw new Error(
      `This installed app does not include the native Bluetooth module. Close Expo Go, run ${buildCommand} to build and install the MechanIQ development app, then run npm start.${detail}`,
    );
  }
}

async function ensureClassicModule() {
  if (classicModule) return classicModule;
  if (Platform.OS !== 'android') return null;
  try {
    const bluetooth = await import('react-native-bluetooth-classic');
    classicModule = bluetooth.default;
    return classicModule;
  } catch (error) {
    const detail = error instanceof Error ? ` (${error.message})` : '';
    throw new Error(`Bluetooth Classic support is missing from this build. Rebuild and reinstall the Android app.${detail}`);
  }
}

function encodeBase64(value) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  for (let i = 0; i < value.length; i += 3) {
    const a = value.charCodeAt(i) & 255;
    const hasB = i + 1 < value.length;
    const hasC = i + 2 < value.length;
    const b = hasB ? value.charCodeAt(i + 1) & 255 : 0;
    const c = hasC ? value.charCodeAt(i + 2) & 255 : 0;
    output += alphabet[a >> 2];
    output += alphabet[((a & 3) << 4) | (b >> 4)];
    output += hasB ? alphabet[((b & 15) << 2) | (c >> 6)] : '=';
    output += hasC ? alphabet[c & 63] : '=';
  }
  return output;
}

function decodeBase64(value) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  if (typeof value !== 'string' || value.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error('The adapter returned malformed Bluetooth data.');
  }
  const input = value.replace(/[^A-Za-z0-9+/=]/g, '');
  let output = '';
  for (let i = 0; i < input.length; i += 4) {
    const a = alphabet.indexOf(input[i]);
    const b = alphabet.indexOf(input[i + 1]);
    const c = alphabet.indexOf(input[i + 2]);
    const d = alphabet.indexOf(input[i + 3]);
    if (a < 0 || b < 0) continue;
    output += String.fromCharCode((a << 2) | (b >> 4));
    if (c >= 0) output += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d >= 0 && c >= 0) output += String.fromCharCode(((c & 3) << 6) | d);
  }
  return output;
}

async function requestBluetoothPermissions() {
  if (Platform.OS !== 'android') return;

  const version = Number(Platform.Version);
  const permissions = version >= 31
    ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
    : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
  const result = await PermissionsAndroid.requestMultiple(permissions);
  if (Object.values(result).some((status) => status !== PermissionsAndroid.RESULTS.GRANTED)) {
    throw new Error('Bluetooth permission is required to find and connect to your OBD adapter.');
  }
}

async function waitForBluetooth(signal) {
  if (signal?.aborted) throw new Error('The scan was cancelled.');
  const currentState = await manager.state();
  if (currentState === BleState.PoweredOn) return;
  if (currentState === BleState.Unsupported || currentState === BleState.Unauthorized) {
    throw new Error('Bluetooth Low Energy is unavailable or not permitted on this device.');
  }
  return new Promise((resolve, reject) => {
    let subscription;
    let settingsOpened = false;
    const finish = (error) => {
      clearTimeout(timeout);
      subscription?.remove();
      signal?.removeEventListener('abort', cancel);
      error ? reject(error) : resolve();
    };
    const cancel = () => finish(new Error('The Bluetooth check was cancelled.'));
    const timeout = setTimeout(() => finish(new Error('Bluetooth is still off. Turn it on in your phone settings, then return to MechanIQ.')), 120000);
    const promptToEnableBluetooth = async () => {
      if (Platform.OS !== 'android' || settingsOpened) return;
      settingsOpened = true;
      try {
        await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
      } catch {
        finish(new Error('Bluetooth is off. Turn it on in your phone settings, then return to MechanIQ and try again.'));
      }
    };
    subscription = manager.onStateChange((state) => {
      if (state === BleState.PoweredOn) finish();
      else if (state === BleState.Unsupported || state === BleState.Unauthorized) finish(new Error('Bluetooth Low Energy is unavailable or not permitted on this device.'));
      else if (state === BleState.PoweredOff) void promptToEnableBluetooth();
    });
    if (signal?.aborted) return cancel();
    signal?.addEventListener('abort', cancel, { once: true });
    if (currentState === BleState.PoweredOff) void promptToEnableBluetooth();
  });
}

async function findAdapters(signal) {
  const devices = new Map();
  await new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', cancel);
      manager.stopDeviceScan();
      error ? reject(error) : resolve();
    };
    const cancel = () => finish(new Error('The adapter search was cancelled.'));
    const timeout = setTimeout(() => finish(), 9000);
    if (signal?.aborted) return cancel();
    signal?.addEventListener('abort', cancel, { once: true });
    manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        finish(new Error('Unable to scan for Bluetooth devices.'));
        return;
      }
      if (device?.id && (device.name || device.localName) && device.isConnectable !== false) {
        devices.set(device.id, device);
      }
    });
  });
  const discovered = [...devices.values()];
  return discovered.filter((device) => OBD_NAME.test(device.name || device.localName || ''));
}

async function connectToAdapter(device, signal) {
  if (signal?.aborted) throw new Error('The scan was cancelled.');
  const abort = () => { void device.cancelConnection().catch(() => {}); };
  signal?.addEventListener('abort', abort, { once: true });
  let connected;
  try {
    connected = await device.connect({ timeout: obdDiagnosticPolicy.limits.connectionTimeoutMs });
    if (signal?.aborted) throw new Error('The scan was cancelled.');
    await connected.discoverAllServicesAndCharacteristics();
    if (signal?.aborted) throw new Error('The scan was cancelled.');
    const services = await connected.services();
    for (const service of services) {
      const characteristics = await connected.characteristicsForService(service.uuid);
      const notify = characteristics.find((item) => item.isNotifiable || item.isIndicatable);
      const write = characteristics.find((item) => item.isWritableWithResponse || item.isWritableWithoutResponse);
      if (notify && write) return { device: connected, notify, write };
    }
    throw new Error('The selected adapter does not expose a supported read/write BLE service.');
  } catch (error) {
    try { await (connected || device).cancelConnection(); } catch { /* already disconnected */ }
    if (signal?.aborted) throw new Error('The scan was cancelled.');
    throw error;
  } finally {
    signal?.removeEventListener('abort', abort);
  }
}

function createElmSession(connection, onOperation) {
  let pending = null;
  let sessionState = 'connected';
  let lastRequestAt = 0;
  const subscription = connection.device.monitorCharacteristicForService(
    connection.notify.serviceUUID,
    connection.notify.uuid,
    (error, characteristic) => {
      if (error) {
        if (pending) clearTimeout(pending.timeout);
        pending?.reject(new Error('The OBD adapter disconnected during a read.'));
        pending = null;
        sessionState = 'disconnected';
        return;
      }
      if (!pending || !characteristic?.value) return;
      try {
        pending.response += decodeBase64(characteristic.value);
      } catch {
        const active = pending;
        pending = null;
        clearTimeout(active.timeout);
        sessionState = 'disconnected';
        active.reject(new Error('The adapter returned malformed Bluetooth data.'));
        return;
      }
      if (pending.response.length > obdDiagnosticPolicy.limits.responseCharacters) {
        const active = pending;
        pending = null;
        clearTimeout(active.timeout);
        active.reject(new Error('The adapter response exceeded the allowed size.'));
        return;
      }
      if (pending.response.includes('>')) {
        const active = pending;
        pending = null;
        clearTimeout(active.timeout);
        active.resolve(active.response.replace(/>/g, '').trim());
      }
    },
  );

  async function perform(operation, parameters = {}) {
    if (pending) throw new Error('The OBD adapter is already processing a request.');
    const request = buildApprovedDiagnosticRequest(operation, parameters, sessionState);
    const waitMs = Math.max(0, obdDiagnosticPolicy.limits.minimumRequestIntervalMs - (Date.now() - lastRequestAt));
    if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
    if (sessionState !== 'connected') throw new Error('The OBD adapter connection is no longer active.');
    onOperation?.(OPERATION_LABELS[operation] || 'Reading vehicle diagnostics');
    const response = new Promise((resolve, reject) => {
      pending = {
        response: '', resolve, reject,
        timeout: setTimeout(() => {
          const active = pending;
          pending = null;
          if (active) {
            const timeout = new Error('The adapter request timed out.');
            timeout.code = 'OBD_REQUEST_TIMEOUT';
            active.reject(timeout);
          }
        }, obdDiagnosticPolicy.limits.requestTimeoutMs),
      };
    });
    const payload = encodeBase64(request.command + '\r');
    lastRequestAt = Date.now();
    try {
      if (connection.write.isWritableWithoutResponse) {
        await connection.device.writeCharacteristicWithoutResponseForService(connection.write.serviceUUID, connection.write.uuid, payload);
      } else {
        await connection.device.writeCharacteristicWithResponseForService(connection.write.serviceUUID, connection.write.uuid, payload);
      }
    } catch {
      const active = pending;
      pending = null;
      if (active) {
        clearTimeout(active.timeout);
        active.reject(new Error('The diagnostic request could not be sent to the adapter.'));
      }
    }
    return validateApprovedResponse(await response, request);
  }

  return {
    perform,
    close: () => {
      sessionState = 'disconnected';
      subscription.remove();
      if (pending) {
        clearTimeout(pending.timeout);
        const active = pending;
        pending = null;
        active.reject(new Error('The OBD adapter connection was stopped.'));
      }
    },
  };
}

function createClassicElmSession(device, onOperation) {
  let pending = null;
  let sessionState = 'connected';
  let lastRequestAt = 0;
  const subscription = device.onDataReceived((event) => {
    if (!pending || typeof event?.data !== 'string') return;
    pending.response += event.data;
    if (pending.response.length > obdDiagnosticPolicy.limits.responseCharacters) {
      const active = pending;
      pending = null;
      clearTimeout(active.timeout);
      active.reject(new Error('The adapter response exceeded the allowed size.'));
      return;
    }
    if (pending.response.includes('>')) {
      const active = pending;
      pending = null;
      clearTimeout(active.timeout);
      active.resolve(active.response.replace(/>/g, '').trim());
    }
  });
  return {
    perform: async (operation, parameters = {}) => {
      if (pending) throw new Error('The OBD adapter is already processing a request.');
      const request = buildApprovedDiagnosticRequest(operation, parameters, sessionState);
      const waitMs = Math.max(0, obdDiagnosticPolicy.limits.minimumRequestIntervalMs - (Date.now() - lastRequestAt));
      if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
      if (sessionState !== 'connected') throw new Error('The OBD adapter connection is no longer active.');
      onOperation?.(OPERATION_LABELS[operation] || 'Reading vehicle diagnostics');
      const response = new Promise((resolve, reject) => {
        pending = {
          response: '', resolve, reject,
          timeout: setTimeout(() => {
            const active = pending;
            pending = null;
            if (active) {
              const timeout = new Error('The adapter request timed out.');
              timeout.code = 'OBD_REQUEST_TIMEOUT';
              active.reject(timeout);
            }
          }, obdDiagnosticPolicy.limits.requestTimeoutMs),
        };
      });
      lastRequestAt = Date.now();
      try {
        await device.write(`${request.command}\r`);
      } catch {
        const active = pending;
        pending = null;
        if (active) {
          clearTimeout(active.timeout);
          active.reject(new Error('The diagnostic request could not be sent to the adapter.'));
        }
      }
      return validateApprovedResponse(await response, request);
    },
    close: () => {
      sessionState = 'disconnected';
      subscription.remove();
      if (pending) {
        clearTimeout(pending.timeout);
        const active = pending;
        pending = null;
        active.reject(new Error('The OBD adapter connection was stopped.'));
      }
    },
  };
}

async function findPairedClassicAdapters() {
  if (Platform.OS !== 'android') return [];
  const bluetooth = await ensureClassicModule();
  const paired = await bluetooth.getBondedDevices();
  return paired
    .filter((device) => device?.address && OBD_NAME.test(device.name || ''))
    .map((device) => ({ ...device, id: `classic:${device.address}`, transport: 'classic' }));
}

function chooseAdapter(adapters, signal) {
  if (signal?.aborted) return Promise.reject(new Error('The adapter search was cancelled.'));
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (id) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener('abort', cancel);
      resolve(id);
    };
    const cancel = () => {
      if (settled) return;
      settled = true;
      reject(new Error('The adapter search was cancelled.'));
    };
    signal?.addEventListener('abort', cancel, { once: true });
    Alert.alert('Choose OBD adapter', 'Only the selected Bluetooth connection will be opened.', [
      ...adapters.slice(0, 3).map((adapter) => ({
        text: `${adapter.name} · ${adapter.transport === 'classic' ? 'Classic' : 'BLE'}`,
        onPress: () => finish(adapter.id),
      })),
      { text: 'Cancel', style: 'cancel', onPress: () => finish(null) },
    ], { cancelable: false, onDismiss: () => finish(null) });
  });
}

async function connectClassicAdapter(adapter, signal) {
  const device = adapter.device;
  if (signal?.aborted) throw new Error('The scan was cancelled.');
  const abort = () => { void device.disconnect().catch(() => {}); };
  signal?.addEventListener('abort', abort, { once: true });
  try {
    const connected = await device.connect({ CONNECTOR_TYPE: 'rfcomm', DELIMITER: '', DEVICE_CHARSET: 'ascii' });
    if (!connected || signal?.aborted) throw new Error('Could not connect to the paired Bluetooth Classic adapter.');
    return { device, disconnect: () => device.disconnect() };
  } catch (error) {
    try { await device.disconnect(); } catch { /* already disconnected */ }
    throw error;
  } finally {
    signal?.removeEventListener('abort', abort);
  }
}

function modeResponse(response, mode, pid) {
  const cleaned = response
    .replace(/SEARCHING\.\.\./gi, '')
    .replace(/NO DATA|STOPPED|UNABLE TO CONNECT|CAN ERROR|BUS INIT[^\r\n]*/gi, '')
    .replace(/\bOK\b/gi, '')
    .replace(/[\r\n\t]/g, ' ')
    .trim();
  const bytes = cleaned.match(/[0-9A-F]{2}/gi) || [];
  const prefix = pid ? [mode, pid] : [mode];
  const index = bytes.findIndex((byte, position) => prefix.every((expected, offset) => bytes[position + offset]?.toUpperCase() === expected));
  if (index < 0) return null;
  const selected = bytes.slice(index);
  return selected.join(' ').toUpperCase();
}

function supportedPidsFromResponse(response, basePid) {
  const matched = modeResponse(response, '41', basePid);
  if (!matched) return null;
  const bytes = matched.split(/\s+/).slice(2, 6).map((byte) => Number.parseInt(byte, 16));
  if (bytes.length !== 4 || bytes.some((byte) => !Number.isFinite(byte))) return null;
  const bitmap = bytes.reduce((value, byte) => value * 256 + byte, 0);
  const supported = new Set();
  for (let offset = 1; offset <= 32; offset += 1) {
    const bit = 1 << (32 - offset);
    if ((bitmap & bit) !== 0) supported.add(Number.parseInt(basePid, 16) + offset);
  }
  return supported;
}

async function discoverSupportedPids(elm, firstRangeResponse) {
  const supported = new Set();
  let base = 0;
  let response = firstRangeResponse;
  while (base <= 0x40) {
    const basePid = base.toString(16).padStart(2, '0').toUpperCase();
    const range = supportedPidsFromResponse(response, basePid);
    if (!range) throw new Error('The ECU did not return a valid supported-PID response; the scan stopped safely.');
    for (const pid of range) supported.add(pid);
    if (base === 0x40 || !range.has(base + 0x20)) break;
    base += 0x20;
    response = await elm.perform('readSupportedPidRange', { pid: base.toString(16).padStart(2, '0').toUpperCase() });
    if (!response) throw new Error('The ECU did not complete its supported-PID response; the scan stopped safely.');
  }
  return supported;
}

export async function startObdLiveSession({ authorized, selectAdapter, signal, onUpdate, onError, onConnected, onState, onOperation } = {}) {
  requireScanAuthorization(authorized);
  await ensureBleModule();
  await requestBluetoothPermissions();
  onState?.('checking-bluetooth');
  await waitForBluetooth(signal);
  onState?.('searching-adapters');
  // BLE scanning is stopped before the paired Classic list is read. We never
  // run BLE scanning and an RFCOMM connection at the same time.
  const bleAdapters = (await findAdapters(signal)).map((device) => ({
    id: `ble:${device.id}`,
    name: device.name || device.localName || 'Unnamed BLE adapter',
    transport: 'ble',
    device,
  }));
  let classicAdapters = [];
  if (Platform.OS === 'android') {
    try { classicAdapters = await findPairedClassicAdapters(); } catch { /* BLE remains available if Classic enumeration is unavailable. */ }
  }
  const adapters = [...bleAdapters, ...classicAdapters].filter((adapter) => OBD_NAME.test(adapter.name || ''));
  if (!adapters.length) {
    throw new Error('No recognizable OBD adapter was found. For Bluetooth Classic, pair the adapter in Android Bluetooth settings first.');
  }
  onState?.('adapter-selection');
  const choices = adapters.map(({ id, name, transport }) => ({ id, name, transport }));
  const selectedId = typeof selectAdapter === 'function'
    ? await selectAdapter(choices, signal)
    : await chooseAdapter(choices, signal);
  if (!selectedId) {
    const cancelled = new Error('Adapter selection cancelled.');
    cancelled.name = 'AbortError';
    throw cancelled;
  }
  const selected = adapters.find((adapter) => adapter.id === selectedId);
  if (!selected) throw new Error('The selected adapter is no longer available. Scan again and select it explicitly.');
  onState?.('connecting');
  if (signal?.aborted) throw new Error('The scan was cancelled.');
  const connection = selected.transport === 'classic'
    ? await connectClassicAdapter(selected, signal)
    : await connectToAdapter(selected.device, signal);
  let stopped = false;
  let closed = false;
  let loopPromise = null;
  let stopPromise = null;
  let first = true;
  let resolveFirstReadings;
  let rejectFirstReadings;
  let resolveSessionReady;
  const sessionReady = new Promise((resolve) => { resolveSessionReady = resolve; });
  const closeConnection = async () => {
    if (closed) return;
    closed = true;
    elm.close();
    try {
      if (selected.transport === 'classic') await connection.disconnect();
      else await connection.device.cancelConnection();
    } catch { /* already disconnected */ }
  };
  const session = {
    adapterName: selected.name || 'Selected OBD adapter',
    rawDtcResponse: null,
    source: `real vehicle via ${selected.transport === 'classic' ? 'Bluetooth Classic' : 'BLE'} OBD adapter`,
    unsupportedPids: [],
    firstReadings: new Promise((resolve, reject) => { resolveFirstReadings = resolve; rejectFirstReadings = reject; }),
    stop: () => {
      if (stopPromise) return stopPromise;
      stopped = true;
      stopPromise = (async () => {
        await closeConnection();
        await loopPromise;
      })();
      return stopPromise;
    },
  };
  const elm = selected.transport === 'classic'
    ? createClassicElmSession(connection.device, onOperation)
    : createElmSession(connection, onOperation);
  try {
    onConnected?.(session);
    onState?.('reading');
    const rangeResponse = await elm.perform('readSupportedPidRange', { pid: '00' });
    if (stopped) throw new Error('The scan was stopped.');
    const supportedPids = await discoverSupportedPids(elm, rangeResponse);
    const dtcResponse = await elm.perform('readStoredEmissionDtcs');
    if (stopped) throw new Error('The scan was stopped.');
    session.rawDtcResponse = dtcResponse && modeResponse(dtcResponse, '43') ? modeResponse(dtcResponse, '43') : null;
    const readablePids = LIVE_DATA_PIDS.filter((pid) => supportedPids.has(Number.parseInt(pid, 16)));
    const unsupportedPids = LIVE_DATA_PIDS.filter((pid) => !supportedPids.has(Number.parseInt(pid, 16)));
    session.unsupportedPids = unsupportedPids;
    const pidReadQueue = createPidReadQueue({
      read: (pid) => elm.perform('readLivePid', { pid }),
      normalize: (response, pid) => modeResponse(response, '41', pid),
      isCancelled: () => stopped,
    });
    let snapshotTimer;
    const waitBetweenSnapshots = () => new Promise((resolve) => { snapshotTimer = setTimeout(resolve, obdDiagnosticPolicy.limits.snapshotIntervalMs); });
    const readSnapshot = async () => {
      const { rawResponses, unavailablePids } = await pidReadQueue.readPids(readablePids);
      const unavailable = new Set([...unsupportedPids, ...unavailablePids]);
      return {
        rawResponses,
        unsupportedPids: [...unavailable],
        readings: decodeLiveResponses(rawResponses, [...unavailable]),
        capturedAt: new Date().toISOString(),
        source: `real vehicle via ${selected.transport === 'classic' ? 'Bluetooth Classic' : 'BLE'} OBD adapter`,
      };
    };
    loopPromise = (async () => {
      try {
        while (!stopped) {
          const snapshot = await readSnapshot();
          if (stopped) break;
          onUpdate?.(snapshot);
          if (first) {
            first = false;
            resolveFirstReadings(snapshot);
            resolveSessionReady(session);
          }
          await waitBetweenSnapshots();
        }
        if (first) {
          const stoppedError = new Error('The scan was stopped before the first reading.');
          rejectFirstReadings(stoppedError);
          resolveSessionReady(null);
        }
      } catch (error) {
        if (first) {
          rejectFirstReadings(error);
          resolveSessionReady(null);
        }
        if (!stopped) onError?.(new Error('The scan stopped because the adapter response or connection was invalid.'));
      } finally {
        stopped = true;
        clearTimeout(snapshotTimer);
        onState?.('disconnected');
        await closeConnection();
      }
    })();
    const ready = await sessionReady;
    if (!ready) throw new Error('The scan stopped before valid readings were available.');
    return session;
  } catch (error) {
    stopped = true;
    await closeConnection();
    throw error;
  }
}

