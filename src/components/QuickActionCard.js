import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function QuickActionCard({ description, icon, onPress, title }) {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            accessibilityLabel={title}
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={onPress}
            style={[styles.card, { backgroundColor: colors.card }]}
        >
            <MaterialCommunityIcons color={colors.accent} name={icon} size={22} />
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.description, { color: colors.secondaryText }]}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderCurve: 'continuous',
        borderRadius: 20,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.24)',
        flexGrow: 0,
        flexShrink: 0,
        gap: 12,
        minHeight: 118,
        minWidth: 0,
        width: '48%',
        padding: 16,
    },
    description: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 4,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: -0.2,
        lineHeight: 19,
    },
});
