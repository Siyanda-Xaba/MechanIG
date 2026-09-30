import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radii, typography } from '../theme/theme';
import { getMarketplaceOverview, updateListingStatus } from '../api/platformApi';
import useAsync from '../api/useAsync';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import StatGrid from '../components/StatGrid';
import { LoadingView, ErrorView, EmptyView } from '../components/StateViews';

const TONE = {
  Live: { c: colors.success, bg: colors.successBg },
  Pending: { c: colors.warning, bg: colors.warningBg },
  Flagged: { c: colors.danger, bg: colors.dangerBg },
};

export default function MarketplaceScreen() {
  const { data, setData, loading, error, reload } = useAsync(getMarketplaceOverview);

  const setStatus = async (id, status) => {
    await updateListingStatus(id, status); // TODO backend: handle errors
    setData((d) => ({ ...d, items: d.items.map((i) => (i.id === id ? { ...i, status } : i)) }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Marketplace" subtitle="Oversee products, stores and listings" />
        {loading && !data ? <LoadingView label="Loading marketplace..." />
        : error ? <ErrorView message={error} onRetry={reload} />
        : (
          <>
            <StatGrid>
              <StatCard icon="package" iconBg={colors.infoBg} iconColor={colors.info} value={data.totalProducts} label="Products" />
              <StatCard icon="shopping-bag" iconBg={colors.successBg} iconColor={colors.success} value={data.stores} label="Stores" />
              <StatCard icon="clock" iconBg={colors.warningBg} iconColor={colors.warning} value={data.pendingApproval} label="Pending Approval" />
            </StatGrid>

            <Text style={styles.section}>Listings</Text>
            {data.items.length === 0 ? <EmptyView message="No listings yet" icon="shopping-bag" /> :
              data.items.map((item) => {
                const t = TONE[item.status] || TONE.Live;
                return (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.top}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.sub} numberOfLines={1}>{item.store}</Text>
                      </View>
                      <Text style={styles.price}>R{item.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.bottom}>
                      <View style={[styles.pill, { backgroundColor: t.bg }]}>
                        <Text style={[styles.pillText, { color: t.c }]}>{item.status}</Text>
                      </View>
                      {item.status !== 'Live' && (
                        <Pressable style={styles.btn} onPress={() => setStatus(item.id, 'Live')}>
                          <Text style={styles.btnText}>Approve</Text>
                        </Pressable>
                      )}
                      {item.status !== 'Flagged' && (
                        <Pressable style={[styles.btn, styles.btnDanger]} onPress={() => setStatus(item.id, 'Flagged')}>
                          <Text style={[styles.btnText, { color: colors.danger }]}>Flag</Text>
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
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  sub: { ...typography.small, color: colors.textSecondary, fontWeight: '400', marginTop: 2 },
  price: { ...typography.bodyBold, color: colors.textPrimary },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.full },
  pillText: { fontSize: 12, fontWeight: '600' },
  btn: {
    marginLeft: 'auto', paddingHorizontal: spacing.lg, paddingVertical: 6,
    borderRadius: radii.full, borderWidth: 1, borderColor: colors.primary,
  },
  btnDanger: { marginLeft: 0, borderColor: colors.danger },
  btnText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
});