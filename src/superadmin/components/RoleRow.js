import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';
import StatusBadge from './StatusBadge';

export default function RoleRow({ role, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${role.color}26` }]}>
        <Feather name={role.icon || 'shield'} size={18} color={role.color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{role.name}</Text>
        <Text style={styles.subtitle}>{role.description}</Text>
      </View>
      <View style={styles.usersWrap}>
        <Feather name="users" size={13} color={colors.textSecondary} />
        <Text style={styles.usersLabel}>{role.users} users</Text>
      </View>
      <StatusBadge status={role.status} />
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  pressed: { opacity: 0.8 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  usersWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  usersLabel: { ...typography.small, color: colors.textSecondary },
});
