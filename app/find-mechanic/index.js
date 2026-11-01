import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useVehicleMechanicSearch } from '../../src/customer/useVehicleMechanicSearch';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function VehicleMechanicSearchScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { mechanicSearchResult, isLoadingMechanics, mechanicSearchError, refreshMechanics, } = useVehicleMechanicSearch(selectedVehicle?.id);
    const isLoading = isLoadingVehicles ||
        isLoadingMechanics;
    const mechanics = mechanicSearchResult?.mechanics ?? [];
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
                    ], children: "Finding suitable mechanics..." })] }));
    }
    if (!selectedVehicle) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 48, color: colors.secondaryText }), _jsx(Text, { style: [
                        styles.errorTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "No vehicle selected" }), _jsx(Text, { style: [
                        styles.errorMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Select a vehicle before searching for a mechanic." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/(customer)'), style: [
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
    if (mechanicSearchError) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 48, color: colors.danger }), _jsx(Text, { style: [
                        styles.errorTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Unable to find mechanics" }), _jsx(Text, { style: [
                        styles.errorMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: mechanicSearchError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshMechanics, style: [
                        styles.retryButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: "#000000" }), _jsx(Text, { style: styles.retryButtonText, children: "Try Again" })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/(customer)'), style: [
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
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/(customer)'), style: [
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
                                    ], children: "Find a Mechanic" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Find verified mechanics who can help with your selected vehicle." })] })] }), _jsxs(View, { style: [
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
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 24, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleContent, children: [_jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Searching for" }), _jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsxs(Text, { style: [
                                        styles.vehicleDetails,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [selectedVehicle.registration, ' • ', selectedVehicle.year ?? 'N/A'] })] })] }), _jsxs(View, { style: styles.resultsHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                        styles.resultsTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Available Mechanics" }), _jsxs(Text, { style: [
                                        styles.resultsCount,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [mechanics.length, ' ', mechanics.length === 1
                                            ? 'mechanic'
                                            : 'mechanics', ' ', "found"] })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshMechanics, style: [
                                styles.refreshButton,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: colors.card,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "refresh", size: 20, color: colors.accent }) })] }), mechanics.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "wrench-outline", size: 38, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No mechanics available" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Try again shortly or expand your search when location-based filtering becomes available." })] })) : (_jsx(View, { style: styles.mechanicsList, children: mechanics.map((mechanic) => {
                        const availabilityLabel = mechanic.availability ===
                            'available'
                            ? 'Available'
                            : mechanic.availability ===
                                'busy'
                                ? 'Busy'
                                : 'Unavailable';
                        return (_jsxs(View, { style: [
                                styles.mechanicCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.mechanicHeader, children: [_jsx(View, { style: [
                                                styles.profilePlaceholder,
                                                {
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(Ionicons, { name: "person-outline", size: 27, color: colors.accent }) }), _jsxs(View, { style: styles.mechanicIdentity, children: [_jsxs(View, { style: styles.mechanicNameRow, children: [_jsx(Text, { numberOfLines: 1, style: [
                                                                styles.mechanicName,
                                                                {
                                                                    color: colors.text,
                                                                },
                                                            ], children: mechanic.name }), mechanic.verified ? (_jsx(MaterialCommunityIcons, { name: "check-decagram", size: 16, color: colors.accent })) : null] }), mechanic.businessName ? (_jsx(Text, { numberOfLines: 1, style: [
                                                        styles.businessName,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: mechanic.businessName })) : null, _jsxs(View, { style: styles.ratingRow, children: [mechanic.rating !==
                                                            null ? (_jsxs(_Fragment, { children: [_jsx(Ionicons, { name: "star", size: 14, color: colors.accent }), _jsx(Text, { style: [
                                                                        styles.rating,
                                                                        {
                                                                            color: colors.text,
                                                                        },
                                                                    ], children: mechanic.rating })] })) : null, _jsxs(Text, { style: [
                                                                styles.reviews,
                                                                {
                                                                    color: colors.secondaryText,
                                                                },
                                                            ], children: ["(", mechanic.reviewCount, ' ', "reviews)"] })] })] }), _jsx(View, { style: [
                                                styles.availabilityBadge,
                                                {
                                                    borderColor: mechanic.availability ===
                                                        'available'
                                                        ? colors.success
                                                        : colors.border,
                                                },
                                            ], children: _jsx(Text, { style: [
                                                    styles.availabilityText,
                                                    {
                                                        color: mechanic.availability ===
                                                            'available'
                                                            ? colors.success
                                                            : colors.secondaryText,
                                                    },
                                                ], children: availabilityLabel }) })] }), _jsxs(View, { style: styles.locationRow, children: [_jsx(Ionicons, { name: "location-outline", size: 16, color: colors.secondaryText }), _jsx(Text, { numberOfLines: 2, style: [
                                                styles.locationText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: mechanic.location
                                                .address }), mechanic.location
                                            .distanceKm !==
                                            null ? (_jsxs(Text, { style: [
                                                styles.distanceText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: [mechanic.location
                                                    .distanceKm, ' ', "km"] })) : null] }), _jsx(Text, { style: [
                                        styles.sectionLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Specialties" }), _jsx(View, { style: styles.specialties, children: mechanic.specialties.map((specialty) => (_jsx(View, { style: [
                                            styles.specialtyPill,
                                            {
                                                borderColor: colors.border,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.specialtyText,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: specialty }) }, specialty))) }), _jsxs(View, { style: styles.serviceOptions, children: [mechanic.supportsMobileService ? (_jsxs(View, { style: styles.serviceItem, children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.serviceText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: "Mobile Service" })] })) : null, mechanic.supportsWorkshopBooking ? (_jsxs(View, { style: styles.serviceItem, children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.serviceText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: "Workshop Booking" })] })) : null] }), _jsxs(View, { style: styles.actions, children: [mechanic.supportsMobileService ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: mechanic.availability ===
                                                'unavailable', onPress: () => {
                                                router.push({
                                                    pathname: '/mechanic-request/[mechanicId]',
                                                    params: {
                                                        mechanicId: mechanic.id,
                                                    },
                                                });
                                            }, style: [
                                                styles.outlineAction,
                                                {
                                                    borderColor: colors.accent,
                                                    opacity: mechanic.availability ===
                                                        'unavailable'
                                                        ? 0.45
                                                        : 1,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.outlineActionText,
                                                        {
                                                            color: colors.accent,
                                                        },
                                                    ], children: "Request Mechanic" })] })) : null, mechanic.supportsWorkshopBooking ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => {
                                                router.push({
                                                    pathname: '/workshop-booking/[mechanicId]',
                                                    params: {
                                                        mechanicId: mechanic.id,
                                                    },
                                                });
                                            }, style: [
                                                styles.primaryAction,
                                                {
                                                    backgroundColor: colors.accent,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 18, color: "#000000" }), _jsx(Text, { style: styles.primaryActionText, children: "Book Workshop" })] })) : null] })] }, mechanic.id));
                    }) })), _jsx(Text, { style: [
                        styles.backendNotice,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Mechanic availability, distance, pricing, and live status will be verified by MechanIQ backend services." })] }) }));
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
        paddingBottom: 32,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 12,
        textAlign: 'center',
    },
    errorTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    errorMessage: {
        marginTop: 8,
        maxWidth: 300,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    retryButton: {
        minWidth: 150,
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
        minWidth: 150,
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
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        paddingRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 5,
        fontSize: 11,
        lineHeight: 16,
    },
    vehicleCard: {
        marginTop: 20,
        minHeight: 82,
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
        fontSize: 9,
    },
    vehicleName: {
        marginTop: 2,
        fontSize: 15,
        fontWeight: '700',
    },
    vehicleDetails: {
        marginTop: 4,
        fontSize: 9.5,
    },
    resultsHeader: {
        marginTop: 22,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    resultsCount: {
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
    mechanicsList: {
        gap: 12,
    },
    mechanicCard: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    mechanicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePlaceholder: {
        width: 52,
        height: 52,
        borderWidth: 1,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mechanicIdentity: {
        flex: 1,
        marginLeft: 11,
    },
    mechanicNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    mechanicName: {
        flexShrink: 1,
        fontSize: 14,
        fontWeight: '700',
    },
    businessName: {
        marginTop: 2,
        fontSize: 10,
    },
    ratingRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 10,
        fontWeight: '700',
    },
    reviews: {
        fontSize: 9,
    },
    availabilityBadge: {
        marginLeft: 8,
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 7,
    },
    availabilityText: {
        fontSize: 8,
        fontWeight: '700',
    },
    locationRow: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 14,
    },
    distanceText: {
        fontSize: 9,
    },
    sectionLabel: {
        marginTop: 15,
        marginBottom: 7,
        fontSize: 9,
        fontWeight: '600',
    },
    specialties: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    specialtyPill: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 8,
    },
    specialtyText: {
        fontSize: 9,
        fontWeight: '600',
    },
    serviceOptions: {
        marginTop: 15,
        gap: 8,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    serviceText: {
        fontSize: 10,
        fontWeight: '600',
    },
    actions: {
        marginTop: 18,
        flexDirection: 'row',
        gap: 8,
    },
    outlineAction: {
        flex: 1,
        minHeight: 44,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    outlineActionText: {
        flexShrink: 1,
        fontSize: 9,
        fontWeight: '700',
        textAlign: 'center',
    },
    primaryAction: {
        flex: 1,
        minHeight: 44,
        paddingHorizontal: 7,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    primaryActionText: {
        flexShrink: 1,
        color: '#000000',
        fontSize: 9,
        fontWeight: '700',
        textAlign: 'center',
    },
    emptyCard: {
        minHeight: 180,
        padding: 20,
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
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },
    backendNotice: {
        marginTop: 18,
        paddingHorizontal: 10,
        fontSize: 8.5,
        lineHeight: 13,
        textAlign: 'center',
    },
});
