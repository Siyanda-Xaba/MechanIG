import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useCustomerNotificationPreferences } from '../src/customer/useCustomerNotificationPreferences';
import { useUpdateCustomerNotificationPreferences } from '../src/customer/useUpdateCustomerNotificationPreferences';
import { useTheme } from '../src/theme/ThemeContext';
import { useUser } from '../src/users/UserContext';
const notificationCategories = [
    {
        category: 'diagnostics',
        title: 'Diagnostics',
        description: 'Vehicle health, diagnostic results, and important diagnostic alerts.',
        icon: 'car-wrench',
    },
    {
        category: 'service',
        title: 'Service & Repairs',
        description: 'Bookings, mechanic responses, service reminders, and repair updates.',
        icon: 'wrench-outline',
    },
    {
        category: 'fuel',
        title: 'Fuel',
        description: 'Fuel delivery, scheduled top-ups, and supported fuel-service updates.',
        icon: 'gas-station-outline',
    },
    {
        category: 'marketplace',
        title: 'Marketplace',
        description: 'Relevant marketplace activity, orders, and supported product updates.',
        icon: 'shopping-outline',
    },
    {
        category: 'account',
        title: 'Account',
        description: 'Important account, profile, security, and service-related information.',
        icon: 'account-outline',
    },
];
function createDefaultDraft() {
    return notificationCategories.map(({ category }) => ({
        category,
        pushEnabled: false,
        emailEnabled: false,
    }));
}
export default function NotificationPreferencesScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, } = useUser();
    const { notificationPreferences, isLoadingNotificationPreferences, notificationPreferencesError, refreshNotificationPreferences, } = useCustomerNotificationPreferences(user?.id ?? null);
    const { isUpdatingNotificationPreferences, updateNotificationPreferencesError, updateNotificationPreferences, clearUpdateNotificationPreferencesError, } = useUpdateCustomerNotificationPreferences();
    const [draftPreferences, setDraftPreferences,] = useState(createDefaultDraft);
    useEffect(() => {
        if (!notificationPreferences) {
            return;
        }
        setDraftPreferences(notificationCategories.map(({ category }) => {
            const savedPreference = notificationPreferences.categoryPreferences.find((preference) => preference.category ===
                category);
            return (savedPreference ?? {
                category,
                pushEnabled: false,
                emailEnabled: false,
            });
        }));
    }, [notificationPreferences]);
    const isLoading = isLoadingUser ||
        isLoadingNotificationPreferences;
    function updatePreference(category, channel, enabled) {
        clearUpdateNotificationPreferencesError();
        setDraftPreferences((current) => current.map((preference) => {
            if (preference.category !==
                category) {
                return preference;
            }
            if (channel === 'push') {
                return {
                    ...preference,
                    pushEnabled: enabled,
                };
            }
            return {
                ...preference,
                emailEnabled: enabled,
            };
        }));
    }
    async function handleSave() {
        if (!user) {
            return;
        }
        const savedPreferences = await updateNotificationPreferences({
            customerId: user.id,
            categoryPreferences: draftPreferences,
        });
        if (!savedPreferences) {
            return;
        }
        setDraftPreferences(savedPreferences.categoryPreferences);
        router.dismissTo('/profile');
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, disabled: isUpdatingNotificationPreferences, onPress: () => router.dismissTo('/profile'), style: [
                                styles.backButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Notifications" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Notification Preferences" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Choose how you would like to receive different types of MechanIQ updates." }), isLoading ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Loading Preferences" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Retrieving your saved notification settings." })] })) : !user ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "person-outline", size: 40, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Customer Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Your account information could not be loaded." })] })) : notificationPreferencesError ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 40, color: colors.warning }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Preferences Unavailable" }), _jsx(Text, { style: [
                                styles.stateDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: notificationPreferencesError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshNotificationPreferences, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: colors.text }), _jsx(Text, { style: [
                                        styles.retryButtonText,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Try Again" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                styles.channelHeader,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(View, { style: styles.channelHeaderSpacer }), _jsx(Text, { style: [
                                        styles.channelHeaderText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Push" }), _jsx(Text, { style: [
                                        styles.channelHeaderText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Email" })] }), _jsx(View, { style: [
                                styles.preferencesCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: notificationCategories.map((definition, index) => {
                                const preference = draftPreferences.find((item) => item.category ===
                                    definition.category);
                                const pushEnabled = preference?.pushEnabled ??
                                    false;
                                const emailEnabled = preference?.emailEnabled ??
                                    false;
                                return (_jsxs(View, { style: [
                                        styles.preferenceRow,
                                        index !==
                                            notificationCategories.length -
                                                1
                                            ? {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border,
                                            }
                                            : null,
                                    ], children: [_jsx(View, { style: [
                                                styles.preferenceIcon,
                                                {
                                                    borderColor: colors.accent,
                                                },
                                            ], children: _jsx(MaterialCommunityIcons, { name: definition.icon, size: 21, color: colors.accent }) }), _jsxs(View, { style: styles.preferenceContent, children: [_jsx(Text, { style: [
                                                        styles.preferenceTitle,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: definition.title }), _jsx(Text, { style: [
                                                        styles.preferenceDescription,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: definition.description })] }), _jsx(View, { style: styles.switchColumn, children: _jsx(Switch, { style: styles.compactSwitch, value: pushEnabled, disabled: isUpdatingNotificationPreferences, onValueChange: (value) => updatePreference(definition.category, 'push', value) }) }), _jsx(View, { style: styles.switchColumn, children: _jsx(Switch, { style: styles.compactSwitch, value: emailEnabled, disabled: isUpdatingNotificationPreferences, onValueChange: (value) => updatePreference(definition.category, 'email', value) }) })] }, definition.category));
                            }) }), updateNotificationPreferencesError ? (_jsxs(View, { style: [
                                styles.errorCard,
                                {
                                    borderColor: colors.danger,
                                },
                            ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                                        styles.errorText,
                                        {
                                            color: colors.danger,
                                        },
                                    ], children: updateNotificationPreferencesError })] })) : null, _jsxs(View, { style: [
                                styles.noticeCard,
                                {
                                    borderColor: colors.warning,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 20, color: colors.warning }), _jsx(Text, { style: [
                                        styles.noticeText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "These switches are a local draft until the backend confirms the save. Push delivery also requires device notification permissions, push-token registration, and a notification provider." })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: isUpdatingNotificationPreferences, onPress: handleSave, style: [
                                styles.saveButton,
                                {
                                    backgroundColor: colors.accent,
                                    opacity: isUpdatingNotificationPreferences
                                        ? 0.6
                                        : 1,
                                },
                            ], children: [isUpdatingNotificationPreferences ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "content-save-outline", size: 20, color: "#000000" })), _jsx(Text, { style: styles.saveButtonText, children: isUpdatingNotificationPreferences
                                        ? 'Saving...'
                                        : 'Save Preferences' })] })] }))] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 36,
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
    title: {
        marginTop: 14,
        fontSize: 24,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
    },
    stateCard: {
        minHeight: 230,
        marginTop: 18,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    stateDescription: {
        marginTop: 7,
        maxWidth: 310,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    retryButton: {
        minHeight: 42,
        marginTop: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    retryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    channelHeader: {
        minHeight: 40,
        marginTop: 18,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelHeaderSpacer: {
        flex: 1,
    },
    channelHeaderText: {
        width: 58,
        fontSize: 9,
        fontWeight: '700',
        textAlign: 'center',
    },
    preferencesCard: {
        borderWidth: 1,
        borderRadius: 14,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingHorizontal: 12,
    },
    preferenceRow: {
        minHeight: 92,
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    preferenceContent: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
    },
    preferenceTitle: {
        fontSize: 11.5,
        fontWeight: '700',
    },
    preferenceDescription: {
        marginTop: 4,
        fontSize: 8.5,
        lineHeight: 13,
    },
    switchColumn: {
        width: 58,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compactSwitch: {
        transform: [
            {
                scaleX: 0.76,
            },
            {
                scaleY: 0.76,
            },
        ],
    },
    errorCard: {
        marginTop: 14,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 14,
    },
    noticeCard: {
        marginTop: 14,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    noticeText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 15,
    },
    saveButton: {
        minHeight: 50,
        marginTop: 18,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
});
