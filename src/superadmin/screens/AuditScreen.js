import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';
import { getAuditLogs, exportAuditLogs, subscribeAuditLogs } from '../api/adminApi';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import StatGrid from '../components/StatGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { LoadingView, ErrorView, EmptyView } from '../components/StateViews';

const PAGE_SIZE = 10;

function LogCard({ log }) {
  const userObj = typeof log.user === 'object' && log.user !== null ? log.user : null;
  const userName = userObj?.name ?? (typeof log.user === 'string' ? log.user : null) ?? log.userName ?? log.actor ?? 'Unknown';
  const userEmail = userObj?.email ?? log.email ?? log.userEmail ?? '';
  const when =
    log.dateTime ?? log.timestamp ??
    [log.date, log.time].filter(Boolean).join('  ·  ');

  return (
    <View style={styles.logCard}>
      <View style={styles.logTop}>
        <View style={styles.actionTag}>
          <Text style={styles.actionText} numberOfLines={1}>{log.action}</Text>
        </View>
        <Text style={styles.when} numberOfLines={1}>{when}</Text>
      </View>

      <View style={styles.userRow}>
        <Feather name="user" size={14} color={colors.textSecondary} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          {userEmail ? <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text> : null}
        </View>
      </View>

      {log.details ? <Text style={styles.details}>{log.details}</Text> : null}
    </View>
  );
}

export default function AuditScreen() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getAuditLogs({ search, page, pageSize: PAGE_SIZE });
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => subscribeAuditLogs((logs) => {
    const filtered = logs.filter((log) => `${log.actorEmail || ''} ${log.details || ''} ${log.action || ''}`.toLowerCase().includes(search.toLowerCase()));
    const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((log) => ({
      ...log, user: log.actorEmail || 'System', dateTime: log.timestamp || log.createdAt,
    }));
    setData({ items, total: filtered.length,
      userActions: filtered.filter((x) => x.targetType === 'user').length,
      systemChanges: filtered.filter((x) => x.targetType !== 'user').length,
      securityEvents: filtered.filter((x) => /LOGIN|SECURITY|AUTH/.test(x.action || '')).length });
    setLoading(false);
  }, setError), [search, page]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAuditLogs();
    } finally {
      setExporting(false);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Audit" subtitle="Monitor system activity and changes" />

        {loading && !data ? (
          <LoadingView label="Loading audit logs..." />
        ) : error ? (
          <ErrorView message={error} onRetry={load} />
        ) : (
          <>
            <StatGrid>
              <StatCard icon="file-text" iconBg={colors.infoBg} iconColor={colors.info} value={data.total.toLocaleString()} label="Total Logs" />
              <StatCard icon="user" iconBg={colors.successBg} iconColor={colors.success} value={data.userActions} label="User Actions" />
              <StatCard icon="settings" iconBg={colors.infoBg} iconColor={colors.info} value={data.systemChanges} label="System Changes" />
              <StatCard icon="shield" iconBg={colors.warningBg} iconColor={colors.warning} value={data.securityEvents} label="Security Events" />
            </StatGrid>

            <SearchBar
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search audit logs..."
              showFilter={false}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Audit Logs</Text>
              <Pressable style={styles.exportBtn} onPress={handleExport} disabled={exporting}>
                <Feather name="download" size={14} color={colors.primary} />
                <Text style={styles.exportLabel}>{exporting ? 'Exporting...' : 'Export Logs'}</Text>
              </Pressable>
            </View>

            {data.items.length === 0 ? (
              <EmptyView message="No audit logs match your search" icon="file-text" />
            ) : (
              data.items.map((log) => <LogCard key={log.id} log={log} />)
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              showingLabel={`Showing ${(page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, data.total)} of ${data.total} logs`}
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
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md, gap: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, flexShrink: 1 },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    borderColor: colors.border, borderWidth: 1, borderRadius: radii.full,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  exportLabel: { ...typography.bodyBold, color: colors.primary, fontSize: 13 },

  logCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md,
  },
  logTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionTag: {
    backgroundColor: colors.infoBg, paddingHorizontal: spacing.md, paddingVertical: 5,
    borderRadius: radii.full, flexShrink: 1,
  },
  actionText: { ...typography.small, color: colors.primary, fontWeight: '600' },
  when: { ...typography.small, color: colors.textMuted, fontWeight: '400' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  userName: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 14 },
  userEmail: { ...typography.small, color: colors.textSecondary, fontWeight: '400', marginTop: 2 },
  details: {
    ...typography.caption, color: colors.textSecondary, fontWeight: '400',
    marginTop: spacing.md, lineHeight: 20,
  },
});
