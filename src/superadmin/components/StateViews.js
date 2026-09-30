import React from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export function LoadingView({ label = 'Loading...' }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function ErrorView({ message = 'Something went wrong', onRetry }) {
  return (
    <View style={styles.center}>
      <Feather name="alert-triangle" size={28} color={colors.danger} />
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyView({ message = 'Nothing here yet', icon = 'inbox' }) {
  return (
    <View style={styles.center}>
      <Feather name={icon} size={28} color={colors.textMuted} />
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  muted: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  errorText: { ...typography.body, color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
  retryBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryLabel: { ...typography.bodyBold, color: colors.primary },
});
