import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../theme/theme';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFilterPress,
  showFilter = true,
  filterLabel = 'Filters',
  filterActive = false,
}) {
  return (
    <View style={styles.row}>
      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>
      {showFilter ? (
        <Pressable
          style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
          onPress={onFilterPress}
        >
          <Feather name="sliders" size={16} color={filterActive ? colors.primary : colors.textPrimary} />
          <Text style={[styles.filterLabel, filterActive && styles.filterLabelActive]}>{filterLabel}</Text>
          <Feather name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  input: { flex: 1, marginLeft: spacing.sm, color: colors.textPrimary, ...typography.body },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.full,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  filterBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(34,211,238,0.1)',
  },
  filterLabel: { ...typography.bodyBold, color: colors.textPrimary, marginHorizontal: spacing.xs },
  filterLabelActive: { color: colors.primary },
});