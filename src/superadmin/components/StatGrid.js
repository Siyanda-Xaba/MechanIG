import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../theme/theme';

export default function StatGrid({ children }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
