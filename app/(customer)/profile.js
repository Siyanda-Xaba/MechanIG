import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageSourcePickerModal from '../../src/components/ImageSourcePickerModal';
import ProfileAvatar from '../../src/components/ProfileAvatar';
import StableScrollView from '../../src/components/StableScrollView';
import { useCustomerProfile } from '../../src/customer/CustomerProfileContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { useProfileImageUpload } from '../../src/users/useProfileImageUpload';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
import { signOutUser } from '../../src/auth/authService';
export default function CustomerProfile() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user, isLoadingUser, setUser, } = useUser();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { profileData, isLoadingProfile, profileError, } = useCustomerProfile();
    const { previewImageUrl, isSelectingImage, isUploadingProfileImage, profileImageError, selectAndUploadProfileImage, clearProfileImageError, } = useProfileImageUpload();
    const [isImageSourcePickerVisible, setIsImageSourcePickerVisible,] = useState(false);
    const isLoading = isLoadingUser ||
        isLoadingVehicles ||
        isLoadingProfile;
    const isProfileImageBusy = isSelectingImage ||
        isUploadingProfileImage;
    const fullName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : 'Driver';
    const quickActions = profileData?.quickActions ?? [];
    const settings = profileData?.settings ?? [];
    const recentActivity = profileData?.recentActivity ?? [];
    function handleProfileImagePress() {
        clearProfileImageError();
        setIsImageSourcePickerVisible(true);
    }
    async function handleProfileImageSource(source) {
        await selectAndUploadProfileImage(source);
        setIsImageSourcePickerVisible(false);
    }
    function handleVehiclePress() {
        router.push('/vehicle-details');
    }
    function handleQuickActionPress(action) {
        switch (action.id) {
            case 'vehicle-details':
                handleVehiclePress();
                return;
            case 'service-history':
                router.push('/service-history');
                return;
            case 'saved-addresses':
                router.push('/saved-addresses');
                return;
            case 'payment-methods':
                router.push('/payment-methods');
                return;
        }
    }
    function handleSettingPress(setting) {
        switch (setting.id) {
            case 'personal-information':
                router.push('/personal-information');
                return;
            case 'notifications':
                router.push('/notification-preferences');
                return;
            case 'security':
                router.push('/security');
                return;
            case 'help-support':
                router.push('/help-support');
                return;
        }
    }
    function handleActivityPress(activity) {
        switch (activity.type) {
            case 'profile-updated':
                router.push('/personal-information');
                return;
            case 'service-booking-confirmed':
                router.push('/service-history');
                return;
        }
    }
    function handleViewAllActivityPress() {
        router.push('/activity');
    }
    function handleSignOutPress() {
        Alert.alert('Sign out?', 'You can sign back in at any time.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOutUser();
                        setUser(null);
                        router.replace('/auth/login');
                    }
                    catch {
                        Alert.alert('Unable to sign out', 'Please try again.');
                    }
                },
            },
        ]);
    }
    return (_jsxs(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], edges: ['top'], children: [_jsxs(StableScrollView, { style: styles.scrollView, contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Profile" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Manage your account, vehicles, and preferences." }), _jsx(View, { style: [
                            styles.profileCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: isLoading ? (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "small", color: colors.accent }), _jsx(Text, { style: [
                                        styles.loadingText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Loading profile..." })] })) : !user ? (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(Ionicons, { name: "person-outline", size: 34, color: colors.secondaryText }), _jsx(Text, { style: [
                                        styles.loadingText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Profile information is unavailable." })] })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: styles.profileTopRow, children: [_jsxs(View, { style: styles.avatarContainer, children: [_jsx(ProfileAvatar, { imageUrl: previewImageUrl ??
                                                        user.profileImageUrl, size: 74 }), _jsx(TouchableOpacity, { activeOpacity: 0.75, disabled: isProfileImageBusy, onPress: handleProfileImagePress, style: [
                                                        styles.cameraButton,
                                                        {
                                                            backgroundColor: colors.accent,
                                                            borderColor: colors.card,
                                                            opacity: isProfileImageBusy
                                                                ? 0.55
                                                                : 1,
                                                        },
                                                    ], children: isProfileImageBusy ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsx(MaterialCommunityIcons, { name: "camera", size: 14, color: "#000000" })) })] }), _jsxs(View, { style: styles.profileIdentity, children: [_jsx(Text, { numberOfLines: 2, style: [
                                                        styles.userName,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: fullName }), _jsxs(View, { style: styles.accountRow, children: [_jsx(Text, { style: [
                                                                styles.accountLabel,
                                                                {
                                                                    color: colors.secondaryText,
                                                                },
                                                            ], children: profileData?.accountLabel ??
                                                                'Driver Account' }), profileData?.isVerified ? (_jsxs(View, { style: [
                                                                styles.verifiedBadge,
                                                                {
                                                                    borderColor: colors.accent,
                                                                },
                                                            ], children: [_jsx(MaterialCommunityIcons, { name: "check-circle", size: 12, color: colors.accent }), _jsx(Text, { style: [
                                                                        styles.verifiedText,
                                                                        {
                                                                            color: colors.accent,
                                                                        },
                                                                    ], children: "Verified" })] })) : null] })] })] }), previewImageUrl ? (_jsxs(View, { style: [
                                        styles.previewNotice,
                                        {
                                            borderColor: colors.warning,
                                        },
                                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 18, color: colors.warning }), _jsx(Text, { style: [
                                                styles.previewNoticeText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "This is a local preview. Your new profile photo will become permanent only after the profile-image backend successfully uploads it." })] })) : null, profileImageError ? (_jsxs(View, { style: [
                                        styles.imageErrorContainer,
                                        {
                                            borderColor: colors.danger,
                                        },
                                    ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 18, color: colors.danger }), _jsx(Text, { style: [
                                                styles.imageErrorText,
                                                {
                                                    color: colors.danger,
                                                },
                                            ], children: profileImageError })] })) : null, _jsxs(View, { style: styles.contactList, children: [_jsxs(View, { style: styles.contactRow, children: [_jsx(Ionicons, { name: "call-outline", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.contactText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: user.phone })] }), _jsxs(View, { style: styles.contactRow, children: [_jsx(Ionicons, { name: "mail-outline", size: 18, color: colors.accent }), _jsx(Text, { numberOfLines: 1, style: [
                                                        styles.contactText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: user.email })] })] }), _jsx(View, { style: [
                                        styles.divider,
                                        {
                                            backgroundColor: colors.border,
                                        },
                                    ] }), selectedVehicle ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleVehiclePress, style: styles.vehicleRow, children: [_jsx(View, { style: [
                                                styles.vehicleImagePlaceholder,
                                                {
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(MaterialCommunityIcons, { name: "car-side", size: 48, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleIdentity, children: [_jsxs(Text, { numberOfLines: 1, style: [
                                                        styles.vehicleName,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(View, { style: [
                                                        styles.registrationBadge,
                                                        {
                                                            borderColor: colors.border,
                                                        },
                                                    ], children: _jsx(Text, { style: [
                                                            styles.registration,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ], children: selectedVehicle.registration }) })] }), _jsx(View, { style: [
                                                styles.vehicleDivider,
                                                {
                                                    backgroundColor: colors.border,
                                                },
                                            ] }), _jsxs(View, { style: styles.primaryVehicleInfo, children: [_jsx(View, { style: [
                                                        styles.primaryVehicleIcon,
                                                        {
                                                            borderColor: colors.accent,
                                                        },
                                                    ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 19, color: colors.accent }) }), _jsxs(View, { style: styles.primaryVehicleText, children: [_jsx(Text, { style: [
                                                                styles.primaryVehicleLabel,
                                                                {
                                                                    color: colors.text,
                                                                },
                                                            ], children: selectedVehicle.isPrimary
                                                                ? 'Primary Vehicle'
                                                                : 'Selected Vehicle' }), _jsxs(Text, { numberOfLines: 1, style: [
                                                                styles.primaryVehicleDetails,
                                                                {
                                                                    color: colors.secondaryText,
                                                                },
                                                            ], children: [selectedVehicle.fuelType || 'N/A', " \u2022", ' ', selectedVehicle.year ?? 'N/A'] })] })] }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] })) : (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleVehiclePress, style: styles.noVehicleRow, children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 24, color: colors.accent }), _jsx(Text, { style: [
                                                styles.noVehicleText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "No vehicle selected" }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }))] })) }), _jsx(View, { style: styles.quickActionsRow, children: quickActions.map((action) => (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleQuickActionPress(action), style: [
                                styles.quickActionCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: getQuickActionIcon(action.id), size: 25, color: colors.accent }), _jsxs(View, { style: styles.quickActionBottom, children: [_jsx(Text, { style: [
                                                styles.quickActionTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: action.title }), _jsx(Ionicons, { name: "chevron-forward", size: 16, color: colors.secondaryText })] })] }, action.id))) }), _jsx(Text, { style: [
                            styles.sectionTitle,
                            {
                                color: colors.text,
                            },
                        ], children: "Account Settings" }), _jsx(View, { style: [
                            styles.settingsCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: settings.map((setting, index) => (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleSettingPress(setting), style: [
                                styles.settingRow,
                                index !== settings.length - 1
                                    ? {
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                    }
                                    : null,
                            ], children: [_jsx(View, { style: [
                                        styles.settingIcon,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: getSettingIcon(setting.id), size: 22, color: colors.accent }) }), _jsxs(View, { style: styles.settingContent, children: [_jsx(Text, { style: [
                                                styles.settingTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: setting.title }), _jsx(Text, { style: [
                                                styles.settingDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: setting.description })] }), _jsx(Ionicons, { name: "chevron-forward", size: 18, color: colors.secondaryText })] }, setting.id))) }), _jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                                    styles.sectionTitleInline,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Recent Activity" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: handleViewAllActivityPress, children: _jsx(Text, { style: [
                                        styles.viewAll,
                                        {
                                            color: colors.accent,
                                        },
                                    ], children: "View All" }) })] }), _jsx(View, { style: [
                            styles.activityCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: recentActivity.length === 0 ? (_jsxs(View, { style: styles.emptyActivity, children: [_jsx(MaterialCommunityIcons, { name: "history", size: 28, color: colors.secondaryText }), _jsx(Text, { style: [
                                        styles.emptyActivityText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "No recent profile activity." })] })) : (recentActivity.map((activity, index) => (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => handleActivityPress(activity), style: [
                                styles.activityRow,
                                index !==
                                    recentActivity.length - 1
                                    ? {
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                    }
                                    : null,
                            ], children: [_jsx(View, { style: [
                                        styles.activityIcon,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: getActivityIcon(activity.type), size: 21, color: colors.accent }) }), _jsxs(View, { style: styles.activityContent, children: [_jsx(Text, { style: [
                                                styles.activityTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: activity.title }), _jsx(Text, { numberOfLines: 2, style: [
                                                styles.activityDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: activity.description })] }), _jsxs(View, { style: styles.activityRight, children: [_jsx(Text, { style: [
                                                styles.activityTime,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: activity.occurredAt }), _jsx(Ionicons, { name: "chevron-forward", size: 17, color: colors.secondaryText })] })] }, activity.id)))) }), profileError ? (_jsxs(View, { style: [
                            styles.errorContainer,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(Ionicons, { name: "alert-circle-outline", size: 18, color: colors.danger }), _jsx(Text, { style: [
                                    styles.errorText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: profileError })] })) : null, _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: handleSignOutPress, style: [
                            styles.signOutButton,
                            {
                                borderColor: colors.danger,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "logout", size: 22, color: colors.danger }), _jsx(Text, { style: [
                                    styles.signOutText,
                                    {
                                        color: colors.danger,
                                    },
                                ], children: "Sign Out" })] })] }), _jsx(ImageSourcePickerModal, { visible: isImageSourcePickerVisible, isBusy: isProfileImageBusy, title: "Change Profile Photo", description: "Take a new profile photo or choose an existing image from your device.", onCameraPress: () => handleProfileImageSource('camera'), onLibraryPress: () => handleProfileImageSource('library'), onClose: () => {
                    if (!isProfileImageBusy) {
                        setIsImageSourcePickerVisible(false);
                    }
                } })] }));
}
function getQuickActionIcon(id) {
    switch (id) {
        case 'vehicle-details':
            return 'car-wrench';
        case 'service-history':
            return 'history';
        case 'saved-addresses':
            return 'map-marker-outline';
        case 'payment-methods':
            return 'credit-card-outline';
    }
}
function getSettingIcon(id) {
    switch (id) {
        case 'personal-information':
            return 'account-outline';
        case 'notifications':
            return 'bell-outline';
        case 'security':
            return 'shield-lock-outline';
        case 'help-support':
            return 'help-circle-outline';
    }
}
function getActivityIcon(type) {
    switch (type) {
        case 'profile-updated':
            return 'account-outline';
        case 'service-booking-confirmed':
            return 'wrench-outline';
    }
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
    profileCard: {
        marginTop: 18,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
    },
    loadingContainer: {
        minHeight: 170,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    loadingText: {
        fontSize: 11,
        textAlign: 'center',
    },
    profileTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    cameraButton: {
        position: 'absolute',
        right: -3,
        bottom: -2,
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIdentity: {
        flex: 1,
        marginLeft: 14,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
    },
    accountRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 7,
    },
    accountLabel: {
        fontSize: 11,
    },
    verifiedBadge: {
        minHeight: 22,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '600',
    },
    previewNotice: {
        marginTop: 14,
        minHeight: 52,
        paddingHorizontal: 11,
        paddingVertical: 9,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    previewNoticeText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 14,
    },
    imageErrorContainer: {
        marginTop: 10,
        minHeight: 44,
        paddingHorizontal: 11,
        paddingVertical: 9,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    imageErrorText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 14,
    },
    contactList: {
        marginTop: 16,
        gap: 10,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactText: {
        flex: 1,
        fontSize: 11,
    },
    divider: {
        height: 1,
        marginTop: 16,
        marginBottom: 12,
    },
    vehicleRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        minHeight: 72,
    },
    vehicleImagePlaceholder: {
        width: 70,
        height: 52,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleIdentity: {
        flex: 1,
        minWidth: 0,
        marginLeft: 10,
    },
    vehicleName: {
        fontSize: 14,
        fontWeight: '700',
    },
    registrationBadge: {
        alignSelf: 'flex-start',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    registration: {
        fontSize: 9,
    },
    vehicleDivider: {
        display: 'none',
    },
    primaryVehicleInfo: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    primaryVehicleIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryVehicleText: {
        flex: 1,
        marginLeft: 8,
    },
    primaryVehicleLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    primaryVehicleDetails: {
        marginTop: 2,
        fontSize: 9,
    },
    noVehicleRow: {
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    noVehicleText: {
        flex: 1,
        fontSize: 11,
    },
    quickActionsRow: {
        marginTop: 14,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    quickActionCard: {
        width: '48%',
        flexGrow: 0,
        flexShrink: 0,
        minHeight: 98,
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-between',
    },
    quickActionBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
    },
    quickActionTitle: {
        flex: 1,
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '600',
    },
    sectionTitle: {
        marginTop: 18,
        marginBottom: 8,
        fontSize: 15,
        fontWeight: '700',
    },
    settingsCard: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
    },
    settingRow: {
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContent: {
        flex: 1,
        marginHorizontal: 12,
    },
    settingTitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    settingDescription: {
        marginTop: 3,
        fontSize: 9.5,
        lineHeight: 13,
    },
    sectionHeader: {
        marginTop: 18,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitleInline: {
        fontSize: 15,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 11,
        fontWeight: '600',
    },
    activityCard: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
    },
    activityRow: {
        minHeight: 74,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityContent: {
        flex: 1,
        marginLeft: 12,
    },
    activityTitle: {
        fontSize: 11.5,
        fontWeight: '600',
    },
    activityDescription: {
        marginTop: 3,
        fontSize: 9.5,
        lineHeight: 13,
    },
    activityRight: {
        marginLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    activityTime: {
        maxWidth: 86,
        fontSize: 9,
        textAlign: 'right',
    },
    emptyActivity: {
        minHeight: 100,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emptyActivityText: {
        fontSize: 10,
    },
    errorContainer: {
        marginTop: 14,
        minHeight: 44,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 10,
    },
    signOutButton: {
        minHeight: 48,
        marginTop: 18,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    signOutText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
