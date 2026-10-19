import {
    jsx as _jsx,
    jsxs as _jsxs,
    Fragment as _Fragment,
} from "react/jsx-runtime";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import FuelActionCard from '../../src/components/FuelActionCard';
import FuelRecentActivityCard from '../../src/components/FuelRecentActivityCard';
import StableScrollView from '../../src/components/StableScrollView';

import { useCustomerFuel } from '../../src/customer/CustomerFuelContext';
import { auth } from '../../src/firebase/firebase';
import {
    deleteEmergencyRequest,
    loadEmergencyRequests,
} from '../../src/emergency/emergencyStorage';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';

export default function CustomerFuel() {
    const router = useRouter();

    const { colors } = useTheme();
    const { user, isLoadingUser } = useUser();

    const [savedFuelRequests, setSavedFuelRequests] = useState([]);
    const [savedRequestsOwnerId, setSavedRequestsOwnerId] = useState(null);
    const [isLoadingSavedRequests, setIsLoadingSavedRequests] = useState(false);
    const [savedRequestsError, setSavedRequestsError] = useState(null);
    const [expandedRequestId, setExpandedRequestId] = useState(null);
    const [deletingRequestId, setDeletingRequestId] = useState(null);
    const activeOwnerRef = useRef(null);

    const firebaseUser = auth.currentUser;
    const canViewSavedRequests =
        !isLoadingUser &&
        !!firebaseUser &&
        firebaseUser.emailVerified === true &&
        !!user &&
        user.id === firebaseUser.uid &&
        user.emailVerified === true &&
        user.role === 'customer';

    // Filter by the live Firebase UID as well as the loaded owner to
    // avoid showing another account's drafts during account changes.
    const visibleFuelRequests =
        canViewSavedRequests &&
        savedRequestsOwnerId === firebaseUser.uid
            ? savedFuelRequests
            : [];

    useFocusEffect(
        useCallback(() => {
            let active = true;
            const currentFirebaseUser = auth.currentUser;
            const accountId = currentFirebaseUser?.uid;
            const ownerMatches =
                !isLoadingUser &&
                currentFirebaseUser?.emailVerified === true &&
                !!user &&
                user.id === accountId &&
                user.emailVerified === true &&
                user.role === 'customer';

            activeOwnerRef.current = ownerMatches ? accountId : null;
            setSavedFuelRequests([]);
            setSavedRequestsOwnerId(null);
            setExpandedRequestId(null);
            setSavedRequestsError(null);
            setIsLoadingSavedRequests(ownerMatches);

            if (ownerMatches) {
                loadEmergencyRequests({ type: 'customer', accountId })
                    .then((requests) => {
                        if (!active || activeOwnerRef.current !== accountId ||
                            auth.currentUser?.uid !== accountId) {
                            return;
                        }

                        setSavedFuelRequests(
                            requests
                                .filter((request) => request.serviceType === 'fuel')
                                .sort((first, second) =>
                                    second.createdAt.localeCompare(first.createdAt)
                                )
                        );
                        setSavedRequestsOwnerId(accountId);
                    })
                    .catch((error) => {
                        if (!active || activeOwnerRef.current !== accountId) {
                            return;
                        }

                        setSavedRequestsError(
                            error instanceof Error
                                ? error.message
                                : 'Unable to load saved emergency fuel requests.'
                        );
                    })
                    .finally(() => {
                        if (active && activeOwnerRef.current === accountId) {
                            setIsLoadingSavedRequests(false);
                        }
                    });
            }

            return () => {
                active = false;
                activeOwnerRef.current = null;
            };
        }, [isLoadingUser, user?.id, user?.role, user?.emailVerified])
    );

    function formatRequestDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? 'Date unavailable'
            : date.toLocaleString();
    }

    function formatRequestStatus(status) {
        if (status === 'saved') return 'Saved locally — Not submitted';
        if (status === 'submission_failed') return 'Submission not confirmed';
        if (status === 'submitting') return 'Submission status pending';
        if (status === 'submitted') return 'Backend acknowledged';
        if (status === 'cancelled') return 'Cancelled';
        return 'Status unavailable';
    }

    function handleDeleteSavedRequest(request) {
        Alert.alert(
            'Delete saved emergency fuel request?',
            'This removes the local copy only. It cannot cancel any request already received by a provider.',
            [
                { text: 'Keep', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const ownerId = savedRequestsOwnerId;
                        if (
                            !ownerId ||
                            !canViewSavedRequests ||
                            auth.currentUser?.uid !== ownerId ||
                            activeOwnerRef.current !== ownerId
                        ) {
                            return;
                        }

                        setDeletingRequestId(request.localId);
                        setSavedRequestsError(null);
                        try {
                            await deleteEmergencyRequest(
                                { type: 'customer', accountId: ownerId },
                                request.localId
                            );
                            if (
                                activeOwnerRef.current !== ownerId ||
                                auth.currentUser?.uid !== ownerId
                            ) {
                                return;
                            }
                            setSavedFuelRequests((current) =>
                                current.filter((item) => item.localId !== request.localId)
                            );
                            setExpandedRequestId((current) =>
                                current === request.localId ? null : current
                            );
                        } catch (error) {
                            if (activeOwnerRef.current === ownerId) {
                                setSavedRequestsError(
                                    error instanceof Error
                                        ? error.message
                                        : 'Unable to delete this saved request.'
                                );
                            }
                        } finally {
                            if (activeOwnerRef.current === ownerId) {
                                setDeletingRequestId(null);
                            }
                        }
                    },
                },
            ]
        );
    }

    const {
        selectedVehicle,
        isLoadingVehicles,
    } = useVehicle();

    const {
        fuelData,
        isLoadingFuel,
        fuelError,
    } = useCustomerFuel();

    const isLoading = isLoadingVehicles || isLoadingFuel;

    const recentActivity = fuelData?.recentActivity ?? [];

    const fuelLevelColor =
        fuelData?.fuelLevel === null ||
        fuelData?.fuelLevel === undefined
            ? colors.secondaryText
            : fuelData.fuelLevel <= 20
                ? colors.danger
                : fuelData.fuelLevel <= 50
                    ? colors.warning
                    : colors.success;

    function handleFuelRequest(requestType) {
        const fuelType = fuelData?.fuelType;

        const compatibleFuelTypes =
            fuelData?.compatibleFuelTypes ?? [];

        router.push({
            pathname: '/fuel-delivery-request',
            params: {
                requestType,
                ...(fuelType
                    ? {
                        fuelType,
                    }
                    : {}),
                compatibleFuelTypes: JSON.stringify(
                    compatibleFuelTypes
                ),
            },
        });
    }

    function handleScheduleTopUp() {
        const fuelType = fuelData?.fuelType;

        const compatibleFuelTypes =
            fuelData?.compatibleFuelTypes ?? [];

        router.push({
            pathname: '/fuel-top-up-schedule',
            params: {
                ...(fuelType
                    ? {
                        fuelType,
                    }
                    : {}),
                compatibleFuelTypes: JSON.stringify(
                    compatibleFuelTypes
                ),
            },
        });
    }

    function handleTrackDelivery() {
        const activeDeliveryId = fuelData?.activeDeliveryId;

        if (activeDeliveryId) {
            router.push({
                pathname: '/fuel-delivery-tracking',
                params: {
                    deliveryId: activeDeliveryId,
                },
            });

            return;
        }

        router.push('/fuel-delivery-tracking');
    }

    function handleFuelHistory() {
        router.push('/fuel-history');
    }

    function handleSavedLocations() {
        router.push('/fuel-saved-locations');
    }

    return _jsx(SafeAreaView, {
        style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ],
        edges: ['top'],
        children: _jsxs(StableScrollView, {
            style: styles.scrollView,
            contentContainerStyle: styles.content,
            showsVerticalScrollIndicator: false,
            children: [
                _jsx(Text, {
                    style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ],
                    children: "Fuel Services",
                }),

                _jsx(Text, {
                    style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ],
                    children:
                        "Manage fuel delivery, nearby stations, and emergency top-ups.",
                }),

                _jsx(View, {
                    style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ],
                    children: isLoading
                        ? _jsx(Text, {
                            style: [
                                styles.message,
                                {
                                    color: colors.secondaryText,
                                },
                            ],
                            children: "Loading fuel information...",
                        })
                        : !selectedVehicle
                            ? _jsx(Text, {
                                style: [
                                    styles.message,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ],
                                children: "No vehicle selected",
                            })
                            : _jsxs(_Fragment, {
                                children: [
                                    _jsxs(View, {
                                        style: styles.vehicleTopRow,
                                        children: [
                                            _jsxs(View, {
                                                children: [
                                                    _jsxs(Text, {
                                                        style: [
                                                            styles.vehicleName,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ],
                                                        children: [
                                                            selectedVehicle.make,
                                                            ' ',
                                                            selectedVehicle.model,
                                                        ],
                                                    }),

                                                    _jsx(Text, {
                                                        style: [
                                                            styles.registration,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ],
                                                        children:
                                                            selectedVehicle.registration,
                                                    }),
                                                ],
                                            }),

                                            _jsx(MaterialCommunityIcons, {
                                                name: "gas-station-outline",
                                                size: 34,
                                                color: fuelLevelColor,
                                            }),
                                        ],
                                    }),

                                    _jsxs(View, {
                                        style: styles.statsGrid,
                                        children: [
                                            _jsxs(View, {
                                                style: styles.statItem,
                                                children: [
                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statLabel,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ],
                                                        children: "Fuel Level",
                                                    }),

                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statValue,
                                                            {
                                                                color: fuelLevelColor,
                                                            },
                                                        ],
                                                        children:
                                                            fuelData?.fuelLevel !== null &&
                                                            fuelData?.fuelLevel !== undefined
                                                                ? `${fuelData.fuelLevel}%`
                                                                : '—',
                                                    }),
                                                ],
                                            }),

                                            _jsxs(View, {
                                                style: styles.statItem,
                                                children: [
                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statLabel,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ],
                                                        children: "Estimated Range",
                                                    }),

                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statValue,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ],
                                                        children:
                                                            fuelData?.estimatedRangeKm !== null &&
                                                            fuelData?.estimatedRangeKm !== undefined
                                                                ? `${fuelData.estimatedRangeKm} km`
                                                                : '—',
                                                    }),
                                                ],
                                            }),

                                            _jsxs(View, {
                                                style: styles.statItem,
                                                children: [
                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statLabel,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ],
                                                        children: "Fuel Type",
                                                    }),

                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statValue,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ],
                                                        children:
                                                            fuelData?.fuelType ?? '—',
                                                    }),
                                                ],
                                            }),

                                            _jsxs(View, {
                                                style: styles.statItem,
                                                children: [
                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statLabel,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ],
                                                        children: "Nearest Station",
                                                    }),

                                                    _jsx(Text, {
                                                        style: [
                                                            styles.statValue,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ],
                                                        children:
                                                            fuelData?.nearestStation?.distanceKm !== null &&
                                                            fuelData?.nearestStation?.distanceKm !== undefined
                                                                ? `${fuelData.nearestStation.distanceKm} km`
                                                                : '—',
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                }),

                _jsxs(View, {
                    style: [
                        styles.deliveryCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ],
                    children: [
                        _jsxs(View, {
                            style: styles.deliveryHeader,
                            children: [
                                _jsxs(View, {
                                    children: [
                                        _jsx(Text, {
                                            style: [
                                                styles.deliveryTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ],
                                            children: "Fuel Delivery",
                                        }),

                                        _jsx(Text, {
                                            style: [
                                                styles.deliveryStatus,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ],
                                            children:
                                                "Driver availability not confirmed",
                                        }),
                                    ],
                                }),

                                _jsx(MaterialCommunityIcons, {
                                    name: "truck-delivery-outline",
                                    size: 30,
                                    color: colors.accent,
                                }),
                            ],
                        }),

                        _jsx(Text, {
                            style: [
                                styles.deliveryDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ],
                            children:
                                "Fuel delivery requires verified fuel compatibility, service coverage, and provider availability.",
                        }),

                        _jsxs(TouchableOpacity, {
                            activeOpacity: 0.75,
                            onPress: () => handleFuelRequest('standard'),
                            style: [
                                styles.requestButton,
                                {
                                    backgroundColor: colors.accent,
                                },
                            ],
                            children: [
                                _jsx(MaterialCommunityIcons, {
                                    name: "gas-station",
                                    size: 18,
                                    color: "#000000",
                                }),

                                _jsx(Text, {
                                    style: styles.requestButtonText,
                                    children: "Request Fuel",
                                }),
                            ],
                        }),
                    ],
                }),

                _jsxs(View, {
                    style: styles.actionsGrid,
                    children: [
                        _jsx(FuelActionCard, {
                            title: "Nearby Stations",
                            description: "Find fuel stations close to you.",
                            icon: "map-marker-radius-outline",
                            onPress: () => {
                                router.push('/nearby-fuel-stations');
                            },
                        }),

                        _jsx(FuelActionCard, {
                            title: "Emergency Fuel",
                            description: "Request urgent fuel assistance.",
                            icon: "alert-circle-outline",
                            onPress: () => handleFuelRequest('emergency'),
                        }),

                        _jsx(FuelActionCard, {
                            title: "Track Delivery",
                            description: "View your active fuel delivery.",
                            icon: "truck-fast-outline",
                            onPress: handleTrackDelivery,
                        }),

                        _jsx(FuelActionCard, {
                            title: "Schedule Top-up",
                            description: "Plan a future fuel delivery.",
                            icon: "calendar-clock-outline",
                            onPress: handleScheduleTopUp,
                        }),

                        _jsx(FuelActionCard, {
                            title: "Fuel History",
                            description: "View previous fuel activity.",
                            icon: "history",
                            onPress: handleFuelHistory,
                        }),

                        _jsx(FuelActionCard, {
                            title: "Saved Locations",
                            description: "Manage your frequent delivery locations.",
                            icon: "map-marker-star-outline",
                            onPress: handleSavedLocations,
                        }),
                    ],
                }),

                _jsxs(View, {
                    style: [
                        styles.savedRequestsCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ],
                    children: [
                        _jsxs(View, {
                            style: styles.savedRequestsHeading,
                            children: [
                                _jsx(MaterialCommunityIcons, {
                                    name: 'content-save-outline',
                                    size: 22,
                                    color: colors.accent,
                                }),
                                _jsx(Text, {
                                    style: [styles.savedRequestsTitle, { color: colors.text }],
                                    children: 'Saved Emergency Fuel',
                                }),
                                _jsx(Text, {
                                    style: [styles.savedRequestsCount, { color: colors.secondaryText }],
                                    children: String(visibleFuelRequests.length),
                                }),
                            ],
                        }),
                        _jsx(Text, {
                            style: [styles.savedRequestsHelp, { color: colors.secondaryText }],
                            children:
                                'Requests saved on this device have not been dispatched. Review or delete them here. Online submission is not yet available.',
                        }),
                        isLoadingSavedRequests
                            ? _jsxs(View, {
                                style: styles.savedRequestsLoading,
                                children: [
                                    _jsx(ActivityIndicator, {
                                        size: 'small',
                                        color: colors.accent,
                                    }),
                                    _jsx(Text, {
                                        style: [styles.savedRequestsHelp, { color: colors.secondaryText }],
                                        children: 'Loading saved requests...',
                                    }),
                                ],
                            })
                            : null,
                        savedRequestsError
                            ? _jsx(Text, {
                                style: [styles.savedRequestsError, { color: colors.danger }],
                                children: savedRequestsError,
                            })
                            : null,
                        !isLoadingSavedRequests &&
                        !savedRequestsError &&
                        canViewSavedRequests &&
                        visibleFuelRequests.length === 0
                            ? _jsx(Text, {
                                style: [styles.savedRequestsEmpty, { color: colors.secondaryText }],
                                children: 'No saved emergency fuel requests yet.',
                            })
                            : null,
                        !canViewSavedRequests && !isLoadingSavedRequests
                            ? _jsx(Text, {
                                style: [styles.savedRequestsEmpty, { color: colors.secondaryText }],
                                children: 'Sign in with your verified Customer account to view saved requests.',
                            })
                            : null,
                        ...visibleFuelRequests.map((request) => {
                            const isExpanded = expandedRequestId === request.localId;
                            const coordinates = request.location?.coordinates;
                            const isDeleting = deletingRequestId === request.localId;
                            const locationDescription = request.location?.description;
                            const vehicle = request.vehicle;
                            const vehicleText = vehicle
                                ? [vehicle.make, vehicle.model, vehicle.year]
                                    .filter((part) => part !== null && part !== undefined && part !== '')
                                    .join(' ')
                                : '';

                            return _jsxs(View, {
                                style: [styles.savedRequestItem, { borderColor: colors.border }],
                                children: [
                                    _jsx(Text, {
                                        style: [styles.savedRequestStatus, { color: colors.accent }],
                                        children: formatRequestStatus(request.status),
                                    }),
                                    _jsx(Text, {
                                        style: [styles.savedRequestSummary, { color: colors.text }],
                                        children:
                                            `${request.details?.quantityLitres != null ? `${request.details.quantityLitres} litres` : 'Quantity pending'} · ${request.details?.fuelType ?? 'Fuel type pending'}`,
                                    }),
                                    _jsx(Text, {
                                        style: [styles.savedRequestMeta, { color: colors.secondaryText }],
                                        children: `Saved ${formatRequestDate(request.createdAt)}`,
                                    }),
                                    _jsxs(View, {
                                        style: styles.savedRequestActions,
                                        children: [
                                            _jsx(TouchableOpacity, {
                                                accessibilityRole: 'button',
                                                activeOpacity: 0.75,
                                                disabled: isDeleting,
                                                onPress: () => setExpandedRequestId(
                                                    isExpanded ? null : request.localId
                                                ),
                                                style: [styles.savedRequestAction, { borderColor: colors.accent }],
                                                children: _jsx(Text, {
                                                    style: [styles.savedRequestActionText, { color: colors.accent }],
                                                    children: isExpanded ? 'Hide Details' : 'Review Details',
                                                }),
                                            }),
                                            _jsx(TouchableOpacity, {
                                                accessibilityRole: 'button',
                                                activeOpacity: 0.75,
                                                disabled: isDeleting,
                                                onPress: () => handleDeleteSavedRequest(request),
                                                style: [styles.savedRequestAction, { borderColor: colors.danger }],
                                                children: _jsx(Text, {
                                                    style: [styles.savedRequestActionText, { color: colors.danger }],
                                                    children: isDeleting ? 'Deleting...' : 'Delete',
                                                }),
                                            }),
                                        ],
                                    }),
                                    isExpanded
                                        ? _jsxs(View, {
                                            style: [styles.savedRequestDetails, { borderTopColor: colors.border }],
                                            children: [
                                                _jsx(Text, {
                                                    style: [styles.savedRequestDetail, { color: colors.text }],
                                                    children: `Vehicle: ${vehicleText || 'Not specified'}`,
                                                }),
                                                _jsx(Text, {
                                                    style: [styles.savedRequestDetail, { color: colors.text }],
                                                    children: `Contact: ${request.contact?.name || 'Not provided'}`,
                                                }),
                                                _jsx(Text, {
                                                    style: [styles.savedRequestDetail, { color: colors.text }],
                                                    children: `Phone: ${request.contact?.phoneNumber || 'Not provided'}`,
                                                }),
                                                _jsx(Text, {
                                                    style: [styles.savedRequestDetail, { color: colors.text }],
                                                    children: `Location: ${locationDescription || 'No description provided'}`,
                                                }),
                                                _jsx(Text, {
                                                    style: [styles.savedRequestDetail, { color: colors.text }],
                                                    children: coordinates
                                                        ? `GPS: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
                                                        : 'GPS: Not available',
                                                }),
                                                _jsx(Text, {
                                                    style: [styles.savedRequestDisclaimer, { color: colors.secondaryText }],
                                                    children: 'Review only. No fuel provider has been contacted. Editing and backend submission are not available yet.',
                                                }),
                                            ],
                                        })
                                        : null,
                                ],
                            }, request.localId);
                        }),
                    ],
                }),

                _jsx(FuelRecentActivityCard, {
                    activities: recentActivity,
                    onViewAllPress: handleFuelHistory,
                    onActivityPress: (activity) => {
                        console.log(
                            'Selected fuel activity:',
                            activity.id
                        );
                    },
                }),

                fuelError
                    ? _jsx(Text, {
                        style: [
                            styles.errorText,
                            {
                                color: colors.danger,
                            },
                        ],
                        children: fuelError,
                    })
                    : null,
            ],
        }),
    });
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

    vehicleCard: {
        marginTop: 18,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
    },

    vehicleTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    vehicleName: {
        fontSize: 18,
        fontWeight: '700',
    },

    registration: {
        marginTop: 4,
        fontSize: 11,
    },

    statsGrid: {
        marginTop: 18,
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 16,
    },

    statItem: {
        width: '50%',
    },

    statLabel: {
        fontSize: 9,
    },

    statValue: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '700',
    },

    deliveryCard: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
    },

    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    deliveryTitle: {
        fontSize: 17,
        fontWeight: '700',
    },

    deliveryStatus: {
        marginTop: 4,
        fontSize: 10,
        fontWeight: '600',
    },

    deliveryDescription: {
        marginTop: 12,
        fontSize: 11,
        lineHeight: 16,
    },

    requestButton: {
        minHeight: 42,
        marginTop: 16,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },

    requestButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '700',
    },

    actionsGrid: {
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },

    savedRequestsCard: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    savedRequestsHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    savedRequestsTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
    },
    savedRequestsCount: {
        fontSize: 12,
        fontWeight: '700',
    },
    savedRequestsHelp: {
        marginTop: 9,
        fontSize: 11,
        lineHeight: 16,
    },
    savedRequestsLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    savedRequestsError: {
        marginTop: 12,
        fontSize: 11,
        lineHeight: 16,
    },
    savedRequestsEmpty: {
        marginTop: 12,
        fontSize: 11,
    },
    savedRequestItem: {
        marginTop: 12,
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
    },
    savedRequestStatus: {
        fontSize: 11,
        fontWeight: '700',
    },
    savedRequestSummary: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '700',
    },
    savedRequestMeta: {
        marginTop: 5,
        fontSize: 10,
    },
    savedRequestActions: {
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    savedRequestAction: {
        minHeight: 38,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    savedRequestActionText: {
        fontSize: 11,
        fontWeight: '700',
    },
    savedRequestDetails: {
        borderTopWidth: 1,
        marginTop: 12,
        paddingTop: 10,
        gap: 7,
    },
    savedRequestDetail: {
        fontSize: 11,
        lineHeight: 16,
    },
    savedRequestDisclaimer: {
        marginTop: 5,
        fontSize: 10,
        lineHeight: 15,
    },

    message: {
        paddingVertical: 40,
        textAlign: 'center',
        fontSize: 12,
    },

    errorText: {
        marginTop: 10,
        fontSize: 11,
        textAlign: 'center',
    },
});