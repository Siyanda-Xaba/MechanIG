import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
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
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  blue: '#3B82F6',
};

/* Segmented filter at the top (All / Bookings / Jobs / Marketplace / Support) */
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'support', label: 'Support' },
];

/* Bottom tabs — "route" must match the screen names in your navigator */
const TABS = [
  { route: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { route: 'Users', label: 'Users', icon: 'people-outline', iconActive: 'people' },
  { route: 'Mechanics', label: 'Mechanics', icon: 'build-outline', iconActive: 'build' },
  { route: 'Operations', label: 'Operations', icon: 'document-text-outline', iconActive: 'document-text' },
  { route: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

/* "good" = whether the trend is good news (green) or bad news (red) */
const SUMMARY = [
  { icon: 'calendar', value: 12, label: 'Total Bookings', change: '+20%', up: true, good: true, color: colors.primary },
  { icon: 'briefcase', value: 8, label: 'Open Jobs', change: '+14%', up: true, good: false, color: colors.blue },
  { icon: 'cart', value: 5, label: 'Marketplace Items', change: '-29%', up: false, good: true, color: colors.success },
  { icon: 'headset', value: 7, label: 'Support Requests', change: '+40%', up: true, good: false, color: colors.danger },
];

/* Icon + colour for each type of operation */
const TYPE_MAP = {
  bookings: { icon: 'calendar', color: colors.primary },
  jobs: { icon: 'briefcase', color: colors.blue },
  marketplace: { icon: 'cart', color: colors.success },
  support: { icon: 'headset', color: colors.danger },
};

const STATUS_MAP = {
  pending: { color: colors.warning, icon: 'time', label: 'Pending' },
  progress: { color: colors.blue, icon: 'play-circle', label: 'In Progress' },
  review: { color: colors.purple, icon: 'eye', label: 'Under Review' },
  urgent: { color: colors.danger, icon: 'alert-circle', label: 'Urgent' },
  completed: { color: colors.success, icon: 'checkmark-circle', label: 'Completed' },
};

const OPERATIONS = [
  { type: 'bookings', title: 'Booking Request', ref: '#BK-2024-00123', detail: 'Customer: Sarah Smith', status: 'pending', time: '2 hours ago' },
  { type: 'jobs', title: 'Job Assigned', ref: '#JOB-2024-00456', detail: 'Mechanic: Mike Johnson', status: 'progress', time: '3 hours ago' },
  { type: 'marketplace', title: 'Marketplace Listing', ref: '#MP-2024-00789', detail: 'Product: Brake Pads (Front)', status: 'review', time: '5 hours ago' },
  { type: 'support', title: 'Support Request', ref: '#SR-2024-00234', detail: 'Customer: David Wilson', status: 'urgent', time: '6 hours ago' },
  { type: 'bookings', title: 'Booking Completed', ref: '#BK-2024-00122', detail: 'Customer: Lisa Brown', status: 'completed', time: '1 day ago' },
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

function StatusBadge({ status }) {
  const meta = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <View style={[styles.badge, { backgroundColor: meta.color + '22', borderColor: meta.color + '55' }]}>
      <Ionicons name={meta.icon} size={11} color={meta.color} />
      <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

export default function OperationsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = OPERATIONS.filter((op) => {
    const matchesFilter = activeFilter === 'all' || op.type === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      op.title.toLowerCase().includes(q) ||
      op.ref.toLowerCase().includes(q) ||
      op.detail.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Operations</Text>
          <Text style={styles.headerSubtitle}>Manage bookings, jobs, marketplace and support</Text>
        </View>

        {/* Segmented filter */}
        <View style={styles.segmentWrap}>
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.segmentBtn, active && styles.segmentBtnActive]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.segmentText, active && styles.segmentTextActive]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          {SUMMARY.map((s, i) => {
            const trendColor = s.good ? colors.success : colors.danger;
            return (
              <View key={i} style={styles.summaryCard}>
                <View style={[styles.summaryIconWrap, { backgroundColor: s.color + '22' }]}>
                  <Ionicons name={s.icon} size={16} color={s.color} />
                </View>
                <Text style={styles.summaryValue}>{s.value}</Text>
                <Text style={styles.summaryLabel} numberOfLines={2}>{s.label}</Text>
                <View style={styles.trendRow}>
                  <Ionicons name={s.up ? 'trending-up' : 'trending-down'} size={11} color={trendColor} />
                  <Text style={[styles.trendText, { color: trendColor }]}>{s.change}</Text>
                </View>
                <Text style={styles.trendSub}>vs last 7 days</Text>
              </View>
            );
          })}
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="Search by reference, user, mechanic or type..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filtersBtn}>
            <Ionicons name="options-outline" size={16} color={colors.primary} />
            <Text style={styles.filtersBtnText}>Filters</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Recent Operations</Text>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort by: Newest</Text>
            <Ionicons name="chevron-down" size={14} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* List */}
        {filtered.map((op, i) => {
          const type = TYPE_MAP[op.type];
          return (
            <TouchableOpacity key={i} style={styles.opRow} activeOpacity={0.8}>
              <View style={[styles.opIconWrap, { backgroundColor: type.color + '22' }]}>
                <Ionicons name={type.icon} size={20} color={type.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.opTitle}>{op.title}</Text>
                <Text style={styles.opRef}>{op.ref}</Text>
                <Text style={styles.opDetail}>{op.detail}</Text>
              </View>
              <View style={styles.opRight}>
                <StatusBadge status={op.status} />
                <Text style={styles.opTime}>{op.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {/* Empty state */}
        <View style={styles.emptyState}>
          <Ionicons name="file-tray-outline" size={32} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No more operations</Text>
          <Text style={styles.emptyDesc}>
            New bookings, jobs, marketplace items and support requests will appear here.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom tab bar — sits below the ScrollView so it stays pinned */}
      <BottomTabBar active="Operations" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { color: colors.text, fontSize: 30, fontWeight: '800' },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  segmentWrap: {
    flexDirection: 'row', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 14, marginHorizontal: 20, padding: 4, marginBottom: 14,
  },
  segmentBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10,
  },
  segmentBtnActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  segmentTextActive: { color: colors.background, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 14, padding: 10, gap: 3,
  },
  summaryIconWrap: {
    width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  summaryValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
  summaryLabel: { color: colors.textSecondary, fontSize: 10, minHeight: 26 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  trendText: { fontSize: 10, fontWeight: '700' },
  trendSub: { color: colors.textMuted, fontSize: 9 },
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 12, fontSize: 13 },
  filtersBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, paddingHorizontal: 14,
  },
  filtersBtnText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  listTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  opRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 16,
    marginHorizontal: 20, padding: 12, marginBottom: 10,
  },
  opIconWrap: {
    width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  opTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  opRef: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  opDetail: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  opRight: { alignItems: 'flex-end', gap: 6 },
  opTime: { color: colors.textMuted, fontSize: 10 },
  badge: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4, gap: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  emptyState: {
    alignItems: 'center', marginHorizontal: 20, backgroundColor: colors.card, borderWidth: 1,
    borderColor: colors.cardBorder, borderRadius: 16, padding: 26, marginTop: 4,
  },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 10 },
  emptyDesc: { color: colors.textSecondary, fontSize: 12, marginTop: 6, textAlign: 'center', lineHeight: 17 },

  /* Bottom tab bar */
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 12, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
});