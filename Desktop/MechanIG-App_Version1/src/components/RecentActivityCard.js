import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function RecentActivityCard({ activities, onViewAllPress, onActivityPress, }) {
    const { colors } = useTheme();
    return (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                            styles.sectionTitle,
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
                        ], children: "No recent activity" }) })) : (activities.map((activity, index) => {
                    const isDiagnostic = activity.title
                        .toLowerCase()
                        .includes('diagnostic');
                    const isScheduled = activity.status
                        .toLowerCase()
                        .includes('scheduled');
                    return (_jsxs(TouchableOpacity, { activeOpacity: 0.7, onPress: () => onActivityPress(activity), style: [
                            styles.activityRow,
                            index < activities.length - 1 && {
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                            },
                        ], children: [_jsx(View, { style: [
                                    styles.iconContainer,
                                    {
                                        borderColor: colors.accent,
                                    },
                                ], children: _jsx(MaterialCommunityIcons, { name: isDiagnostic
                                        ? 'check-circle-outline'
                                        : 'calendar-check-outline', size: 21, color: colors.accent }) }), _jsxs(View, { style: styles.activityContent, children: [_jsx(Text, { numberOfLines: 1, style: [
                                            styles.activityTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: activity.title }), _jsx(Text, { numberOfLines: 1, style: [
                                            styles.activityDescription,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: activity.description })] }), _jsxs(View, { style: styles.activityRight, children: [_jsx(Text, { style: [
                                            styles.activityTime,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: activity.time }), _jsx(View, { style: [
                                            styles.statusPill,
                                            {
                                                borderColor: isScheduled
                                                    ? colors.accent
                                                    : colors.success,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.statusText,
                                                {
                                                    color: isScheduled
                                                        ? colors.accent
                                                        : colors.success,
                                                },
                                            ], children: activity.status }) })] }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }, activity.id));
                })) })] }));
}
const styles = StyleSheet.create({
    section: {
        marginTop: 18,
    },
    sectionHeader: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 11,
        fontWeight: '600',
    },
    card: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    activityRow: {
        minHeight: 72,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityContent: {
        flex: 1,
        minWidth: 0,
    },
    activityTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    activityDescription: {
        marginTop: 3,
        fontSize: 9,
    },
    activityRight: {
        alignItems: 'flex-end',
        gap: 5,
    },
    activityTime: {
        fontSize: 8,
    },
    statusPill: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 8,
        fontWeight: '600',
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
