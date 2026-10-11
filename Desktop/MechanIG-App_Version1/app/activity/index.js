import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useCustomerHome } from '../../src/customer/CustomerHomeContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function CustomerActivityHistoryScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { homeData, isLoadingHome, homeError, refreshHomeData, } = useCustomerHome();
    const activities = homeData?.recentActivity ?? [];
    const isLoading = isLoadingVehicles || isLoadingHome;
    function handleActivityPress(activity) {
        if (!activity.action) {
            return;
        }
        handleActivityAction(activity.action);
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
                    ], children: "Loading activity..." })] }));
    }
    if (homeError) {
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
                    ], children: "Unable to load activity" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: homeError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshHomeData, style: [
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
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/(customer)'), accessibilityRole: "button", accessibilityLabel: "Go back", style: [
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
                                    ], children: "Activity History" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Recent vehicle and account activity" })] })] }), selectedVehicle ? (_jsxs(View, { style: [
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
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 23, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleContent, children: [_jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Activity for" }), _jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                        styles.vehicleRegistration,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: selectedVehicle.registration })] })] })) : null, _jsxs(View, { style: styles.sectionHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                        styles.sectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Recent Activity" }), _jsxs(Text, { style: [
                                        styles.sectionDescription,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [activities.length, ' ', activities.length === 1
                                            ? 'activity'
                                            : 'activities'] })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshHomeData, accessibilityRole: "button", accessibilityLabel: "Refresh activity", style: [
                                styles.refreshButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "refresh", size: 19, color: colors.accent }) })] }), activities.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "history", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No recent activity" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Diagnostics, fuel, service, maintenance and Marketplace activity will appear here." })] })) : (_jsx(View, { style: styles.activityList, children: activities.map((activity) => {
                        const icon = getActivityIcon(activity.action);
                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: activity.action ===
                                null, onPress: () => handleActivityPress(activity), style: [
                                styles.activityCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.activityIcon,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 22, color: colors.accent }) }), _jsxs(View, { style: styles.activityContent, children: [_jsxs(View, { style: styles.activityTitleRow, children: [_jsx(Text, { style: [
                                                        styles.activityTitle,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: activity.title }), _jsx(View, { style: [
                                                        styles.statusBadge,
                                                        {
                                                            borderColor: colors.border,
                                                        },
                                                    ], children: _jsx(Text, { style: [
                                                            styles.statusText,
                                                            {
                                                                color: colors.accent,
                                                            },
                                                        ], children: activity.status }) })] }), _jsx(Text, { style: [
                                                styles.activityDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: activity.description }), _jsx(Text, { style: [
                                                styles.activityTime,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: activity.time })] }), activity.action ? (_jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })) : null] }, activity.id));
                    }) })), _jsxs(View, { style: [
                        styles.backendNotice,
                        {
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 17, color: colors.accent }), _jsx(Text, { style: [
                                styles.backendNoticeText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Full activity history will eventually come from MechanIQ backend records. Navigation actions only use identifiers when a real related diagnostic, delivery, mechanic or service record exists." })] })] }) }));
}
function getActivityIcon(action) {
    if (!action) {
        return 'history';
    }
    switch (action.type) {
        case 'diagnostics':
            return 'car-search';
        case 'fuel':
            return 'gas-station';
        case 'maintenance':
            return 'wrench-outline';
        case 'service':
            return 'calendar-check-outline';
        case 'marketplace':
            return 'shopping-outline';
        case 'profile':
            return 'account-outline';
    }
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
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
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
        marginTop: 3,
        fontSize: 10,
    },
    vehicleCard: {
        minHeight: 82,
        marginTop: 22,
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
        fontSize: 8.5,
    },
    vehicleName: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '700',
    },
    vehicleRegistration: {
        marginTop: 3,
        fontSize: 9,
    },
    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    sectionDescription: {
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
    activityList: {
        gap: 10,
    },
    activityCard: {
        minHeight: 98,
        padding: 12,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
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
        marginHorizontal: 11,
    },
    activityTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    activityTitle: {
        flex: 1,
        fontSize: 11.5,
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 7.5,
        fontWeight: '700',
    },
    activityDescription: {
        marginTop: 5,
        fontSize: 9.5,
        lineHeight: 14,
    },
    activityTime: {
        marginTop: 6,
        fontSize: 8.5,
    },
    emptyCard: {
        minHeight: 210,
        padding: 22,
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
        maxWidth: 280,
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },
    backendNotice: {
        marginTop: 20,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    backendNoticeText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 8.5,
        lineHeight: 13,
    },
});
