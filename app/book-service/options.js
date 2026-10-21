import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useServiceMechanicSearch } from '../../src/customer/useServiceMechanicSearch';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function BookServiceOptionsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const params = useLocalSearchParams();
    const serviceId = getSingleParam(params.serviceId);
    const preferredDate = getSingleParam(params.preferredDate);
    const preferredTime = getSingleParam(params.preferredTime);
    const rawLocationPreference = getSingleParam(params.locationPreference);
    const locationPreference = rawLocationPreference === 'workshop' ||
        rawLocationPreference === 'mobile-service'
        ? rawLocationPreference
        : null;
    const request = selectedVehicle?.id &&
        serviceId &&
        preferredDate &&
        preferredTime &&
        locationPreference
        ? {
            vehicleId: selectedVehicle.id,
            serviceId,
            preferredDate,
            preferredTime,
            locationPreference,
            notes: null,
        }
        : null;
    const { mechanicSearchResult, isLoadingMechanics, mechanicSearchError, refreshMechanics, } = useServiceMechanicSearch(request);
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
                    ], children: "Finding suitable service options..." })] }));
    }
    if (!selectedVehicle || !request) {
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
                    ], children: "Service details are incomplete" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Choose a service and scheduling preferences before searching for available options." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/book-service/schedule'), style: [
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
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Unable to find service options" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: mechanicSearchError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshMechanics, style: [
                        styles.retryButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: "#000000" }), _jsx(Text, { style: styles.retryButtonText, children: "Try Again" })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/book-service/schedule'), style: [
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.secondaryButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Change Preferences" }) })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/book-service/schedule'), style: [
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
                                    ], children: "Service Options" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Choose a suitable mechanic or workshop for your service request." })] })] }), _jsxs(View, { style: [
                        styles.preferenceCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsxs(View, { style: styles.preferenceRow, children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 19, color: colors.accent }), _jsxs(View, { style: styles.preferenceText, children: [_jsx(Text, { style: [
                                                styles.preferenceLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Vehicle" }), _jsxs(Text, { style: [
                                                styles.preferenceValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: [selectedVehicle.make, ' ', selectedVehicle.model] })] })] }), _jsxs(View, { style: styles.preferenceRow, children: [_jsx(MaterialCommunityIcons, { name: "calendar-outline", size: 19, color: colors.accent }), _jsxs(View, { style: styles.preferenceText, children: [_jsx(Text, { style: [
                                                styles.preferenceLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Preferred schedule" }), _jsxs(Text, { style: [
                                                styles.preferenceValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: [preferredDate, " \u2022", ' ', preferredTime] })] })] }), _jsxs(View, { style: styles.preferenceRow, children: [_jsx(MaterialCommunityIcons, { name: locationPreference ===
                                        'workshop'
                                        ? 'garage'
                                        : 'car-wrench', size: 19, color: colors.accent }), _jsxs(View, { style: styles.preferenceText, children: [_jsx(Text, { style: [
                                                styles.preferenceLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Service location" }), _jsx(Text, { style: [
                                                styles.preferenceValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: locationPreference ===
                                                'workshop'
                                                ? 'Workshop'
                                                : 'Mobile Service' })] })] })] }), _jsxs(View, { style: styles.resultsHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                        styles.resultsTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Suitable Options" }), _jsxs(Text, { style: [
                                        styles.resultsCount,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [mechanics.length, ' ', mechanics.length === 1
                                            ? 'option'
                                            : 'options', ' ', "found"] })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshMechanics, style: [
                                styles.refreshButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "refresh", size: 20, color: colors.accent }) })] }), mechanics.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "calendar-remove-outline", size: 38, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No suitable options found" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Try changing your preferred date, time, or service location." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/book-service/schedule'), style: [
                                styles.changePreferenceButton,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.changePreferenceText,
                                    {
                                        color: colors.accent,
                                    },
                                ], children: "Change Preferences" }) })] })) : (_jsx(View, { style: styles.optionsList, children: mechanics.map((mechanic) => {
                        const availabilityLabel = mechanic.availability ===
                            'available'
                            ? 'Available'
                            : mechanic.availability ===
                                'busy'
                                ? 'Busy'
                                : 'Unavailable';
                        return (_jsxs(View, { style: [
                                styles.optionCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.optionHeader, children: [_jsx(View, { style: [
                                                styles.mechanicAvatar,
                                                {
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(Ionicons, { name: "person-outline", size: 26, color: colors.accent }) }), _jsxs(View, { style: styles.identity, children: [_jsxs(View, { style: styles.nameRow, children: [_jsx(Text, { numberOfLines: 1, style: [
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
                                                                styles.reviewCount,
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
                                                ], children: availabilityLabel }) })] }), _jsxs(View, { style: styles.locationRow, children: [_jsx(Ionicons, { name: "location-outline", size: 16, color: colors.secondaryText }), _jsx(Text, { style: [
                                                styles.locationText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: mechanic.location
                                                .address })] }), _jsxs(View, { style: styles.capabilityRow, children: [_jsx(MaterialCommunityIcons, { name: locationPreference ===
                                                'workshop'
                                                ? 'garage'
                                                : 'car-wrench', size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                styles.capabilityText,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: locationPreference ===
                                                'workshop'
                                                ? 'Workshop service supported'
                                                : 'Mobile service supported' })] }), _jsx(Text, { style: [
                                        styles.specialtiesLabel,
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
                                            ], children: specialty }) }, specialty))) }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: mechanic.availability ===
                                        'unavailable', onPress: () => {
                                        if (locationPreference ===
                                            'mobile-service') {
                                            router.push({
                                                pathname: '/mechanic-request/[mechanicId]',
                                                params: {
                                                    mechanicId: mechanic.id,
                                                },
                                            });
                                            return;
                                        }
                                        router.push({
                                            pathname: '/workshop-booking/[mechanicId]',
                                            params: {
                                                mechanicId: mechanic.id,
                                            },
                                        });
                                    }, style: [
                                        styles.primaryButton,
                                        {
                                            backgroundColor: colors.accent,
                                            opacity: mechanic.availability ===
                                                'unavailable'
                                                ? 0.45
                                                : 1,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: locationPreference ===
                                                'mobile-service'
                                                ? 'car-wrench'
                                                : 'calendar-check-outline', size: 19, color: "#000000" }), _jsx(Text, { style: styles.primaryButtonText, children: locationPreference ===
                                                'mobile-service'
                                                ? 'Request Mechanic'
                                                : 'Continue to Booking' })] })] }, mechanic.id));
                    }) })), _jsx(Text, { style: [
                        styles.backendNotice,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "These matches are frontend development data only. Final service support, pricing, capacity, travel availability and appointment confirmation must be validated by the MechanIQ backend." })] }) }));
}
function getSingleParam(value) {
    if (!value) {
        return null;
    }
    return Array.isArray(value)
        ? value[0] ?? null
        : value;
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
        textAlign: 'center',
    },
    stateTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    stateDescription: {
        marginTop: 8,
        maxWidth: 310,
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
    preferenceCard: {
        marginTop: 20,
        padding: 13,
        borderWidth: 1,
        borderRadius: 14,
        gap: 13,
    },
    preferenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceText: {
        flex: 1,
        marginLeft: 10,
    },
    preferenceLabel: {
        fontSize: 8.5,
    },
    preferenceValue: {
        marginTop: 2,
        fontSize: 10.5,
        fontWeight: '600',
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
        fontWeight: '800',
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
    optionsList: {
        gap: 12,
    },
    optionCard: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mechanicAvatar: {
        width: 52,
        height: 52,
        borderWidth: 1,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    identity: {
        flex: 1,
        marginLeft: 11,
    },
    nameRow: {
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
    reviewCount: {
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
    },
    capabilityRow: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    capabilityText: {
        fontSize: 10,
        fontWeight: '600',
    },
    specialtiesLabel: {
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
    primaryButton: {
        minHeight: 46,
        marginTop: 18,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: '#000000',
        fontSize: 10.5,
        fontWeight: '800',
    },
    emptyCard: {
        minHeight: 190,
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
        maxWidth: 270,
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },
    changePreferenceButton: {
        minHeight: 42,
        marginTop: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    changePreferenceText: {
        fontSize: 10,
        fontWeight: '700',
    },
    backendNotice: {
        marginTop: 18,
        paddingHorizontal: 10,
        fontSize: 8.5,
        lineHeight: 13,
        textAlign: 'center',
    },
});
