import { Feather } from '@expo/vector-icons';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';

export default function ScreenWithBack({ title, onBack, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bar}>
        <Pressable style={styles.btn} onPress={onBack} hitSlop={10}>
          <Feather name="chevron-left" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.btn} />
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
  },
  btn: {
    width: 40, height: 40, borderRadius: radii.full, borderWidth: 1,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  title: { color: colors.textPrimary, fontSize: 17, fontWeight: '600' },
});