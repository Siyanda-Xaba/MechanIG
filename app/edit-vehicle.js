import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createElement as h, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import { useConnectivity } from '../src/offline/ConnectivityContext';
import { useTheme } from '../src/theme/ThemeContext';
import { useUser } from '../src/users/UserContext';
import { useUpdateVehicle } from '../src/vehicles/useUpdateVehicle';
import { useVehicle } from '../src/vehicles/VehicleContext';

const emptyForm = {
    make: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    registration: '',
};

function VehicleField({
    label,
    placeholder,
    value,
    error,
    onChangeText,
    colors,
    keyboardType = 'default',
    maxLength,
    autoCapitalize = 'words',
    disabled = false,
}) {
    return h(View, { style: styles.field },
        h(Text, {
            style: [styles.fieldLabel, { color: colors.text }],
        }, label),
        h(TextInput, {
            value,
            onChangeText,
            placeholder,
            placeholderTextColor: colors.secondaryText,
            keyboardType,
            maxLength,
            autoCapitalize,
            editable: !disabled,
            style: [
                styles.input,
                {
                    color: colors.text,
                    borderColor: error ? colors.danger : colors.border,
                    opacity: disabled ? 0.6 : 1,
                },
            ],
        }),
        error
            ? h(Text, {
                style: [styles.fieldError, { color: colors.danger }],
            }, error)
            : null
    );
}

