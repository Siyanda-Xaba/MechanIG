import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/theme';

const PALETTE = [colors.primary, colors.primaryDark, colors.success, colors.warning, colors.danger, colors.info];

function colorForName(name = '') {
  const code = name.charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

function initialsForName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export default function Avatar({ name, uri, size = 44 }) {
  const dims = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dims]} />;
  }

  return (
    <View style={[styles.circle, dims, { backgroundColor: colorForName(name) }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initialsForName(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surfaceAlt },
  circle: { alignItems: 'center', justifyContent: 'center' },
  initials: { ...typography.bodyBold, color: colors.background },
});
