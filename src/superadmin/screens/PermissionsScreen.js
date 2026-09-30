import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRecentPermissionChanges, getRolesAndPermissions } from '../api/adminApi';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import StatGrid from '../components/StatGrid';
import StatusBadge from '../components/StatusBadge';
import { colors, radii, spacing, typography } from '../theme/theme';

const CHANGE_ICONS = {
  add: { icon: 'plus', bg: colors.successBg, color: colors.success },
  update: { icon: 'edit-2', bg: colors.warningBg, color: colors.warning },
  remove: { icon: 'minus', bg: colors.dangerBg, color: colors.danger },
};

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

function RoleCard({ role }) {
  const icon = Feather.glyphMap[role.icon] ? role.icon : 'shield';
  const userCount = role.users ?? role.userCount ?? role.assignedUsers ?? 0;

  return (
    <View style={styles.roleCard}>
      <View style={styles.roleTop}>
        <View style={[styles.roleIcon, { backgroundColor: role.bg ?? role.iconBg ?? colors.infoBg }]}>
          <Feather name={icon} size={20} color={role.color ?? role.iconColor ?? colors.primary} />
        </View>
        <View style={styles.roleInfo}>
          <Text style={styles.roleName} numberOfLines={1}>{role.name}</Text>
          <View style={styles.usersRow}>
            <Feather name="users" size={13} color={colors.textSecondary} />
            <Text style={styles.usersText}>{userCount} users</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      </View>

      {role.description ? (
        <Text style={styles.roleDesc}>{role.description}</Text>
      ) : null}

      <View style={styles.roleBottom}>
        <StatusBadge status={role.status || 'Active'} />
      </View>
    </View>
  );
}

export default function PermissionsScreen({ navigation }) {
  const [view, setView] = useState('Roles');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const cycleStatusFilter = () => {
    setStatusFilter((current) => {
      const nextIndex = (STATUS_FILTERS.indexOf(current) + 1) % STATUS_FILTERS.length;
      return STATUS_FILTERS[nextIndex];
    });
  };

  const [data, setData] = useState(null);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const [rolesRes, changesRes] = await Promise.all([
        getRolesAndPermissions(),
        getRecentPermissionChanges(),
      ]);
      setData(rolesRes);
      setChanges(changesRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRoles = useMemo(() => {
    if (!data) return [];
    return data.roles
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      .filter((r) => statusFilter === 'All' || r.status === statusFilter);
  }, [data, search, statusFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Permissions" subtitle="Manage roles and system permissions" />

        {loading && !data ? (
          <LoadingView label="Loading permissions..." />
        ) : error ? (
          <ErrorView message={error} onRetry={load} />
        ) : (
          <>
            <StatGrid>
              <StatCard icon="users" iconBg={colors.infoBg} iconColor={colors.info} value={data.totalRoles} label="Total Roles" />
              <StatCard icon="check-circle" iconBg={colors.successBg} iconColor={colors.success} value={data.totalPermissions} label="Permissions" />
              <StatCard icon="user-check" iconBg={colors.infoBg} iconColor={colors.info} value={data.assignedUsers} label="Assigned Users" />
              <StatCard icon="clock" iconBg={colors.warningBg} iconColor={colors.warning} value={data.pendingChanges} label="Pending Changes" />
            </StatGrid>

            <View style={styles.toggleRow}>
              <Pressable
                style={[styles.toggleBtn, view === 'Roles' && styles.toggleBtnActive]}
                onPress={() => setView('Roles')}
              >
                <Text style={[styles.toggleLabel, view === 'Roles' && styles.toggleLabelActive]}>Roles</Text>
              </Pressable>
              <Pressable
                style={[styles.toggleBtn, view === 'Permissions' && styles.toggleBtnActive]}
                onPress={() => setView('Permissions')}
              >
                <Text style={[styles.toggleLabel, view === 'Permissions' && styles.toggleLabelActive]}>Permissions</Text>
              </Pressable>
            </View>

            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search roles..."
              onFilterPress={cycleStatusFilter}
              filterLabel={statusFilter === 'All' ? 'Filters' : statusFilter}
              filterActive={statusFilter !== 'All'}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Roles ({filteredRoles.length})</Text>
              <PrimaryButton
                label="Add Role"
                onPress={() => navigation?.navigate?.('AddRole')}
              />
            </View>

            {filteredRoles.length === 0 ? (
              <EmptyView message="No roles match your search" icon="shield" />
            ) : (
              filteredRoles.map((role) => <RoleCard key={role.id} role={role} />)
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Permission Changes</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
            {changes.map((change) => {
              const style = CHANGE_ICONS[change.type] || CHANGE_ICONS.update;
              return (
                <View key={change.id} style={styles.changeRow}>
                  <View style={[styles.changeIconWrap, { backgroundColor: style.bg }]}>
                    <Feather name={style.icon} size={14} color={style.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.changeTitle}>{change.title}</Text>
                    <Text style={styles.changeDetails}>{change.details}</Text>
                  </View>
                  <Text style={styles.changeTime}>{change.time}</Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  toggleRow: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radii.full,
    padding: 4, marginBottom: spacing.lg, borderColor: colors.border, borderWidth: 1,
  },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radii.full, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.primary },
  toggleLabel: { ...typography.bodyBold, color: colors.textSecondary },
  toggleLabelActive: { color: colors.background },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md, marginTop: spacing.lg, gap: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, flexShrink: 1 },
  viewAll: { ...typography.caption, color: colors.primary },

  roleCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md,
  },
  roleTop: { flexDirection: 'row', alignItems: 'center' },
  roleIcon: {
    width: 46, height: 46, borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
  },
  roleInfo: { flex: 1, minWidth: 0, marginHorizontal: spacing.md },
  roleName: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 16 },
  usersRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  usersText: { ...typography.small, color: colors.textSecondary, fontWeight: '400' },
  roleDesc: {
    ...typography.caption, color: colors.textSecondary, fontWeight: '400',
    marginTop: spacing.md, lineHeight: 20,
  },
  roleBottom: { flexDirection: 'row', marginTop: spacing.md },

  changeRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderBottomColor: colors.border, borderBottomWidth: 1,
  },
  changeIconWrap: {
    width: 32, height: 32, borderRadius: radii.full,
    alignItems: 'center', justifyContent: 'center',
  },
  changeTitle: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 14 },
  changeDetails: { ...typography.caption, color: colors.textSecondary, marginTop: 2, fontWeight: '400' },
  changeTime: { ...typography.small, color: colors.textMuted, fontWeight: '400' },
});