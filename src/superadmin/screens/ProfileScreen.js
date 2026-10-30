import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';
import { getCurrentUserProfile } from '../api/adminApi';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import MenuRow from '../components/MenuRow';
import { LoadingView, ErrorView } from '../components/StateViews';

export default function ProfileScreen({ navigation, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getCurrentUserProfile();
      setProfile(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <Text style={styles.subtitle}>Administrator account and settings</Text>

        {loading && !profile ? (
          <LoadingView label="Loading profile..." />
        ) : error ? (
          <ErrorView message={error} onRetry={load} />
        ) : (
          <>
            <View style={styles.profileCard}>
              <Avatar name={profile.name} size={64} />
              <View style={{ flex: 1, marginLeft: spacing.lg }}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.role}>{profile.role === 'Super Admin' ? 'Super Administrator' : profile.role}</Text>
                <Text style={styles.email}>{profile.email}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.roleTag}>
                    <Feather name="award" size={12} color={colors.primary} />
                    <Text style={styles.roleTagLabel}>{profile.role}</Text>
                  </View>
                  <StatusBadge status={profile.status} />
                </View>
              </View>
            </View>
            <Pressable style={styles.editBtn}>
              <Feather name="user" size={14} color={colors.primary} />
              <Text style={styles.editLabel}>Edit Profile</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Account</Text>
            <MenuRow icon="user" title="Personal Information" subtitle="Name, email and contact details" />
            <MenuRow icon="lock" title="Security" subtitle="Password, two-factor authentication" />
            <MenuRow icon="bell" title="Notifications" subtitle="Manage your notification preferences" />

            <Text style={styles.sectionTitle}>System</Text>
            <MenuRow icon="settings" title="Appearance" subtitle="Theme and display settings" />
            <MenuRow
              icon="users"
              title="Manage Administrators"
              subtitle="View and manage admin accounts"
              onPress={() => navigation?.navigate?.('Administrators')}
            />
            <MenuRow
              icon="shield"
              title="Permissions"
              subtitle="Roles and system permissions"
              onPress={() => navigation?.navigate?.('Permissions')}
            />
            <MenuRow
              icon="file-text"
              title="Audit Logs"
              subtitle="View system activity and changes"
              onPress={() => navigation?.navigate?.('Audit')}
            />
            <MenuRow icon="database" title="System Settings" subtitle="Application configuration" />

            <Text style={styles.sectionTitle}>Support</Text>
            <MenuRow icon="help-circle" title="Help & Support" subtitle="Get help or contact support" />
            <MenuRow icon="info" title="About" subtitle="App version and information" />

            <MenuRow
              icon="log-out"
              title="Logout"
              danger
              showChevron={false}
              onPress={onLogout}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  headerRow: { marginBottom: 4 },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, padding: spacing.lg,
  },
  name: { ...typography.h3, color: colors.textPrimary },
  role: { ...typography.caption, color: colors.textSecondary, marginTop: 2, fontWeight: '400' },
  email: { ...typography.caption, color: colors.textSecondary, marginTop: 2, fontWeight: '400' },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  roleTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.infoBg, paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radii.full,
  },
  roleTagLabel: { ...typography.small, color: colors.primary },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    borderColor: colors.primary, borderWidth: 1, borderRadius: radii.full,
    paddingVertical: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl,
  },
  editLabel: { ...typography.bodyBold, color: colors.primary },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
});
