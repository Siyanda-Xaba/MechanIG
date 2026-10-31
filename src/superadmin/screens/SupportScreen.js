import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '../theme/theme';
import { getSupportRequests, updateSupportStatus } from '../api/platformApi';
import useAsync from '../api/useAsync';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import StatGrid from '../components/StatGrid';
import { LoadingView, ErrorView, EmptyView } from '../components/StateViews';

const PRIORITY = {
  High: { c: colors.danger, bg: colors.dangerBg },
  Medium: { c: colors.warning, bg: colors.warningBg },
  Low: { c: colors.info, bg: colors.infoBg },
};

export default function SupportScreen() {
  const { data, setData, loading, error, reload } = useAsync(getSupportRequests);

  const setStatus = async (id, status) => {
    await updateSupportStatus(id, status); // TODO backend: handle errors
    setData((d) => ({ ...d, items: d.items.map((i) => (i.id === id ? { ...i, status } : i)) }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Support Requests" subtitle="Review and resolve user issues" />
        {loading && !data ? <LoadingView label="Loading requests..." />
        : error ? <ErrorView message={error} onRetry={reload} />
        : (
          <>
            <StatGrid>
              <StatCard icon="inbox" iconBg={colors.dangerBg} iconColor={colors.danger} value={data.open} label="Open" />
              <StatCard icon="clock" iconBg={colors.warningBg} iconColor={colors.warning} value={data.inProgress} label="In Progress" />
              <StatCard icon="check-circle" iconBg={colors.successBg} iconColor={colors.success} value={data.resolved} label="Resolved" />
            </StatGrid>

            <Text style={styles.section}>Requests</Text>
            {data.items.length === 0 ? <EmptyView message="No support requests" icon="headphones" /> :
              data.items.map((r) => {
                const p = PRIORITY[r.priority] || PRIORITY.Low;
                return (
                  <View key={r.id} style={styles.card}>
                    <View style={styles.top}>
                      <View style={[styles.pill, { backgroundColor: p.bg }]}>
                        <Text style={[styles.pillText, { color: p.c }]}>{r.priority}</Text>
                      </View>
                      <Text style={styles.time}>{r.time}</Text>
                    </View>
                    <Text style={styles.subject}>{r.subject}</Text>
                    <Text style={styles.user}>From {r.user}</Text>
                    <View style={styles.bottom}>
                      <Text style={styles.status}>{r.status}</Text>
                      {r.status !== 'Resolved' && (
                        <Pressable style={styles.btn} onPress={() => setStatus(r.id, 'Resolved')}>
                          <Text style={styles.btnText}>Mark resolved</Text>
                        </Pressable>
                      )}
                    </View>
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
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  section: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.full },
  pillText: { fontSize: 12, fontWeight: '600' },
  time: { ...typography.small, color: colors.textMuted, fontWeight: '400' },
  subject: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15, marginTop: spacing.md },
  user: { ...typography.small, color: colors.textSecondary, fontWeight: '400', marginTop: 2 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  status: { ...typography.small, color: colors.textSecondary },
  btn: { paddingHorizontal: spacing.lg, paddingVertical: 6, borderRadius: radii.full, borderWidth: 1, borderColor: colors.primary },
  btnText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
});