import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';
import { createRole } from '../api/platformApi';

const PERMISSIONS = [
  'View users', 'Manage users', 'View bookings', 'Manage bookings',
  'View revenue', 'Manage marketplace', 'View audit logs', 'Manage administrators',
];

export default function AddRoleScreen({ onDone }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState({});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Give the role a name.');
      return;
    }
    setSaving(true);
    try {
      const permissions = PERMISSIONS.filter((p) => enabled[p]);
      await createRole({ name: name.trim(), description: description.trim(), permissions });
      onDone?.();
    } catch (e) {
      Alert.alert('Could not create role', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Role name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName}
        placeholder="e.g. Finance Manager" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={description} onChangeText={setDescription} multiline
        placeholder="What is this role for?" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>Permissions</Text>
      <View style={styles.card}>
        {PERMISSIONS.map((p, i) => (
          <View key={p} style={[styles.row, i > 0 && styles.rowBorder]}>
            <Text style={styles.rowText}>{p}</Text>
            <Switch value={!!enabled[p]}
              onValueChange={(v) => setEnabled((prev) => ({ ...prev, [p]: v }))} />
          </View>
        ))}
      </View>

      <Pressable style={[styles.submit, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
        <Text style={styles.submitText}>{saving ? 'Creating...' : 'Create Role'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, paddingBottom: 60 },
  label: { color: colors.textSecondary, marginTop: spacing.md, marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.md, padding: spacing.md, color: colors.textPrimary, fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.md, paddingHorizontal: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowText: { color: colors.textPrimary, fontSize: 15, flex: 1, paddingRight: spacing.md },
  submit: {
    backgroundColor: colors.primary, borderRadius: radii.md,
    padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl,
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});