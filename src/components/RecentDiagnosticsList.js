import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function RecentDiagnosticsList({ scans, onScanPress, onViewAllPress, }) {
    const { colors } = useTheme();
    return (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Recent Diagnostics" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: onViewAllPress, children: _jsx(Text, { style: [
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
                ], children: scans.length === 0 ? (_jsx(View, { style: styles.emptyContainer, children: _jsx(Text, { style: [
                            styles.emptyText,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "No diagnostic scans yet" }) })) : (scans.map((scan, index) => {
                    const isWarning = scan.severity === 'warning';
                    const statusColor = scan.severity === 'critical'
                        ? colors.danger
                        : isWarning
                            ? colors.warning
                            : colors.success;
                    return (_jsxs(TouchableOpacity, { activeOpacity: 0.7, onPress: () => onScanPress(scan), style: [
                            styles.row,
                            index < scans.length - 1 && {
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                            },
                        ], children: [_jsx(View, { style: [
                                    styles.iconContainer,
                                    {
                                        borderColor: statusColor,
                                    },
                                ], children: _jsx(MaterialCommunityIcons, { name: isWarning
                                        ? 'disc'
                                        : 'clipboard-check-outline', size: 22, color: statusColor }) }), _jsxs(View, { style: styles.content, children: [_jsx(Text, { style: [
                                            styles.scanTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: scan.title }), _jsx(Text, { style: [
                                            styles.description,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: scan.description }), _jsx(Text, { style: [
                                            styles.time,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: scan.scannedAt })] }), _jsx(View, { style: [
                                    styles.statusPill,
                                    {
                                        borderColor: statusColor,
                                    },
                                ], children: _jsx(Text, { style: [
                                        styles.statusText,
                                        {
                                            color: statusColor,
                                        },
                                    ], children: scan.status }) }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }, scan.id));
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
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        minWidth: 0,
    },
    scanTitle: {
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
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 4,
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
