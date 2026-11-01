import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const HOME_PIDS = [
    { pid: '0C', label: 'Engine RPM', fallbackUnit: 'rpm', icon: 'engine' },
    { pid: '0D', label: 'Vehicle speed', fallbackUnit: 'km/h', icon: 'speedometer' },
    { pid: '05', label: 'Coolant temperature', fallbackUnit: '°C', icon: 'thermometer' },
    { pid: '04', label: 'Engine load', fallbackUnit: '%', icon: 'engine-outline' },
    { pid: '0F', label: 'Intake air temperature', fallbackUnit: '°C', icon: 'weather-windy' },
];

function formatValue(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 'N/A';
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

export default function CustomerHomeObdReadingsCard({ snapshot, onConnect }) {
    const { colors } = useTheme();
    const readings = snapshot?.readings ?? [];
    const hasReadings = readings.some((reading) => reading.supported !== false && reading.value != null);

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.header}>
                <View style={styles.titleWrap}>
                    <Text style={[styles.title, { color: colors.text }]}>Latest OBD readings</Text>
                    <Text style={[styles.updated, { color: colors.secondaryText }]}>
                        {snapshot?.capturedAt
                            ? `Last updated ${new Date(snapshot.capturedAt).toLocaleTimeString()}`
                            : 'Values appear after the ECU returns a valid reading'}
                    </Text>
                </View>
                <MaterialCommunityIcons color={colors.accent} name="access-point" size={22} />
            </View>
            {hasReadings ? (
                <>
                    <View style={styles.grid}>
                        {HOME_PIDS.map((metric) => {
                            const reading = readings.find((item) => item.pid === metric.pid);
                            const available = reading?.supported !== false && reading?.value != null;
                            return (
                                <View key={metric.pid} style={[styles.metric, { borderColor: colors.border }]}>
                                    <View style={styles.metricHeading}>
                                        <MaterialCommunityIcons color={colors.accent} name={metric.icon} size={16} />
                                        <Text numberOfLines={2} style={[styles.label, { color: colors.secondaryText }]}>{metric.label}</Text>
                                    </View>
                                    <Text style={[styles.value, { color: available ? colors.accent : colors.secondaryText }]}>
                                        {available ? `${formatValue(reading.value)} ${reading.unit || metric.fallbackUnit}` : 'N/A'}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                    <Text style={[styles.hint, { color: colors.secondaryText }]}>See Diagnostics for all ECU-supported readings and their explanations.</Text>
                </>
            ) : (
                <View style={styles.empty}>
                    <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No OBD readings have been received for this vehicle yet.</Text>
                    <TouchableOpacity
                        accessibilityRole="button"
                        activeOpacity={0.75}
                        onPress={onConnect}
                        style={[styles.button, { backgroundColor: colors.accent }]}
                    >
                        <Text style={[styles.buttonText, { color: '#090B10' }]}>Connect to OBD in Diagnostics</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderWidth: 1, borderRadius: 20, padding: 16, marginTop: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    titleWrap: { flex: 1 },
    title: { fontSize: 17, fontWeight: '800' },
    updated: { fontSize: 11, marginTop: 4 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
    metric: { width: '48%', minHeight: 68, borderWidth: 1, borderRadius: 14, padding: 10, justifyContent: 'space-between' },
    metricHeading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    label: { flex: 1, fontSize: 10, fontWeight: '600' },
    value: { fontSize: 16, fontWeight: '800', marginTop: 8 },
    hint: { fontSize: 10, lineHeight: 14, marginTop: 10 },
    empty: { alignItems: 'flex-start', marginTop: 12 },
    emptyText: { fontSize: 12, lineHeight: 17 },
    button: { minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingHorizontal: 14, marginTop: 12 },
    buttonText: { fontSize: 12, fontWeight: '800' },
});
