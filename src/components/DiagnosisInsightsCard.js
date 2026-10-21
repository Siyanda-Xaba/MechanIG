import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { analyzeLiveDiagnostics } from '../customer/liveDiagnosticModel';
import { useTheme } from '../theme/ThemeContext';

const PART_ICONS = {
  battery: 'car-battery',
  cooling: 'thermometer-alert',
  engine: 'engine-outline',
  wheel: 'tire',
};

export default function DiagnosisInsightsCard({ readings = [], dtcProblems = [], isLive = false }) {
  const { colors } = useTheme();
  if (!readings.length && !dtcProblems.length) return null;
  const findings = analyzeLiveDiagnostics(readings, dtcProblems);
  const availableCount = readings.filter((reading) => reading.supported !== false && reading.value != null).length;

  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Possible causes</Text>
      <Text style={[styles.intro, { color: colors.secondaryText }]}>Checking {availableCount} supported live readings and the scan codes{isLive ? ' · updates live' : ''}. Only readings that match a specific rule contribute to a cause score. The percentage is an evidence-match score, not a measured probability.</Text>
      {findings.length ? findings.map((finding) => (
        <View key={finding.id} style={[styles.finding, { borderColor: colors.border }]}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={PART_ICONS[finding.part] ?? PART_ICONS.engine} size={30} color={colors.accent} />
          </View>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[styles.findingTitle, { color: colors.text }]}>{finding.title}</Text>
              <Text style={[styles.score, { color: colors.accent }]}>{finding.score}%</Text>
            </View>
            <Text style={[styles.label, { color: colors.secondaryText }]}>Evidence match</Text>
            {finding.evidence.map((item, index) => (
              <Text key={`${finding.id}-evidence-${index}`} style={[styles.evidence, { color: colors.secondaryText }]}>• {item}</Text>
            ))}
            <Text style={[styles.next, { color: colors.text }]}>{finding.next}</Text>
          </View>
        </View>
      )) : (
        <View style={[styles.empty, { borderColor: colors.border }]}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{dtcProblems.length ? 'No matching rule for the reported code' : 'No likely cause can be ranked yet'}</Text>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>{dtcProblems.length
            ? `The scan returned ${dtcProblems.map((problem) => problem.code).filter(Boolean).join(', ')}, but MechanIQ has no scoring rule for that code yet.`
            : 'The current readings do not show a supported fault pattern. Components such as CV joints and brakes are not measured by these standard OBD readings.'}</Text>
        </View>
      )}
      <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>Use these as leads for inspection, not a confirmed diagnosis. The model only ranks patterns it has rules for and never treats unavailable readings as faults.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 14, gap: 9 },
  title: { fontSize: 18, fontWeight: '800' },
  intro: { fontSize: 11, lineHeight: 16, marginTop: -4 },
  finding: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderRadius: 13, padding: 8, gap: 10 },
  iconWrap: { width: 54, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  findingTitle: { flex: 1, fontSize: 12, fontWeight: '800', lineHeight: 16 },
  score: { fontSize: 17, fontWeight: '900' },
  label: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', marginTop: 1, marginBottom: 3 },
  evidence: { fontSize: 10, lineHeight: 14, marginTop: 2 },
  next: { fontSize: 10, lineHeight: 14, fontWeight: '600', marginTop: 5 },
  empty: { borderWidth: 1, borderRadius: 12, padding: 12 },
  emptyTitle: { fontSize: 12, fontWeight: '800' },
  emptyText: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  disclaimer: { fontSize: 10, lineHeight: 14 },
});
