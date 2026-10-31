import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const READING_DETAILS = {
  '04': ['engine', 'Engine load reported by the ECU.'],
  '05': ['radiator', 'Coolant temperature reported by the ECU.'],
  '06': ['engine', 'Short-term fuel mixture correction, bank 1.'],
  '07': ['engine', 'Long-term fuel mixture correction, bank 1.'],
  '08': ['engine', 'Short-term fuel mixture correction, bank 2.'],
  '09': ['engine', 'Long-term fuel mixture correction, bank 2.'],
  '0A': ['engine', 'Fuel pressure reported by the ECU.'],
  '0B': ['engine', 'Intake manifold pressure reported by the ECU.'],
  '0C': ['engine', 'Engine speed reported by the ECU.'],
  '0D': ['engine', 'Vehicle speed reported by the ECU.'],
  '0E': ['engine', 'Ignition timing reported by the ECU.'],
  '0F': ['engine', 'Intake air temperature reported by the ECU.'],
  '10': ['engine', 'Airflow entering the engine, measured by the ECU.'],
  '11': ['engine', 'Throttle opening reported by the ECU.'],
  '2F': ['engine', 'Fuel level reported by the ECU.'],
  '32': ['engine', 'EVAP system vapor pressure reported by the ECU.'],
  '33': ['engine', 'Outside air pressure reported by the ECU.'],
  '5E': ['engine', 'Fuel use rate reported by the ECU.'],
  '42': ['battery', 'Electrical voltage reported by the ECU.'],
};

const READING_ICONS = {
  '04': 'engine-outline', '05': 'thermometer', '06': 'tune-vertical', '07': 'tune-vertical',
  '08': 'tune-vertical', '09': 'tune-vertical', '0A': 'fuel', '0B': 'gauge', '0C': 'engine',
  '0D': 'speedometer', '0E': 'flash', '0F': 'thermometer', '10': 'weather-windy', '11': 'car-control',
  '2F': 'fuel', '32': 'cloud-outline', '33': 'gauge', '5E': 'fuel', '42': 'car-battery',
};

function formatValue(value) {
  if (value == null || !Number.isFinite(Number(value))) return 'N/A';
  const numeric = Number(value);
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
}

function readingFeedback(reading) {
  if (reading.supported === false || reading.value == null) {
    return 'This vehicle did not provide this reading. Other available readings keep updating.';
  }
  return READING_DETAILS[reading.pid]?.[1] ?? 'Live value received from the vehicle ECU.';
}

export default function LiveObdReadingsCard({
  readings = [],
  capturedAt = null,
  isLive = false,
  isStartingScan = false,
  connectionState = 'idle',
  currentOperation = null,
  resultId = null,
  onStop,
  onViewReport,
}) {
  const { colors } = useTheme();
  if (!readings.length && !isLive && !isStartingScan) return null;
  const unavailableCount = readings.filter((reading) => reading.supported === false).length;
  const checkingEcu = connectionState === 'reading' && !capturedAt;
  const statusColor = isLive ? colors.success : checkingEcu ? colors.accent : colors.secondaryText;
  const connectionLabel = {
    starting: 'Preparing a safe scan',
    'checking-bluetooth': 'Checking Bluetooth permission and state',
    'searching-adapters': 'Searching for named BLE and paired Classic adapters',
    'adapter-selection': 'Waiting for your adapter selection',
    connecting: 'Connecting to the selected adapter',
    reading: 'Reading ECU-supported data',
    disconnected: 'Connection stopped',
    error: 'Connection error',
  }[connectionState] || (isLive ? 'Connected to selected adapter' : 'Not connected');

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.text }]}>Live readings & feedback</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {isLive ? 'CONNECTED · UPDATING' : checkingEcu ? 'ADAPTER CONNECTED · CHECKING ECU' : isStartingScan ? 'CONNECTING TO ADAPTER' : 'CONNECTION STOPPED'}
          </Text>
        </View>
        <MaterialCommunityIcons name={isLive || checkingEcu ? 'access-point' : 'access-point-off'} size={22} color={statusColor} />
      </View>
      <Text style={[styles.updated, { color: colors.secondaryText }]}>
        {capturedAt ? `Last updated ${new Date(capturedAt).toLocaleTimeString()}` : 'Waiting for the first readings…'}
      </Text>
      <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>{connectionLabel}{currentOperation ? ` · ${currentOperation}` : ''}</Text>
      <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>Data source: real vehicle through the selected BLE or Classic OBD adapter. Bluetooth names and pairing alone do not prove adapter compatibility.</Text>
      <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>Each card explains what the ECU value measures. A reading by itself does not prove a part has failed.</Text>
      {readings.length ? <View style={styles.list}>
        {readings.map((reading) => {
          const available = reading.supported !== false && reading.value != null;
          return (
            <View key={reading.pid} style={[styles.reading, { borderColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.background ?? colors.card }]}>
                <MaterialCommunityIcons name={READING_ICONS[reading.pid] ?? 'car-info'} size={30} color={colors.accent} />
              </View>
              <View style={styles.readingInfo}>
                <Text style={[styles.readingName, { color: colors.text }]} numberOfLines={2}>{reading.name}</Text>
                <Text style={[styles.readingValue, { color: available ? colors.accent : colors.secondaryText }]}>
                  {available ? `${formatValue(reading.value)} ${reading.unit ?? ''}`.trim() : 'N/A'}
                </Text>
                <Text style={[styles.feedback, { color: colors.secondaryText }]}>{readingFeedback(reading)}</Text>
              </View>
            </View>
          );
        })}
      </View> : null}
      {unavailableCount ? (
        <Text style={[styles.note, { color: colors.secondaryText }]}>
          {unavailableCount} reading{unavailableCount === 1 ? '' : 's'} unavailable for this vehicle; available readings continue updating.
        </Text>
      ) : null}
      <View style={styles.actions}>
        {isLive || isStartingScan ? (
          <TouchableOpacity onPress={onStop} activeOpacity={0.75} style={[styles.button, styles.stopButton, { borderColor: colors.danger }]}>
            <Text style={[styles.buttonText, { color: colors.danger }]}>{isLive ? 'Stop Scan' : 'Cancel Scan'}</Text>
          </TouchableOpacity>
        ) : null}
        {resultId ? (
          <TouchableOpacity onPress={onViewReport} activeOpacity={0.75} style={[styles.button, { borderColor: colors.border }]}>
            <Text style={[styles.buttonText, { color: colors.text }]}>View saved scan report</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {isLive || isStartingScan ? <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>Stopping prevents more requests. A request already sent to the adapter may finish.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { flex: 1, gap: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  status: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  updated: { fontSize: 12, marginTop: 8 },
  disclaimer: { fontSize: 11, lineHeight: 15, marginTop: 5, marginBottom: 10 },
  list: { gap: 8 },
  reading: { minHeight: 91, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 13, padding: 8, gap: 10 },
  iconWrap: { width: 58, height: 58, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  readingInfo: { flex: 1, justifyContent: 'center' },
  readingName: { fontSize: 12, fontWeight: '700' },
  readingValue: { fontSize: 16, fontWeight: '800', marginTop: 3 },
  feedback: { fontSize: 10, lineHeight: 14, marginTop: 2 },
  note: { fontSize: 11, lineHeight: 16, marginTop: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  button: { minHeight: 42, borderWidth: 1, borderRadius: 11, paddingHorizontal: 13, justifyContent: 'center', alignItems: 'center' },
  stopButton: { backgroundColor: 'transparent' },
  buttonText: { fontSize: 12, fontWeight: '800' },
});
