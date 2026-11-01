import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { deleteAdministrator, getAdministrators, subscribeAdministrators, updateAdministrator } from '../api/adminApi';
import Avatar from '../components/Avatar';
import Pagination from '../components/Pagination';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import StatGrid from '../components/StatGrid';
import StatusBadge from '../components/StatusBadge';
import { colors, radii, spacing, typography } from '../theme/theme';

const TABS = ['All', 'Active', 'Inactive'];
const PAGE_SIZE = 8;

export default function AdministratorsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const [page, setPage] = useState(1);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getAdministrators({ search, page, pageSize: PAGE_SIZE });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => subscribeAdministrators((all) => {
    const filtered = all.filter((a) => `${a.name} ${a.email}`.toLowerCase().includes(search.toLowerCase()));
    const start = (page - 1) * PAGE_SIZE;
    setResult({ items: filtered.slice(start, start + PAGE_SIZE), total: filtered.length,
      totalAdministrators: all.length, active: all.filter((a) => a.status === 'Active').length,
      pending: all.filter((a) => a.status === 'Pending').length, suspended: all.filter((a) => a.status === 'Suspended').length });
    setLoading(false);
  }, setError), [search, page]);

  const manageAdmin = (admin) => Alert.alert(admin.name, 'Manage this administrator record', [
    { text: admin.status === 'Active' ? 'Suspend' : 'Activate', onPress: async () => {
      try { await updateAdministrator(admin.id, { status: admin.status === 'Active' ? 'Suspended' : 'Active' }); }
      catch (e) { Alert.alert('Could not update administrator', e.message); }
    } },
    { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Delete administrator?', `Remove ${admin.email} from the administrator list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteAdministrator(admin.id); } catch (e) { Alert.alert('Could not delete administrator', e.message); } } },
    ]) },
    { text: 'Cancel', style: 'cancel' },
  ]);

  const items = useMemo(() => {
    if (!result) return [];
    if (tab === 'Active') return result.items.filter((a) => a.status === 'Active');
    if (tab === 'Inactive') return result.items.filter((a) => a.status !== 'Active');
    return result.items;
  }, [result, tab]);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / PAGE_SIZE)) : 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Administrators"
          subtitle="Manage super admin and admin accounts"
          action={
            <PrimaryButton
              label="Add Administrator"
              onPress={() => navigation?.navigate?.('AddAdministrator')}
            />
          }
        />

        {loading && !result ? (
          <LoadingView label="Loading administrators..." />
        ) : error ? (
          <ErrorView message={error} onRetry={load} />
        ) : (
          <>
            <StatGrid>
              <StatCard icon="users" iconBg={colors.infoBg} iconColor={colors.info} value={result.totalAdministrators} label="Total Administrators" />
              <StatCard icon="check-circle" iconBg={colors.successBg} iconColor={colors.success} value={result.active} label="Active" />
              <StatCard icon="clock" iconBg={colors.warningBg} iconColor={colors.warning} value={result.pending} label="Pending" />
              <StatCard icon="user-x" iconBg={colors.dangerBg} iconColor={colors.danger} value={result.suspended} label="Suspended" />
            </StatGrid>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
              {TABS.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTab(t)}
                  style={[styles.tab, tab === t && styles.tabActive]}
                >
                  <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <SearchBar
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search administrators..."
            />

            {items.length === 0 ? (
              <EmptyView message="No administrators match your search" icon="users" />
            ) : (
              items.map((admin) => (
                <View key={admin.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Avatar name={admin.name} size={44} />
                    <View style={styles.info}>
                      <Text style={styles.name} numberOfLines={1}>{admin.name}</Text>
                      <Text style={styles.email} numberOfLines={1}>{admin.email}</Text>
                    </View>
                    <Pressable hitSlop={10} onPress={() => manageAdmin(admin)} accessibilityLabel={`Manage ${admin.name}`}>
                      <Feather name="more-vertical" size={18} color={colors.textMuted} />
                    </Pressable>
                  </View>

                  <View style={styles.cardBottom}>
                    <View style={styles.roleTag}>
                      <Feather
                        name={admin.role === 'Super Admin' ? 'award' : 'user'}
                        size={12}
                        color={colors.primary}
                      />
                      <Text style={styles.roleLabel} numberOfLines={1}>{admin.role}</Text>
                    </View>
                    <StatusBadge status={admin.status} />
                    <Text style={styles.lastActive} numberOfLines={1}>{admin.lastActive}</Text>
                  </View>
                </View>
              ))
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              showingLabel={`Showing ${items.length} of ${result.total} administrators`}
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
  tabsRow: { marginBottom: spacing.lg, flexGrow: 0 },
  tab: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radii.full, marginRight: spacing.sm,
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabLabel: { ...typography.bodyBold, color: colors.textSecondary, fontSize: 13 },
  tabLabelActive: { color: colors.background },
  card: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, minWidth: 0, marginLeft: spacing.md, marginRight: spacing.sm },
  name: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  email: { ...typography.small, color: colors.textSecondary, fontWeight: '400', marginTop: 2 },
  cardBottom: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    gap: spacing.sm, marginTop: spacing.md,
  },
  roleTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.infoBg, paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radii.full,
  },
  roleLabel: { ...typography.small, color: colors.primary },
  lastActive: {
    ...typography.caption, color: colors.textSecondary, fontWeight: '400',
    marginLeft: 'auto',
  },
});
