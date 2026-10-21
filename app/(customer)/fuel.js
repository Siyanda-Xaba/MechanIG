import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FuelActionCard from '../../src/components/FuelActionCard';
import FuelRecentActivityCard from '../../src/components/FuelRecentActivityCard';
import StableScrollView from '../../src/components/StableScrollView';
import { useCustomerFuel } from '../../src/customer/CustomerFuelContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function CustomerFuel() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { fuelData, isLoadingFuel, fuelError, } = useCustomerFuel();
    const isLoading = isLoadingVehicles || isLoadingFuel;
    const recentActivity = fuelData?.recentActivity ?? [];
    const profileFuelType = selectedVehicle?.fuelType?.trim();
    const vehicleFuelType = fuelData?.fuelType || (profileFuelType && profileFuelType !== 'N/A' ? profileFuelType : null);
    const vehicleFuelTypes = fuelData?.compatibleFuelTypes?.length
        ? fuelData.compatibleFuelTypes
        : vehicleFuelType
            ? [vehicleFuelType]
            : [];
    const fuelLevelColor = fuelData?.fuelLevel === null ||
        fuelData?.fuelLevel === undefined
        ? colors.secondaryText
        : fuelData.fuelLevel <= 20
            ? colors.danger
            : fuelData.fuelLevel <= 50
                ? colors.warning
                : colors.success;
    function handleFuelRequest(requestType) {
        const fuelType = vehicleFuelType;
        const compatibleFuelTypes = vehicleFuelTypes;
        router.push({
            pathname: '/fuel-delivery-request',
            params: {
                requestType,
                ...(fuelType
                    ? {
                        fuelType,
                    }
                    : {}),
                compatibleFuelTypes: JSON.stringify(compatibleFuelTypes),
            },
        });
    }
    function handleScheduleTopUp() {
        const fuelType = vehicleFuelType;
        const compatibleFuelTypes = vehicleFuelTypes;
        router.push({
            pathname: '/fuel-top-up-schedule',
            params: {
                ...(fuelType
                    ? {
                        fuelType,
                    }
                    : {}),
                compatibleFuelTypes: JSON.stringify(compatibleFuelTypes),
            },
        });
    }
    function handleTrackDelivery() {
        const activeDeliveryId = fuelData?.activeDeliveryId;
        if (activeDeliveryId) {
            router.push({
                pathname: '/fuel-delivery-tracking',
                params: {
                    deliveryId: activeDeliveryId,
                },
            });
            return;
        }
        router.push('/fuel-delivery-tracking');
    }
    function handleFuelHistory() {
        router.push('/fuel-history');
    }
    function handleSavedLocations() {
        router.push('/fuel-saved-locations');
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], edges: ['top'], children: _jsxs(StableScrollView, { style: styles.scrollView, contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Fuel Services" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Manage fuel delivery, nearby stations, and emergency top-ups." }), _jsx(View, { style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: isLoading ? (_jsx(Text, { style: [
                            styles.message,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Loading fuel information..." })) : !selectedVehicle ? (_jsx(Text, { style: [
                            styles.message,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "No vehicle selected" })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: styles.vehicleTopRow, children: [_jsxs(View, { children: [_jsxs(Text, { style: [
                                                    styles.vehicleName,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                                    styles.registration,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: selectedVehicle.registration })] }), _jsx(MaterialCommunityIcons, { name: "gas-station-outline", size: 34, color: fuelLevelColor })] }), _jsxs(View, { style: styles.statsGrid, children: [_jsxs(View, { style: styles.statItem, children: [_jsx(Text, { style: [
                                                    styles.statLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Fuel Level" }), _jsx(Text, { style: [
                                                    styles.statValue,
                                                    {
                                                        color: fuelLevelColor,
                                                    },
                                                ], children: fuelData?.fuelLevel !==
                                                    null &&
                                                    fuelData?.fuelLevel !==
                                                        undefined
                                                    ? `${fuelData.fuelLevel}%`
                                                    : 'Unavailable' })] }), _jsxs(View, { style: styles.statItem, children: [_jsx(Text, { style: [
                                                    styles.statLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Estimated Range" }), _jsx(Text, { style: [
                                                    styles.statValue,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: fuelData?.estimatedRangeKm !==
                                                    null &&
                                                    fuelData?.estimatedRangeKm !==
                                                        undefined
                                                    ? `${fuelData.estimatedRangeKm} km`
                                                    : 'Unavailable' })] }), _jsxs(View, { style: styles.statItem, children: [_jsx(Text, { style: [
                                                    styles.statLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Fuel Type" }), _jsx(Text, { style: [
                                                    styles.statValue,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: vehicleFuelType ??
                                                    'Unavailable' })] }), _jsxs(View, { style: styles.statItem, children: [_jsx(Text, { style: [
                                                    styles.statLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Nearest Station" }), _jsx(Text, { style: [
                                                    styles.statValue,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: fuelData
                                                    ?.nearestStation
                                                    ?.distanceKm !==
                                                    null &&
                                                    fuelData
                                                        ?.nearestStation
                                                        ?.distanceKm !==
                                                        undefined
                                                    ? `${fuelData.nearestStation.distanceKm} km`
                                                    : 'N/A' })] })] })] })) }), _jsxs(View, { style: [
                        styles.deliveryCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsxs(View, { style: styles.deliveryHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                                styles.deliveryTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Fuel Delivery" }), _jsx(Text, { style: [
                                                styles.deliveryStatus,
                                                {
                                                    color: colors.success,
                                                },
                                            ], children: "Availability confirmed after request" })] }), _jsx(MaterialCommunityIcons, { name: "truck-delivery-outline", size: 30, color: colors.accent })] }), _jsx(Text, { style: [
                                styles.deliveryDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Submit a request and the delivery provider can confirm availability for your location." }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleFuelRequest('standard'), style: [
                                styles.requestButton,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "gas-station", size: 18, color: "#000000" }), _jsx(Text, { style: styles.requestButtonText, children: "Request Fuel" })] })] }), _jsxs(View, { style: styles.actionsGrid, children: [_jsx(FuelActionCard, { title: "Nearby Stations", description: "Find fuel stations close to you.", icon: "map-marker-radius-outline", onPress: () => {
                                router.push('/nearby-fuel-stations');
                            } }), _jsx(FuelActionCard, { title: "Emergency Fuel", description: "Request urgent fuel assistance.", icon: "alert-circle-outline", onPress: () => handleFuelRequest('emergency') }), _jsx(FuelActionCard, { title: "Track Delivery", description: "View your active fuel delivery.", icon: "truck-fast-outline", onPress: handleTrackDelivery }), _jsx(FuelActionCard, { title: "Schedule Top-up", description: "Plan a future fuel delivery.", icon: "calendar-clock-outline", onPress: handleScheduleTopUp }), _jsx(FuelActionCard, { title: "Fuel History", description: "View previous fuel activity.", icon: "history", onPress: handleFuelHistory }), _jsx(FuelActionCard, { title: "Saved Locations", description: "Manage your frequent delivery locations.", icon: "map-marker-star-outline", onPress: handleSavedLocations })] }), _jsx(FuelRecentActivityCard, { activities: recentActivity, onViewAllPress: handleFuelHistory, onActivityPress: (activity) => {
                        console.log('Selected fuel activity:', activity.id);
                    } }), fuelError ? (_jsx(Text, { style: [
                        styles.errorText,
                        {
                            color: colors.danger,
                        },
                    ], children: fuelError })) : null] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 110,
    },
    title: {
        marginTop: 12,
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 18,
    },
    vehicleCard: {
        marginTop: 18,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
    },
    vehicleTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: '700',
    },
    registration: {
        marginTop: 4,
        fontSize: 11,
    },
    statsGrid: {
        marginTop: 18,
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 16,
    },
    statItem: {
        width: '50%',
    },
    statLabel: {
        fontSize: 9,
    },
    statValue: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '700',
    },
    deliveryCard: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    deliveryTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    deliveryStatus: {
        marginTop: 4,
        fontSize: 10,
        fontWeight: '600',
    },
    deliveryDescription: {
        marginTop: 12,
        fontSize: 11,
        lineHeight: 16,
    },
    requestButton: {
        minHeight: 42,
        marginTop: 16,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    requestButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '700',
    },
    actionsGrid: {
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    message: {
        paddingVertical: 40,
        textAlign: 'center',
        fontSize: 12,
    },
    errorText: {
        marginTop: 10,
        fontSize: 11,
        textAlign: 'center',
    },
});
