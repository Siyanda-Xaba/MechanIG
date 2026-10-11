import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useCustomerNotifications } from '../../src/customer/useCustomerNotifications';
import { useTheme } from '../../src/theme/ThemeContext';
export default function CustomerNotificationsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { notificationsData, isLoadingNotifications, notificationsError, refreshNotifications, } = useCustomerNotifications();
    const notifications = notificationsData?.notifications ?? [];
    function handleNotificationPress(notification) {
        if (!notification.action) {
            return;
        }
        switch (notification.action.type) {
            case 'diagnostics': {
                if (notification.action.resultId) {
                    router.push({
                        pathname: '/diagnostic-result/[resultId]',
                        params: {
                            resultId: notification.action.resultId,
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
            case 'service': {
                if (notification.action.mechanicId) {
                    router.push({
                        pathname: '/workshop-booking/[mechanicId]',
                        params: {
                            mechanicId: notification.action.mechanicId,
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
    if (isLoadingNotifications) {
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
                    ], children: "Loading notifications..." })] }));
    }
    if (notificationsError) {
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
                    ], children: "Unable to load notifications" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: notificationsError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshNotifications, style: [
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
                                    ], children: "Notifications" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Vehicle, service and account updates" })] }), notificationsData &&
                            notificationsData.unreadCount > 0 ? (_jsx(View, { style: [
                                styles.unreadBadge,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: styles.unreadBadgeText, children: notificationsData.unreadCount }) })) : null] }), notifications.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(View, { style: [
                                styles.emptyIcon,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "notifications-outline", size: 32, color: colors.secondaryText }) }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No notifications" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Vehicle alerts, mechanic responses, service updates and other MechanIQ notifications will appear here." })] })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                                styles.sectionTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Recent" }), _jsxs(Text, { style: [
                                                styles.sectionDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: [notifications.length, ' ', notifications.length === 1
                                                    ? 'notification'
                                                    : 'notifications'] })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshNotifications, accessibilityRole: "button", accessibilityLabel: "Refresh notifications", style: [
                                        styles.refreshButton,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: "refresh", size: 19, color: colors.accent }) })] }), _jsx(View, { style: styles.notificationsList, children: notifications.map((notification) => {
                                const icon = getNotificationIcon(notification.category);
                                return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: notification.action ===
                                        null, onPress: () => handleNotificationPress(notification), style: [
                                        styles.notificationCard,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: notification.isRead
                                                ? colors.border
                                                : colors.accent,
                                        },
                                    ], children: [_jsx(View, { style: [
                                                styles.notificationIcon,
                                                {
                                                    borderColor: notification.isRead
                                                        ? colors.border
                                                        : colors.accent,
                                                },
                                            ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 23, color: notification.isRead
                                                    ? colors.secondaryText
                                                    : colors.accent }) }), _jsxs(View, { style: styles.notificationContent, children: [_jsxs(View, { style: styles.notificationTitleRow, children: [_jsx(Text, { style: [
                                                                styles.notificationTitle,
                                                                {
                                                                    color: colors.text,
                                                                },
                                                            ], children: notification.title }), !notification.isRead ? (_jsx(View, { style: [
                                                                styles.unreadDot,
                                                                {
                                                                    backgroundColor: colors.accent,
                                                                },
                                                            ] })) : null] }), _jsx(Text, { style: [
                                                        styles.notificationMessage,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: notification.message }), _jsx(Text, { style: [
                                                        styles.notificationTime,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: notification.createdAt })] }), notification.action ? (_jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })) : null] }, notification.id));
                            }) })] })), _jsxs(View, { style: [
                        styles.backendNotice,
                        {
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 17, color: colors.accent }), _jsx(Text, { style: [
                                styles.backendNoticeText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Notification delivery and read state will be synchronized with the MechanIQ backend. This screen does not simulate mechanic responses or push events locally." })] })] }) }));
}
function getNotificationIcon(category) {
    switch (category) {
        case 'diagnostics':
            return 'car-search';
        case 'fuel':
            return 'gas-station';
        case 'service':
            return 'calendar-check-outline';
        case 'marketplace':
            return 'shopping-outline';
        case 'account':
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
    unreadBadge: {
        minWidth: 30,
        height: 30,
        paddingHorizontal: 8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadBadgeText: {
        color: '#000000',
        fontSize: 10,
        fontWeight: '800',
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
    notificationsList: {
        gap: 10,
    },
    notificationCard: {
        minHeight: 94,
        padding: 12,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationContent: {
        flex: 1,
        marginHorizontal: 11,
    },
    notificationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationTitle: {
        flex: 1,
        fontSize: 11.5,
        fontWeight: '700',
    },
    unreadDot: {
        width: 7,
        height: 7,
        marginLeft: 8,
        borderRadius: 4,
    },
    notificationMessage: {
        marginTop: 5,
        fontSize: 9.5,
        lineHeight: 14,
    },
    notificationTime: {
        marginTop: 6,
        fontSize: 8.5,
    },
    emptyCard: {
        minHeight: 230,
        marginTop: 24,
        padding: 24,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        width: 62,
        height: 62,
        borderWidth: 1,
        borderRadius: 31,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: '700',
    },
    emptyDescription: {
        marginTop: 7,
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
