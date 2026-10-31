import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function FuelRecentActivityCard({ activities, onActivityPress, onViewAllPress, }) {
    const { colors } = useTheme();
    return (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Recent Activity" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: onViewAllPress, children: _jsx(Text, { style: [
                                styles.viewAll,
                                {
                                    color: colors.accent,
                                },
                            ], children: "View All" }) })] }), _jsx(View, { style: [
                    styles.card,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ], children: activities.length === 0 ? (_jsx(View, { style: styles.emptyContainer, children: _jsx(Text, { style: [
                            styles.emptyText,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "No fuel activity yet" }) })) : (activities.map((activity, index) => {
                    const isCompleted = activity.status.toLowerCase() ===
                        'completed';
                    const statusColor = isCompleted
                        ? colors.success
                        : colors.accent;
                    return (_jsxs(TouchableOpacity, { activeOpacity: 0.7, onPress: () => onActivityPress(activity), style: [
                            styles.row,
                            index < activities.length - 1 && {
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                            },
                        ], children: [_jsx(View, { style: [
                                    styles.iconContainer,
                                    {
                                        borderColor: statusColor,
                                    },
                                ], children: _jsx(MaterialCommunityIcons, { name: isCompleted
                                        ? 'truck-check-outline'
                                        : 'calendar-clock-outline', size: 21, color: statusColor }) }), _jsxs(View, { style: styles.content, children: [_jsx(Text, { style: [
                                            styles.activityTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: activity.title }), _jsx(Text, { style: [
                                            styles.description,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: activity.description }), _jsx(Text, { style: [
                                            styles.time,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: activity.occurredAt })] }), _jsx(View, { style: [
                                    styles.statusPill,
                                    {
                                        borderColor: statusColor,
                                    },
                                ], children: _jsx(Text, { style: [
                                        styles.statusText,
                                        {
                                            color: statusColor,
                                        },
                                    ], children: activity.status }) }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }, activity.id));
                })) })] }));
}
const styles = StyleSheet.create({
    section: {
        marginTop: 20,
    },
    header: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 11,
        fontWeight: '600',
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    row: {
        minHeight: 78,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        minWidth: 0,
    },
    activityTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    description: {
        marginTop: 3,
        fontSize: 9,
    },
    time: {
        marginTop: 4,
        fontSize: 8,
    },
    statusPill: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 8,
        fontWeight: '700',
    },
    emptyContainer: {
        minHeight: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 11,
    },
});
