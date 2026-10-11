import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import FuelMap from '../src/components/FuelMap';
import { useFuelDeliveryTracking } from '../src/customer/useFuelDeliveryTracking';
import { useForegroundLocation } from '../src/location/useForegroundLocation';
import { useTheme } from '../src/theme/ThemeContext';
function getStatusLabel(status) {
    switch (status) {
        case 'scheduled':
            return 'Scheduled';
        case 'driver-assigned':
            return 'Driver Assigned';
        case 'en-route':
            return 'En Route';
        case 'arrived':
            return 'Driver Arrived';
        case 'delivering':
            return 'Delivering Fuel';
        case 'completed':
            return 'Completed';
        case 'cancelled':
            return 'Cancelled';
    }
}
export default function FuelDeliveryTrackingScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const params = useLocalSearchParams();
    const deliveryId = Array.isArray(params.deliveryId)
        ? params.deliveryId[0]
        : params.deliveryId;
    const { tracking, isLoadingTracking, trackingError, refreshTracking, } = useFuelDeliveryTracking(deliveryId ?? null);
    const { location, isLoadingLocation, locationError, refreshLocation, } = useForegroundLocation();
    const destinationLocation = tracking?.destination ?? location;
    const driverLocation = tracking?.driver?.location ?? null;
    const isLoading = isLoadingTracking ||
        isLoadingLocation;
    const mapError = locationError ??
        trackingError;
    if (!deliveryId) {
        return (_jsx(SafeAreaView, { style: [
                styles.safeArea,
                {
                    backgroundColor: colors.background,
                },
            ], children: _jsxs(View, { style: styles.emptyPage, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/fuel'), style: [
                                    styles.headerButton,
                                    {
                                        borderColor: colors.border,
                                    },
                                ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Track Delivery" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsxs(View, { style: [
                            styles.emptyCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "truck-delivery-outline", size: 48, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.emptyTitle,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "No active delivery" }), _jsx(Text, { style: [
                                    styles.emptyDescription,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "When you have an active fuel delivery, its live status and driver location will appear here." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/fuel'), style: [
                                    styles.primaryButton,
                                    {
                                        backgroundColor: colors.accent,
                                    },
                                ], children: _jsx(Text, { style: styles.primaryButtonText, children: "Back to Fuel" }) })] })] }) }));
    }
    if (isLoadingTracking &&
        !tracking) {
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
                    ], children: "Loading delivery tracking..." })] }));
    }
    if (trackingError &&
        !tracking) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "truck-alert-outline", size: 48, color: colors.danger }), _jsx(Text, { style: [
                        styles.errorTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Tracking unavailable" }), _jsx(Text, { style: [
                        styles.errorMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: trackingError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshTracking, style: [
                        styles.primaryButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: _jsx(Text, { style: styles.primaryButtonText, children: "Try Again" }) }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/fuel'), style: [
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
                            ], children: "Track Delivery" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => {
                                refreshTracking();
                                refreshLocation();
                            }, style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "refresh", size: 19, color: colors.accent }) })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Fuel Delivery" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Follow your delivery status and driver location." }), tracking ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                styles.statusCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.statusTopRow, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                                        styles.statusLabel,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: "Delivery Status" }), _jsx(Text, { style: [
                                                        styles.statusValue,
                                                        {
                                                            color: colors.accent,
                                                        },
                                                    ], children: getStatusLabel(tracking.status) })] }), _jsx(MaterialCommunityIcons, { name: "truck-fast-outline", size: 32, color: colors.accent })] }), tracking.estimatedArrivalMinutes !==
                                    null ? (_jsxs(View, { style: styles.infoRow, children: [_jsx(Ionicons, { name: "time-outline", size: 18, color: colors.accent }), _jsxs(View, { style: styles.infoContent, children: [_jsx(Text, { style: [
                                                        styles.infoLabel,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: "Estimated Arrival" }), _jsxs(Text, { style: [
                                                        styles.infoValue,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: [tracking.estimatedArrivalMinutes, ' ', "min"] })] })] })) : null, tracking.destinationLabel ? (_jsxs(View, { style: styles.infoRow, children: [_jsx(Ionicons, { name: "location-outline", size: 18, color: colors.accent }), _jsxs(View, { style: styles.infoContent, children: [_jsx(Text, { style: [
                                                        styles.infoLabel,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: "Delivery Location" }), _jsx(Text, { style: [
                                                        styles.infoValue,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: tracking.destinationLabel })] })] })) : null] }), _jsx(View, { style: styles.mapSection, children: _jsx(FuelMap, { customerLocation: destinationLocation, deliveryVehicleLocation: driverLocation, routeCoordinates: tracking.routeCoordinates, isLoading: isLoading, errorMessage: mapError, height: 350 }) }), tracking.driver ? (_jsxs(View, { style: [
                                styles.driverCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.driverIcon,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: _jsx(Ionicons, { name: "person-outline", size: 24, color: colors.accent }) }), _jsxs(View, { style: styles.driverContent, children: [_jsx(Text, { style: [
                                                styles.driverLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Your Driver" }), _jsx(Text, { style: [
                                                styles.driverName,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: tracking.driver.name ??
                                                'Assigned driver' }), tracking.driver.vehicleDescription ? (_jsxs(Text, { style: [
                                                styles.driverVehicle,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: [tracking.driver
                                                    .vehicleDescription, tracking.driver
                                                    .vehicleRegistration
                                                    ? ` • ${tracking.driver.vehicleRegistration}`
                                                    : ''] })) : null] })] })) : (_jsxs(View, { style: [
                                styles.waitingCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "account-clock-outline", size: 28, color: colors.accent }), _jsxs(View, { style: styles.waitingContent, children: [_jsx(Text, { style: [
                                                styles.waitingTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Waiting for driver assignment" }), _jsx(Text, { style: [
                                                styles.waitingDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Driver details will appear when the delivery backend assigns a driver." })] })] })), tracking.updatedAt ? (_jsxs(Text, { style: [
                                styles.updatedText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: ["Last updated:", ' ', tracking.updatedAt] })) : null] })) : null] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    emptyPage: {
        flex: 1,
        paddingHorizontal: 16,
    },
    centeredPage: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
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
    headerPlaceholder: {
        width: 38,
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
    loadingText: {
        marginTop: 12,
        fontSize: 12,
    },
    errorTitle: {
        marginTop: 14,
        fontSize: 18,
        fontWeight: '700',
    },
    errorMessage: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    primaryButton: {
        minHeight: 42,
        marginTop: 20,
        paddingHorizontal: 24,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '700',
    },
    secondaryButton: {
        minHeight: 42,
        marginTop: 10,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    emptyCard: {
        marginTop: 40,
        minHeight: 230,
        padding: 24,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        marginTop: 14,
        fontSize: 16,
        fontWeight: '700',
    },
    emptyDescription: {
        marginTop: 7,
        maxWidth: 280,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    statusCard: {
        marginTop: 20,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    statusTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    statusLabel: {
        fontSize: 9,
    },
    statusValue: {
        marginTop: 4,
        fontSize: 17,
        fontWeight: '700',
    },
    infoRow: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 9,
    },
    infoValue: {
        marginTop: 2,
        fontSize: 11,
        fontWeight: '600',
    },
    mapSection: {
        marginTop: 16,
    },
    driverCard: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverIcon: {
        width: 46,
        height: 46,
        borderWidth: 1.5,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverContent: {
        flex: 1,
        marginLeft: 12,
    },
    driverLabel: {
        fontSize: 9,
    },
    driverName: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: '700',
    },
    driverVehicle: {
        marginTop: 4,
        fontSize: 10,
    },
    waitingCard: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    waitingContent: {
        flex: 1,
        marginLeft: 12,
    },
    waitingTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    waitingDescription: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 15,
    },
    updatedText: {
        marginTop: 12,
        fontSize: 9,
        textAlign: 'center',
    },
});
