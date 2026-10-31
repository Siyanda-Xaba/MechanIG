import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaintenanceReminderCard from '../../src/components/MaintenanceReminderCard';
import PowerShieldCard from '../../src/components/PowerShieldCard';
import ProfileAvatar from '../../src/components/ProfileAvatar';
import QuickActionCard from '../../src/components/QuickActionCard';
import RecentActivityCard from '../../src/components/RecentActivityCard';
import VehicleHealthRing from '../../src/components/VehicleHealthRing';
import { useCustomerHome } from '../../src/customer/CustomerHomeContext';
import { homePalette } from '../../src/customer/homePalette';
import { clearVehicleHeroImage, saveVehicleHeroImage } from '../../src/vehicles/vehicleService';
import { fetchWithPictureSearchFallback, getPictureSearchAuthHeaders } from '../../src/config/pictureSearchApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomerNotifications } from '../../src/customer/useCustomerNotifications';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
import { useTheme } from '../../src/theme/ThemeContext';
import ThemeLogo from '../../src/components/ThemeLogo';

function getVehicleHeroCacheKey(vehicle) {
    if (!vehicle?.make || !vehicle?.model || !vehicle?.year) return null;
    const value = [vehicle.make, vehicle.model, vehicle.year].join('|').toLowerCase();
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
}

const logoAspectRatio = 1679 / 937;

