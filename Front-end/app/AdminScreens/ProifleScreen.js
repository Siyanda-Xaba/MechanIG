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
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#22C55E',
  danger: '#EF4444',
};

const ACCOUNT_ITEMS = [
  { icon: 'person-outline', title: 'Personal Information', sub: 'View and update your details' },
  { icon: 'mail-outline', title: 'Email & Security', sub: 'Manage your email, password and 2FA' },
  { icon: 'shield-checkmark-outline', title: 'Role & Permissions', sub: 'View your role and access levels' },
];

const PREFERENCE_ITEMS = [
  { icon: 'notifications-outline', title: 'Notifications', sub: 'Manage your notification preferences' },
  { icon: 'color-palette-outline', title: 'Appearance', sub: 'Light / Dark mode and theme settings' },
  { icon: 'globe-outline', title: 'Language', sub: 'App language and region' },
];

const SUPPORT_ITEMS = [
  { icon: 'help-circle-outline', title: 'Help & Support', sub: 'Get help or contact the support team' },
  { icon: 'document-text-outline', title: 'Terms & Privacy', sub: 'View our terms of service and privacy policy' },
  { icon: 'information-circle-outline', title: 'About MechanIQ', sub: 'App version and information' },
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

function SettingsRow({ icon, title, sub, isLast }) {
  return (
    <TouchableOpacity style={[styles.row, !isLast && styles.rowDivider]} activeOpacity={0.7}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function SettingsSection({ title, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, i) => (
          <SettingsRow key={i} {...item} isLast={i === items.length - 1} />
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your admin account and settings</Text>
        </View>

        {/* Profile card */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={34} color={colors.textMuted} />
            </View>
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={12} color={colors.text} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Admin User</Text>
            <Text style={styles.profileEmail}>admin@example.com</Text>
            <View style={styles.profileBadgeRow}>
              <View style={styles.roleBadge}>
                <Ionicons name="shield-outline" size={12} color={colors.primary} />
                <Text style={styles.roleBadgeText}>Administrator</Text>
              </View>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.memberSince}>Member since —</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <SettingsSection title="Account" items={ACCOUNT_ITEMS} />
        <SettingsSection title="Preferences" items={PREFERENCE_ITEMS} />
        <SettingsSection title="Support" items={SUPPORT_ITEMS} />

        <TouchableOpacity style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom tab bar — sits below the ScrollView so it stays pinned */}
      <BottomTabBar active="Profile" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { color: colors.text, fontSize: 30, fontWeight: '800' },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 16,
    marginHorizontal: 20, padding: 16, marginBottom: 24,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.background, borderWidth: 2, borderColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  profileName: { color: colors.text, fontSize: 17, fontWeight: '700' },
  profileEmail: { color: colors.textSecondary, fontSize: 13, marginTop: 1 },
  profileBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary + '55',
    backgroundColor: colors.primary + '15', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  roleBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.success + '15',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  activeBadgeText: { color: colors.success, fontSize: 11, fontWeight: '600' },
  memberSince: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  section: { marginBottom: 22, paddingHorizontal: 20 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  sectionCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 16,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  rowIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
  rowSub: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.danger + '15', borderWidth: 1, borderColor: colors.danger + '40',
    borderRadius: 14, marginHorizontal: 20, paddingVertical: 14, marginTop: 4,
  },
  signOutText: { color: colors.danger, fontSize: 15, fontWeight: '700' },

  /* Bottom tab bar */
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 12, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
});