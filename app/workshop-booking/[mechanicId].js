import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useWorkshopBooking } from '../../src/customer/useWorkshopBooking';
import { useTheme } from '../../src/theme/ThemeContext';
import { useUser } from '../../src/users/UserContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function WorkshopBookingScreen() {
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
    const [serviceType, setServiceType] = useState('Vehicle Inspection');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const { workshopBooking, isSubmittingBooking, workshopBookingError, submitWorkshopBooking, } = useWorkshopBooking();
    const hasServiceType = serviceType.trim().length > 0;
    const hasDate = scheduledDate.trim().length > 0;
    const hasTime = scheduledTime.trim().length > 0;
    const canSubmit = Boolean(user) &&
        Boolean(selectedVehicle) &&
        Boolean(mechanicId) &&
        hasServiceType &&
        hasDate &&
        hasTime &&
        !isSubmittingBooking;
    const handleSubmit = async () => {
        if (!user ||
            !selectedVehicle ||
            !mechanicId ||
            !hasServiceType ||
            !hasDate ||
            !hasTime) {
            return;
        }
        await submitWorkshopBooking({
            customerId: user.id,
            vehicleId: selectedVehicle.id,
            mechanicId,
            diagnosticResultId: resultId ?? null,
            serviceType: serviceType.trim(),
            issueDescription: issueDescription.trim() || null,
            scheduledDate: scheduledDate.trim(),
            scheduledTime: scheduledTime.trim(),
        });
    };
    if (workshopBooking) {
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
                    ], children: _jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 34, color: colors.success }) }), _jsx(Text, { style: [
                        styles.successTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Booking Submitted" }), _jsx(Text, { style: [
                        styles.successDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Your requested workshop appointment has been submitted and is awaiting confirmation." }), _jsxs(View, { style: [
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
                            ], children: "Requested Appointment" }), _jsx(Text, { style: [
                                styles.appointmentValue,
                                {
                                    color: colors.text,
                                },
                            ], children: workshopBooking.scheduledDate }), _jsx(Text, { style: [
                                styles.appointmentTime,
                                {
                                    color: colors.text,
                                },
                            ], children: workshopBooking.scheduledTime }), _jsx(Text, { style: [
                                styles.statusValue,
                                {
                                    color: colors.warning,
                                },
                            ], children: "Pending Confirmation" }), _jsx(Text, { style: [
                                styles.bookingId,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: workshopBooking.id })] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.replace('/(customer)'), style: [
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
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/find-mechanic'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Book Service" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Workshop Booking" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Request a workshop appointment for your selected vehicle." }), _jsx(Text, { style: [
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
                    ], children: "Service" }), _jsxs(View, { style: [
                        styles.inputRow,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "wrench-outline", size: 21, color: colors.accent }), _jsx(TextInput, { value: serviceType, onChangeText: setServiceType, placeholder: "e.g. Brake Inspection", placeholderTextColor: colors.secondaryText, style: [
                                styles.singleLineInput,
                                {
                                    color: colors.text,
                                },
                            ] })] }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Preferred Date" }), _jsxs(View, { style: [
                        styles.inputRow,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "calendar-outline", size: 21, color: colors.accent }), _jsx(TextInput, { value: scheduledDate, onChangeText: setScheduledDate, placeholder: "YYYY-MM-DD", placeholderTextColor: colors.secondaryText, keyboardType: "numbers-and-punctuation", style: [
                                styles.singleLineInput,
                                {
                                    color: colors.text,
                                },
                            ] })] }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Preferred Time" }), _jsxs(View, { style: [
                        styles.inputRow,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "clock-outline", size: 21, color: colors.accent }), _jsx(TextInput, { value: scheduledTime, onChangeText: setScheduledTime, placeholder: "HH:MM", placeholderTextColor: colors.secondaryText, keyboardType: "numbers-and-punctuation", style: [
                                styles.singleLineInput,
                                {
                                    color: colors.text,
                                },
                            ] })] }), _jsx(Text, { style: [
                        styles.slotNote,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "This is a requested appointment time. The workshop must confirm availability before the booking becomes confirmed." }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Additional Details" }), _jsxs(View, { style: [
                        styles.descriptionContainer,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "clipboard-text-outline", size: 21, color: colors.accent }), _jsx(TextInput, { value: issueDescription, onChangeText: setIssueDescription, placeholder: "Describe anything the workshop should know...", placeholderTextColor: colors.secondaryText, multiline: true, maxLength: 500, textAlignVertical: "top", style: [
                                styles.descriptionInput,
                                {
                                    color: colors.text,
                                },
                            ] })] }), _jsxs(Text, { style: [
                        styles.characterCount,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: [issueDescription.length, "/500"] }), workshopBookingError ? (_jsx(Text, { style: [
                        styles.bookingError,
                        {
                            color: colors.danger,
                        },
                    ], children: workshopBookingError })) : null, _jsx(TouchableOpacity, { activeOpacity: 0.75, disabled: !canSubmit, onPress: handleSubmit, style: [
                        styles.submitButton,
                        {
                            backgroundColor: canSubmit
                                ? colors.accent
                                : colors.border,
                        },
                    ], children: isSubmittingBooking ? (_jsx(ActivityIndicator, { size: "small", color: "#000000" })) : (_jsxs(_Fragment, { children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 20, color: "#000000" }), _jsx(Text, { style: styles.submitButtonText, children: "Request Booking" })] })) }), _jsx(Text, { style: [
                        styles.disclaimer,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Appointment availability, pricing and final confirmation will be provided by the workshop through MechanIQ." })] }) }));
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
    inputRow: {
        minHeight: 54,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    singleLineInput: {
        flex: 1,
        minHeight: 52,
        paddingVertical: 0,
        fontSize: 11,
    },
    slotNote: {
        marginTop: 7,
        paddingHorizontal: 4,
        fontSize: 8,
        lineHeight: 13,
    },
    descriptionContainer: {
        minHeight: 125,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    descriptionInput: {
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
    bookingError: {
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
    appointmentValue: {
        marginTop: 7,
        fontSize: 14,
        fontWeight: '700',
    },
    appointmentTime: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: '700',
    },
    statusValue: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '800',
    },
    bookingId: {
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
