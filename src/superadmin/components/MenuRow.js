import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export default function MenuRow({ icon, title, subtitle, onPress, danger = false, showChevron = true }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, danger && styles.dangerRow]}
    >
      {icon ? (
        <View style={[styles.iconWrap, danger && styles.dangerIconWrap]}>
          <Feather name={icon} size={18} color={danger ? colors.danger : colors.textPrimary} />
        </View>
      ) : null}
      <View style={styles.textWrap}>
        <Text style={[styles.title, danger && { color: colors.danger }]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {showChevron && !danger ? (
        <Feather name="chevron-right" size={20} color={colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  dangerRow: {
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dangerIconWrap: { backgroundColor: 'transparent', marginRight: spacing.sm, width: 'auto', height: 'auto' },
  textWrap: { flex: 1 },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