export default function EditVehicleScreen() {
    const router = useRouter();
    const { vehicleId: requestedVehicleId } = useLocalSearchParams();
    const vehicleId = typeof requestedVehicleId === 'string'
        ? requestedVehicleId
        : null;
    const { colors } = useTheme();
    const { user } = useUser();
    const { isOffline } = useConnectivity();
    const { vehicles, isLoadingVehicles, isUpdatingVehicle } = useVehicle();
    const {
        isUpdatingVehicle: isSavingVehicle,
        updateVehicleError,
        updateVehicle,
        clearUpdateVehicleError,
    } = useUpdateVehicle();

    // Never silently edit the selected vehicle if this route has no valid ID.
    const vehicle = vehicleId
        ? vehicles.find((item) => item.id === vehicleId) ?? null
        : null;
    const formOwnerKey = vehicle && user?.id
        ? `${user.id}:${vehicle.id}`
        : null;

    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});
    const [initializedKey, setInitializedKey] = useState(null);

    // Initialize once per vehicle/account; background refreshes must not
    // overwrite edits a customer is currently typing.
    useEffect(() => {
        if (!vehicle || !formOwnerKey) {
            setInitializedKey(null);
            setForm(emptyForm);
            setFormErrors({});
            return;
        }

        setForm({
            make: String(vehicle.make ?? ''),
            model: String(vehicle.model ?? ''),
            year: vehicle.year != null ? String(vehicle.year) : '',
            color: String(vehicle.color ?? ''),
            fuelType: String(vehicle.fuelType ?? ''),
            registration: String(vehicle.registration ?? ''),
        });
        setFormErrors({});
        clearUpdateVehicleError();
        setInitializedKey(formOwnerKey);
    }, [formOwnerKey]);

    const isBusy = isSavingVehicle || isUpdatingVehicle;
    const isReady = Boolean(formOwnerKey && initializedKey === formOwnerKey);
    const canSave = isReady && !isBusy && !isOffline;

    function updateField(field, value) {
        if (isBusy) {
            return;
        }
        setForm((current) => ({ ...current, [field]: value }));
        setFormErrors((current) => ({ ...current, [field]: undefined }));
        clearUpdateVehicleError();
    }

    function validateForm() {
        const errors = {};
        const make = form.make.trim();
        const model = form.model.trim();
        const color = form.color.trim();
        const fuelType = form.fuelType.trim();
        const registration = form.registration.trim().toUpperCase();
        const year = Number(form.year.trim());
        const maxYear = new Date().getFullYear() + 1;

        if (!make) errors.make = 'Vehicle make is required.';
        if (!model) errors.model = 'Vehicle model is required.';
        if (!form.year.trim()) {
            errors.year = 'Vehicle year is required.';
        } else if (!Number.isInteger(year) || year < 1900 || year > maxYear) {
            errors.year = 'Enter a valid vehicle year.';
        }
        if (!color) errors.color = 'Vehicle colour is required.';
        if (!fuelType) errors.fuelType = 'Fuel type is required.';
        if (!registration) errors.registration = 'Registration is required.';

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return null;
        return { make, model, year, color, fuelType, registration };
    }

    async function handleSubmit() {
        if (!canSave || !vehicleId) return;
        const input = validateForm();
        if (!input) return;
        const savedVehicle = await updateVehicle(vehicleId, input);
        if (savedVehicle) router.back();
    }

    const safeStyle = [styles.safeArea, { backgroundColor: colors.background }];

    if (isLoadingVehicles && !vehicle) {
        return h(SafeAreaView, { style: safeStyle },
            h(View, { style: styles.centeredLoading },
                h(ActivityIndicator, { size: 'large', color: colors.accent }),
                h(Text, {
                    style: [styles.subtitle, { color: colors.secondaryText }],
                }, 'Loading vehicle...')
            )
        );
    }

    const header = h(View, { style: styles.header },
        h(TouchableOpacity, {
            activeOpacity: 0.7,
            disabled: isBusy,
            onPress: () => router.back(),
            style: [styles.backButton, { borderColor: colors.border }],
        }, h(Ionicons, { name: 'chevron-back', size: 22, color: colors.text })),
        h(Text, { style: [styles.headerTitle, { color: colors.text }] },
            'Edit Vehicle'),
        h(View, { style: styles.headerPlaceholder })
    );

    if (!vehicle || !user?.id) {
        return h(SafeAreaView, { style: safeStyle },
            h(StableScrollView, { contentContainerStyle: styles.content },
                header,
                h(View, {
                    style: [styles.unavailableCard, {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }],
                },
                    h(MaterialCommunityIcons, {
                        name: 'car-off', size: 35, color: colors.secondaryText,
                    }),
                    h(Text, {
                        style: [styles.unavailableTitle, { color: colors.text }],
                    }, 'Vehicle unavailable'),
                    h(Text, {
                        style: [styles.unavailableDescription, {
                            color: colors.secondaryText,
                        }],
                    }, 'This vehicle is no longer available for this account. Return to Vehicle Details and refresh.'),
                    h(TouchableOpacity, {
                        onPress: () => router.back(),
                        style: [styles.secondaryButton, {
                            borderColor: colors.border,
                        }],
                    }, h(Text, {
                        style: [styles.secondaryButtonText, {
                            color: colors.text,
                        }],
                    }, 'Go Back'))
                )
            )
        );
    }

    const fieldConfigs = [
        ['make', 'Make', 'e.g. BMW'],
        ['model', 'Model', 'e.g. 320i'],
        ['year', 'Year', 'e.g. 2019', 'number-pad', 4],
        ['color', 'Colour', 'e.g. Black'],
        ['fuelType', 'Fuel Type', 'e.g. Petrol 95'],
        ['registration', 'Registration', 'e.g. CAA 123 456', 'default', undefined, 'characters'],
    ];

    return h(SafeAreaView, { style: safeStyle },
        h(KeyboardAvoidingView, {
            style: styles.keyboardView,
            behavior: Platform.OS === 'ios' ? 'padding' : undefined,
        },
            h(StableScrollView, {
                keyboardShouldPersistTaps: 'handled',
                showsVerticalScrollIndicator: false,
                contentContainerStyle: styles.content,
            },
                header,
                h(Text, {
                    style: [styles.title, { color: colors.text }],
                }, 'Vehicle Information'),
                h(Text, {
                    style: [styles.subtitle, { color: colors.secondaryText }],
                }, 'Update your existing vehicle details without changing its primary status.'),
                h(View, {
                    style: [styles.formCard, {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }],
                },
                    ...fieldConfigs.map(([key, label, placeholder, keyboardType, maxLength, autoCapitalize]) =>
                        h(VehicleField, {
                            key,
                            label,
                            placeholder,
                            value: form[key],
                            error: formErrors[key],
                            onChangeText: (value) => updateField(key, value),
                            colors,
                            keyboardType,
                            maxLength,
                            autoCapitalize,
                            disabled: isBusy || !isReady,
                        })
                    ),
                    h(View, {
                        style: [styles.primaryRow, { borderColor: colors.border }],
                    },
                        h(View, {
                            style: [styles.primaryIcon, {
                                borderColor: colors.accent,
                            }],
                        }, h(MaterialCommunityIcons, {
                            name: 'car-outline', size: 21, color: colors.accent,
                        })),
                        h(View, { style: styles.primaryContent },
                            h(Text, {
                                style: [styles.primaryTitle, { color: colors.text }],
                            }, 'Primary Vehicle Status'),
                            h(Text, {
                                style: [styles.primaryDescription, {
                                    color: colors.secondaryText,
                                }],
                            }, 'Change the primary vehicle from Vehicle Details.')
                        ),
                        h(View, {
                            style: [styles.readOnlyStatus, {
                                borderColor: colors.border,
                            }],
                        }, h(Text, {
                            style: [styles.readOnlyStatusText, {
                                color: colors.secondaryText,
                            }],
                        }, vehicle.isPrimary ? 'Primary' : 'Not primary'))
                    )
                ),
                updateVehicleError
                    ? h(View, {
                        style: [styles.errorCard, { borderColor: colors.danger }],
                    },
                        h(Ionicons, {
                            name: 'alert-circle-outline', size: 19,
                            color: colors.danger,
                        }),
                        h(Text, {
                            style: [styles.errorText, { color: colors.danger }],
                        }, updateVehicleError)
                    )
                    : null,
                h(View, {
                    style: [styles.noticeCard, { borderColor: colors.warning }],
                },
                    h(MaterialCommunityIcons, {
                        name: 'information-outline', size: 20,
                        color: colors.warning,
                    }),
                    h(Text, {
                        style: [styles.noticeText, {
                            color: colors.secondaryText,
                        }],
                    }, isOffline
                        ? 'You are offline. Connect to the internet to save vehicle changes.'
                        : 'Vehicle changes are only applied once Firebase confirms the update. Editing does not change which vehicle is primary.')
                ),
                h(TouchableOpacity, {
                    activeOpacity: 0.75,
                    disabled: !canSave,
                    onPress: handleSubmit,
                    style: [styles.submitButton, {
                        backgroundColor: colors.accent,
                        opacity: canSave ? 1 : 0.6,
                    }],
                },
                    isBusy
                        ? h(ActivityIndicator, { size: 'small', color: '#000000' })
                        : h(MaterialCommunityIcons, {
                            name: 'content-save-outline', size: 21,
                            color: '#000000',
                        }),
                    h(Text, { style: styles.submitButtonText },
                        isBusy ? 'Saving Vehicle...' : 'Save Changes')
                )
            )
        )
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
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
    formCard: {
        marginTop: 18,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        gap: 14,
    },
    field: {
        gap: 6,
    },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '700',
    },
    input: {
        minHeight: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 12,
    },
    fieldError: {
        fontSize: 9,
        lineHeight: 13,
    },
    primaryRow: {
        minHeight: 76,
        paddingTop: 14,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    primaryIcon: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryContent: {
        flex: 1,
    },
    primaryTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    primaryDescription: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 14,
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
        fontSize: 10,
        lineHeight: 15,
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
    submitButton: {
        minHeight: 50,
        marginTop: 18,
        borderRadius: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    readOnlyStatus: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 7,
        borderWidth: 1,
    },
    readOnlyStatusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    unavailableCard: {
        marginTop: 18,
        paddingHorizontal: 20,
        paddingVertical: 22,
        borderWidth: 1,
        borderRadius: 14,
        gap: 12,
        alignItems: 'center',
    },
    unavailableTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    unavailableDescription: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    secondaryButton: {
        minHeight: 42,
        paddingHorizontal: 18,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    centeredLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
});
