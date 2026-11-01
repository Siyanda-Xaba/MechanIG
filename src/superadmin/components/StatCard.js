import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export default function StatCard({ icon, iconColor, iconBg, value, label, change }) {
  return (
    <View style={styles.card}>
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: iconBg || colors.infoBg }]}>
          <Feather name={icon} size={18} color={iconColor || colors.info} />
        </View>
      ) : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {change ? <Text style={styles.change}>{change}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minWidth: 140,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  value: { ...typography.h2, color: colors.textPrimary },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  change: { ...typography.small, color: colors.success, marginTop: spacing.sm },
});
