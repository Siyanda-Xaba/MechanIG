import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { deleteManagedUser, subscribeManagedUsers, updateManagedUser } from '../api/adminApi';
import ScreenHeader from '../components/ScreenHeader';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { colors, radii, spacing, typography } from '../theme/theme';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => subscribeManagedUsers((items) => { setUsers(items); setLoading(false); setError(null); }, (e) => { setError(e.message); setLoading(false); }), []);
  const filtered = useMemo(() => users.filter((user) => `${user.firstName || ''} ${user.lastName || ''} ${user.fullName || ''} ${user.email || ''}`.toLowerCase().includes(search.toLowerCase())), [users, search]);
  const manage = (user) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || user.email || 'User';
    Alert.alert(name, 'Manage this user profile', [
      { text: user.status === 'Suspended' ? 'Reactivate' : 'Suspend', onPress: async () => { try { await updateManagedUser(user.id, { status: user.status === 'Suspended' ? 'Active' : 'Suspended' }); } catch (e) { Alert.alert('Could not update user', e.message); } } },
      { text: 'Delete profile', style: 'destructive', onPress: () => Alert.alert('Delete user profile?', 'This removes the Firestore profile only. Firebase Authentication credentials are not deleted from the client.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteManagedUser(user.id); } catch (e) { Alert.alert('Could not delete user', e.message); } } },
      ]) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Users" subtitle="Review customer and mechanic profiles" />
      <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search users by name or email" placeholderTextColor={colors.textMuted} autoCapitalize="none" />
      {loading ? <LoadingView label="Loading users..." /> : error ? <ErrorView message={error} /> : filtered.length === 0 ? <EmptyView message="No user profiles found" icon="users" /> : filtered.map((user) => {
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || user.email || 'User';
        return <View key={user.id} style={styles.card}>
          <View style={styles.identity}><View style={styles.avatar}><Feather name={user.role === 'mechanic' ? 'tool' : 'user'} size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.name}>{name}</Text><Text style={styles.email}>{user.email || 'No email'}</Text></View><Pressable onPress={() => manage(user)} hitSlop={10}><Feather name="more-vertical" size={19} color={colors.textMuted} /></Pressable></View>
          <Text style={styles.meta}>{user.role || 'user'}  ·  {user.status || 'Active'}</Text>
        </View>;
      })}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, container: { padding: spacing.xl, paddingBottom: spacing.xxxl }, search: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.md, padding: spacing.md, color: colors.textPrimary, marginBottom: spacing.md }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md }, identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' }, name: { ...typography.bodyBold, color: colors.textPrimary }, email: { ...typography.small, color: colors.textSecondary, marginTop: 2 }, meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.md, textTransform: 'capitalize' } });
