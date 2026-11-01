import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';
import { subscribeDashboardStats, subscribeRecentActivity } from '../api/adminApi';
import { formatSouthAfricaDate } from '../../utils/timeZone';
import StatCard from '../components/StatCard';
import StatGrid from '../components/StatGrid';
import ActivityRow from '../components/ActivityRow';
import { LoadingView, ErrorView } from '../components/StateViews';

const QUICK_ACTIONS = [

  { key: 'admins', icon: 'users', bg: colors.purpleBg, color: colors.purple, title: 'Manage Administrators', subtitle: 'Create, view and manage admin accounts', screen: 'Administrators' },
  { key: 'users', icon: 'user-check', bg: colors.infoBg, color: colors.info, title: 'Manage Users', subtitle: 'Review customer and mechanic profiles', screen: 'Users' },
  { key: 'permissions', icon: 'shield', bg: colors.successBg, color: colors.success, title: 'Roles & Permissions', subtitle: 'Manage platform access and policies', screen: 'Permissions' },
  { key: 'marketplace', icon: 'shopping-bag', bg: colors.warningBg, color: colors.warning, title: 'Manage Marketplace', subtitle: 'Oversee products, stores and listings', screen: 'Marketplace' },
  { key: 'audit', icon: 'file-text', bg: colors.infoBg, color: colors.info, title: 'View Audit Logs', subtitle: 'Monitor system and admin activity', screen: 'Audit' },
  { key: 'support', icon: 'headphones', bg: colors.dangerBg, color: colors.danger, title: 'Support Requests', subtitle: 'Review and resolve user issues', screen: 'Support' },
  { key: 'settings', icon: 'settings', bg: colors.surfaceAlt, color: colors.textSecondary, title: 'Platform Settings', subtitle: 'Configure global system settings', screen: 'Settings' },
];



