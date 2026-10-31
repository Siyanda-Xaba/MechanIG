import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function PowerShieldCard({ nextOutageTime, onSchedulePress }) {
    const { colors } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Power Shield</Text>
                <MaterialCommunityIcons color={colors.text} name="shield-outline" size={20} />
            </View>
            <Text style={[styles.label, { color: colors.secondaryText }]}>Next outage</Text>
            <Text selectable style={[styles.time, { color: colors.text }]}>
                {nextOutageTime ?? 'Not available'}
            </Text>
            <TouchableOpacity
                accessibilityLabel="Schedule fuel top-up"
                accessibilityRole="button"
                activeOpacity={0.75}
                onPress={onSchedulePress}
                style={[styles.button, { backgroundColor: colors.accent }]}
            >
                <MaterialCommunityIcons color={colors.onAccent} name="gas-station" size={16} />
                <Text numberOfLines={1} style={[styles.buttonText, { color: colors.onAccent }]}>
                    Schedule fuel top-up
                </Text>
                <Ionicons color={colors.onAccent} name="chevron-forward" size={16} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 14,
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        marginTop: 18,
        minHeight: 48,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    buttonText: {
        flexShrink: 1,
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'center',
    },
    card: {
        borderCurve: 'continuous',
        borderRadius: 20,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.24)',
        padding: 18,
        width: '100%',
    },
    header: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 12,
        marginTop: 16,
    },
    time: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.3,
        lineHeight: 24,
        marginTop: 4,
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
});
