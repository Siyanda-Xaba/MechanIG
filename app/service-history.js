import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useServiceHistory } from '../src/customer/useServiceHistory';
import { useTheme } from '../src/theme/ThemeContext';
import { useUser } from '../src/users/UserContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function ServiceHistoryScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, } = useUser();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { records, isLoadingServiceHistory, serviceHistoryError, refreshServiceHistory, } = useServiceHistory(user?.id ?? null, selectedVehicle?.id ?? null);
    const isLoading = isLoadingUser ||
        isLoadingVehicles ||
        isLoadingServiceHistory;
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/profile'), style: [
                                styles.backButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Service History" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Vehicle Service Records" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "View completed and recorded workshop services for your selected vehicle." }), selectedVehicle ? (_jsxs(View, { style: [
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
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-side", size: 28, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleContent, children: [_jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, " ", selectedVehicle.model] }), _jsx(Text, { style: [
                                        styles.vehicleRegistration,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: selectedVehicle.registration })] })] })) : null, isLoading ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Loading Service History" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Retrieving service records for your vehicle." })] })) : !user ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "person-outline", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Customer Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Your account information could not be loaded." })] })) : !selectedVehicle ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No Vehicle Selected" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Select a vehicle before viewing its service history." }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.push('/vehicle-details'), style: [
                                styles.primaryButton,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "car-search", size: 19, color: "#000000" }), _jsx(Text, { style: styles.primaryButtonText, children: "View Vehicles" })] })] })) : serviceHistoryError ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 42, color: colors.warning }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Service History Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: serviceHistoryError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshServiceHistory, style: [
                                styles.secondaryButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: colors.text }), _jsx(Text, { style: [
                                        styles.secondaryButtonText,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Try Again" })] })] })) : records.length === 0 ? (_jsxs(View, { style: [
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
                            ], children: "No Service Records" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Completed workshop services will appear here once they are available from the MechanIQ backend." })] })) : (_jsx(View, { style: styles.recordsContainer, children: records.map((record) => (_jsxs(View, { style: [
                            styles.recordCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.recordHeader, children: [_jsx(View, { style: [
                                            styles.recordIcon,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(MaterialCommunityIcons, { name: "wrench-outline", size: 21, color: colors.accent }) }), _jsxs(View, { style: styles.recordHeaderContent, children: [_jsx(Text, { style: [
                                                    styles.recordTitle,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: record.serviceType }), _jsx(Text, { style: [
                                                    styles.recordDate,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: record.completedAt ??
                                                    record.scheduledDate })] }), _jsx(View, { style: [
                                            styles.statusBadge,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.statusText,
                                                {
                                                    color: colors.accent,
                                                },
                                            ], children: formatStatus(record.status) }) })] }), record.issueDescription ? (_jsx(Text, { style: [
                                    styles.recordDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: record.issueDescription })) : null, _jsx(View, { style: [
                                    styles.recordDivider,
                                    {
                                        backgroundColor: colors.border,
                                    },
                                ] }), _jsxs(View, { style: styles.recordDetails, children: [_jsx(RecordDetail, { label: "Scheduled", value: `${record.scheduledDate} • ${record.scheduledTime}`, textColor: colors.text, secondaryTextColor: colors.secondaryText }), _jsx(RecordDetail, { label: "Final Price", value: record.finalPrice !== null
                                            ? `R ${record.finalPrice.toFixed(2)}`
                                            : 'Not available', textColor: colors.text, secondaryTextColor: colors.secondaryText })] })] }, record.id))) })), _jsxs(View, { style: [
                        styles.noticeCard,
                        {
                            borderColor: colors.warning,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                styles.noticeText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Service history is only shown from authoritative backend and workshop records. MechanIQ does not treat development bookings or maintenance reminders as completed services." })] })] }) }));
}
function RecordDetail({ label, value, textColor, secondaryTextColor, }) {
    return (_jsxs(View, { style: styles.recordDetail, children: [_jsx(Text, { style: [
                    styles.recordDetailLabel,
                    {
                        color: secondaryTextColor,
                    },
                ], children: label }), _jsx(Text, { style: [
                    styles.recordDetailValue,
                    {
                        color: textColor,
                    },
                ], children: value })] }));
}
function formatStatus(status) {
    return status
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() +
        part.slice(1))
        .join(' ');
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 36,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
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
    headerPlaceholder: {
        width: 38,
    },
    title: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
    },
    vehicleCard: {
        marginTop: 18,
        minHeight: 72,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleIcon: {
        width: 42,
        height: 42,
        borderWidth: 1,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleContent: {
        flex: 1,
        marginLeft: 12,
    },
    vehicleName: {
        fontSize: 13,
        fontWeight: '700',
    },
    vehicleRegistration: {
        marginTop: 3,
        fontSize: 10,
    },
    stateCard: {
        minHeight: 230,
        marginTop: 18,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    stateDescription: {
        marginTop: 7,
        maxWidth: 310,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    primaryButton: {
        minHeight: 44,
        marginTop: 16,
        paddingHorizontal: 18,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    primaryButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '800',
    },
    secondaryButton: {
        minHeight: 42,
        marginTop: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    secondaryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    recordsContainer: {
        marginTop: 18,
        gap: 12,
    },
    recordCard: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    recordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordIcon: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordHeaderContent: {
        flex: 1,
        marginLeft: 10,
    },
    recordTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    recordDate: {
        marginTop: 3,
        fontSize: 9,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 8,
        fontWeight: '700',
    },
    recordDescription: {
        marginTop: 12,
        fontSize: 10,
        lineHeight: 15,
    },
    recordDivider: {
        height: 1,
        marginVertical: 12,
    },
    recordDetails: {
        gap: 10,
    },
    recordDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    recordDetailLabel: {
        fontSize: 9,
    },
    recordDetailValue: {
        flex: 1,
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'right',
    },
    noticeCard: {
        marginTop: 18,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    noticeText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 15,
    },
});
