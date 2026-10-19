import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { prepareAndSaveEmergencyRequest } from '../../src/emergency/emergencyPreparationService';
import { deleteEmergencyRequest, loadEmergencyRequests } from '../../src/emergency/emergencyStorage';
import { useForegroundLocation } from '../../src/location/useForegroundLocation';
import { useUser } from '../../src/users/UserContext';
import { useVehicleMechanicSearch } from '../../src/customer/useVehicleMechanicSearch';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function VehicleMechanicSearchScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { mechanicSearchResult, isLoadingMechanics, mechanicSearchError, refreshMechanics, } = useVehicleMechanicSearch(selectedVehicle?.id);
    const isLoading = isLoadingVehicles ||
        isLoadingMechanics;
    const mechanics = mechanicSearchResult?.mechanics ?? [];
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
                    ], children: "Finding suitable mechanics..." }), _jsx(EmergencyMechanicSection, { selectedVehicle, colors })] }));
    }
    if (!selectedVehicle) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 48, color: colors.secondaryText }), _jsx(Text, { style: [
                        styles.errorTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "No vehicle selected" }), _jsx(Text, { style: [
                        styles.errorMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Select a vehicle before searching for a mechanic." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.back(), style: [
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.secondaryButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Go Back" }) }), _jsx(EmergencyMechanicSection, { selectedVehicle, colors })] }));
    }
    if (mechanicSearchError) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 48, color: colors.danger }), _jsx(Text, { style: [
                        styles.errorTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Unable to find mechanics" }), _jsx(Text, { style: [
                        styles.errorMessage,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: mechanicSearchError }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshMechanics, style: [
                        styles.retryButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "refresh", size: 18, color: "#000000" }), _jsx(Text, { style: styles.retryButtonText, children: "Try Again" })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.back(), style: [
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.secondaryButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Go Back" }) }), _jsx(EmergencyMechanicSection, { selectedVehicle, colors })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.back(), style: [
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
                                    ], children: "Find a Mechanic" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Find verified mechanics who can help with your selected vehicle." })] })] }), _jsx(EmergencyMechanicSection, { selectedVehicle, colors }), _jsxs(View, { style: [
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
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 24, color: colors.accent }) }), _jsxs(View, { style: styles.vehicleContent, children: [_jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Searching for" }), _jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsxs(Text, { style: [
                                        styles.vehicleDetails,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [selectedVehicle.registration, ' • ', selectedVehicle.year] })] })] }), _jsxs(View, { style: styles.resultsHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: [
                                        styles.resultsTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Available Mechanics" }), _jsxs(Text, { style: [
                                        styles.resultsCount,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [mechanics.length, ' ', mechanics.length === 1
                                            ? 'mechanic'
                                            : 'mechanics', ' ', "found"] })] }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: refreshMechanics, style: [
                                styles.refreshButton,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: colors.card,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "refresh", size: 20, color: colors.accent }) })] }), mechanics.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "wrench-outline", size: 38, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No mechanics available" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Try again shortly or expand your search when location-based filtering becomes available." })] })) : (_jsx(View, { style: styles.mechanicsList, children: mechanics.map((mechanic) => {
                        const availabilityLabel = mechanic.availability ===
                            'available'
                            ? 'Available'
                            : mechanic.availability ===
                                'busy'
                                ? 'Busy'
                                : 'Unavailable';
                        return (_jsxs(View, { style: [
                                styles.mechanicCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.mechanicHeader, children: [_jsx(View, { style: [
                                                styles.profilePlaceholder,
                                                {
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(Ionicons, { name: "person-outline", size: 27, color: colors.accent }) }), _jsxs(View, { style: styles.mechanicIdentity, children: [_jsxs(View, { style: styles.mechanicNameRow, children: [_jsx(Text, { numberOfLines: 1, style: [
                                                                styles.mechanicName,
                                                                {
                                                                    color: colors.text,
                                                                },
                                                            ], children: mechanic.name }), mechanic.verified ? (_jsx(MaterialCommunityIcons, { name: "check-decagram", size: 16, color: colors.accent })) : null] }), mechanic.businessName ? (_jsx(Text, { numberOfLines: 1, style: [
                                                        styles.businessName,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: mechanic.businessName })) : null, _jsxs(View, { style: styles.ratingRow, children: [mechanic.rating !==
                                                            null ? (_jsxs(_Fragment, { children: [_jsx(Ionicons, { name: "star", size: 14, color: colors.accent }), _jsx(Text, { style: [
                                                                        styles.rating,
                                                                        {
                                                                            color: colors.text,
                                                                        },
                                                                    ], children: mechanic.rating })] })) : null, _jsxs(Text, { style: [
                                                                styles.reviews,
                                                                {
                                                                    color: colors.secondaryText,
                                                                },
                                                            ], children: ["(", mechanic.reviewCount, ' ', "reviews)"] })] })] }), _jsx(View, { style: [
                                                styles.availabilityBadge,
                                                {
                                                    borderColor: mechanic.availability ===
                                                        'available'
                                                        ? colors.success
                                                        : colors.border,
                                                },
                                            ], children: _jsx(Text, { style: [
                                                    styles.availabilityText,
                                                    {
                                                        color: mechanic.availability ===
                                                            'available'
                                                            ? colors.success
                                                            : colors.secondaryText,
                                                    },
                                                ], children: availabilityLabel }) })] }), _jsxs(View, { style: styles.locationRow, children: [_jsx(Ionicons, { name: "location-outline", size: 16, color: colors.secondaryText }), _jsx(Text, { numberOfLines: 2, style: [
                                                styles.locationText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: mechanic.location
                                                .address }), mechanic.location
                                            .distanceKm !==
                                            null ? (_jsxs(Text, { style: [
                                                styles.distanceText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: [mechanic.location
                                                    .distanceKm, ' ', "km"] })) : null] }), _jsx(Text, { style: [
                                        styles.sectionLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Specialties" }), _jsx(View, { style: styles.specialties, children: mechanic.specialties.map((specialty) => (_jsx(View, { style: [
                                            styles.specialtyPill,
                                            {
                                                borderColor: colors.border,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.specialtyText,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: specialty }) }, specialty))) }), _jsxs(View, { style: styles.serviceOptions, children: [mechanic.supportsMobileService ? (_jsxs(View, { style: styles.serviceItem, children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.serviceText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: "Mobile Service" })] })) : null, mechanic.supportsWorkshopBooking ? (_jsxs(View, { style: styles.serviceItem, children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.serviceText,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: "Workshop Booking" })] })) : null] }), _jsxs(View, { style: styles.actions, children: [mechanic.supportsMobileService ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: mechanic.availability ===
                                                'unavailable', onPress: () => {
                                                router.push({
                                                    pathname: '/mechanic-request/[mechanicId]',
                                                    params: {
                                                        mechanicId: mechanic.id,
                                                    },
                                                });
                                            }, style: [
                                                styles.outlineAction,
                                                {
                                                    borderColor: colors.accent,
                                                    opacity: mechanic.availability ===
                                                        'unavailable'
                                                        ? 0.45
                                                        : 1,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                        styles.outlineActionText,
                                                        {
                                                            color: colors.accent,
                                                        },
                                                    ], children: "Request Mechanic" })] })) : null, mechanic.supportsWorkshopBooking ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => {
                                                router.push({
                                                    pathname: '/workshop-booking/[mechanicId]',
                                                    params: {
                                                        mechanicId: mechanic.id,
                                                    },
                                                });
                                            }, style: [
                                                styles.primaryAction,
                                                {
                                                    backgroundColor: colors.accent,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 18, color: "#000000" }), _jsx(Text, { style: styles.primaryActionText, children: "Book Workshop" })] })) : null] })] }, mechanic.id));
                    }) })), _jsx(Text, { style: [
                        styles.backendNotice,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Mechanic availability, distance, pricing, and live status will be verified by MechanIQ backend services." })] }) }));
}

/**
 * Customer-only emergency mechanic request preparation.
 *
 * The action is available even when the ordinary mechanic search
 * is loading, fails, or has no selected vehicle. This modal is
 * part of Find Mechanic; it does not create a separate screen.
 *
 * Saving records a local draft only. No mechanic is contacted,
 * no job is created, and no tracking is started.
 */
function EmergencyMechanicSection({ selectedVehicle, colors }) {
    const { user } = useUser();
    const {
        location,
        locationError,
        isLoadingLocation,
        refreshLocation,
    } = useForegroundLocation({ autoLoad: false });

    const [isOpen, setIsOpen] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [savedRequest, setSavedRequest] = useState(null);

    // Keep the saved list tied to a single authenticated Customer UID.
    // Existing role caching is for offline navigation, never backend authorization.
    const customerId = user?.role === 'customer' && user.emailVerified === true
        ? user.id
        : null;
    const [savedState, setSavedState] = useState({ ownerId: null, requests: [] });
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const [savedListError, setSavedListError] = useState(null);
    const [isSavedListOpen, setIsSavedListOpen] = useState(false);
    const [selectedSavedId, setSelectedSavedId] = useState(null);
    const [deletingRequestId, setDeletingRequestId] = useState(null);

    const refreshSavedRequests = useCallback(async (isActive = () => true) => {
        if (!customerId) {
            if (isActive()) {
                setSavedState({ ownerId: null, requests: [] });
                setSavedListError(null);
                setIsLoadingSaved(false);
            }
            return;
        }

        if (isActive()) {
            setIsLoadingSaved(true);
            setSavedListError(null);
        }
        try {
            const storedRequests = await loadEmergencyRequests({
                type: 'customer',
                accountId: customerId,
            });
            if (isActive()) {
                setSavedState({
                    ownerId: customerId,
                    requests: storedRequests
                        .filter((request) => request.serviceType === 'mechanic')
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
                });
            }
        } catch (error) {
            if (isActive()) {
                setSavedListError(error instanceof Error
                    ? error.message
                    : 'Unable to load saved emergency mechanic requests.');
            }
        } finally {
            if (isActive()) {
                setIsLoadingSaved(false);
            }
        }
    }, [customerId]);

    // Reload after returning to Find Mechanic, including after app resume.
    useFocusEffect(useCallback(() => {
        let active = true;
        void refreshSavedRequests(() => active);
        return () => { active = false; };
    }, [refreshSavedRequests]));

    const savedMechanicRequests = savedState.ownerId === customerId
        ? savedState.requests
        : [];
    const selectedSavedRequest = savedMechanicRequests.find(
        (request) => request.localId === selectedSavedId
    ) ?? null;

    async function handleDeleteSaved(request) {
        if (!customerId || deletingRequestId) {
            return;
        }
        setDeletingRequestId(request.localId);
        setSavedListError(null);
        try {
            const wasDeleted = await deleteEmergencyRequest(
                { type: 'customer', accountId: customerId },
                request.localId
            );
            if (!wasDeleted) {
                throw new Error('This saved request was not found. Refresh the list.');
            }
            setSavedState((current) => current.ownerId === customerId
                ? {
                    ownerId: customerId,
                    requests: current.requests.filter(
                        (item) => item.localId !== request.localId
                    ),
                }
                : current
            );
            setSelectedSavedId(null);
        } catch (error) {
            setSavedListError(error instanceof Error
                ? error.message
                : 'Unable to delete this saved emergency request.');
        } finally {
            setDeletingRequestId(null);
        }
    }

    function confirmDeleteSaved(request) {
        Alert.alert(
            'Delete saved emergency request?',
            'This removes the local copy only. It does not cancel any request already confirmed by a backend.',
            [
                { text: 'Keep Request', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => { void handleDeleteSaved(request); },
                },
            ]
        );
    }

    function closeSavedList() {
        if (deletingRequestId) return;
        setIsSavedListOpen(false);
        setSelectedSavedId(null);
    }

    function displayDate(dateString) {
        const date = new Date(dateString);
        return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
    }

    function displayStatus(status) {
        if (status === 'saved') return 'Saved locally — Not submitted';
        if (status === 'submission_failed') return 'Submission not confirmed';
        if (status === 'submitting') return 'Submission status unconfirmed';
        if (status === 'submitted') return 'Backend acknowledged';
        if (status === 'cancelled') return 'Cancelled';
        return 'Status unavailable';
    }

    if (!user || user.role !== 'customer') {
        return null;
    }

    const locationReady = !!location || locationDescription.trim().length > 0;
    const canReview =
        problemDescription.trim().length > 0 &&
        contactPhone.trim().length > 0 &&
        locationReady &&
        !isSaving;

    function resetDraft() {
        setContactName('');
        setContactPhone('');
        setLocationDescription('');
        setProblemDescription('');
        setIsReviewing(false);
        setSaveError(null);
        setSavedRequest(null);
    }

    async function handleSave() {
        if (!canReview || savedRequest) {
            return;
        }
        setIsSaving(true);
        setSaveError(null);
        try {
            const vehicleYear = selectedVehicle?.year == null
                ? null
                : Number(selectedVehicle.year);
            const request = await prepareAndSaveEmergencyRequest(
                {
                    serviceType: 'mechanic',
                    owner: {
                        type: 'customer',
                        accountId: user.id,
                    },
                    contact: {
                        name: contactName,
                        phoneNumber: contactPhone,
                    },
                    location: {
                        coordinates: location
                            ? {
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }
                            : null,
                        description: locationDescription,
                    },
                    vehicle: selectedVehicle
                        ? {
                            vehicleId: selectedVehicle.id ?? null,
                            make: selectedVehicle.make ?? null,
                            model: selectedVehicle.model ?? null,
                            year: Number.isInteger(vehicleYear) && vehicleYear > 0
                                ? vehicleYear
                                : null,
                        }
                        : null,
                    details: {
                        problemDescription,
                    },
                },
                user
            );
            setSavedRequest(request);
            setSavedState((current) => ({
                ownerId: user.id,
                requests: [
                    request,
                    ...(current.ownerId === user.id
                        ? current.requests.filter((item) => item.localId !== request.localId)
                        : []),
                ],
            }));
            setIsReviewing(false);
        } catch (error) {
            setSaveError(
                error instanceof Error
                    ? error.message
                    : 'Unable to securely save this emergency request.'
            );
        } finally {
            setIsSaving(false);
        }
    }

    const notice = _jsxs(View, {
        style: [styles.emergencyInfo, { borderColor: colors.danger }],
        children: [
            _jsx(MaterialCommunityIcons, {
                name: 'alert-circle-outline',
                size: 20,
                color: colors.danger,
            }),
            _jsx(Text, {
                style: [styles.emergencyInfoText, { color: colors.secondaryText }],
                children:
                    'This prepares a request on your device only. No mechanic is contacted. ' +
                    'After connectivity returns, you must review and explicitly submit ' +
                    'the request once backend service is available.',
            }),
        ],
    });

    function field(label, value, onChangeText, placeholder, options = {}) {
        return _jsxs(View, {
            style: styles.emergencyField,
            children: [
                _jsx(Text, {
                    style: [styles.emergencyLabel, { color: colors.text }],
                    children: label,
                }),
                _jsx(TextInput, {
                    value,
                    onChangeText: (text) => {
                        setSaveError(null);
                        onChangeText(text);
                    },
                    placeholder,
                    placeholderTextColor: colors.secondaryText,
                    maxLength: options.maxLength ?? 500,
                    multiline: options.multiline ?? false,
                    keyboardType: options.keyboardType ?? 'default',
                    autoCapitalize: options.autoCapitalize ?? 'sentences',
                    style: [
                        styles.emergencyInput,
                        options.multiline ? styles.emergencyMultiline : null,
                        { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
                    ],
                }),
            ],
        });
    }

    const form = _jsxs(View, {
        children: [
            field('What happened? *', problemDescription, setProblemDescription,
                'Describe the breakdown and any warning signs',
                { multiline: true, maxLength: 1000 }),
            field('Contact name (optional)', contactName, setContactName,
                'Name the mechanic can ask for', { maxLength: 120 }),
            field('Phone number *', contactPhone, setContactPhone,
                'Your reachable phone number',
                { maxLength: 40, keyboardType: 'phone-pad' }),
            _jsxs(View, {
                style: styles.emergencyField,
                children: [
                    _jsx(Text, {
                        style: [styles.emergencyLabel, { color: colors.text }],
                        children: 'Your location *',
                    }),
                    _jsx(Text, {
                        style: [styles.emergencyHelpText, { color: colors.secondaryText }],
                        children: location
                            ? `GPS: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                            : 'GPS not recorded. You may enter a road name, landmark, or other location below.',
                    }),
                    locationError
                        ? _jsx(Text, {
                            style: [styles.emergencyHelpText, { color: colors.danger }],
                            children: locationError,
                        })
                        : null,
                    _jsx(TouchableOpacity, {
                        activeOpacity: 0.75,
                        disabled: isLoadingLocation,
                        onPress: () => { void refreshLocation(); },
                        accessibilityRole: 'button',
                        style: [styles.emergencySecondaryButton, { borderColor: colors.accent }],
                        children: isLoadingLocation
                            ? _jsx(ActivityIndicator, { size: 'small', color: colors.accent })
                            : _jsx(Text, {
                                style: [styles.emergencySecondaryText, { color: colors.accent }],
                                children: location ? 'Refresh GPS Location' : 'Get GPS Location',
                            }),
                    }),
                ],
            }),
            field('Road / landmark (if available)', locationDescription,
                setLocationDescription,
                'Road name, nearby landmark, or an easy-to-find description',
                { multiline: true, maxLength: 500 }),
            _jsx(Text, {
                style: [styles.emergencyHelpText, { color: colors.secondaryText }],
                children: selectedVehicle
                    ? `Selected vehicle: ${selectedVehicle.make} ${selectedVehicle.model}`
                    : 'No vehicle selected. You can still save this emergency draft.',
            }),
            _jsx(TouchableOpacity, {
                activeOpacity: canReview ? 0.75 : 1,
                disabled: !canReview,
                onPress: () => { setSaveError(null); setIsReviewing(true); },
                accessibilityRole: 'button',
                style: [
                    styles.emergencyPrimaryButton,
                    { backgroundColor: canReview ? colors.accent : colors.border },
                ],
                children: _jsx(Text, {
                    style: [styles.emergencyPrimaryText, {
                        color: canReview ? '#000000' : colors.secondaryText,
                    }],
                    children: 'Review Emergency Request',
                }),
            }),
            !canReview
                ? _jsx(Text, {
                    style: [styles.emergencyHelpText, { color: colors.secondaryText }],
                    children: 'Enter the problem, a phone number, and a GPS location or location description to continue.',
                })
                : null,
        ],
    });

    const review = _jsxs(View, {
        children: [
            _jsx(Text, {
                style: [styles.emergencySubheading, { color: colors.text }],
                children: 'Review your request before saving',
            }),
            _jsx(Text, {
                style: [styles.emergencyReviewText, { color: colors.text }],
                children: `Breakdown: ${problemDescription.trim()}`,
            }),
            _jsx(Text, {
                style: [styles.emergencyReviewText, { color: colors.text }],
                children: `Contact: ${contactName.trim() || 'Not provided'} • ${contactPhone.trim()}`,
            }),
            _jsx(Text, {
                style: [styles.emergencyReviewText, { color: colors.text }],
                children: `Location: ${location
                    ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                    : 'GPS unavailable'}${locationDescription.trim()
                    ? ` • ${locationDescription.trim()}`
                    : ''}`,
            }),
            _jsx(Text, {
                style: [styles.emergencyReviewText, { color: colors.text }],
                children: selectedVehicle
                    ? `Vehicle: ${selectedVehicle.make} ${selectedVehicle.model}`
                    : 'Vehicle: Not selected',
            }),
            _jsx(TouchableOpacity, {
                activeOpacity: isSaving ? 1 : 0.75,
                disabled: isSaving,
                onPress: () => { void handleSave(); },
                accessibilityRole: 'button',
                style: [styles.emergencyPrimaryButton, { backgroundColor: colors.accent }],
                children: isSaving
                    ? _jsx(ActivityIndicator, { size: 'small', color: '#000000' })
                    : _jsx(Text, {
                        style: styles.emergencyPrimaryText,
                        children: 'Save Locally — Not Submitted',
                    }),
            }),
            _jsx(TouchableOpacity, {
                disabled: isSaving,
                onPress: () => setIsReviewing(false),
                accessibilityRole: 'button',
                style: [styles.emergencySecondaryButton, { borderColor: colors.border }],
                children: _jsx(Text, {
                    style: [styles.emergencySecondaryText, { color: colors.text }],
                    children: 'Edit Details',
                }),
            }),
        ],
    });

    const saved = _jsxs(View, {
        style: styles.emergencySaved,
        children: [
            _jsx(MaterialCommunityIcons, {
                name: 'check-circle-outline',
                size: 34,
                color: colors.accent,
            }),
            _jsx(Text, {
                style: [styles.emergencySubheading, { color: colors.text }],
                children: 'Saved Locally — Not Submitted',
            }),
            _jsx(Text, {
                style: [styles.emergencyHelpText, { color: colors.secondaryText }],
                children:
                    'Your request is securely stored on this device. ' +
                    'No mechanic has been contacted. Submission and job tracking ' +
                    'require a connected backend and your explicit confirmation.',
            }),
            _jsx(TouchableOpacity, {
                onPress: () => setIsOpen(false),
                style: [styles.emergencyPrimaryButton, { backgroundColor: colors.accent }],
                accessibilityRole: 'button',
                children: _jsx(Text, {
                    style: styles.emergencyPrimaryText,
                    children: 'Done',
                }),
            }),
            _jsx(TouchableOpacity, {
                onPress: resetDraft,
                accessibilityRole: 'button',
                style: [styles.emergencySecondaryButton, { borderColor: colors.border }],
                children: _jsx(Text, {
                    style: [styles.emergencySecondaryText, { color: colors.text }],
                    children: 'Prepare Another Request',
                }),
            }),
        ],
    });

    // Saved mechanic requests are reviewed inside Find Mechanic, not a
    // separate route. They are NEVER treated as jobs or active tracking.
    const savedManagerButton = _jsxs(TouchableOpacity, {
        activeOpacity: 0.75,
        onPress: () => {
            setSelectedSavedId(null);
            setIsSavedListOpen(true);
            void refreshSavedRequests();
        },
        accessibilityRole: 'button',
        accessibilityLabel: 'View saved emergency mechanic requests',
        style: [styles.savedMechanicEntry, {
            backgroundColor: colors.card,
            borderColor: colors.border,
        }],
        children: [
            _jsx(MaterialCommunityIcons, {
                name: 'content-save-outline', size: 23, color: colors.accent,
            }),
            _jsxs(View, { style: styles.emergencyEntryText, children: [
                _jsx(Text, { style: [styles.emergencyEntryTitle, { color: colors.text }],
                    children: 'Saved Emergency Mechanic' }),
                _jsx(Text, { style: [styles.emergencyEntryDescription, { color: colors.secondaryText }],
                    children: isLoadingSaved
                        ? 'Loading saved requests...'
                        : `${savedMechanicRequests.length} saved request${savedMechanicRequests.length === 1 ? '' : 's'} — review or delete`,
                }),
            ] }),
            _jsx(Ionicons, { name: 'chevron-forward', size: 20, color: colors.text }),
        ],
    });

    const savedManagerContent = selectedSavedRequest
        ? _jsxs(View, { children: [
            _jsx(Text, {
                style: [styles.savedMechanicStatus, { color: colors.secondaryText }],
                children: displayStatus(selectedSavedRequest.status),
            }),
            ...[
                ['Saved', displayDate(selectedSavedRequest.createdAt)],
                ['Breakdown', selectedSavedRequest.details.problemDescription || 'Not provided'],
                ['Contact name', selectedSavedRequest.contact.name || 'Not provided'],
                ['Phone', selectedSavedRequest.contact.phoneNumber || 'Not provided'],
                ['Vehicle', selectedSavedRequest.vehicle
                    ? [selectedSavedRequest.vehicle.make, selectedSavedRequest.vehicle.model,
                       selectedSavedRequest.vehicle.year].filter(Boolean).join(' ') || 'Not specified'
                    : 'Not selected'],
                ['GPS coordinates', selectedSavedRequest.location.coordinates
                    ? `${selectedSavedRequest.location.coordinates.latitude.toFixed(6)}, ${selectedSavedRequest.location.coordinates.longitude.toFixed(6)}`
                    : 'Not available'],
                ['Road / landmark', selectedSavedRequest.location.description || 'Not provided'],
            ].map(([label, value]) => _jsxs(View, { style: styles.savedMechanicDetailRow,
                children: [
                    _jsx(Text, { style: [styles.savedMechanicDetailLabel, { color: colors.secondaryText }],
                        children: label }),
                    _jsx(Text, { selectable: true,
                        style: [styles.savedMechanicDetailValue, { color: colors.text }],
                        children: value }),
                ],
            }, label)),
            _jsx(Text, {
                style: [styles.emergencyHelpText, { color: colors.secondaryText }],
                children: 'Viewing this local record does not send a request or contact a mechanic. Backend submission and live tracking are not available yet.',
            }),
            _jsx(TouchableOpacity, {
                activeOpacity: 0.75,
                disabled: !!deletingRequestId,
                onPress: () => confirmDeleteSaved(selectedSavedRequest),
                accessibilityRole: 'button',
                style: [styles.emergencySecondaryButton, { borderColor: colors.danger }],
                children: _jsx(Text, {
                    style: [styles.emergencySecondaryText, { color: colors.danger }],
                    children: deletingRequestId === selectedSavedRequest.localId ? 'Deleting...' : 'Delete Local Request',
                }),
            }),
            _jsx(TouchableOpacity, {
                activeOpacity: 0.75,
                onPress: () => setSelectedSavedId(null),
                accessibilityRole: 'button',
                style: [styles.emergencySecondaryButton, { borderColor: colors.border }],
                children: _jsx(Text, { style: [styles.emergencySecondaryText, { color: colors.text }],
                    children: 'Back to Saved Requests' }),
            }),
        ] })
        : _jsxs(View, { children: [
            _jsx(Text, {
                style: [styles.emergencyHelpText, { color: colors.secondaryText }],
                children: 'These requests exist only on this device until a backend acknowledges submission. They are not active mechanic jobs.',
            }),
            isLoadingSaved
                ? _jsx(ActivityIndicator, { size: 'small', color: colors.accent,
                    style: styles.savedMechanicLoading })
                : savedMechanicRequests.length === 0
                    ? _jsx(Text, {
                        style: [styles.savedMechanicEmpty, { color: colors.secondaryText }],
                        children: 'No saved emergency mechanic requests.',
                    })
                    : _jsx(View, {
                        style: styles.savedMechanicList,
                        children: savedMechanicRequests.map((request) => _jsxs(View, {
                            style: [styles.savedMechanicCard, {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            }],
                            children: [
                                _jsx(Text, {
                                    numberOfLines: 2,
                                    style: [styles.savedMechanicCardTitle, { color: colors.text }],
                                    children: request.details.problemDescription || 'Roadside mechanic request',
                                }),
                                _jsx(Text, {
                                    style: [styles.savedMechanicCardMeta, { color: colors.secondaryText }],
                                    children: `${displayDate(request.createdAt)} • ${displayStatus(request.status)}`,
                                }),
                                _jsxs(View, { style: styles.savedMechanicActions, children: [
                                    _jsx(TouchableOpacity, {
                                        activeOpacity: 0.75,
                                        onPress: () => setSelectedSavedId(request.localId),
                                        accessibilityRole: 'button',
                                        style: [styles.savedMechanicAction, { borderColor: colors.accent }],
                                        children: _jsx(Text, {
                                            style: [styles.emergencySecondaryText, { color: colors.accent }],
                                            children: 'Review Details',
                                        }),
                                    }),
                                    _jsx(TouchableOpacity, {
                                        activeOpacity: 0.75,
                                        disabled: !!deletingRequestId,
                                        onPress: () => confirmDeleteSaved(request),
                                        accessibilityRole: 'button',
                                        style: [styles.savedMechanicAction, { borderColor: colors.danger }],
                                        children: _jsx(Text, {
                                            style: [styles.emergencySecondaryText, { color: colors.danger }],
                                            children: deletingRequestId === request.localId ? 'Deleting...' : 'Delete',
                                        }),
                                    }),
                                ] }),
                            ],
                        }, request.localId)),
                    }),
            _jsx(TouchableOpacity, {
                activeOpacity: 0.75,
                disabled: isLoadingSaved,
                onPress: () => { void refreshSavedRequests(); },
                accessibilityRole: 'button',
                style: [styles.emergencySecondaryButton, { borderColor: colors.border }],
                children: _jsx(Text, {
                    style: [styles.emergencySecondaryText, { color: colors.text }],
                    children: 'Refresh Saved Requests',
                }),
            }),
        ] });

    const savedManagerModal = _jsx(Modal, {
        visible: isSavedListOpen,
        animationType: 'slide',
        presentationStyle: 'fullScreen',
        onRequestClose: closeSavedList,
        children: _jsx(SafeAreaProvider, {
            style: styles.emergencyFlex,
            children: _jsx(SafeAreaView, {
                edges: ['top', 'bottom'],
                style: [styles.safeArea, { backgroundColor: colors.background }],
                children: _jsx(StableScrollView, {
                    showsVerticalScrollIndicator: false,
                    contentContainerStyle: styles.emergencyModalContent,
                    children: _jsxs(View, { children: [
                        _jsxs(View, { style: styles.emergencyModalHeader, children: [
                            _jsx(TouchableOpacity, {
                                onPress: closeSavedList,
                                disabled: !!deletingRequestId,
                                accessibilityRole: 'button',
                                accessibilityLabel: 'Close saved emergency mechanic requests',
                                style: [styles.backButton, { borderColor: colors.border }],
                                children: _jsx(Ionicons, { name: 'close', size: 22, color: colors.text }),
                            }),
                            _jsx(Text, {
                                style: [styles.emergencyModalTitle, { color: colors.text }],
                                children: selectedSavedRequest ? 'Saved Request Details' : 'Saved Emergency Mechanic',
                            }),
                        ] }),
                        savedListError
                            ? _jsx(Text, {
                                style: [styles.emergencyErrorText, { color: colors.danger }],
                                children: savedListError,
                            })
                            : null,
                        savedManagerContent,
                    ] }),
                }),
            }),
        }),
    });

    return _jsxs(_Fragment, {
        children: [
            _jsxs(TouchableOpacity, {
                activeOpacity: 0.75,
                onPress: () => setIsOpen(true),
                accessibilityRole: 'button',
                style: [
                    styles.emergencyEntry,
                    { backgroundColor: colors.card, borderColor: colors.danger },
                ],
                children: [
                    _jsx(MaterialCommunityIcons, {
                        name: 'car-wrench',
                        size: 27,
                        color: colors.danger,
                    }),
                    _jsxs(View, {
                        style: styles.emergencyEntryText,
                        children: [
                            _jsx(Text, {
                                style: [styles.emergencyEntryTitle, { color: colors.text }],
                                children: 'Emergency Mechanic',
                            }),
                            _jsx(Text, {
                                style: [styles.emergencyEntryDescription, { color: colors.secondaryText }],
                                children: 'Broken down? Prepare and save a roadside request, even offline.',
                            }),
                        ],
                    }),
                    _jsx(Ionicons, { name: 'chevron-forward', size: 20, color: colors.text }),
                ],
            }),
            savedManagerButton,
            savedManagerModal,
            _jsx(Modal, {
                visible: isOpen,
                animationType: 'slide',
                presentationStyle: 'fullScreen',
                onRequestClose: () => { if (!isSaving) setIsOpen(false); },
                // A React Native Modal has its own native root. Provide a separate
                // safe-area context so the header stays below the iPhone status bar.
                children: _jsx(SafeAreaProvider, {
                    style: styles.emergencyFlex,
                    children: _jsx(SafeAreaView, {
                        edges: ['top', 'bottom'],
                        style: [styles.safeArea, { backgroundColor: colors.background }],
                        children: _jsx(KeyboardAvoidingView, {
                        style: styles.emergencyFlex,
                        behavior: Platform.OS === 'ios' ? 'padding' : undefined,
                        children: _jsxs(StableScrollView, {
                            showsVerticalScrollIndicator: false,
                            keyboardShouldPersistTaps: 'handled',
                            contentContainerStyle: styles.emergencyModalContent,
                            children: [
                                _jsxs(View, {
                                    style: styles.emergencyModalHeader,
                                    children: [
                                        _jsx(TouchableOpacity, {
                                            onPress: () => { if (!isSaving) setIsOpen(false); },
                                            disabled: isSaving,
                                            accessibilityRole: 'button',
                                            accessibilityLabel: 'Close Emergency Mechanic',
                                            style: [styles.backButton, { borderColor: colors.border }],
                                            children: _jsx(Ionicons, {
                                                name: 'close',
                                                size: 22,
                                                color: colors.text,
                                            }),
                                        }),
                                        _jsx(Text, {
                                            style: [styles.emergencyModalTitle, { color: colors.text }],
                                            children: 'Emergency Mechanic',
                                        }),
                                    ],
                                }),
                                notice,
                                savedRequest ? saved : isReviewing ? review : form,
                                saveError
                                    ? _jsx(Text, {
                                        style: [styles.emergencyErrorText, { color: colors.danger }],
                                        children: saveError,
                                    })
                                    : null,
                            ],
                        }),
                    }),
                    }),
                }),
            }),
        ],
    });
}

const styles = StyleSheet.create({
    savedMechanicEntry: {
        minHeight: 74,
        marginTop: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    savedMechanicLoading: { marginTop: 22 },
    savedMechanicEmpty: { marginTop: 18, fontSize: 12, lineHeight: 18 },
    savedMechanicList: { marginTop: 18, gap: 10 },
    savedMechanicCard: { borderWidth: 1, borderRadius: 12, padding: 13 },
    savedMechanicCardTitle: { fontSize: 13, fontWeight: '700', lineHeight: 20 },
    savedMechanicCardMeta: { fontSize: 10, marginTop: 7, lineHeight: 16 },
    savedMechanicActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
    savedMechanicAction: {
        flex: 1, minHeight: 40, paddingHorizontal: 6, borderWidth: 1,
        borderRadius: 9, justifyContent: 'center', alignItems: 'center',
    },
    savedMechanicStatus: { fontSize: 12, marginTop: 8, marginBottom: 8 },
    savedMechanicDetailRow: { marginTop: 14 },
    savedMechanicDetailLabel: { fontSize: 10, fontWeight: '600' },
    savedMechanicDetailValue: { fontSize: 13, lineHeight: 20, marginTop: 4 },
    emergencyFlex: { flex: 1 },
    emergencyEntry: {
        minHeight: 86,
        marginTop: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emergencyEntryText: { flex: 1 },
    emergencyEntryTitle: { fontSize: 15, fontWeight: '800' },
    emergencyEntryDescription: { marginTop: 4, fontSize: 10, lineHeight: 15 },
    emergencyModalContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 50 },
    emergencyModalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    emergencyModalTitle: { fontSize: 19, fontWeight: '800', flex: 1 },
    emergencyInfo: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 12, gap: 9 },
    emergencyInfoText: { flex: 1, fontSize: 11, lineHeight: 17 },
    emergencyField: { marginTop: 17 },
    emergencyLabel: { fontSize: 12, fontWeight: '700', marginBottom: 7 },
    emergencyInput: { minHeight: 48, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
    emergencyMultiline: { minHeight: 96, textAlignVertical: 'top' },
    emergencyHelpText: { marginTop: 9, fontSize: 11, lineHeight: 17 },
    emergencySecondaryButton: { minHeight: 43, borderWidth: 1, borderRadius: 10, marginTop: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
    emergencySecondaryText: { fontWeight: '700', fontSize: 12, textAlign: 'center' },
    emergencyPrimaryButton: { minHeight: 48, borderRadius: 10, marginTop: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
    emergencyPrimaryText: { fontWeight: '800', fontSize: 12, color: '#000000', textAlign: 'center' },
    emergencySubheading: { marginTop: 18, fontSize: 16, fontWeight: '800' },
    emergencyReviewText: { marginTop: 13, fontSize: 12, lineHeight: 19 },
    emergencySaved: { marginTop: 12 },
    emergencyErrorText: { marginTop: 14, fontSize: 12, lineHeight: 18 },
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
        paddingBottom: 32,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 12,
        textAlign: 'center',
    },
    errorTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    errorMessage: {
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
    resultsHeader: {
        marginTop: 22,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    resultsCount: {
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
    mechanicsList: {
        gap: 12,
    },
    mechanicCard: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    mechanicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePlaceholder: {
        width: 52,
        height: 52,
        borderWidth: 1,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mechanicIdentity: {
        flex: 1,
        marginLeft: 11,
    },
    mechanicNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    mechanicName: {
        flexShrink: 1,
        fontSize: 14,
        fontWeight: '700',
    },
    businessName: {
        marginTop: 2,
        fontSize: 10,
    },
    ratingRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 10,
        fontWeight: '700',
    },
    reviews: {
        fontSize: 9,
    },
    availabilityBadge: {
        marginLeft: 8,
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 7,
    },
    availabilityText: {
        fontSize: 8,
        fontWeight: '700',
    },
    locationRow: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 14,
    },
    distanceText: {
        fontSize: 9,
    },
    sectionLabel: {
        marginTop: 15,
        marginBottom: 7,
        fontSize: 9,
        fontWeight: '600',
    },
    specialties: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    specialtyPill: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 8,
    },
    specialtyText: {
        fontSize: 9,
        fontWeight: '600',
    },
    serviceOptions: {
        marginTop: 15,
        gap: 8,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    serviceText: {
        fontSize: 10,
        fontWeight: '600',
    },
    actions: {
        marginTop: 18,
        flexDirection: 'row',
        gap: 8,
    },
    outlineAction: {
        flex: 1,
        minHeight: 44,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    outlineActionText: {
        flexShrink: 1,
        fontSize: 9,
        fontWeight: '700',
        textAlign: 'center',
    },
    primaryAction: {
        flex: 1,
        minHeight: 44,
        paddingHorizontal: 7,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    primaryActionText: {
        flexShrink: 1,
        color: '#000000',
        fontSize: 9,
        fontWeight: '700',
        textAlign: 'center',
    },
    emptyCard: {
        minHeight: 180,
        padding: 20,
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
        fontSize: 10,
        lineHeight: 15,
        textAlign: 'center',
    },
    backendNotice: {
        marginTop: 18,
        paddingHorizontal: 10,
        fontSize: 8.5,
        lineHeight: 13,
        textAlign: 'center',
    },
});
