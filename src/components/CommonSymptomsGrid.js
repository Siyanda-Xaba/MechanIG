import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function CommonSymptomsGrid({ symptoms, onSymptomPress }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Common Symptoms</Text>
      <View style={styles.grid}>
        {symptoms.map((symptom) => (
          <TouchableOpacity
            key={symptom.id}
            activeOpacity={0.75}
            onPress={() => onSymptomPress(symptom)}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <MaterialCommunityIcons name={symptom.icon} size={24} color={colors.accent} />
            <Text style={[styles.label, { color: colors.text }]}>{symptom.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  sectionTitle: { marginBottom: 12, fontSize: 17, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  card: { width: '31.5%', minHeight: 82, borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 6, fontSize: 10, fontWeight: '600', textAlign: 'center' },
});
