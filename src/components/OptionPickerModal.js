import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function OptionPickerModal({ visible, title, options, selectedValue, onSelect, onClose }) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close options" style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close options" onPress={onClose} style={[styles.closeButton, { borderColor: colors.border }]}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.options} contentContainerStyle={styles.optionsContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
            {options.map((option) => {
              const selected = option === selectedValue;
              return (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  activeOpacity={0.75}
                  onPress={() => onSelect(option)}
                  style={[styles.option, { borderColor: selected ? colors.accent : colors.border, backgroundColor: selected ? colors.background : colors.card }]}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
                  {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.accent} /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.72)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 460, maxHeight: '78%', padding: 16, borderWidth: 1, borderRadius: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { flex: 1, fontSize: 17, fontWeight: '700' },
  closeButton: { width: 36, height: 36, marginLeft: 12, borderWidth: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  options: { flexGrow: 0 },
  optionsContent: { paddingBottom: 4 },
  option: { minHeight: 48, marginBottom: 8, paddingHorizontal: 14, borderWidth: 1, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { flex: 1, fontSize: 13, fontWeight: '600' },
});
