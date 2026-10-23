import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaintenanceReminderCard from '../../src/components/MaintenanceReminderCard';
import PowerShieldCard from '../../src/components/PowerShieldCard';
import ProfileAvatar from '../../src/components/ProfileAvatar';
import QuickActionCard from '../../src/components/QuickActionCard';
import RecentActivityCard from '../../src/components/RecentActivityCard';
import Vehicle3DViewer from '../../src/components/Vehicle3DViewer';
import VehicleHealthRing from '../../src/components/VehicleHealthRing';
import { useCustomerHome } from '../../src/customer/CustomerHomeContext';
import { useCustomerNotifications } from '../../src/customer/useCustomerNotifications';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
import { getVehicleModelSource } from '../../src/vehicles/modelRegistry';
export default function CustomerHome() {
    const router = useRouter();
    const { colors } = useTheme();
    const [isVehicleSelectorOpen, setIsVehicleSelectorOpen,] = useState(false);
    const [isVehicleModelInteracting, setIsVehicleModelInteracting,] = useState(false);
    const { user, isLoadingUser, } = useUser();
    const { vehicles, selectedVehicle, isLoadingVehicles, selectVehicle, } = useVehicle();
    const { homeData, isLoadingHome, homeError, } = useCustomerHome();
    const { notificationsData, } = useCustomerNotifications();
    const vehicleModel = selectedVehicle
        ? getVehicleModelSource(selectedVehicle.modelKey)
        : null;
    const firstName = user?.firstName ?? 'Driver';
    const isVehicleLoading = isLoadingVehicles || isLoadingHome;
    const maintenanceReminder = homeData?.maintenanceReminders?.[0] ??
        null;
    const recentActivity = homeData?.recentActivity ?? [];
    const unreadNotificationCount = notificationsData?.unreadCount ?? 0;
    function handleVehicleSelection(vehicleId) {
        selectVehicle(vehicleId);
        setIsVehicleSelectorOpen(false);
    }
    function handleActivityAction(action) {
        switch (action.type) {
            case 'diagnostics': {
                if (action.resultId) {
                    router.push({
                        pathname: '/diagnostic-result/[resultId]',
                        params: {
                            resultId: action.resultId,
                        },
                    });
                    return;
                }
                router.push('/(customer)/diagnostics');
                return;
            }
            case 'fuel': {
                router.push('/(customer)/fuel');
                return;
            }
            case 'maintenance': {
                router.push('/maintenance');
                return;
            }
            case 'service': {
                if (action.mechanicId) {
                    router.push({
                        pathname: '/workshop-booking/[mechanicId]',
                        params: {
                            mechanicId: action.mechanicId,
                        },
                    });
                    return;
                }
                router.push('/book-service');
                return;
            }
            case 'marketplace': {
                router.push('/(customer)/marketplace');
                return;
            }
            case 'profile': {
                router.push('/(customer)/profile');
                return;
            }
        }
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], edges: ['top'], children: _jsxs(ScrollView, { style: styles.scrollView, contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, scrollEnabled: !isVehicleModelInteracting, bounces: false, alwaysBounceVertical: false, overScrollMode: "never", children: [_jsxs(View, { style: styles.header, children: [_jsx(Image, { source: require('../../assets/images/mechaniq-logo.png'), style: styles.logo, resizeMode: "contain" }), _jsxs(View, { style: styles.headerRight, children: [_jsxs(View, { style: styles.greetingContainer, children: [_jsx(Text, { style: [
                                                styles.greeting,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Good Morning," }), _jsx(Text, { numberOfLines: 1, style: [
                                                styles.userName,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: isLoadingUser
                                                ? 'Loading...'
                                                : firstName })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.7, onPress: () => {
                                        router.push('/notifications');
                                    }, accessibilityRole: "button", accessibilityLabel: "Open notifications", style: [
                                        styles.notificationButton,
                                        {
                                            borderColor: colors.border,
                                            backgroundColor: colors.card,
                                        },
                                    ], children: [_jsx(Ionicons, { name: "notifications-outline", size: 21, color: colors.text }), unreadNotificationCount >
                                            0 ? (_jsx(View, { style: [
                                                styles.notificationBadge,
                                                {
                                                    backgroundColor: colors.accent,
                                                },
                                            ], children: _jsx(Text, { style: styles.notificationBadgeText, children: unreadNotificationCount >
                                                    9
                                                    ? '9+'
                                                    : unreadNotificationCount }) })) : null] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => {
                                        router.push('/(customer)/profile');
                                    }, accessibilityRole: "button", accessibilityLabel: "Open profile", children: _jsx(ProfileAvatar, { imageUrl: user?.profileImageUrl, size: 42 }) })] })] }), _jsxs(View, { style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [isVehicleLoading ? (_jsx(View, { style: styles.vehicleMessageContainer, children: _jsx(Text, { style: [
                                    styles.vehicleMessage,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "Loading vehicle..." }) })) : !selectedVehicle ? (_jsxs(View, { style: styles.vehicleMessageContainer, children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 34, color: colors.secondaryText }), _jsx(Text, { style: [
                                        styles.vehicleMessage,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "No vehicle selected" })] })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: styles.vehicleHeader, children: [_jsxs(View, { children: [_jsxs(Text, { style: [
                                                        styles.vehicleName,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                                        styles.registration,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: selectedVehicle.registration })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => {
                                                setIsVehicleSelectorOpen((currentValue) => !currentValue);
                                            }, accessibilityRole: "button", accessibilityLabel: "Select vehicle", style: [
                                                styles.vehicleSelector,
                                                {
                                                    borderColor: isVehicleSelectorOpen
                                                        ? colors.accent
                                                        : colors.border,
                                                },
                                            ], children: _jsx(Ionicons, { name: isVehicleSelectorOpen
                                                    ? 'chevron-up'
                                                    : 'chevron-down', size: 18, color: colors.accent }) })] }), isVehicleSelectorOpen ? (_jsx(View, { style: [
                                        styles.vehicleSelectorMenu,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border,
                                        },
                                    ], children: vehicles.map((vehicle, index) => {
                                        const isSelected = vehicle.id ===
                                            selectedVehicle.id;
                                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleVehicleSelection(vehicle.id), style: [
                                                styles.vehicleSelectorOption,
                                                index !==
                                                    vehicles.length -
                                                        1
                                                    ? {
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: colors.border,
                                                    }
                                                    : null,
                                            ], children: [_jsx(View, { style: [
                                                        styles.vehicleSelectorIcon,
                                                        {
                                                            borderColor: isSelected
                                                                ? colors.accent
                                                                : colors.border,
                                                        },
                                                    ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 21, color: isSelected
                                                            ? colors.accent
                                                            : colors.secondaryText }) }), _jsxs(View, { style: styles.vehicleSelectorContent, children: [_jsxs(View, { style: styles.vehicleSelectorTitleRow, children: [_jsxs(Text, { numberOfLines: 1, style: [
                                                                        styles.vehicleSelectorTitle,
                                                                        {
                                                                            color: colors.text,
                                                                        },
                                                                    ], children: [vehicle.make, ' ', vehicle.model] }), vehicle.isPrimary ? (_jsx(View, { style: [
                                                                        styles.primaryBadge,
                                                                        {
                                                                            borderColor: colors.accent,
                                                                        },
                                                                    ], children: _jsx(Text, { style: [
                                                                            styles.primaryBadgeText,
                                                                            {
                                                                                color: colors.accent,
                                                                            },
                                                                        ], children: "Primary" }) })) : null] }), _jsxs(Text, { style: [
                                                                styles.vehicleSelectorRegistration,
                                                                {
                                                                    color: colors.secondaryText,
                                                                },
                                                            ], children: [vehicle.registration, ' • ', vehicle.year ?? 'N/A'] })] }), isSelected ? (_jsx(Ionicons, { name: "checkmark-circle", size: 21, color: colors.accent })) : (_jsx(Ionicons, { name: "ellipse-outline", size: 21, color: colors.secondaryText }))] }, vehicle.id));
                                    }) })) : null, _jsxs(View, { style: styles.vehicleMainContent, children: [_jsx(View, { style: styles.vehicleModelContainer, children: _jsx(View, { style: [
                                                    styles.vehicleModelFrame,
                                                    {
                                                        backgroundColor: colors.background,
                                                        borderColor: colors.border,
                                                    },
                                                ], children: _jsx(Vehicle3DViewer, { modelSource: vehicleModel, height: 155, onInteractionChange: setIsVehicleModelInteracting }) }) }), _jsxs(View, { style: styles.healthContainer, children: [_jsx(Text, { style: [
                                                        styles.healthTitle,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: "Vehicle Health" }), _jsx(VehicleHealthRing, { score: homeData?.vehicleHealthScore ??
                                                        null, size: 78, strokeWidth: 7 }), _jsx(Text, { style: [
                                                        styles.healthLabel,
                                                        {
                                                            color: colors.accent,
                                                        },
                                                    ], children: homeData?.vehicleHealthLabel ??
                                                        'Not available' })] })] }), _jsxs(View, { style: [
                                        styles.statusRow,
                                        {
                                            borderTopColor: colors.border,
                                        },
                                    ], children: [_jsx(VehicleStatusItem, { icon: "gas-station", label: "Fuel Level", value: homeData?.fuelLevel !=
                                                null
                                                ? `${homeData.fuelLevel}%`
                                                : 'N/A', colors: colors }), _jsx(VehicleStatusItem, { icon: "wrench-outline", label: "Next Service", value: homeData?.nextServiceKm !=
                                                null
                                                ? `${homeData.nextServiceKm.toLocaleString()} km`
                                                : 'N/A', colors: colors }), _jsx(VehicleStatusItem, { icon: "battery-high", label: "Battery", value: homeData?.batteryStatus ??
                                                'N/A', colors: colors }), _jsx(VehicleStatusItem, { icon: "tire", label: "Tyres", value: homeData?.tyreStatus ??
                                                'N/A', colors: colors })] })] })), homeError ? (_jsx(Text, { style: [
                                styles.errorText,
                                {
                                    color: colors.danger,
                                },
                            ], children: homeError })) : null] }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Quick Actions" }), _jsxs(View, { style: styles.quickActionsGrid, children: [_jsx(QuickActionCard, { title: "Diagnose Vehicle", description: "Scan & check vehicle health", icon: "car-search", onPress: () => {
                                router.push('/(customer)/diagnostics');
                            } }), _jsx(QuickActionCard, { title: "Order Fuel", description: "Request fuel delivery", icon: "gas-station", onPress: () => {
                                router.push('/(customer)/fuel');
                            } }), _jsx(QuickActionCard, { title: "Find Mechanic", description: "Find trusted mechanics", icon: "account-wrench-outline", onPress: () => {
                                router.push('/find-mechanic');
                            } }), _jsx(QuickActionCard, { title: "Book Service", description: "Schedule service appointments", icon: "calendar-check-outline", onPress: () => {
                                router.push('/book-service');
                            } })] }), _jsxs(View, { style: styles.dashboardRow, children: [_jsx(PowerShieldCard, { nextOutageTime: homeData?.nextOutageTime ??
                                null, onSchedulePress: () => {
                                router.push('/(customer)/fuel');
                            } }), _jsx(MaintenanceReminderCard, { reminder: maintenanceReminder, onPress: () => {
                                router.push('/maintenance');
                            } })] }), _jsx(RecentActivityCard, { activities: recentActivity, onViewAllPress: () => {
                        router.push('/activity');
                    }, onActivityPress: (activity) => {
                        if (!activity.action) {
                            return;
                        }
                        handleActivityAction(activity.action);
                    } })] }) }));
}
function VehicleStatusItem({ icon, label, value, colors, }) {
    return (_jsxs(View, { style: styles.statusItem, children: [_jsx(MaterialCommunityIcons, { name: icon, size: 19, color: colors.accent }), _jsx(Text, { numberOfLines: 1, style: [
                    styles.statusLabel,
                    {
                        color: colors.secondaryText,
                    },
                ], children: label }), _jsx(Text, { numberOfLines: 1, style: [
                    styles.statusValue,
                    {
                        color: colors.text,
                    },
                ], children: value })] }));
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
    header: {
        width: '100%',
        minHeight: 74,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: 115,
        height: 62,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    greetingContainer: {
        maxWidth: 92,
        alignItems: 'flex-end',
    },
    greeting: {
        fontSize: 10,
        fontWeight: '400',
    },
    userName: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '700',
    },
    notificationButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationBadge: {
        minWidth: 16,
        height: 16,
        paddingHorizontal: 4,
        borderRadius: 8,
        position: 'absolute',
        top: -4,
        right: -4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadgeText: {
        color: '#000000',
        fontSize: 7,
        fontWeight: '800',
    },
    vehicleCard: {
        width: '100%',
        minHeight: 300,
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
    },
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: '700',
    },
    registration: {
        marginTop: 3,
        fontSize: 11,
        fontWeight: '500',
    },
    vehicleSelector: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleSelectorMenu: {
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    vehicleSelectorOption: {
        minHeight: 66,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleSelectorIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleSelectorContent: {
        flex: 1,
        marginHorizontal: 10,
    },
    vehicleSelectorTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    vehicleSelectorTitle: {
        maxWidth: 150,
        fontSize: 11,
        fontWeight: '700',
    },
    vehicleSelectorRegistration: {
        marginTop: 4,
        fontSize: 9,
    },
    primaryBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
        borderRadius: 5,
    },
    primaryBadgeText: {
        fontSize: 7.5,
        fontWeight: '700',
    },
    vehicleMainContent: {
        minHeight: 165,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleModelContainer: {
        flex: 1,
        minWidth: 0,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7,
        elevation: 5,
    },
    vehicleModelFrame: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    healthContainer: {
        width: 105,
        alignItems: 'center',
        justifyContent: 'center',
    },
    healthTitle: {
        marginBottom: 7,
        fontSize: 10,
        fontWeight: '500',
    },
    healthLabel: {
        marginTop: 6,
        fontSize: 10,
        fontWeight: '700',
    },
    statusRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        paddingTop: 12,
    },
    statusItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    statusLabel: {
        marginTop: 4,
        fontSize: 8,
        textAlign: 'center',
    },
    statusValue: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: '700',
        textAlign: 'center',
    },
    vehicleMessageContainer: {
        minHeight: 260,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    vehicleMessage: {
        fontSize: 13,
        fontWeight: '500',
    },
    errorText: {
        marginTop: 10,
        fontSize: 11,
        textAlign: 'center',
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 12,
        fontSize: 17,
        fontWeight: '700',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    dashboardRow: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12,
    },
});
