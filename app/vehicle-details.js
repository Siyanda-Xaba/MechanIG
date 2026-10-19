import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function VehicleDetailsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { vehicles, selectedVehicle, isLoadingVehicles, isSettingPrimaryVehicle, isUpdatingVehicle, isDeletingVehicle, vehiclesError, selectVehicle, setPrimaryVehicle, deleteVehicle, refreshVehicles, } = useVehicle();
    function handleAddVehiclePress() {
        router.push('/add-vehicle');
    }
    function handleEditVehiclePress() {
        if (!selectedVehicle || isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle) {
            return;
        }
        router.push({
            pathname: '/edit-vehicle',
            params: { vehicleId: selectedVehicle.id },
        });
    }
    async function handleSetPrimaryPress() {
        if (!selectedVehicle || selectedVehicle.isPrimary || isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle) {
            return;
        }
        try {
            await setPrimaryVehicle(selectedVehicle.id);
        }
        catch (error) {
            Alert.alert('Unable to set primary vehicle', error instanceof Error
                ? error.message
                : 'Please try again.');
        }
    }
    function handleDeleteVehiclePress() {
        if (!selectedVehicle || isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle) {
            return;
        }

        const vehicleToDelete = selectedVehicle;
        const vehicleLabel = `${vehicleToDelete.make} ${vehicleToDelete.model}`.trim();
        const registrationLabel = vehicleToDelete.registration
            ? ` (${vehicleToDelete.registration})`
            : '';

        Alert.alert(
            'Delete Vehicle?',
            `Permanently remove ${vehicleLabel}${registrationLabel} from your MechanIQ account? This cannot be undone. Existing service history and bookings are not deleted. If this is your primary vehicle, another remaining vehicle will become primary.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Vehicle',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteVehicle(vehicleToDelete.id);
                        }
                        catch (error) {
                            Alert.alert(
                                'Unable to delete vehicle',
                                error instanceof Error
                                    ? error.message
                                    : 'Please try again.'
                            );
                        }
                    },
                },
            ]
        );
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
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.back(), style: [
                                styles.backButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Vehicle Details" }), _jsx(View, { style: styles.headerPlaceholder })] }), vehiclesError ? (_jsx(View, { style: [styles.vehiclesErrorCard, { borderColor: colors.warning }], children: _jsx(Text, { style: [styles.vehiclesErrorText, { color: colors.secondaryText }], children: vehiclesError }) })) : null, _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isDeletingVehicle, onPress: handleAddVehiclePress, style: [
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
                            ], children: "Add a vehicle to your MechanIQ account to see it here." }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleAddVehiclePress, style: [
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
                                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isDeletingVehicle, onPress: () => selectVehicle(vehicle.id), style: [
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
                                                            : 'Selected Vehicle' })] }) })] }), !selectedVehicle.isPrimary ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle, onPress: handleSetPrimaryPress, style: [
                                        styles.primaryActionButton,
                                        {
                                            backgroundColor: colors.accent,
                                            opacity: isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle ? 0.6 : 1,
                                        },
                                    ], children: [isSettingPrimaryVehicle ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "star-circle-outline", size: 21, color: "#000000" })), _jsx(Text, { style: styles.primaryActionText, children: isSettingPrimaryVehicle
                                                ? 'Saving Primary Vehicle...'
                                                : 'Set as Primary' })] })) : null, _jsx(Text, { style: [
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
                                    ], children: [_jsx(DetailRow, { icon: "calendar-outline", label: "Year", value: String(selectedVehicle.year), borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent }), _jsx(DetailRow, { icon: "palette-outline", label: "Colour", value: selectedVehicle.color, borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent }), _jsx(DetailRow, { icon: "fuel", label: "Fuel Type", value: selectedVehicle.fuelType, borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent }), _jsx(DetailRow, { icon: "card-text-outline", label: "Registration", value: selectedVehicle.registration, isLast: true, borderColor: colors.border, textColor: colors.text, secondaryTextColor: colors.secondaryText, accentColor: colors.accent })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle, onPress: handleEditVehiclePress, style: [
                                        styles.editActionButton,
                                        {
                                            borderColor: colors.accent,
                                            backgroundColor: colors.card,
                                            opacity: isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle ? 0.55 : 1,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: "pencil-outline", size: 20, color: colors.accent }), _jsx(Text, { style: [styles.editActionText, { color: colors.text }], children: "Edit Vehicle" })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle, onPress: handleDeleteVehiclePress, style: [
                                        styles.deleteActionButton,
                                        {
                                            borderColor: colors.danger,
                                            backgroundColor: colors.card,
                                            opacity: isSettingPrimaryVehicle || isUpdatingVehicle || isDeletingVehicle ? 0.55 : 1,
                                        },
                                    ], children: [isDeletingVehicle ? (_jsx(ActivityIndicator, { size: "small", color: colors.danger })) : (_jsx(MaterialCommunityIcons, { name: "trash-can-outline", size: 20, color: colors.danger })), _jsx(Text, { style: [styles.deleteActionText, { color: colors.danger }], children: isDeletingVehicle ? 'Deleting Vehicle...' : 'Delete Vehicle' })] }), _jsxs(View, { style: [
                                        styles.noticeCard,
                                        {
                                            borderColor: colors.warning,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                                styles.noticeText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Select a vehicle to use it across MechanIQ. Set as Primary saves your default and selects it automatically. Editing retains the existing vehicle record. Deleting a vehicle permanently removes it from your account." })] })] })) : null] }))] }) }));
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
    editActionButton: {
        minHeight: 48,
        marginTop: 14,
        borderWidth: 1,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    editActionText: {
        fontSize: 12,
        fontWeight: '800',
    },
    deleteActionButton: {
        minHeight: 48,
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    deleteActionText: {
        fontSize: 12,
        fontWeight: '800',
    },
    primaryActionButton: {
        minHeight: 48,
        marginTop: 12,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryActionText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    vehiclesErrorCard: {
        marginTop: 12,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
    },
    vehiclesErrorText: {
        fontSize: 10,
        lineHeight: 15,
    },
});
