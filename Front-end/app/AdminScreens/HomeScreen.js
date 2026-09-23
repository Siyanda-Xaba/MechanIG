import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

/* Theme colors — kept here so this file works on its own */
const colors = {
  background: '#0A0F14',
  card: '#111823',
  cardBorder: '#1E2A38',
  primary: '#22D3EE',
  primaryDark: '#0E7490',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  danger: '#EF4444',
};

const overviewStats = [
  { icon: 'people', label: 'Total Customers', value: '—' },
  { icon: 'construct', label: 'Total Mechanics', value: '—' },
  { icon: 'calendar', label: 'Total Bookings', value: '—' },
  { icon: 'briefcase', label: 'Open Jobs', value: '—' },
];

const quickActions = [
  { icon: 'shield-checkmark', label: 'Verify\nMechanics' },
  { icon: 'people', label: 'Manage\nUsers' },
  { icon: 'storefront', label: 'Marketplace' },
  { icon: 'headset', label: 'Support\nRequests' },
];

/* Bottom tabs — "route" must match the screen names in your navigator */
const TABS = [
  { route: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { route: 'Users', label: 'Users', icon: 'people-outline', iconActive: 'people' },
  { route: 'Mechanics', label: 'Mechanics', icon: 'build-outline', iconActive: 'build' },
  { route: 'Operations', label: 'Operations', icon: 'document-text-outline', iconActive: 'document-text' },
  { route: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

function BottomTabBar({ active, navigation }) {
  const insets = useSafeAreaInsets(); // keeps the bar above the phone's home indicator

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const isActive = tab.route === active;
        const color = isActive ? colors.primary : colors.text;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => {
              // only navigate if we're not already on that tab
              if (!isActive && navigation) navigation.navigate(tab.route);
            }}
          >
            <Ionicons name={isActive ? tab.iconActive : tab.icon} size={24} color={color} />
            <Text style={[styles.tabLabel, { color }, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>
              MECHAN<Text style={{ color: colors.primary }}>IQ</Text>
            </Text>
            <Text style={styles.brandSub}>Smarter Automotive Care</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.bellBtn}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <Text style={styles.avatarLabel}>Admin</Text>
            </View>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.welcomeName}>Admin</Text>
          <Text style={styles.welcomeSub}>Platform operations and management</Text>
        </View>

        <TouchableOpacity style={styles.dateChip}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={styles.dateChipText}>{today}</Text>
        </TouchableOpacity>

        {/* Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAll}>View all</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {overviewStats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name={s.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>Backend data</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSub}>Manage platform operations</Text>
          </View>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAll}>View all</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {quickActions.map((a, i) => (
            <TouchableOpacity key={i} style={styles.actionCard}>
              <View style={styles.actionIconWrap}>
                <Ionicons name={a.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <View style={styles.actionArrowWrap}>
                <Ionicons name="arrow-forward" size={16} color={colors.text} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pending Attention */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Pending Attention</Text>
            <Text style={styles.sectionSub}>Items that require your review</Text>
          </View>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAll}>View all</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.card, styles.emptyCard]}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="time-outline" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>No pending items</Text>
            <Text style={styles.emptyDesc}>
              Pending operational items will appear here when connected to the backend.
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Platform Activity</Text>
            <Text style={styles.sectionSub}>Latest platform events</Text>
          </View>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAll}>View all</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.card, styles.emptyCard]}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>No recent activity</Text>
            <Text style={styles.emptyDesc}>Verified platform events will appear here.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom tab bar — sits below the ScrollView so it stays pinned */}
      <BottomTabBar active="Home" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 10,
  },
  brand: { color: colors.text, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  brandSub: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.danger,
  },
  avatarWrap: { alignItems: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card,
  },
  avatarText: { color: colors.primary, fontWeight: '700' },
  avatarLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  welcomeRow: { paddingHorizontal: 20, marginTop: 20 },
  welcomeText: { color: colors.textSecondary, fontSize: 15 },
  welcomeName: { color: colors.text, fontSize: 28, fontWeight: '800' },
  welcomeSub: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  dateChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    marginHorizontal: 20, marginTop: 14, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  dateChipText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, marginTop: 26, marginBottom: 12,
  },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '700' },
  sectionSub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  viewAll: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  statCard: {
    width: '47%', marginBottom: 12, backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.cardBorder, padding: 16,
  },
  statIconWrap: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  statSub: { color: colors.textMuted, fontSize: 12, marginTop: 6, fontWeight: '600' },
  actionCard: {
    width: '23.5%', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1,
    borderColor: colors.cardBorder, paddingVertical: 16, paddingHorizontal: 8,
    alignItems: 'center', marginBottom: 12,
  },
  actionIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  actionLabel: { color: colors.text, fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
  actionArrowWrap: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  card: {
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.cardBorder,
    marginHorizontal: 20, padding: 16,
  },
  emptyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  emptyIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  emptyDesc: { color: colors.textSecondary, fontSize: 13, marginTop: 4, lineHeight: 18 },

  /* Bottom tab bar */
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 12, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
});