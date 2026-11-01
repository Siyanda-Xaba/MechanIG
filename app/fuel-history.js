import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useFuelHistory } from '../src/customer/useFuelHistory';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function FuelHistoryScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { history, isLoadingHistory, historyError, refreshHistory, } = useFuelHistory(selectedVehicle?.id ?? null);
    const isLoading = isLoadingVehicles ||
        isLoadingHistory;
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/fuel'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Fuel History" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshHistory, disabled: isLoadingHistory, style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "refresh", size: 19, color: isLoadingHistory
                                    ? colors.secondaryText
                                    : colors.accent }) })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Fuel Activity" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Review fuel deliveries, scheduled top-ups, and other fuel activity for your selected vehicle." }), _jsxs(View, { style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsxs(View, { style: styles.vehicleHeader, children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Selected Vehicle" })] }), isLoadingVehicles ? (_jsx(Text, { style: [
                                styles.vehicleMessage,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading vehicle..." })) : selectedVehicle ? (_jsxs(_Fragment, { children: [_jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                        styles.registration,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: selectedVehicle.registration })] })) : (_jsx(Text, { style: [
                                styles.vehicleMessage,
                                {
                                    color: colors.danger,
                                },
                            ], children: "No vehicle selected." }))] }), isLoading ? (_jsxs(View, { style: styles.stateContainer, children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading fuel history..." })] })) : historyError ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 42, color: colors.danger }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Unable to load history" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: historyError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshHistory, style: [
                                styles.retryButton,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ], children: [_jsx(Ionicons, { name: "refresh", size: 17, color: "#000000" }), _jsx(Text, { style: styles.retryButtonText, children: "Try Again" })] })] })) : !selectedVehicle ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "car-off", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No vehicle selected" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Select a vehicle before viewing its fuel history." })] })) : history.length === 0 ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "history", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No fuel activity yet" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Fuel deliveries and scheduled top-ups will appear here when activity is available." })] })) : (_jsxs(View, { style: styles.historySection, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Activity" }), _jsxs(Text, { style: [
                                        styles.activityCount,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [history.length, ' ', history.length === 1
                                            ? 'record'
                                            : 'records'] })] }), history.map((activity) => {
                            const status = activity.status.toLowerCase();
                            const statusColor = status ===
                                'completed'
                                ? colors.success
                                : status ===
                                    'cancelled'
                                    ? colors.danger
                                    : status ===
                                        'scheduled'
                                        ? colors.accent
                                        : colors.secondaryText;
                            return (_jsxs(View, { style: [
                                    styles.activityCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(View, { style: [
                                            styles.activityIcon,
                                            {
                                                borderColor: statusColor,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: "gas-station-outline", size: 22, color: statusColor }) }), _jsxs(View, { style: styles.activityContent, children: [_jsxs(View, { style: styles.activityTopRow, children: [_jsx(Text, { style: [
                                                            styles.activityTitle,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ], children: activity.title }), _jsx(View, { style: [
                                                            styles.statusBadge,
                                                            {
                                                                borderColor: statusColor,
                                                            },
                                                        ], children: _jsx(Text, { style: [
                                                                styles.statusText,
                                                                {
                                                                    color: statusColor,
                                                                },
                                                            ], children: activity.status }) })] }), _jsx(Text, { style: [
                                                    styles.activityDescription,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: activity.description }), _jsxs(View, { style: styles.activityTimeRow, children: [_jsx(Ionicons, { name: "time-outline", size: 14, color: colors.secondaryText }), _jsx(Text, { style: [
                                                            styles.activityTime,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ], children: activity.occurredAt })] })] })] }, activity.id));
                        })] }))] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerButton: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    title: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 6,
        fontSize: 12,
        lineHeight: 18,
    },
    vehicleCard: {
        marginTop: 20,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    vehicleLabel: {
        fontSize: 9,
        fontWeight: '600',
    },
    vehicleName: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '700',
    },
    registration: {
        marginTop: 4,
        fontSize: 10,
    },
    vehicleMessage: {
        marginTop: 12,
        fontSize: 11,
    },
    stateContainer: {
        minHeight: 260,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateText: {
        marginTop: 12,
        fontSize: 11,
    },
    stateCard: {
        minHeight: 220,
        marginTop: 18,
        padding: 24,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '700',
    },
    stateDescription: {
        marginTop: 7,
        maxWidth: 280,
        fontSize: 10,
        lineHeight: 16,
        textAlign: 'center',
    },
    retryButton: {
        minHeight: 40,
        marginTop: 18,
        paddingHorizontal: 18,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    retryButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '700',
    },
    historySection: {
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    activityCount: {
        fontSize: 9,
    },
    activityCard: {
        marginTop: 12,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    activityIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityContent: {
        flex: 1,
        marginLeft: 12,
    },
    activityTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
    },
    activityTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 8,
        fontWeight: '700',
    },
    activityDescription: {
        marginTop: 6,
        fontSize: 10,
        lineHeight: 15,
    },
    activityTimeRow: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    activityTime: {
        fontSize: 9,
    },
});
