import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';
import Avatar from './Avatar';

const ACTION_STYLES = {
  CREATE: { bg: colors.successBg, text: colors.success },
  UPDATE: { bg: colors.infoBg, text: colors.info },
  LOGIN: { bg: colors.surfaceAlt, text: colors.textSecondary },
  DELETE: { bg: colors.dangerBg, text: colors.danger },
  ASSIGN: { bg: colors.purpleBg, text: colors.purple },
  EXPORT: { bg: colors.warningBg, text: colors.warning },
};

function truncate(text, maxChars) {
  if (!text) return '';
  return text.length > maxChars ? `${text.slice(0, maxChars - 1).trimEnd()}…` : text;
}

export default function AuditRow({ log, onPress }) {
  const actionStyle = ACTION_STYLES[log.action] || ACTION_STYLES.LOGIN;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.dateWrap}>
        <Text style={styles.date}>{log.date}</Text>
        <Text style={styles.time}>{log.time}</Text>
      </View>

      <View style={styles.userWrap}>
        <Avatar name={log.user} size={32} />
        <View style={styles.userTextWrap}>
          <Text style={styles.userName} numberOfLines={1}>{truncate(log.user, 16)}</Text>
          <Text style={styles.userRole} numberOfLines={1}>{truncate(log.role, 16)}</Text>
        </View>
      </View>

      <View style={[styles.actionBadge, { backgroundColor: actionStyle.bg }]}>
        <Text style={[styles.actionLabel, { color: actionStyle.text }]}>{log.action}</Text>
      </View>

      <Text style={styles.details} numberOfLines={1}>{log.details}</Text>

      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  pressed: { opacity: 0.7 },
  dateWrap: { width: 90, flexShrink: 0 },
  date: { ...typography.caption, color: colors.textPrimary },
  time: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  userWrap: { flexDirection: 'row', alignItems: 'center', width: 170, flexShrink: 0, overflow: 'hidden' },
  userTextWrap: { marginLeft: spacing.sm, flex: 1, minWidth: 0 },
  userName: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 13 },
  userRole: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  actionBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.sm,
    flexShrink: 0,
  },
  actionLabel: { ...typography.small },
  details: { flex: 1, ...typography.caption, color: colors.textSecondary },
});
