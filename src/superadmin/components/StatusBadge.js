import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '../theme/theme';

const STATUS_STYLES = {
  Active: { dot: colors.success, bg: colors.successBg, text: colors.success },
  Pending: { dot: colors.warning, bg: colors.warningBg, text: colors.warning },
  Suspended: { dot: colors.danger, bg: colors.dangerBg, text: colors.danger },
  Inactive: { dot: colors.textMuted, bg: 'rgba(138,155,168,0.15)', text: colors.textSecondary },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Inactive;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <View style={[styles.dot, { backgroundColor: style.dot }]} />
      <Text style={[styles.label, { color: style.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: spacing.sm },
  label: { ...typography.small },
});
