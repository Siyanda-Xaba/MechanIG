import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';
import { createAdmin } from '../api/platformApi';

const ROLES = ['Admin', 'Support', 'Finance', 'Moderator'];

export default function AddAdministratorScreen({ onDone }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || !email.includes('@')) {
      Alert.alert('Missing details', 'Enter a name and a valid email.');
      return;
    }
    setSaving(true);
    try {
      await createAdmin({ name: name.trim(), email: email.trim(), role });
      onDone?.();
    } catch (e) {
      Alert.alert('Could not create administrator', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName}
        placeholder="e.g. Jane Smith" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail}
        placeholder="jane@company.com" placeholderTextColor={colors.textMuted}
        autoCapitalize="none" keyboardType="email-address" />

      <Text style={styles.label}>Role</Text>
      <View style={styles.chips}>
        {ROLES.map((r) => (
          <Pressable key={r} onPress={() => setRole(r)}
            style={[styles.chip, role === r && styles.chipActive]}>
            <Text style={[styles.chipText, role === r && { color: '#fff' }]}>{r}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.submit, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
        <Text style={styles.submitText}>{saving ? 'Creating...' : 'Create Administrator'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.sm },
  label: { color: colors.textSecondary, marginTop: spacing.md, marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.md, padding: spacing.md, color: colors.textPrimary, fontSize: 15,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  submit: {
    backgroundColor: colors.primary, borderRadius: radii.md,
    padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl,
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});