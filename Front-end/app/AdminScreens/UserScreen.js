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
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  blue: '#3B82F6',
};

const STATUS_MAP = {
  active: { color: colors.success, icon: 'ellipse', label: 'Active' },
  inactive: { color: colors.danger, icon: 'ellipse', label: 'Inactive' },
  pending: { color: colors.warning, icon: 'ellipse', label: 'Pending' },
};

/* Filter tabs at the top of the screen (All / Customers / Mechanics) */
const TABS = [
  { key: 'all', label: 'All Users', icon: 'people' },
  { key: 'customers', label: 'Customers', icon: 'person' },
  { key: 'mechanics', label: 'Mechanics', icon: 'construct' },
];

/* Bottom navigation tabs — "route" must match the screen names in your navigator */
const NAV_TABS = [
  { route: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { route: 'Users', label: 'Users', icon: 'people-outline', iconActive: 'people' },
  { route: 'Mechanics', label: 'Mechanics', icon: 'build-outline', iconActive: 'build' },
  { route: 'Operations', label: 'Operations', icon: 'document-text-outline', iconActive: 'document-text' },
  { route: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

const SUMMARY = [
  { icon: 'people', value: '—', label: 'Total Users' },
  { icon: 'person', value: '—', label: 'Customers' },
  { icon: 'construct', value: '—', label: 'Mechanics' },
  { icon: 'shield-checkmark', value: '—', label: 'Pending Verification' },
];

const USERS = [
  { name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', status: 'active' },
  { name: 'Sarah Smith', email: 'sarah.smith@example.com', role: 'Customer', status: 'active' },
  { name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Mechanic', status: 'active' },
  { name: 'Lisa Brown', email: 'lisa.brown@example.com', role: 'Customer', status: 'inactive' },
  { name: 'David Wilson', email: 'david.wilson@example.com', role: 'Mechanic', status: 'pending' },
];

function BottomTabBar({ active, navigation }) {
  const insets = useSafeAreaInsets(); // keeps the bar above the phone's home indicator

  return (
    <View style={[styles.navBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {NAV_TABS.map((item) => {
        const isActive = item.route === active;
        const color = isActive ? colors.primary : colors.text;
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => {
              // only navigate if we're not already on that tab
              if (!isActive && navigation) navigation.navigate(item.route);
            }}
          >
            <Ionicons name={isActive ? item.iconActive : item.icon} size={24} color={color} />
            <Text style={[styles.navLabel, { color }, isActive && styles.navLabelActive]}>
              {item.label}
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
      <Ionicons name={meta.icon} size={10} color={meta.color} />
      <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

export default function UsersScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = USERS.filter((u) => {
    const matchesTab =
      tab === 'all' ||
      (tab === 'customers' && u.role === 'Customer') ||
      (tab === 'mechanics' && u.role === 'Mechanic');
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
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
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSubtitle}>Manage customer and mechanic accounts</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
              >
                <Ionicons name={t.icon} size={14} color={active ? colors.background : colors.textSecondary} />
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="Search by name, email or phone..."
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

        {/* Summary */}
        <View style={styles.summaryRow}>
          {SUMMARY.map((s, i) => (
            <View key={i} style={styles.summaryCard}>
              <View style={styles.summaryIconWrap}>
                <Ionicons name={s.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>Showing {filtered.length} users</Text>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort by: Newest</Text>
            <Ionicons name="chevron-down" size={14} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* List */}
        {filtered.map((u, i) => (
          <TouchableOpacity key={i} style={styles.userRow} activeOpacity={0.8}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={20} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userEmail}>{u.email}</Text>
              <View style={styles.joinedRow}>
                <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
                <Text style={styles.joinedText}>Joined —</Text>
              </View>
            </View>
            <View style={styles.userRight}>
              <View style={[styles.roleBadge, u.role === 'Mechanic' && styles.roleBadgeMechanic]}>
                <Text style={styles.roleBadgeText}>{u.role}</Text>
              </View>
              <StatusBadge status={u.status} />
            </View>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="ellipsis-horizontal" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Empty state (matches "No users to display" from mock, shown below the sample rows) */}
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={36} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No users to display</Text>
          <Text style={styles.emptyDesc}>
            User accounts will appear here when connected to the MechanIQ backend.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom navigation bar — sits below the ScrollView so it stays pinned */}
      <BottomTabBar active="Users" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { color: colors.text, fontSize: 30, fontWeight: '800' },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  tabBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: colors.background },
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 14 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 12, fontSize: 14 },
  filtersBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, paddingHorizontal: 14,
  },
  filtersBtnText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 18, flexWrap: 'wrap' },
  summaryCard: {
    flexBasis: '47%', flexGrow: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 14, padding: 12, gap: 4,
  },
  summaryIconWrap: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  summaryValue: { color: colors.text, fontSize: 18, fontWeight: '800' },
  summaryLabel: { color: colors.textSecondary, fontSize: 11 },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  listCount: { color: colors.textSecondary, fontSize: 13 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 16,
    marginHorizontal: 20, padding: 14, marginBottom: 12,
  },
  userAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  userName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  userEmail: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  joinedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  joinedText: { color: colors.textMuted, fontSize: 11 },
  userRight: { alignItems: 'flex-end', gap: 6 },
  roleBadge: {
    backgroundColor: colors.blue + '33', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  roleBadgeMechanic: { backgroundColor: colors.purple + '33' },
  roleBadgeText: { color: colors.text, fontSize: 11, fontWeight: '600' },
  moreBtn: { paddingLeft: 4 },
  badge: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4, gap: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  emptyState: {
    alignItems: 'center', marginHorizontal: 20, backgroundColor: colors.card, borderWidth: 1,
    borderColor: colors.cardBorder, borderRadius: 16, padding: 30, marginTop: 8,
  },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 10 },
  emptyDesc: { color: colors.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center', lineHeight: 18 },

  /* Bottom navigation bar */
  navBar: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  navLabel: { fontSize: 12, fontWeight: '500' },
  navLabelActive: { fontWeight: '700' },
});