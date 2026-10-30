import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function MaintenanceReminderCard({ onPress, reminder }) {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            accessibilityLabel="Maintenance reminders"
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={onPress}
            style={[styles.card, { backgroundColor: colors.card }]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Maintenance Reminders</Text>
                <Ionicons color={colors.text} name="notifications-outline" size={18} />
            </View>
            {reminder ? (
                <View style={styles.reminderContent}>
                    <MaterialCommunityIcons color={colors.text} name="oil" size={22} />
                    <View style={styles.textContainer}>
                        <Text selectable style={[styles.reminderTitle, { color: colors.text }]}>
                            {reminder.title}
                        </Text>
                        <Text style={[styles.description, { color: colors.secondaryText }]}>{reminder.description}</Text>
                    </View>
                    <Ionicons color={colors.secondaryText} name="chevron-forward" size={18} />
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No maintenance reminders</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderCurve: 'continuous',
        borderRadius: 20,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.24)',
        padding: 18,
        width: '100%',
    },
    description: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 4,
    },
    emptyContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    emptyText: {
        fontSize: 13,
        textAlign: 'center',
    },
    header: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
    },
    reminderContent: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    reminderTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    textContainer: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: -0.2,
        lineHeight: 19,
    },
});
