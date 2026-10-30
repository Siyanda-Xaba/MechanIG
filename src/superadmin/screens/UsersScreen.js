import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { deleteManagedUser, subscribeManagedUsers } from '../api/adminApi';
import ScreenHeader from '../components/ScreenHeader';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { colors, radii, spacing, typography } from '../theme/theme';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  useEffect(() => subscribeManagedUsers((items) => { setUsers(items); setLoading(false); setError(null); }, (e) => { setError(e.message); setLoading(false); }), []);
  const filtered = useMemo(() => users.filter((user) => `${user.firstName || ''} ${user.lastName || ''} ${user.fullName || ''} ${user.email || ''}`.toLowerCase().includes(search.toLowerCase())), [users, search]);
  function confirmDelete(user) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || user.email || 'this user';
    Alert.alert(
      'Delete this user?',
      `This marks ${name} as deleted and blocks future MechanIQ sign-ins. Firebase Authentication and historical records are retained; they are not permanently erased.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete user',
          style: 'destructive',
          onPress: async () => {
            setDeletingUserId(user.id);
            setActionError(null);
            try {
              await deleteManagedUser(user.id);
            } catch (deleteError) {
              setActionError(deleteError?.message || 'The user could not be deleted.');
            } finally {
              setDeletingUserId(null);
            }
          },
        },
      ],
    );
  }
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Users" subtitle="Review customer and mechanic profiles" />
      <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search users by name or email" placeholderTextColor={colors.textMuted} autoCapitalize="none" />
      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}
      {loading ? <LoadingView label="Loading users..." /> : error ? <ErrorView message={error} /> : filtered.length === 0 ? <EmptyView message="No user profiles found" icon="users" /> : filtered.map((user) => {
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || user.email || 'User';
        return <View key={user.id} style={styles.card}>
          <View style={styles.identity}><View style={styles.avatar}><Feather name={user.role === 'mechanic' ? 'tool' : 'user'} size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.name}>{name}</Text><Text style={styles.email}>{user.email || 'No email'}</Text></View></View>
          <View style={styles.footer}><Text style={styles.meta}>{user.role || 'user'}  ·  {user.status || 'Active'}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Delete ${name}`} disabled={deletingUserId === user.id || String(user.status).toLowerCase() === 'deleted'} onPress={() => confirmDelete(user)} style={styles.deleteButton}><Feather name="trash-2" size={15} color={colors.danger} /><Text style={styles.deleteText}>{deletingUserId === user.id ? 'Deleting…' : String(user.status).toLowerCase() === 'deleted' ? 'Deleted' : 'Delete'}</Text></Pressable></View>
        </View>;
      })}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, container: { padding: spacing.xl, paddingBottom: spacing.xxxl }, search: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.md, padding: spacing.md, color: colors.textPrimary, marginBottom: spacing.md }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.md }, identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' }, name: { ...typography.bodyBold, color: colors.textPrimary }, email: { ...typography.small, color: colors.textSecondary, marginTop: 2 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, marginTop: spacing.md }, meta: { ...typography.caption, color: colors.textMuted, textTransform: 'capitalize' }, deleteButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.danger, borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }, deleteText: { ...typography.small, color: colors.danger }, error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md } });
