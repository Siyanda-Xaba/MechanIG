import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export default function PrimaryButton({ label, icon = 'plus', onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {icon ? <Feather name={icon} size={16} color={colors.background} style={styles.icon} /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
  },
  pressed: { opacity: 0.85 },
  icon: { marginRight: spacing.sm },
  label: { ...typography.bodyBold, color: colors.background },
});
