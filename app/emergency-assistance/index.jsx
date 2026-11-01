import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../src/theme/ThemeContext';

import { useConnectivity } from '../../src/offline/ConnectivityContext';

import { useForegroundLocation } from '../../src/location/useForegroundLocation';

export default function EmergencyAssistanceScreen() {
    const router = useRouter();

    const { colors } = useTheme();

    const {
        status,
        isOnline,
        isOffline,
        isCheckingConnectivity,
        refreshConnectivity,
    } = useConnectivity();

    const {
        location,
        isLoadingLocation,
        locationError,
        refreshLocation,
    } = useForegroundLocation({
        autoLoad: false,
    });

    function handleGoBack() {
        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace('/');
    }

    const connectionMessage = isOnline
        ? 'Internet connection detected. Online assistance still requires backend confirmation.'
        : isOffline
          ? 'You are offline. Safety guidance and device GPS remain available.'
          : 'Connection status is unknown. Safety guidance remains available.';

    const connectionIcon = isOnline
        ? 'wifi-outline'
        : isOffline
          ? 'cloud-offline-outline'
          : 'help-circle-outline';

    const connectionColor = isOnline
        ? colors.accent
        : colors.secondaryText;

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Pressable
                        onPress={handleGoBack}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        style={[
                            styles.backButton,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color={colors.text}
                        />
                    </Pressable>

                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        Emergency Assistance
                    </Text>

                    <View style={styles.headerSpacer} />
                </View>

                <View
                    style={[
                        styles.heroCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.heroIcon,
                            {
                                backgroundColor: colors.background,
                            },
                        ]}
                    >
                        <Ionicons
                            name="warning-outline"
                            size={32}
                            color={colors.danger}
                        />
                    </View>

                    <Text
                        style={[
                            styles.heroTitle,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        Stranded or Broken Down?
                    </Text>

                    <Text
                        style={[
                            styles.heroDescription,
                            {
                                color: colors.secondaryText,
                            },
                        ]}
                    >
                        Access essential safety guidance and find
                        your location, even when internet access
                        is limited.
                    </Text>

                    <Text
                        style={[
                            styles.emergencyDisclaimer,
                            {
                                color: colors.danger,
                            },
                        ]}
                    >
                        If anyone is injured or in immediate danger,
                        contact local emergency services directly.
                        MechanIQ has not dispatched assistance.
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.sectionHeading}>
                        <Ionicons
                            name={connectionIcon}
                            size={22}
                            color={connectionColor}
                        />

                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            Connection Status
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.connectionLabel,
                            {
                                color: connectionColor,
                            },
                        ]}
                    >
                        {status === 'online'
                            ? 'Online'
                            : status === 'offline'
                              ? 'Offline'
                              : 'Checking Connection'}
                    </Text>

                    <Text
                        style={[
                            styles.bodyText,
                            {
                                color: colors.secondaryText,
                            },
                        ]}
                    >
                        {connectionMessage}
                    </Text>

                    <Pressable
                        onPress={() => {
                            void refreshConnectivity();
                        }}
                        disabled={isCheckingConnectivity}
                        accessibilityRole="button"
                        style={[
                            styles.secondaryButton,
                            {
                                borderColor: colors.border,
                                opacity: isCheckingConnectivity
                                    ? 0.6
                                    : 1,
                            },
                        ]}
                    >
                        {isCheckingConnectivity ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.accent}
                            />
                        ) : (
                            <Ionicons
                                name="refresh-outline"
                                size={19}
                                color={colors.accent}
                            />
                        )}

                        <Text
                            style={[
                                styles.secondaryButtonText,
                                {
                                    color: colors.accent,
                                },
                            ]}
                        >
                            {isCheckingConnectivity
                                ? 'Checking...'
                                : 'Check Connection'}
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.locationCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.sectionHeading}>
                        <Ionicons
                            name="location-outline"
                            size={22}
                            color={colors.accent}
                        />

                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            My Location
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.bodyText,
                            {
                                color: colors.secondaryText,
                            },
                        ]}
                    >
                        Find your coordinates to help describe
                        your location to emergency responders.
                        GPS may work without internet, but a
                        location fix is not guaranteed.
                    </Text>

                    {location ? (
                        <View
                            style={[
                                styles.coordinatesContainer,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.coordinateLabel,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ]}
                            >
                                Latest location obtained
                            </Text>

                            <Text
                                selectable
                                style={[
                                    styles.coordinateText,
                                    {
                                        color: colors.text,
                                    },
                                ]}
                            >
                                Latitude: {location.latitude.toFixed(6)}
                            </Text>

                            <Text
                                selectable
                                style={[
                                    styles.coordinateText,
                                    {
                                        color: colors.text,
                                    },
                                ]}
                            >
                                Longitude: {location.longitude.toFixed(6)}
                            </Text>

                            <Text
                                style={[
                                    styles.locationNote,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ]}
                            >
                                These coordinates are not
                                continuously updated.
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={[
                                styles.locationPlaceholder,
                                {
                                    color: colors.secondaryText,
                                },
                            ]}
                        >
                            No location obtained yet.
                        </Text>
                    )}

                    {locationError ? (
                        <Text
                            style={[
                                styles.errorText,
                                {
                                    color: colors.danger,
                                },
                            ]}
                        >
                            {locationError}
                        </Text>
                    ) : null}

                    <Pressable
                        onPress={() => {
                            void refreshLocation();
                        }}
                        disabled={isLoadingLocation}
                        accessibilityRole="button"
                        style={[
                            styles.primaryButton,
                            {
                                backgroundColor: colors.accent,
                                opacity: isLoadingLocation
                                    ? 0.6
                                    : 1,
                            },
                        ]}
                    >
                        {isLoadingLocation ? (
                            <ActivityIndicator
                                size="small"
                                color="#000000"
                            />
                        ) : (
                            <Ionicons
                                name="navigate-outline"
                                size={20}
                                color="#000000"
                            />
                        )}

                        <Text style={styles.primaryButtonText}>
                            {isLoadingLocation
                                ? 'Getting Location...'
                                : location
                                  ? 'Refresh My Location'
                                  : 'Get My Location'}
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={[
                        styles.guidanceCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.sectionHeading}>
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={22}
                            color={colors.accent}
                        />

                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            Stay Safe
                        </Text>
                    </View>

                    <SafetyTip
                        number="1"
                        title="Prioritize Your Safety"
                        description="If possible, stop in a safe location away from moving traffic. Turn on your hazard lights."
                        colors={colors}
                    />

                    <SafetyTip
                        number="2"
                        title="Assess Your Surroundings"
                        description="Avoid stepping into traffic. Stay in a safe position and follow local road safety guidance."
                        colors={colors}
                    />

                    <SafetyTip
                        number="3"
                        title="Avoid Unsafe Repairs"
                        description="Do not attempt vehicle repairs in a dangerous location or work on safety-critical components."
                        colors={colors}
                    />

                    <SafetyTip
                        number="4"
                        title="Communicate Your Location"
                        description="If you can safely contact someone, share your road name, nearby landmarks, or GPS coordinates."
                        colors={colors}
                    />

                    <SafetyTip
                        number="5"
                        title="Seek Immediate Help When Needed"
                        description="For injuries, fire, or immediate danger, contact local emergency services. Calling requires available phone service."
                        colors={colors}
                    />
                </View>

                <View
                    style={[
                        styles.noticeCard,
                        {
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Ionicons
                        name="information-circle-outline"
                        size={21}
                        color={colors.secondaryText}
                    />

                    <Text
                        style={[
                            styles.noticeText,
                            {
                                color: colors.secondaryText,
                            },
                        ]}
                    >
                        This screen provides safety guidance
                        and device location only. Mechanic
                        requests, dispatch confirmation,
                        and tracking require connected
                        backend services and are not active
                        on this screen.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function SafetyTip({
    number,
    title,
    description,
    colors,
}) {
    return (
        <View style={styles.safetyTip}>
            <View
                style={[
                    styles.tipNumber,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.tipNumberText,
                        {
                            color: colors.accent,
                        },
                    ]}
                >
                    {number}
                </Text>
            </View>

            <View style={styles.tipContent}>
                <Text
                    style={[
                        styles.tipTitle,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    {title}
                </Text>

                <Text
                    style={[
                        styles.tipDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ]}
                >
                    {description}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    backButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        flex: 1,
    },

    headerSpacer: {
        width: 42,
    },

    heroCard: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 22,
        alignItems: 'center',
        marginBottom: 16,
    },

    heroIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },

    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 10,
    },

    heroDescription: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
    },

    emergencyDisclaimer: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 16,
    },

    statusCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
    },

    locationCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
    },

    guidanceCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
    },

    sectionHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
    },

    connectionLabel: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },

    bodyText: {
        fontSize: 14,
        lineHeight: 21,
    },

    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 46,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 16,
    },

    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },

    coordinatesContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginTop: 14,
    },

    coordinateLabel: {
        fontSize: 12,
        marginBottom: 8,
    },

    coordinateText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
    },

    locationNote: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 8,
    },

    locationPlaceholder: {
        fontSize: 13,
        marginTop: 14,
        marginBottom: 4,
    },

    errorText: {
        fontSize: 13,
        lineHeight: 19,
        marginTop: 12,
    },

    primaryButton: {
        minHeight: 50,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 14,
        marginTop: 16,
    },

    primaryButtonText: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '800',
    },

    safetyTip: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 16,
    },

    tipNumber: {
        width: 34,
        height: 34,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    tipNumberText: {
        fontSize: 14,
        fontWeight: '800',
    },

    tipContent: {
        flex: 1,
    },

    tipTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 5,
    },

    tipDescription: {
        fontSize: 13,
        lineHeight: 20,
    },

    noticeCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
    },

    noticeText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 19,
    },
});