import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radii, typography } from '../theme/theme';
import { getPlatformSettings, updatePlatformSettings } from '../api/platformApi';
import useAsync from '../api/useAsync';
import ScreenHeader from '../components/ScreenHeader';
import { LoadingView, ErrorView } from '../components/StateViews';

const OPTIONS = [
  { key: 'maintenanceMode', title: 'Maintenance mode', desc: 'Temporarily block users from using the app' },
  { key: 'allowNewSignups', title: 'Allow new sign-ups', desc: 'Let new users and mechanics register' },
  { key: 'emailNotifications', title: 'Email notifications', desc: 'Send system emails to users and admins' },
  { key: 'requireTwoFactor', title: 'Require two-factor login', desc: 'Force all administrators to use 2FA' },
];

export default function SettingsScreen() {
  const { data, loading, error, reload } = useAsync(getPlatformSettings);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await updatePlatformSettings(form);
      Alert.alert('Saved', 'Platform settings updated.');
    } catch (e) {
      Alert.alert('Could not save', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Platform Settings" subtitle="Configure global system settings" />
        {(loading && !form) ? <LoadingView label="Loading settings..." />
        : error ? <ErrorView message={error} onRetry={reload} />
        : form && (
          <>
            <View style={styles.card}>
              {OPTIONS.map((o, i) => (
                <View key={o.key} style={[styles.row, i > 0 && styles.rowBorder]}>
                  <View style={{ flex: 1, paddingRight: spacing.md }}>
                    <Text style={styles.title}>{o.title}</Text>
                    <Text style={styles.desc}>{o.desc}</Text>
                  </View>
                  <Switch value={!!form[o.key]} onValueChange={(v) => setForm((f) => ({ ...f, [o.key]: v }))} />
                </View>
              ))}
            </View>
            <Pressable style={styles.submit} onPress={save} disabled={saving}>
              <Text style={styles.submitText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, paddingHorizontal: spacing.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  title: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  desc: { ...typography.small, color: colors.textSecondary, fontWeight: '400', marginTop: 3 },
  submit: { backgroundColor: colors.primary, borderRadius: radii.md, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl },
  submitText: { color: colors.background, fontWeight: '600', fontSize: 15 },
});