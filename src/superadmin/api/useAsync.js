import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';
import { getCurrentAdmin } from '../api/platformApi';
import useAsync from '../api/useAsync';
import Avatar from '../components/Avatar';
import { LoadingView, ErrorView } from '../components/StateViews';

function Row({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={16} color={colors.textSecondary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '-'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen({ onLogout }) {
  const { data: me, loading, error, reload } = useAsync(getCurrentAdmin);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {loading && !me ? (
          <LoadingView label="Loading profile..." />
        ) : error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <>
            <View style={styles.hero}>
              <Avatar name={me.name} size={84} />
              <Text style={styles.name}>{me.name}</Text>
              <View style={styles.roleTag}>
                <Feather name="award" size={12} color={colors.primary} />
                <Text style={styles.roleText}>{me.role}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Row icon="mail" label="Email" value={me.email} />
              <Row icon="phone" label="Phone" value={me.phone} />
              <Row icon="check-circle" label="Status" value={me.status} />
              <Row icon="clock" label="Last active" value={me.lastActive} />
              <Row icon="calendar" label="Member since" value={me.createdAt} />
            </View>

            <Pressable style={styles.logout} onPress={onLogout}>
              <Feather name="log-out" size={16} color={colors.danger} />
              <Text style={styles.logoutText}>Log out</Text>
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
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  name: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.md, fontSize: 22 },
  roleTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm,
    backgroundColor: colors.infoBg, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full,
  },
  roleText: { ...typography.small, color: colors.primary },
  card: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderBottomColor: colors.border, borderBottomWidth: 1,
  },
  label: { ...typography.small, color: colors.textSecondary, fontWeight: '400' },
  value: { ...typography.bodyBold, color: colors.textPrimary, marginTop: 2 },
  logout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.danger,
  },
  logoutText: { color: colors.danger, fontWeight: '600', fontSize: 15 },
});