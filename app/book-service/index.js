import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useBookService } from '../../src/customer/useBookService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function BookServiceScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { bookServiceData, selectedService, selectedServiceId, isLoadingBookService, bookServiceError, selectService, refreshBookService, } = useBookService(selectedVehicle?.id);
    const isLoading = isLoadingVehicles ||
        isLoadingBookService;
    const services = bookServiceData?.services ?? [];
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
                    ], children: "Loading service options..." })] }));
    }
    if (!selectedVehicle) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 48, color: colors.secondaryText }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "No vehicle selected" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Select a vehicle before booking a service." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/(customer)'), style: [
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
    if (bookServiceError) {
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
                    ], children: "Unable to load services" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: bookServiceError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshBookService, style: [
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
                                    ], children: "Book a Service" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Choose the service your vehicle needs." })] })] }), _jsxs(View, { style: [
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
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 25, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleContent, children: [_jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Service vehicle" }), _jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsxs(Text, { style: [
                                        styles.vehicleDetails,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [selectedVehicle.registration, ' • ', selectedVehicle.year ?? 'N/A'] })] })] }), _jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "What service do you need?" }), _jsx(Text, { style: [
                                styles.sectionDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Select one option to continue." })] }), _jsx(View, { style: styles.serviceGrid, children: services.map((service) => {
                        const isSelected = selectedServiceId ===
                            service.id;
                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => selectService(service.id), style: [
                                styles.serviceCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: isSelected
                                        ? colors.accent
                                        : colors.border,
                                    borderWidth: isSelected
                                        ? 2
                                        : 1,
                                },
                            ], children: [_jsxs(View, { style: styles.serviceTop, children: [_jsx(View, { style: [
                                                styles.serviceIcon,
                                                {
                                                    borderColor: isSelected
                                                        ? colors.accent
                                                        : colors.border,
                                                },
                                            ], children: _jsx(MaterialCommunityIcons, { name: getServiceIcon(service.id), size: 25, color: isSelected
                                                    ? colors.accent
                                                    : colors.text }) }), isSelected ? (_jsx(View, { style: [
                                                styles.selectedIndicator,
                                                {
                                                    backgroundColor: colors.accent,
                                                },
                                            ], children: _jsx(Ionicons, { name: "checkmark", size: 14, color: "#000000" }) })) : null] }), _jsx(Text, { style: [
                                        styles.serviceTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: service.title }), _jsx(Text, { style: [
                                        styles.serviceDescription,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: service.description }), service.estimatedDurationMinutes !==
                                    null ? (_jsxs(View, { style: styles.durationRow, children: [_jsx(MaterialCommunityIcons, { name: "clock-outline", size: 14, color: colors.secondaryText }), _jsxs(Text, { style: [
                                                styles.durationText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: ["About", ' ', formatDuration(service.estimatedDurationMinutes)] })] })) : null] }, service.id));
                    }) }), selectedService ? (_jsx(View, { style: [
                        styles.selectionSummary,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.accent,
                        },
                    ], children: _jsxs(View, { style: styles.selectionSummaryLeft, children: [_jsx(MaterialCommunityIcons, { name: "check-circle-outline", size: 22, color: colors.accent }), _jsxs(View, { style: styles.selectionSummaryText, children: [_jsx(Text, { style: [
                                            styles.selectionLabel,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: "Selected service" }), _jsx(Text, { style: [
                                            styles.selectionTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: selectedService.title })] })] }) })) : null, _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: !selectedService, onPress: () => {
                        if (!selectedService) {
                            return;
                        }
                        router.push({
                            pathname: '/book-service/schedule',
                            params: {
                                serviceId: selectedService.id,
                            },
                        });
                    }, style: [
                        styles.continueButton,
                        {
                            backgroundColor: colors.accent,
                            opacity: selectedService
                                ? 1
                                : 0.4,
                        },
                    ], children: [_jsx(Text, { style: styles.continueButtonText, children: "Continue" }), _jsx(Ionicons, { name: "arrow-forward", size: 20, color: "#000000" })] }), _jsx(Text, { style: [
                        styles.backendNotice,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Final pricing, available dates, workshop capacity, and mechanic availability will come from validated MechanIQ backend data." })] }) }));
}
function getServiceIcon(serviceId) {
    switch (serviceId) {
        case 'oil-service':
            return 'oil';
        case 'brake-service':
            return 'wrench-outline';
        case 'battery-service':
            return 'battery-high';
        case 'tyre-service':
            return 'tire';
        case 'general-service':
            return 'car-wrench';
        case 'vehicle-inspection':
            return 'clipboard-check-outline';
        case 'other':
            return 'dots-horizontal-circle-outline';
    }
}
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    return `${hours}h ${remainingMinutes} min`;
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
    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    sectionDescription: {
        marginTop: 4,
        fontSize: 10.5,
    },
    serviceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    serviceCard: {
        width: '48.5%',
        minHeight: 165,
        borderRadius: 14,
        padding: 13,
    },
    serviceTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    serviceIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIndicator: {
        width: 23,
        height: 23,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceTitle: {
        marginTop: 13,
        fontSize: 13,
        fontWeight: '700',
    },
    serviceDescription: {
        marginTop: 5,
        fontSize: 9,
        lineHeight: 13,
    },
    durationRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    durationText: {
        fontSize: 8.5,
    },
    selectionSummary: {
        marginTop: 18,
        minHeight: 62,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
    },
    selectionSummaryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectionSummaryText: {
        marginLeft: 10,
    },
    selectionLabel: {
        fontSize: 8.5,
    },
    selectionTitle: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '700',
    },
    continueButton: {
        minHeight: 50,
        marginTop: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },
    continueButtonText: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '800',
    },
    backendNotice: {
        marginTop: 15,
        paddingHorizontal: 12,
        fontSize: 8.5,
        lineHeight: 13,
        textAlign: 'center',
    },
});
