import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function VehicleDetailsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { vehicles, selectedVehicle, isLoadingVehicles, selectVehicle, refreshVehicles, } = useVehicle();
    function handleAddVehiclePress() {
        router.push('/add-vehicle');
    }
    if (isLoadingVehicles) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                        styles.stateText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Loading vehicles..." })] }));
    }
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
                            ], children: "Vehicle Details" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleAddVehiclePress, style: [
                        styles.addVehicleButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "plus-circle-outline", size: 22, color: "#000000" }), _jsxs(View, { style: styles.addVehicleContent, children: [_jsx(Text, { style: styles.addVehicleTitle, children: "Add Vehicle" }), _jsx(Text, { style: styles.addVehicleDescription, children: "Add another vehicle to your MechanIQ account." })] }), _jsx(Ionicons, { name: "chevron-forward", size: 19, color: "#000000" })] }), vehicles.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No Vehicles" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Vehicles linked to your account will appear here once they are available from the backend." }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleAddVehiclePress, style: [
                                styles.emptyAddButton,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "plus", size: 18, color: "#000000" }), _jsx(Text, { style: styles.emptyAddButtonText, children: "Add Vehicle" })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshVehicles, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.retryButtonText,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Refresh" }) })] })) : (_jsxs(_Fragment, { children: [vehicles.length > 1 ? (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Your Vehicles" }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.vehicleSelector, children: vehicles.map((vehicle) => {
                                        const isSelected = vehicle.id === selectedVehicle?.id;
                                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => selectVehicle(vehicle.id), style: [
                                                styles.vehicleSelectorCard,
                                                {
                                                    backgroundColor: colors.card,
                                                    borderColor: isSelected
                                                        ? colors.accent
                                                        : colors.border,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "car-side", size: 30, color: isSelected
                                                        ? colors.accent
                                                        : colors.secondaryText }), _jsxs(Text, { numberOfLines: 1, style: [
                                                        styles.vehicleSelectorName,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: [vehicle.make, " ", vehicle.model] }), _jsx(Text, { style: [
                                                        styles.vehicleSelectorRegistration,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: vehicle.registration }), isSelected ? (_jsx(View, { style: [
                                                        styles.selectedBadge,
                                                        {
                                                            borderColor: colors.accent,
                                                        },
                                                    ], children: _jsx(Text, { style: [
                                                            styles.selectedBadgeText,
                                                            {
                                                                color: colors.accent,
                                                            },
                                                        ], children: "Selected" }) })) : null] }, vehicle.id));
                                    }) })] })) : null, selectedVehicle ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                        styles.heroCard,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                        },
                                    ], children: [_jsx(View, { style: [
                                                styles.vehicleIcon,
                                                {
                                                    borderColor: colors.accent,
                                                },
                                            ], children: _jsx(MaterialCommunityIcons, { name: "car-side", size: 54, color: colors.accent }) }), _jsxs(Text, { style: [
                                                styles.vehicleName,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(View, { style: styles.vehicleStatusRow, children: _jsxs(View, { style: [
                                                    styles.statusBadge,
                                                    {
                                                        borderColor: colors.accent,
                                                    },
                                                ], children: [_jsx(MaterialCommunityIcons, { name: "check-circle-outline", size: 14, color: colors.accent }), _jsx(Text, { style: [
                                                            styles.statusText,
                                                            {
                                                                color: colors.accent,
                                                            },
                                                        ], children: selectedVehicle.isPrimary
                                                            ? 'Primary Vehicle'
                                                            : 'Selected Vehicle' })] }) })] }), _jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Vehicle Information" }), _jsxs(View, { style: [
                                        styles.detailsCard,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                        },
                                    ], children: [_jsx(DetailRow, { icon: "calendar-outline", label: "Year", value: String(selectedVehicle.year ?? 'N/A'), borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent }), _jsx(DetailRow, { icon: "palette-outline", label: "Colour", value: selectedVehicle.color, borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent }), _jsx(DetailRow, { icon: "fuel", label: "Fuel Type", value: selectedVehicle.fuelType, borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent }), _jsx(DetailRow, { icon: "card-text-outline", label: "Registration", value: selectedVehicle.registration, isLast: true, borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent })] }), _jsxs(View, { style: [
                                        styles.noticeCard,
                                        {
                                            borderColor: colors.warning,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                                styles.noticeText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Adding, editing, deleting, or changing a primary vehicle requires the vehicle backend. New vehicles are only added after the backend confirms the saved vehicle record." })] })] })) : null] }))] }) }));
}
function DetailRow({ icon, label, value, isLast = false, borderColor, textColor, secondaryTextColor, accentColor, }) {
    return (_jsxs(View, { style: [
            styles.detailRow,
            !isLast
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                }
                : null,
        ], children: [_jsx(View, { style: [
                    styles.detailIcon,
                    {
                        borderColor: accentColor,
                    },
                ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 20, color: accentColor }) }), _jsxs(View, { style: styles.detailContent, children: [_jsx(Text, { style: [
                            styles.detailLabel,
                            {
                                color: secondaryTextColor,
                            },
                        ], children: label }), _jsx(Text, { style: [
                            styles.detailValue,
                            {
                                color: textColor,
                            },
                        ], children: value })] })] }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centeredPage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 24,
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
    addVehicleButton: {
        minHeight: 72,
        marginTop: 14,
        paddingHorizontal: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
    },
    addVehicleContent: {
        flex: 1,
    },
    addVehicleTitle: {
        color: '#000000',
        fontSize: 13,
        fontWeight: '800',
    },
    addVehicleDescription: {
        marginTop: 3,
        color: '#000000',
        fontSize: 9,
        lineHeight: 14,
        opacity: 0.7,
    },
    stateText: {
        marginTop: 8,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    emptyCard: {
        minHeight: 260,
        marginTop: 18,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
    },
    emptyAddButton: {
        minHeight: 42,
        marginTop: 16,
        paddingHorizontal: 18,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    emptyAddButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '800',
    },
    retryButton: {
        marginTop: 10,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 9,
    },
    retryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: '700',
    },
    vehicleSelector: {
        gap: 10,
        paddingRight: 4,
    },
    vehicleSelectorCard: {
        width: 150,
        minHeight: 128,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    vehicleSelectorName: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '700',
    },
    vehicleSelectorRegistration: {
        marginTop: 4,
        fontSize: 9,
    },
    selectedBadge: {
        alignSelf: 'flex-start',
        marginTop: 10,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 5,
    },
    selectedBadgeText: {
        fontSize: 8,
        fontWeight: '700',
    },
    heroCard: {
        marginTop: 18,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
    },
    vehicleIcon: {
        width: 90,
        height: 74,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleName: {
        marginTop: 14,
        fontSize: 22,
        fontWeight: '800',
    },
    vehicleStatusRow: {
        marginTop: 10,
        flexDirection: 'row',
    },
    statusBadge: {
        minHeight: 28,
        paddingHorizontal: 9,
        borderWidth: 1,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '700',
    },
    detailsCard: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
    },
    detailRow: {
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailContent: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 9,
    },
    detailValue: {
        marginTop: 3,
        fontSize: 12,
        fontWeight: '600',
    },
    noticeCard: {
        marginTop: 18,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
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