export default function CustomerHome() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, mode } = useTheme();
    const homeColors = useMemo(() => ({ ...homePalette, ...colors }), [colors]);
    const styles = useMemo(() => createStyles(homeColors), [homeColors]);
    const [isVehicleSelectorOpen, setIsVehicleSelectorOpen] = useState(false);
    const [vehicleHeroImageState, setVehicleHeroImageState] = useState(null);
    const [vehicleHeroImageLoadingKey, setVehicleHeroImageLoadingKey] = useState(null);
    const [vehicleHeroImageFailedKey, setVehicleHeroImageFailedKey] = useState(null);
    const [vehicleHeroImageErrorState, setVehicleHeroImageErrorState] = useState(null);
    const [rejectedVehicleHeroImageUrl, setRejectedVehicleHeroImageUrl] = useState(null);
    const [vehicleHeroImageRetry, setVehicleHeroImageRetry] = useState(0);
    const { isLoadingUser, user } = useUser();
    const { isLoadingVehicles, selectVehicle, selectedVehicle, vehicles } = useVehicle();
    const { homeData, homeError, isLoadingHome, liveObdSnapshot } = useCustomerHome();
    const { notificationsData } = useCustomerNotifications();
    const vehicleHeroCacheKey = getVehicleHeroCacheKey(selectedVehicle);
    const selectedVehicleId = selectedVehicle?.id;
    const selectedVehicleMake = selectedVehicle?.make;
    const selectedVehicleModel = selectedVehicle?.model;
    const selectedVehicleYear = selectedVehicle?.year;
    const selectedVehicleHeroImageUrl = selectedVehicle?.heroImageUrl;
    const vehicleHeroViewKey = [user?.id || 'signed-out', selectedVehicleId || '', vehicleHeroCacheKey || ''].join(':');
    const vehicleHeroImageUri = selectedVehicleHeroImageUrl && selectedVehicleHeroImageUrl !== rejectedVehicleHeroImageUrl
        ? selectedVehicleHeroImageUrl
        : (vehicleHeroImageState?.key === vehicleHeroViewKey ? vehicleHeroImageState.uri : null);
    const isLoadingVehicleHeroImage = vehicleHeroImageLoadingKey === vehicleHeroViewKey;
    const vehicleHeroImageFailed = vehicleHeroImageFailedKey === vehicleHeroViewKey;
    const vehicleHeroImageError = vehicleHeroImageErrorState?.key === vehicleHeroViewKey
        ? vehicleHeroImageErrorState.message
        : null;
    const firstName = user?.firstName ?? 'Driver';
    const isVehicleLoading = isLoadingVehicles || isLoadingHome;
    const maintenanceReminder = homeData?.maintenanceReminders?.[0] ?? null;
    const recentActivity = homeData?.recentActivity ?? [];
    const unreadNotificationCount = notificationsData?.unreadCount ?? 0;
    const liveReading = (pid) => liveObdSnapshot?.readings?.find((reading) => (
        reading.pid === pid && reading.supported !== false && reading.value != null
    ));
    const fuelLevelReading = liveReading('2F');
    const ecuVoltageReading = liveReading('42');
    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        if (!selectedVehicleId || !vehicleHeroCacheKey) {
            return () => {
                active = false;
                controller.abort();
            };
        }

        async function loadVehicleHeroImage() {
            setVehicleHeroImageLoadingKey(vehicleHeroViewKey);
            setVehicleHeroImageFailedKey((currentKey) => currentKey === vehicleHeroViewKey ? null : currentKey);
            setVehicleHeroImageErrorState(null);
            const timeoutId = setTimeout(() => controller.abort(), 120000);
            const storageKey = 'mechaniq-vehicle-hero:' + vehicleHeroCacheKey;
            function showImage(uri) {
                if (active) setVehicleHeroImageState({ key: vehicleHeroViewKey, uri });
            }
            async function assignImageToAccount(imageUri, contentType) {
                try {
                    return await saveVehicleHeroImage(selectedVehicleId, imageUri, contentType);
                } catch (error) {
                    console.warn('Unable to save generated vehicle image to this account:', error?.message || 'unknown error');
                    return null;
                }
            }
            try {
                const { File, Paths } = await import('expo-file-system');
                if (selectedVehicleHeroImageUrl && selectedVehicleHeroImageUrl !== rejectedVehicleHeroImageUrl) {
                    return;
                }

                const savedUri = await AsyncStorage.getItem(storageKey);
                if (savedUri) {
                    const savedFile = new File(savedUri);
                    if (savedFile.exists && savedFile.size > 0) {
                        const contentType = savedUri.toLowerCase().endsWith('.png')
                            ? 'image/png'
                            : savedUri.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';
                        const accountImageUrl = await assignImageToAccount(savedFile.uri, contentType);
                        showImage(accountImageUrl || savedFile.uri);
                        return;
                    }
                }

                const cachedExtensions = ['jpg', 'png', 'webp'];
                for (const extension of cachedExtensions) {
                    const cachedFile = new File(Paths.cache, 'mechaniq-vehicle-' + vehicleHeroCacheKey + '.' + extension);
                    if (cachedFile.exists && cachedFile.size > 0) {
                        await AsyncStorage.setItem(storageKey, cachedFile.uri).catch(() => {});
                        const contentType = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
                        const accountImageUrl = await assignImageToAccount(cachedFile.uri, contentType);
                        showImage(accountImageUrl || cachedFile.uri);
                        return;
                    }
                }

                const headers = await getPictureSearchAuthHeaders();
                const query = [
                    'make=' + encodeURIComponent(String(selectedVehicleMake || '')),
                    'model=' + encodeURIComponent(String(selectedVehicleModel || '')),
                    'year=' + encodeURIComponent(String(selectedVehicleYear || '')),
                ].join('&');
                const response = await fetchWithPictureSearchFallback(
                    '/api/v1/vehicle-hero-image?' + query,
                    { headers, signal: controller.signal }
                );
                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => null);
                    throw new Error(errorPayload?.error || 'The vehicle preview is unavailable.');
                }
                const contentType = String(response.headers.get('content-type') || '').toLowerCase();
                if (!contentType.startsWith('image/')) {
                    throw new Error('The vehicle preview response was not an image.');
                }
                const imageBytes = new Uint8Array(await response.arrayBuffer());
                if (!imageBytes.length || imageBytes.byteLength > 10 * 1024 * 1024) {
                    throw new Error('The vehicle preview image could not be saved.');
                }
                const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
                const imageFile = new File(Paths.cache, 'mechaniq-vehicle-' + vehicleHeroCacheKey + '.' + extension);
                imageFile.write(imageBytes);
                await AsyncStorage.setItem(storageKey, imageFile.uri).catch(() => {});
                showImage(imageFile.uri);
                const accountImageUrl = await assignImageToAccount(imageFile.uri, contentType.split(';')[0]);
                if (accountImageUrl) showImage(accountImageUrl);
            } catch (error) {
                if (active && !controller.signal.aborted) {
                    console.warn('Unable to load the registered vehicle image:', error?.message || 'unknown error');
                    setVehicleHeroImageFailedKey(vehicleHeroViewKey);
                    setVehicleHeroImageErrorState({
                        key: vehicleHeroViewKey,
                        message: error?.message || 'The registered vehicle image could not be loaded.',
                    });
                }
            } finally {
                clearTimeout(timeoutId);
                if (active) setVehicleHeroImageLoadingKey((currentKey) => currentKey === vehicleHeroViewKey ? null : currentKey);
            }
        }

        void loadVehicleHeroImage();
        return () => {
            active = false;
            controller.abort();
        };
    }, [selectedVehicleId, selectedVehicleMake, selectedVehicleModel, selectedVehicleYear, selectedVehicleHeroImageUrl, rejectedVehicleHeroImageUrl, vehicleHeroImageRetry, vehicleHeroCacheKey, vehicleHeroViewKey]);
    const tabBarOffset = Math.max(insets.bottom - 10, 2);
    const scrollBottomPadding = 68 + tabBarOffset + 72;
    useFocusEffect(useCallback(() => {
        StatusBar.setBarStyle(mode === 'light' ? 'dark-content' : 'light-content');
        return () => {
            StatusBar.setBarStyle(mode === 'light' ? 'dark-content' : 'light-content');
        };
    }, [mode]));
    function handleVehicleSelection(vehicleId) {
        selectVehicle(vehicleId);
        setIsVehicleSelectorOpen(false);
    }
    function handleVehicleHeroImageError() {
        setVehicleHeroImageFailedKey(vehicleHeroViewKey);
        setVehicleHeroImageErrorState({
            key: vehicleHeroViewKey,
            message: 'The saved vehicle image could not be displayed. Trying to recover it.',
        });
        if (selectedVehicleHeroImageUrl && vehicleHeroImageUri === selectedVehicleHeroImageUrl) {
            setRejectedVehicleHeroImageUrl(selectedVehicleHeroImageUrl);
            void clearVehicleHeroImage(selectedVehicleId).catch((error) => {
                console.warn('Unable to clear the broken saved vehicle image URL:', error?.message || 'unknown error');
            });
            return;
        }
        const storageKey = 'mechaniq-vehicle-hero:' + vehicleHeroCacheKey;
        void (async () => {
            await AsyncStorage.removeItem(storageKey).catch(() => {});
            const { File, Paths } = await import('expo-file-system');
            for (const extension of ['jpg', 'png', 'webp']) {
                const cachedFile = new File(Paths.cache, 'mechaniq-vehicle-' + vehicleHeroCacheKey + '.' + extension);
                if (cachedFile.exists) cachedFile.delete();
            }
            setVehicleHeroImageState((current) => current?.key === vehicleHeroViewKey ? null : current);
        })().catch((error) => {
            console.warn('Unable to clear the damaged local vehicle image:', error?.message || 'unknown error');
        });
    }
    function retryVehicleHeroImage() {
        setVehicleHeroImageFailedKey(null);
        setVehicleHeroImageRetry((attempt) => attempt + 1);
    }
    function handleActivityAction(action) {
        switch (action.type) {
            case 'diagnostics': {
                if (action.resultId) {
                    router.push({
                        params: {
                            resultId: action.resultId,
                        },
                        pathname: '/diagnostic-result/[resultId]',
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
                        params: {
                            mechanicId: action.mechanicId,
                        },
                        pathname: '/workshop-booking/[mechanicId]',
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
    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.header}>
                    <ThemeLogo
                        accessibilityLabel="MechanIQ"
                        matchAppBackground
                        style={styles.logo}
                    />
                    <View style={styles.headerRight}>
                        <View style={styles.greetingContainer}>
                            <Text numberOfLines={1} style={styles.greeting}>
                                Good Morning,
                            </Text>
                            <Text numberOfLines={1} style={styles.userName}>
                                {isLoadingUser ? 'Loading...' : firstName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            accessibilityLabel="Open notifications"
                            accessibilityRole="button"
                            activeOpacity={0.7}
                            onPress={() => {
                                router.push('/notifications');
                            }}
                            style={styles.notificationButton}
                        >
                            <Ionicons color={homeColors.text} name="notifications-outline" size={20} />
                            {unreadNotificationCount > 0 ? (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationBadgeText}>
                                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                    </Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityLabel="Open profile"
                            accessibilityRole="button"
                            activeOpacity={0.75}
                            onPress={() => {
                                router.push('/(customer)/profile');
                            }}
                        >
                            <ProfileAvatar
                                backgroundColor={homeColors.card}
                                borderColor={homeColors.border}
                                iconColor={homeColors.text}
                                imageUrl={user?.profileImageUrl}
                                size={42}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            <ScrollView
                alwaysBounceVertical={false}
                bounces={false}
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingBottom: scrollBottomPadding,
                    },
                ]}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                scrollEnabled
                style={styles.scrollView}
            >
                <View style={styles.vehicleShadow}>
                    <View style={styles.vehicleCard}>
                        {isVehicleLoading ? (
                            <View style={styles.vehicleMessage}>
                                <Text style={styles.vehicleMessageText}>Loading vehicle...</Text>
                            </View>
                        ) : !selectedVehicle ? (
                            <View style={styles.vehicleMessage}>
                                <Text style={styles.vehicleMessageText}>No vehicle selected</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.featured}>
                                    <View style={styles.heroPlaceholder}>
                                        {vehicleHeroImageUri && !vehicleHeroImageFailed ? (
                                            <Image
                                                accessibilityLabel={String(selectedVehicleYear || '') + ' ' + selectedVehicleMake + ' ' + selectedVehicleModel + ' vehicle image'}
                                                onError={handleVehicleHeroImageError}
                                                resizeMode="cover"
                                                source={{ uri: vehicleHeroImageUri }}
                                                style={styles.heroImage}
                                            />
                                        ) : (
                                            <View style={styles.heroFallback}>
                                                {isLoadingVehicleHeroImage ? (
                                                    <ActivityIndicator color={homeColors.accent} size="large" />
                                                ) : (
                                                    <>
                                                        <MaterialCommunityIcons color={homeColors.secondaryText} name="car-outline" size={64} />
                                                        {vehicleHeroImageFailed ? (
                                                            <>
                                                                <Text style={styles.heroImageError}>{vehicleHeroImageError || 'Vehicle image could not load.'}</Text>
                                                                <TouchableOpacity accessibilityRole="button" onPress={retryVehicleHeroImage} style={styles.heroImageRetry}>
                                                                    <Text style={styles.heroImageRetryText}>Try again</Text>
                                                                </TouchableOpacity>
                                                            </>
                                                        ) : null}
                                                    </>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                    <LinearGradient
                                        colors={['rgba(9, 11, 16, 0.68)', 'rgba(9, 11, 16, 0.4)', 'rgba(9, 11, 16, 0)']}
                                        locations={[0, 0.45, 1]}
                                        end={{
                                            x: 0,
                                            y: 1,
                                        }}
                                        pointerEvents="none"
                                        start={{
                                            x: 0,
                                            y: 0,
                                        }}
                                        style={styles.heroScrim}
                                    />
                                    <View style={styles.vehicleHeader}>
                                        <View style={styles.vehicleTitle}>
                                            <Text numberOfLines={2} selectable style={styles.vehicleName}>
                                                {selectedVehicle.make} {selectedVehicle.model}
                                            </Text>
                                            <Text numberOfLines={1} selectable style={styles.registration}>
                                                {selectedVehicle.registration}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            accessibilityLabel="Select vehicle"
                                            accessibilityRole="button"
                                            activeOpacity={0.7}
                                            hitSlop={8}
                                            onPress={() => {
                                                setIsVehicleSelectorOpen((currentValue) => !currentValue);
                                            }}
                                            style={styles.vehicleSelector}
                                        >
                                            <Ionicons
                                                color={homeColors.text}
                                                name={isVehicleSelectorOpen ? 'chevron-up' : 'chevron-down'}
                                                size={18}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {isVehicleSelectorOpen ? (
                                        <View style={styles.vehicleSelectorMenu}>
                                            {vehicles.map((vehicle, index) => {
                                                const isSelected = vehicle.id === selectedVehicle.id;
                                                return (
                                                    <TouchableOpacity
                                                        accessibilityRole="button"
                                                        activeOpacity={0.75}
                                                        key={vehicle.id}
                                                        onPress={() => handleVehicleSelection(vehicle.id)}
                                                        style={[
                                                            styles.vehicleSelectorOption,
                                                            index !== vehicles.length - 1
                                                                ? {
                                                                    borderBottomColor: homeColors.border,
                                                                    borderBottomWidth: 1,
                                                                }
                                                                : null,
                                                        ]}
                                                    >
                                                        <MaterialCommunityIcons
                                                            color={isSelected ? homeColors.accent : homeColors.secondaryText}
                                                            name="car-side"
                                                            size={22}
                                                        />
                                                        <View style={styles.vehicleSelectorContent}>
                                                            <View style={styles.vehicleSelectorTitleRow}>
                                                                <Text numberOfLines={1} style={styles.vehicleSelectorTitle}>
                                                                    {vehicle.make} {vehicle.model}
                                                                </Text>
                                                                {vehicle.isPrimary ? (
                                                                    <View style={styles.primaryBadge}>
                                                                        <Text style={styles.primaryBadgeText}>Primary</Text>
                                                                    </View>
                                                                ) : null}
                                                            </View>
                                                            <Text numberOfLines={1} style={styles.vehicleSelectorRegistration}>
                                                                {vehicle.registration} • {vehicle.year ?? 'N/A'}
                                                            </Text>
                                                        </View>
                                                        <Ionicons
                                                            color={isSelected ? homeColors.accent : homeColors.secondaryText}
                                                            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                                                            size={20}
                                                        />
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    ) : null}
                                </View>
                                <View style={styles.specRow}>
                                    <VehicleSpec label={homeData?.vehicleHealthLabel ?? 'Health'}>
                                        <VehicleHealthRing
                                            score={homeData?.vehicleHealthScore ?? null}
                                            size={42}
                                            strokeWidth={3.5}
                                        />
                                    </VehicleSpec>
                                    <VehicleSpec label="Fuel Level">
                                        <Text
                                            adjustsFontSizeToFit
                                            minimumFontScale={0.7}
                                            numberOfLines={1}
                                            selectable
                                            style={styles.specValue}
                                        >
                                            {fuelLevelReading ? `${Number(fuelLevelReading.value).toFixed(1)}%` : homeData?.fuelLevel != null ? `${homeData.fuelLevel}%` : 'N/A'}
                                        </Text>
                                    </VehicleSpec>
                                    <VehicleSpec label="Next Service">
                                        <Text
                                            adjustsFontSizeToFit
                                            minimumFontScale={0.7}
                                            numberOfLines={1}
                                            selectable
                                            style={styles.specValue}
                                        >
                                            {homeData?.nextServiceKm != null
                                                ? `${homeData.nextServiceKm.toLocaleString()} km`
                                                : 'N/A'}
                                        </Text>
                                    </VehicleSpec>
                                    <VehicleSpec label="ECU Voltage">
                                        <Text
                                            adjustsFontSizeToFit
                                            minimumFontScale={0.7}
                                            numberOfLines={1}
                                            selectable
                                            style={styles.specValue}
                                        >
                                            {ecuVoltageReading ? `${Number(ecuVoltageReading.value).toFixed(1)} V` : 'N/A'}
                                        </Text>
                                    </VehicleSpec>
                                    <VehicleSpec label="Tyres">
                                        <Text
                                            adjustsFontSizeToFit
                                            minimumFontScale={0.7}
                                            numberOfLines={1}
                                            selectable
                                            style={styles.specValue}
                                        >
                                            {homeData?.tyreStatus ?? 'N/A'}
                                        </Text>
                                    </VehicleSpec>
                                </View>
                            </>
                        )}
                    </View>
                </View>
                {homeError ? (
                    <Text selectable style={styles.errorText}>
                        {homeError}
                    </Text>
                ) : null}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    <QuickActionCard
                        description="Broadcast to nearby mechanics"
                        icon="account-wrench"
                        onPress={() => router.push('/mechanic-request/broadcast')}
                        title="Request Mechanic"
                    />
                    <QuickActionCard
                        description="Scan and check vehicle health"
                        icon="car-search"
                        onPress={() => router.push('/(customer)/diagnostics')}
                        title="Diagnose Vehicle"
                    />
                    <QuickActionCard
                        description="Request fuel delivery"
                        icon="gas-station"
                        onPress={() => router.push('/(customer)/fuel')}
                        title="Order Fuel"
                    />
                    <QuickActionCard
                        description="Find trusted mechanics"
                        icon="account-wrench-outline"
                        onPress={() => router.push('/find-mechanic')}
                        title="Find Mechanic"
                    />
                    <QuickActionCard
                        description="Schedule a service appointment"
                        icon="calendar-check-outline"
                        onPress={() => router.push('/book-service')}
                        title="Book Service"
                    />
                </View>
                <View style={styles.dashboardRow}>
                    <PowerShieldCard
                        nextOutageTime={homeData?.nextOutageTime ?? null}
                        onSchedulePress={() => {
                            router.push('/(customer)/fuel');
                        }}
                    />
                    <MaintenanceReminderCard
                        onPress={() => {
                            router.push('/maintenance');
                        }}
                        reminder={maintenanceReminder}
                    />
                </View>
                <RecentActivityCard
                    activities={recentActivity}
                    onActivityPress={(activity) => {
                        if (!activity.action) {
                            return;
                        }
                        handleActivityAction(activity.action);
                    }}
                    onViewAllPress={() => {
                        router.push('/activity');
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

function VehicleSpec({ children, label }) {
    const { colors } = useTheme();
    return (
        <View style={{ alignItems: 'center', flex: 1, gap: 6 }}>
            <View style={{ alignItems: 'center', height: 42, justifyContent: 'center', width: '100%' }}>{children}</View>
            <Text numberOfLines={2} style={{ color: colors.secondaryText, fontSize: 11, fontWeight: '500', lineHeight: 14, textAlign: 'center' }}>
                {label}
            </Text>
        </View>
    );
}

function createStyles(homeColors) {
    return StyleSheet.create({
    content: {
        flexGrow: 0,
        paddingHorizontal: 16,
        paddingTop: 6,
    },
    dashboardRow: {
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: 12,
        marginTop: 12,
    },
    errorText: {
        color: homeColors.danger,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 12,
        textAlign: 'center',
    },
    featured: {
        backgroundColor: homeColors.background,
        height: 230,
        overflow: 'hidden',
        width: '100%',
    },
    greeting: {
        color: homeColors.secondaryText,
        fontSize: 12,
        fontWeight: '500',
    },
    greetingContainer: {
        alignItems: 'flex-end',
        flexShrink: 1,
    },
    header: {
        alignItems: 'center',
        backgroundColor: homeColors.background,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        minHeight: 78,
        paddingHorizontal: 16,
    },
    headerRight: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        gap: 8,
        justifyContent: 'flex-end',
    },
    logo: {
        aspectRatio: logoAspectRatio,
        width: 140,
    },
    notificationBadge: {
        alignItems: 'center',
        backgroundColor: homeColors.accent,
        borderRadius: 8,
        height: 16,
        justifyContent: 'center',
        minWidth: 16,
        paddingHorizontal: 4,
        position: 'absolute',
        right: -4,
        top: -4,
    },
    notificationBadgeText: {
        color: homeColors.onAccent,
        fontSize: 9,
        fontWeight: '800',
    },
    notificationButton: {
        alignItems: 'center',
        backgroundColor: homeColors.card,
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    primaryBadge: {
        backgroundColor: homeColors.accentWash,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    primaryBadgeText: {
        color: homeColors.accent,
        fontSize: 10,
        fontWeight: '700',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    heroPlaceholder: {
        backgroundColor: homeColors.background,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    heroImage: {
        height: '100%',
        width: '100%',
    },
    heroFallback: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    heroImageError: {
        color: homeColors.secondaryText,
        fontSize: 13,
        marginTop: 10,
    },
    heroImageRetry: {
        borderColor: homeColors.accent,
        borderRadius: 18,
        borderWidth: 1,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    heroImageRetryText: {
        color: homeColors.accent,
        fontSize: 14,
        fontWeight: '700',
    },
    heroScrim: {
        height: 120,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    registration: {
        color: 'rgba(255, 255, 255, 0.78)',
        fontSize: 15,
        fontWeight: '500',
        marginTop: 4,
    },
    safeArea: {
        backgroundColor: homeColors.background,
        flex: 1,
    },
    scrollView: {
        backgroundColor: homeColors.background,
        flex: 1,
    },
    sectionTitle: {
        color: homeColors.text,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.3,
        marginBottom: 12,
        marginTop: 28,
    },
    specItem: {
        alignItems: 'center',
        flex: 1,
        gap: 6,
    },
    specLabel: {
        color: homeColors.secondaryText,
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 14,
        textAlign: 'center',
    },
    specRow: {
        backgroundColor: homeColors.card,
        flexDirection: 'row',
        gap: 2,
        paddingBottom: 16,
        paddingHorizontal: 6,
        paddingTop: 14,
    },
    specValue: {
        color: homeColors.text,
        fontSize: 13,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        textAlign: 'center',
    },
    specValueSlot: {
        alignItems: 'center',
        height: 42,
        justifyContent: 'center',
        width: '100%',
    },
    userName: {
        color: homeColors.text,
        fontSize: 15,
        fontWeight: '700',
        marginTop: 1,
    },
    vehicleCard: {
        backgroundColor: homeColors.card,
        borderCurve: 'continuous',
        borderRadius: 22,
        overflow: 'hidden',
    },
    vehicleHeader: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 12,
        left: 0,
        paddingHorizontal: 16,
        paddingTop: 14,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 2,
    },
    vehicleMessage: {
        alignItems: 'center',
        backgroundColor: homeColors.card,
        gap: 12,
        justifyContent: 'center',
        minHeight: 220,
        paddingHorizontal: 24,
        paddingVertical: 36,
    },
    vehicleMessageText: {
        color: homeColors.text,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    vehicleName: {
        color: homeColors.text,
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.4,
        lineHeight: 32,
    },
    vehicleSelector: {
        alignItems: 'center',
        backgroundColor: 'rgba(9, 11, 16, 0.45)',
        borderRadius: 16,
        height: 32,
        justifyContent: 'center',
        marginTop: 2,
        width: 32,
    },
    vehicleSelectorContent: {
        flex: 1,
        minWidth: 0,
    },
    vehicleSelectorMenu: {
        backgroundColor: homeColors.background,
        borderCurve: 'continuous',
        borderRadius: 18,
        left: 16,
        paddingHorizontal: 12,
        position: 'absolute',
        right: 16,
        top: 76,
        zIndex: 2,
    },
    vehicleSelectorOption: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        minHeight: 64,
    },
    vehicleSelectorRegistration: {
        color: homeColors.secondaryText,
        fontSize: 12,
        marginTop: 3,
    },
    vehicleSelectorTitle: {
        color: homeColors.text,
        flexShrink: 1,
        fontSize: 14,
        fontWeight: '700',
    },
    vehicleSelectorTitleRow: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    vehicleShadow: {
        borderRadius: 22,
        boxShadow: '0 16px 34px rgba(0, 0, 0, 0.14)',
        marginTop: 16,
    },
    vehicleTitle: {
        flex: 1,
        minWidth: 0,
    },
    });
}