export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeDashboardStats((nextStats) => {
      setStats(nextStats);
      setError(null);
      setLoading(false);
    }, (subscriptionError) => {
      setError(subscriptionError.message || 'Unable to load dashboard data.');
      setLoading(false);
    });
    const unsubscribeActivity = subscribeRecentActivity((recentActivity) => {
      setActivity(recentActivity);
    }, (activityError) => {
      setError(activityError.message || 'Unable to load recent activity.');
    });
    return () => {
      unsubscribe();
      unsubscribeActivity();
    };
  }, [reloadKey]);

  const today = new Date();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.superAdmin}>Super Admin</Text>
            <Text style={styles.subtitle}>Platform control center</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn}>
              <Feather name="bell" size={18} color={colors.textPrimary} />
              <View style={styles.badgeDot} />
            </Pressable>
            <Pressable
              style={styles.avatarBtn}
              onPress={() => navigation?.navigate?.('Profile')}
            >
              <Feather name="user" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.dateCard}>
          <View style={styles.dateIconWrap}>
            <Feather name="calendar" size={16} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.dateDay}>{formatSouthAfricaDate(today, { weekday: 'long' })}</Text>
            <Text style={styles.dateFull}>
              {formatSouthAfricaDate(today, { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {loading && !stats ? (
          <LoadingView label="Loading dashboard..." />
        ) : error ? (
          <ErrorView message={error} onRetry={() => {
            setError(null);
            setLoading(true);
            setReloadKey((current) => current + 1);
          }} />
        ) : (
          <>
            <StatGrid>
              <StatCard icon="users" iconBg={colors.infoBg} iconColor={colors.info} value={stats.totalUsers.toLocaleString()} label="Total Users" change={stats.totalUsersChange} />
              <StatCard icon="user-check" iconBg={colors.successBg} iconColor={colors.success} value={stats.activeUsers.toLocaleString()} label="Active Accounts" change={stats.activeUsersChange} />
              <StatCard icon="user-x" iconBg={colors.dangerBg} iconColor={colors.danger} value={stats.deletedUsers.toLocaleString()} label="Deleted Accounts" change="Access blocked in MechanIQ" />
              <StatCard icon="user" iconBg={colors.infoBg} iconColor={colors.info} value={stats.customers.toLocaleString()} label="Customers" change={stats.customerChange} />
              <StatCard icon="tool" iconBg={colors.successBg} iconColor={colors.success} value={stats.mechanics.toLocaleString()} label="Mechanics" change={stats.mechanicsChange} />
              <StatCard icon="calendar" iconBg={colors.infoBg} iconColor={colors.info} value={stats.totalBookings.toLocaleString()} label="Workshop Bookings" change={stats.bookingsChange} />
              <StatCard icon="truck" iconBg={colors.warningBg} iconColor={colors.warning} value={stats.serviceRequests.toLocaleString()} label="Mobile Requests" change={stats.serviceRequestsChange} />
              <StatCard icon="droplet" iconBg={colors.infoBg} iconColor={colors.info} value={stats.fuelRequests.toLocaleString()} label="Fuel Requests" change={stats.fuelRequestsChange} />
              <StatCard icon="droplet" iconBg={colors.infoBg} iconColor={colors.info} value={stats.fuelDeliveries.toLocaleString()} label="Fuel Deliveries" change={stats.fuelDeliveriesChange} />
              <StatCard icon="shield" iconBg={colors.purpleBg} iconColor={colors.purple} value={stats.administratorCount.toLocaleString()} label="Administrator Accounts" change={`${stats.activeAdministrators} active · ${stats.pendingAdministrators} pending`} />
              <StatCard icon="shopping-bag" iconBg={colors.warningBg} iconColor={colors.warning} value={stats.productCount.toLocaleString()} label="Marketplace Products" change={`${stats.activeProductCount} active listings`} />
              <StatCard icon="home" iconBg={colors.successBg} iconColor={colors.success} value={stats.storeCount.toLocaleString()} label="Marketplace Stores" change={`${stats.activeStoreCount} active stores`} />
            </StatGrid>

            <View style={styles.statusCard}>
              <View style={styles.statusDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>System Status</Text>
                <Text style={styles.statusSubtitle}>{stats.systemStatus}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
            <View style={styles.actionsGrid}>
              {QUICK_ACTIONS.map((action) => (
                <Pressable
                  key={action.key}
                  style={styles.actionCard}
                  onPress={() => action.screen && navigation?.navigate?.(action.screen)}
                >
                  <View style={styles.actionTop}>
                    <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                      <Feather name={action.icon} size={18} color={action.color} />
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.textMuted} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Platform Activity</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
            {activity.map((item) => (
              <ActivityRow key={item.id} activity={item} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  welcome: { ...typography.body, color: colors.primary },
  superAdmin: { ...typography.h1, color: colors.textPrimary, marginTop: 2 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: spacing.md },
  iconBtn: {
    width: 40, height: 40, borderRadius: radii.full,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute', top: 8, right: 9,
    width: 7, height: 7, borderRadius: 4, backgroundColor: colors.danger,
  },
  avatarBtn: {
    width: 40, height: 40, borderRadius: radii.full,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dateCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.xl, alignSelf: 'flex-start',
  },
  dateIconWrap: {
    width: 32, height: 32, borderRadius: radii.sm, backgroundColor: colors.infoBg,
    alignItems: 'center', justifyContent: 'center',
  },
  dateDay: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 13 },
  dateFull: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.successBg, borderRadius: radii.md,
    padding: spacing.lg, marginBottom: spacing.xxl,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  statusTitle: { ...typography.bodyBold, color: colors.textPrimary },
  statusSubtitle: { ...typography.caption, color: colors.success, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  viewAll: { ...typography.caption, color: colors.primary },
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xxl,
  },
  actionCard: {
    flexBasis: '31%', flexGrow: 1, minWidth: 150,
    backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: radii.lg, padding: spacing.lg,
  },
  actionTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  actionIconWrap: {
    width: 40, height: 40, borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
  },
  actionTitle: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: 4 },
  actionSubtitle: { ...typography.small, color: colors.textSecondary, fontWeight: '400' },
});
