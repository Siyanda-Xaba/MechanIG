import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useDiagnosticHistory } from '../src/customer/useDiagnosticHistory';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function DiagnosticHistoryScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { diagnosticHistory, isLoadingDiagnosticHistory, diagnosticHistoryError, refreshDiagnosticHistory, deleteHistoryEntry, } = useDiagnosticHistory();
    const isLoading = isLoadingVehicles ||
        isLoadingDiagnosticHistory;
    function handleScanPress(scan) {
        if (!scan.resultId) {
            return;
        }
        router.push({
            pathname: '/diagnostic-result/[resultId]',
            params: {
                resultId: scan.resultId,
            },
        });
    }
    function confirmDeleteScan(scan) {
        Alert.alert('Delete diagnostic record?', 'This permanently removes this scan from your account.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try {
                    await deleteHistoryEntry(scan.id);
                }
                catch {
                    Alert.alert('Could not delete record', 'Check your connection and try again.');
                }
            } },
        ]);
    }
    if (isLoading) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                        styles.loadingText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Loading diagnostic history..." })] }));
    }
    if (diagnosticHistoryError) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 48, color: colors.danger }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Unable to load diagnostics" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: diagnosticHistoryError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshDiagnosticHistory, style: [
                        styles.retryButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: "#000000" }), _jsx(Text, { style: styles.retryButtonText, children: "Try Again" })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/diagnostics'), style: [
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.secondaryButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Go Back" }) })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/diagnostics'), accessibilityRole: "button", accessibilityLabel: "Go back", style: [
                                styles.backButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsxs(View, { style: styles.headerText, children: [_jsx(Text, { style: [
                                        styles.title,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Diagnostic History" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Previous diagnostic checks for your selected vehicle" })] })] }), selectedVehicle ? (_jsxs(View, { style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(View, { style: [
                                styles.vehicleIcon,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 23, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleContent, children: [_jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Diagnostics for" }), _jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                        styles.vehicleRegistration,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: selectedVehicle.registration })] })] })) : null, _jsxs(View, { style: styles.sectionHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "All Diagnostics" }), _jsxs(Text, { style: [
                                        styles.sectionDescription,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [diagnosticHistory.length, ' ', diagnosticHistory.length === 1
                                            ? 'record'
                                            : 'records'] })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshDiagnosticHistory, accessibilityRole: "button", accessibilityLabel: "Refresh diagnostic history", style: [
                                styles.refreshButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "refresh", size: 19, color: colors.accent }) })] }), diagnosticHistory.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "car-search", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No diagnostic history" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Completed diagnostic checks for this vehicle will appear here." })] })) : (_jsx(View, { style: styles.historyList, children: diagnosticHistory.map((scan) => {
                        const statusColor = scan.severity ===
                            'critical'
                            ? colors.danger
                            : scan.severity ===
                                'warning'
                                ? colors.warning
                                : colors.success;
                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: !scan.resultId, onPress: () => handleScanPress(scan), style: [
                                styles.historyCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.scanIcon,
                                        {
                                            borderColor: statusColor,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: scan.severity ===
                                            'normal'
                                            ? 'clipboard-check-outline'
                                            : 'alert-circle-outline', size: 22, color: statusColor }) }), _jsxs(View, { style: styles.scanContent, children: [_jsxs(View, { style: styles.scanTitleRow, children: [_jsx(Text, { style: [
                                                        styles.scanTitle,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: scan.title }), _jsx(View, { style: [
                                                        styles.statusBadge,
                                                        {
                                                            borderColor: statusColor,
                                                        },
                                                    ], children: _jsx(Text, { style: [
                                                            styles.statusText,
                                                            {
                                                                color: statusColor,
                                                            },
                                                        ], children: scan.status }) })] }), _jsx(Text, { style: [
                                                styles.scanDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: scan.description }), _jsx(Text, { style: [
                                                styles.scanTime,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: scan.scannedAt })] }), _jsxs(View, { style: { alignItems: 'center', gap: 8 }, children: [scan.resultId ? (_jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })) : null, _jsx(TouchableOpacity, { accessibilityRole: "button", accessibilityLabel: "Delete diagnostic record", hitSlop: 8, onPress: () => confirmDeleteScan(scan), children: _jsx(MaterialCommunityIcons, { name: "delete-outline", size: 20, color: colors.danger }) })] })] }, scan.id));
                    }) })), _jsxs(View, { style: [
                        styles.backendNotice,
                        {
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 17, color: colors.accent }), _jsx(Text, { style: [
                                styles.backendNoticeText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Full diagnostic history will come from MechanIQ backend records for the selected vehicle. Only records with a related diagnostic result can open a result screen." })] })] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centeredPage: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 34,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 12,
    },
    stateTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    stateDescription: {
        marginTop: 8,
        maxWidth: 300,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    retryButton: {
        minWidth: 160,
        minHeight: 44,
        marginTop: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    retryButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '800',
    },
    secondaryButton: {
        minWidth: 160,
        minHeight: 44,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    header: {
        marginTop: 8,
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 42,
        height: 42,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 3,
        fontSize: 10,
        lineHeight: 14,
    },
    vehicleCard: {
        minHeight: 82,
        marginTop: 22,
        padding: 13,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleIcon: {
        width: 46,
        height: 46,
        borderWidth: 1,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleContent: {
        flex: 1,
        marginLeft: 12,
    },
    vehicleLabel: {
        fontSize: 8.5,
    },
    vehicleName: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '700',
    },
    vehicleRegistration: {
        marginTop: 3,
        fontSize: 9,
    },
    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    sectionDescription: {
        marginTop: 3,
        fontSize: 9.5,
    },
    refreshButton: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyList: {
        gap: 10,
    },
    historyCard: {
        minHeight: 98,
        padding: 12,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scanIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanContent: {
        flex: 1,
        marginHorizontal: 11,
    },
    scanTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    scanTitle: {
        flex: 1,
        fontSize: 11.5,
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 7.5,
        fontWeight: '700',
    },
    scanDescription: {
        marginTop: 5,
        fontSize: 9.5,
        lineHeight: 14,
    },
    scanTime: {
        marginTop: 6,
        fontSize: 8.5,
    },
    emptyCard: {
        minHeight: 210,
        padding: 22,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '700',
    },
    emptyDescription: {
        marginTop: 6,
        maxWidth: 280,
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },
    backendNotice: {
        marginTop: 20,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    backendNoticeText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 8.5,
        lineHeight: 13,
    },
});
