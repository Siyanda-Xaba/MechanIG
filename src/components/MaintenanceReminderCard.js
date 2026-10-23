import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function MaintenanceReminderCard({ reminder, onPress, }) {
    const { colors } = useTheme();
    return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: onPress, style: [
            styles.card,
            {
                backgroundColor: colors.card,
                borderColor: colors.border,
            },
        ], children: [_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Maintenance Reminders" }), _jsx(View, { style: [
                            styles.reminderBell,
                            {
                                borderColor: colors.accent,
                            },
                        ], children: _jsx(Ionicons, { name: "notifications-outline", size: 16, color: colors.accent }) })] }), reminder ? (_jsxs(View, { style: styles.reminderContent, children: [_jsx(View, { style: [
                            styles.iconContainer,
                            {
                                borderColor: colors.accent,
                            },
                        ], children: _jsx(MaterialCommunityIcons, { name: "oil", size: 24, color: colors.accent }) }), _jsxs(View, { style: styles.textContainer, children: [_jsx(Text, { style: [
                                    styles.reminderTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: reminder.title }), _jsx(Text, { style: [
                                    styles.description,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: reminder.description })] }), _jsx(Ionicons, { name: "chevron-forward", size: 20, color: colors.secondaryText })] })) : (_jsx(View, { style: styles.emptyContainer, children: _jsx(Text, { style: [
                        styles.emptyText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "No maintenance reminders" }) }))] }));
}
const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: 150,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        paddingRight: 8,
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 17,
    },
    reminderBell: {
        width: 32,
        height: 32,
        flexShrink: 0,
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reminderContent: {
        flex: 1,
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    description: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 14,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 11,
    },
});
