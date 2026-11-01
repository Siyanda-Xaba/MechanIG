import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export default function Pagination({ page, totalPages, onPageChange, showingLabel }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <View style={styles.row}>
      {showingLabel ? <Text style={styles.label}>{showingLabel}</Text> : <View />}
      <View style={styles.controls}>
        <Pressable
          disabled={page <= 1}
          onPress={() => onPageChange(page - 1)}
          style={[styles.arrow, page <= 1 && styles.disabled]}
        >
          <Feather name="chevron-left" size={18} color={colors.textPrimary} />
        </Pressable>
        {pages.map((p) => (
          <Pressable
            key={p}
            onPress={() => onPageChange(p)}
            style={[styles.pageBtn, p === page && styles.pageBtnActive]}
          >
            <Text style={[styles.pageLabel, p === page && styles.pageLabelActive]}>{p}</Text>
          </Pressable>
        ))}
        <Pressable
          disabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
          style={[styles.arrow, page >= totalPages && styles.disabled]}
        >
          <Feather name="chevron-right" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  label: { ...typography.caption, color: colors.textSecondary },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.35 },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  pageBtnActive: { backgroundColor: colors.primary },
  pageLabel: { ...typography.bodyBold, color: colors.textPrimary },
  pageLabelActive: { color: colors.background },
});
