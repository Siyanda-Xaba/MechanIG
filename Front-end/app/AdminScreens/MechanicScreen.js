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
};

const STATUS_MAP = {
  verified: { color: colors.success, icon: 'checkmark-circle', label: 'Verified' },
  pending: { color: colors.warning, icon: 'time', label: 'Pending' },
  suspended: { color: colors.danger, icon: 'ban', label: 'Suspended' },
};

const FILTERS = [
  { key: 'all', label: 'All', icon: 'person' },
  { key: 'verified', label: 'Verified', icon: 'checkmark-circle' },
  { key: 'pending', label: 'Pending', icon: 'time' },
  { key: 'suspended', label: 'Suspended', icon: 'ban' },
];

/* Bottom tabs — "route" must match the screen names in your navigator */
const TABS = [
  { route: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { route: 'Users', label: 'Users', icon: 'people-outline', iconActive: 'people' },
  { route: 'Mechanics', label: 'Mechanics', icon: 'build-outline', iconActive: 'build' },
  { route: 'Operations', label: 'Operations', icon: 'document-text-outline', iconActive: 'document-text' },
  { route: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

const SUMMARY = [
  { icon: 'people', value: 28, label: 'Total Mechanics', color: colors.primary },
  { icon: 'checkmark-circle', value: 20, label: 'Verified', color: colors.success },
  { icon: 'time', value: 5, label: 'Pending Review', color: colors.warning },
  { icon: 'ban', value: 3, label: 'Suspended', color: colors.danger },
];

const MECHANICS = [
  { name: 'Carlos Mendez', shop: 'Mendez Auto Care', location: 'Austin, TX', status: 'verified', rating: 4.8, jobs: 124, note: 'Documents complete', action: 'View Profile' },
  { name: 'Priya Sharma', shop: 'Sharma Motors', location: 'San Jose, CA', status: 'verified', rating: 4.9, jobs: 342, note: 'Documents complete', action: 'View Profile' },
  { name: 'Marcus Bell', shop: "Bell's Garage", location: 'Atlanta, GA', status: 'pending', rating: 4.6, jobs: 28, note: '3/5 documents', action: 'Review Documents' },
  { name: 'Liam Carter', shop: 'Carter Auto Works', location: 'Denver, CO', status: 'verified', rating: 4.7, jobs: 96, note: 'Documents complete', action: 'View Profile' },
  { name: 'Daniel Kim', shop: 'DK Auto Repair', location: 'Seattle, WA', status: 'suspended', rating: 4.2, jobs: 18, note: 'Policy violation', action: 'View Profile' },
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
      <Ionicons name={meta.icon} size={12} color={meta.color} />
      <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

export default function MechanicsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MECHANICS.filter((m) => {
    const matchesFilter = activeFilter === 'all' || m.status === activeFilter;
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.shop.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase());
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
          <Text style={styles.headerTitle}>Mechanics</Text>
          <Text style={styles.headerSubtitle}>Manage mechanic accounts, verification, and performance.</Text>
        </View>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Ionicons name={f.icon} size={14} color={active ? colors.background : colors.textSecondary} />
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="Search by name, workshop, or location..."
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

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          {SUMMARY.map((s, i) => (
            <View key={i} style={styles.summaryCard}>
              <Ionicons name={s.icon} size={16} color={s.color} />
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>Showing {filtered.length} mechanics</Text>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort by: Newest</Text>
            <Ionicons name="chevron-down" size={14} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* List */}
        {filtered.map((m, i) => (
          <TouchableOpacity key={i} style={styles.mechCard} activeOpacity={0.8}>
            <View style={styles.mechTopRow}>
              <View style={styles.mechAvatar}>
                <Text style={styles.mechAvatarText}>
                  {m.name.split(' ').map((p) => p[0]).join('')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mechName}>{m.name}</Text>
                <Text style={styles.mechShop}>{m.shop}</Text>
                <View style={styles.mechLocationRow}>
                  <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.mechLocation}>{m.location}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>

            <View style={styles.mechMidRow}>
              <StatusBadge status={m.status} />
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.ratingText}>{m.rating} ({m.jobs} jobs)</Text>
              </View>
            </View>

            <View style={styles.mechBottomRow}>
              <View style={styles.noteRow}>
                <Ionicons name="document-text-outline" size={13} color={colors.textMuted} />
                <Text style={styles.noteText}>{m.note}</Text>
              </View>
              <TouchableOpacity style={[styles.actionBtn, m.status === 'pending' && styles.actionBtnFilled]}>
                <Text style={[styles.actionBtnText, m.status === 'pending' && styles.actionBtnTextFilled]}>
                  {m.action}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom tab bar — sits below the ScrollView so it stays pinned */}
      <BottomTabBar active="Mechanics" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { color: colors.text, fontSize: 30, fontWeight: '800' },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  filterRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 14 },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: colors.background },
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
  summaryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 18 },
  summaryCard: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 14, padding: 12, gap: 4,
  },
  summaryValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  summaryLabel: { color: colors.textSecondary, fontSize: 11 },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  listCount: { color: colors.textSecondary, fontSize: 13 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  mechCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 16,
    marginHorizontal: 20, padding: 14, marginBottom: 12,
  },
  mechTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mechAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
  mechAvatarText: { color: colors.text, fontWeight: '700' },
  mechName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  mechShop: { color: colors.textSecondary, fontSize: 13, marginTop: 1 },
  mechLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  mechLocation: { color: colors.textMuted, fontSize: 12 },
  mechMidRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.textSecondary, fontSize: 13 },
  mechBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  noteText: { color: colors.textMuted, fontSize: 12 },
  actionBtn: {
    borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  actionBtnFilled: { backgroundColor: colors.primary },
  actionBtnText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  actionBtnTextFilled: { color: colors.background },
  badge: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', gap: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },

  /* Bottom tab bar */
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 12, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
});