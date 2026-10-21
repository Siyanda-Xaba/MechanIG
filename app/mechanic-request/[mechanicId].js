import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import StableScrollView from '../../src/components/StableScrollView';
import { useMechanicRequest } from '../../src/customer/useMechanicRequest';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function MechanicRequestScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user } = useUser();
    const { selectedVehicle } = useVehicle();
    const params = useLocalSearchParams();
    const mechanicId = Array.isArray(params.mechanicId)
        ? params.mechanicId[0]
        : params.mechanicId;
    const resultId = Array.isArray(params.resultId)
        ? params.resultId[0]
        : params.resultId;
    const [serviceAddress, setServiceAddress] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const { mechanicRequest, isSubmittingRequest, mechanicRequestError, submitMechanicRequest, } = useMechanicRequest();
    const hasServiceAddress = serviceAddress.trim().length > 0;
    const canSubmit = Boolean(user) &&
        Boolean(selectedVehicle) &&
        Boolean(mechanicId) &&
        hasServiceAddress &&
        !isSubmittingRequest;
    const handleSubmit = async () => {
        if (!user ||
            !selectedVehicle ||
            !mechanicId ||
            !hasServiceAddress) {
            return;
        }
        await submitMechanicRequest({
            customerId: user.id,
            vehicleId: selectedVehicle.id,
            mechanicId,
            diagnosticResultId: resultId ?? null,
            requestType: 'mobile',
            serviceLocation: {
                address: serviceAddress.trim(),
                // Later GPS/geocoding will provide
                // authoritative coordinates.
                latitude: null,
                longitude: null,
            },
            scheduledAt: null,
            issueDescription: issueDescription.trim() || null,
        });
    };
    if (mechanicRequest) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(View, { style: [
                        styles.successIcon,
                        {
                            borderColor: colors.success,
                        },
                    ], children: _jsx(MaterialCommunityIcons, { name: "check", size: 34, color: colors.success }) }), _jsx(Text, { style: [
                        styles.successTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Request Submitted" }), _jsx(Text, { style: [
                        styles.successDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Your mechanic request has been created and is awaiting confirmation." }), _jsxs(View, { style: [
                        styles.statusCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Text, { style: [
                                styles.statusLabel,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Request Status" }), _jsx(Text, { style: [
                                styles.statusValue,
                                {
                                    color: colors.warning,
                                },
                            ], children: "Pending" }), _jsx(Text, { style: [
                                styles.requestId,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: mechanicRequest.id })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.replace('/(customer)'), style: [
                        styles.doneButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: _jsx(Text, { style: styles.doneButtonText, children: "Back to Home" }) })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, keyboardShouldPersistTaps: "handled", children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/find-mechanic'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Request Mechanic" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Mobile Mechanic Request" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Review your vehicle and issue details before requesting assistance." }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Vehicle" }), _jsx(View, { style: [
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: selectedVehicle ? (_jsxs(View, { style: styles.infoRow, children: [_jsx(View, { style: [
                                    styles.iconContainer,
                                    {
                                        borderColor: colors.accent,
                                    },
                                ], children: _jsx(MaterialCommunityIcons, { name: "car-outline", size: 23, color: colors.accent }) }), _jsxs(View, { style: styles.infoContent, children: [_jsxs(Text, { style: [
                                            styles.infoTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                            styles.infoDescription,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: selectedVehicle.registration }), _jsxs(Text, { style: [
                                            styles.infoDescription,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: [selectedVehicle.fuelType || 'N/A', " \u2022", ' ', selectedVehicle.year ?? 'N/A'] })] })] })) : (_jsx(Text, { style: [
                            styles.missingText,
                            {
                                color: colors.danger,
                            },
                        ], children: "No vehicle selected." })) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Service Type" }), _jsx(View, { style: [
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.accent,
                        },
                    ], children: _jsxs(View, { style: styles.infoRow, children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 24, color: colors.accent }), _jsxs(View, { style: styles.infoContent, children: [_jsx(Text, { style: [
                                            styles.infoTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Mobile Mechanic" }), _jsx(Text, { style: [
                                            styles.infoDescription,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: "The mechanic travels to your service location." })] }), _jsx(MaterialCommunityIcons, { name: "check-circle", size: 21, color: colors.accent })] }) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Service Location" }), _jsxs(View, { style: [
                        styles.addressContainer,
                        {
                            backgroundColor: colors.card,
                            borderColor: hasServiceAddress
                                ? colors.accent
                                : colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "map-marker-outline", size: 23, color: colors.accent }), _jsx(TextInput, { value: serviceAddress, onChangeText: setServiceAddress, placeholder: "Enter the address where you need assistance", placeholderTextColor: colors.secondaryText, autoCapitalize: "words", returnKeyType: "done", style: [
                                styles.addressInput,
                                {
                                    color: colors.text,
                                },
                            ] })] }), _jsx(Text, { style: [
                        styles.locationNote,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "GPS and address suggestions will be added here later. For now, enter the service address manually." }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Additional Details" }), _jsxs(View, { style: [
                        styles.inputContainer,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "clipboard-text-outline", size: 21, color: colors.accent }), _jsx(TextInput, { value: issueDescription, onChangeText: setIssueDescription, placeholder: "Describe anything else the mechanic should know...", placeholderTextColor: colors.secondaryText, multiline: true, maxLength: 500, textAlignVertical: "top", style: [
                                styles.input,
                                {
                                    color: colors.text,
                                },
                            ] })] }), _jsxs(Text, { style: [
                        styles.characterCount,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: [issueDescription.length, "/500"] }), mechanicRequestError ? (_jsx(Text, { style: [
                        styles.requestError,
                        {
                            color: colors.danger,
                        },
                    ], children: mechanicRequestError })) : null, _jsx(TouchableOpacity, { activeOpacity: 0.75, disabled: !canSubmit, onPress: handleSubmit, style: [
                        styles.submitButton,
                        {
                            backgroundColor: canSubmit
                                ? colors.accent
                                : colors.border,
                        },
                    ], children: isSubmittingRequest ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsxs(_Fragment, { children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 20, color: "#000000" }), _jsx(Text, { style: styles.submitButtonText, children: "Request Mechanic" })] })) }), _jsx(Text, { style: [
                        styles.disclaimer,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Mechanic availability, pricing and arrival time will be confirmed by MechanIQ before service begins." })] }) }));
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
        paddingBottom: 32,
    },
    header: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerButton: {
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
        marginTop: 6,
        fontSize: 12,
        lineHeight: 18,
    },
    sectionTitle: {
        marginTop: 22,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: '700',
    },
    card: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    infoDescription: {
        marginTop: 3,
        fontSize: 9,
        lineHeight: 14,
    },
    missingText: {
        fontSize: 11,
        textAlign: 'center',
    },
    addressContainer: {
        minHeight: 54,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    addressInput: {
        flex: 1,
        minHeight: 52,
        paddingVertical: 0,
        fontSize: 11,
    },
    locationNote: {
        marginTop: 6,
        paddingHorizontal: 4,
        fontSize: 8,
        lineHeight: 13,
    },
    inputContainer: {
        minHeight: 125,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    input: {
        flex: 1,
        minHeight: 95,
        padding: 0,
        fontSize: 11,
        lineHeight: 17,
    },
    characterCount: {
        marginTop: 5,
        fontSize: 8,
        textAlign: 'right',
    },
    requestError: {
        marginTop: 12,
        fontSize: 10,
        textAlign: 'center',
    },
    submitButton: {
        minHeight: 48,
        marginTop: 24,
        borderRadius: 10,
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
    disclaimer: {
        marginTop: 10,
        paddingHorizontal: 12,
        fontSize: 9,
        lineHeight: 14,
        textAlign: 'center',
    },
    successIcon: {
        width: 72,
        height: 72,
        borderWidth: 2,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: {
        marginTop: 18,
        fontSize: 22,
        fontWeight: '800',
    },
    successDescription: {
        marginTop: 8,
        maxWidth: 300,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    statusCard: {
        width: '100%',
        maxWidth: 320,
        marginTop: 22,
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 9,
    },
    statusValue: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '800',
    },
    requestId: {
        marginTop: 7,
        fontSize: 8,
    },
    doneButton: {
        width: '100%',
        maxWidth: 320,
        minHeight: 46,
        marginTop: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
});
