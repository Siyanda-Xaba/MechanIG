import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

const TYPE_STYLES = {
  user: { icon: 'user', bg: colors.successBg, color: colors.success },
  mechanic: { icon: 'tool', bg: colors.infoBg, color: colors.info },
  booking: { icon: 'calendar', bg: colors.infoBg, color: colors.info },
  product: { icon: 'shopping-bag', bg: colors.warningBg, color: colors.warning },
  support: { icon: 'headphones', bg: colors.dangerBg, color: colors.danger },
};

export default function ActivityRow({ activity, onPress }) {
  const style = TYPE_STYLES[activity.type] || TYPE_STYLES.user;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: style.bg }]}>
        <Feather name={style.icon} size={16} color={style.color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.subtitle}>{activity.details}</Text>
      </View>
      <Text style={styles.time}>{activity.time}</Text>
      <Feather name="chevron-right" size={16} color={colors.textMuted} />
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
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  pressed: { opacity: 0.75 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  title: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 14 },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  time: { ...typography.small, color: colors.textMuted },
});
