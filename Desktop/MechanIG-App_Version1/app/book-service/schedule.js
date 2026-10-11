import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useEffect, useMemo, useState, } from 'react';
import { getBookServiceDateOptions, getBookServiceLocationOptions, getBookServiceTimeOptions, } from '../../src/customer/bookServiceScheduleService';
import { getCustomerBookServiceData, } from '../../src/customer/bookServiceService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function BookServiceScheduleScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const params = useLocalSearchParams();
    const rawServiceId = Array.isArray(params.serviceId)
        ? params.serviceId[0]
        : params.serviceId;
    const [dateOptions, setDateOptions,] = useState([]);
    const [timeOptions, setTimeOptions,] = useState([]);
    const [locationOptions, setLocationOptions,] = useState([]);
    const [selectedDate, setSelectedDate,] = useState(null);
    const [selectedTime, setSelectedTime,] = useState(null);
    const [locationPreference, setLocationPreference,] = useState(null);
    const [serviceTitle, setServiceTitle,] = useState(null);
    const [isLoadingSchedule, setIsLoadingSchedule,] = useState(true);
    const [scheduleError, setScheduleError,] = useState(null);
    useEffect(() => {
        let isActive = true;
        async function loadSchedule() {
            if (!selectedVehicle?.id || !rawServiceId) {
                if (isActive) {
                    setIsLoadingSchedule(false);
                }
                return;
            }
            try {
                setIsLoadingSchedule(true);
                setScheduleError(null);
                const [dates, times, locations, serviceData,] = await Promise.all([
                    getBookServiceDateOptions(),
                    getBookServiceTimeOptions(),
                    getBookServiceLocationOptions(),
                    getCustomerBookServiceData(selectedVehicle.id),
                ]);
                if (!isActive) {
                    return;
                }
                const service = serviceData.services.find((item) => item.id === rawServiceId);
                if (!service) {
                    setScheduleError('The selected service is unavailable.');
                    return;
                }
                setDateOptions(dates);
                setTimeOptions(times);
                setLocationOptions(locations);
                setServiceTitle(service.title);
            }
            catch {
                if (isActive) {
                    setScheduleError('Unable to load scheduling preferences.');
                }
            }
            finally {
                if (isActive) {
                    setIsLoadingSchedule(false);
                }
            }
        }
        loadSchedule();
        return () => {
            isActive = false;
        };
    }, [
        rawServiceId,
        selectedVehicle?.id,
    ]);
    const canContinue = selectedDate !== null &&
        selectedTime !== null &&
        locationPreference !== null;
    const selectedDateLabel = useMemo(() => {
        return dateOptions.find((option) => option.value === selectedDate);
    }, [dateOptions, selectedDate]);
    const selectedTimeLabel = useMemo(() => {
        return timeOptions.find((option) => option.value === selectedTime);
    }, [timeOptions, selectedTime]);
    if (isLoadingVehicles ||
        isLoadingSchedule) {
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
                    ], children: "Loading scheduling options..." })] }));
    }
    if (!selectedVehicle) {
        return (_jsxs(SafeAreaView, { style: [
                styles.centeredPage,
                {
                    backgroundColor: colors.background,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 48, color: colors.secondaryText }), _jsx(Text, { style: [
                        styles.stateTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "No vehicle selected" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Select a vehicle before scheduling a service." }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/book-service'), style: [
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
    if (!rawServiceId ||
        scheduleError ||
        !serviceTitle) {
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
                    ], children: "Unable to schedule service" }), _jsx(Text, { style: [
                        styles.stateDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: scheduleError ??
                        'No service was selected.' }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/book-service'), style: [
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                        },
                    ], children: _jsx(Text, { style: [
                            styles.secondaryButtonText,
                            {
                                color: colors.text,
                            },
                        ], children: "Choose Another Service" }) })] }));
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/book-service'), style: [
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
                                    ], children: "Schedule Service" }), _jsx(Text, { style: [
                                        styles.subtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Tell us when and how you would prefer the service." })] })] }), _jsxs(View, { style: [
                        styles.summaryCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(View, { style: [
                                styles.summaryIcon,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(MaterialCommunityIcons, { name: "car-wrench", size: 23, color: colors.accent }) }), _jsxs(View, { style: styles.summaryContent, children: [_jsx(Text, { style: [
                                        styles.summaryLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Selected service" }), _jsx(Text, { style: [
                                        styles.summaryTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: serviceTitle }), _jsxs(Text, { style: [
                                        styles.summaryVehicle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model, ' • ', selectedVehicle.registration] })] })] }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Preferred Date" }), _jsx(Text, { style: [
                        styles.sectionDescription,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "This is a preference until a workshop confirms availability." }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.dateList, children: dateOptions.map((option) => {
                        const isSelected = option.value ===
                            selectedDate;
                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setSelectedDate(option.value), style: [
                                styles.dateCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: isSelected
                                        ? colors.accent
                                        : colors.border,
                                    borderWidth: isSelected
                                        ? 2
                                        : 1,
                                },
                            ], children: [_jsx(Text, { style: [
                                        styles.dateDay,
                                        {
                                            color: isSelected
                                                ? colors.accent
                                                : colors.text,
                                        },
                                    ], children: option.label }), _jsx(Text, { style: [
                                        styles.dateValue,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: option.secondaryLabel })] }, option.value));
                    }) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Preferred Time" }), _jsx(View, { style: styles.timeList, children: timeOptions.map((option) => {
                        const isSelected = option.value ===
                            selectedTime;
                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setSelectedTime(option.value), style: [
                                styles.timeCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: isSelected
                                        ? colors.accent
                                        : colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.timeIcon,
                                        {
                                            borderColor: isSelected
                                                ? colors.accent
                                                : colors.border,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: "clock-outline", size: 20, color: isSelected
                                            ? colors.accent
                                            : colors.text }) }), _jsxs(View, { style: styles.timeContent, children: [_jsx(Text, { style: [
                                                styles.timeTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: option.label }), _jsx(Text, { style: [
                                                styles.timeDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: option.description })] }), _jsx(View, { style: [
                                        styles.radioOuter,
                                        {
                                            borderColor: isSelected
                                                ? colors.accent
                                                : colors.border,
                                        },
                                    ], children: isSelected ? (_jsx(View, { style: [
                                            styles.radioInner,
                                            {
                                                backgroundColor: colors.accent,
                                            },
                                        ] })) : null })] }, option.value));
                    }) }), _jsx(Text, { style: [
                        styles.sectionTitle,
                        {
                            color: colors.text,
                        },
                    ], children: "Service Location" }), _jsx(View, { style: styles.locationList, children: locationOptions.map((option) => {
                        const isSelected = option.id ===
                            locationPreference;
                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setLocationPreference(option.id), style: [
                                styles.locationCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: isSelected
                                        ? colors.accent
                                        : colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.locationIcon,
                                        {
                                            borderColor: isSelected
                                                ? colors.accent
                                                : colors.border,
                                        },
                                    ], children: _jsx(MaterialCommunityIcons, { name: option.id ===
                                            'workshop'
                                            ? 'garage'
                                            : 'car-wrench', size: 22, color: isSelected
                                            ? colors.accent
                                            : colors.text }) }), _jsxs(View, { style: styles.locationContent, children: [_jsx(Text, { style: [
                                                styles.locationTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: option.title }), _jsx(Text, { style: [
                                                styles.locationDescription,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: option.description })] }), _jsx(Ionicons, { name: isSelected
                                        ? 'checkmark-circle'
                                        : 'ellipse-outline', size: 23, color: isSelected
                                        ? colors.accent
                                        : colors.secondaryText })] }, option.id));
                    }) }), canContinue ? (_jsxs(View, { style: [
                        styles.preferenceSummary,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Text, { style: [
                                styles.preferenceSummaryTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Your Preference" }), _jsxs(Text, { style: [
                                styles.preferenceSummaryText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: [selectedDateLabel?.label, ' ', selectedDateLabel?.secondaryLabel, ' • ', selectedTimeLabel?.description, ' • ', locationPreference ===
                                    'workshop'
                                    ? 'Workshop'
                                    : 'Mobile Service'] })] })) : null, _jsxs(TouchableOpacity, { activeOpacity: 0.75, disabled: !canContinue, onPress: () => {
                        if (!selectedDate ||
                            !selectedTime ||
                            !locationPreference) {
                            return;
                        }
                        router.push({
                            pathname: '/book-service/options',
                            params: {
                                serviceId: rawServiceId,
                                preferredDate: selectedDate,
                                preferredTime: selectedTime,
                                locationPreference,
                            },
                        });
                    }, style: [
                        styles.continueButton,
                        {
                            backgroundColor: colors.accent,
                            opacity: canContinue
                                ? 1
                                : 0.4,
                        },
                    ], children: [_jsx(Text, { style: styles.continueButtonText, children: "Find Available Options" }), _jsx(Ionicons, { name: "arrow-forward", size: 20, color: "#000000" })] }), _jsx(Text, { style: [
                        styles.backendNotice,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "These are preferred scheduling details only. Final availability, pricing and confirmation will come from the selected mechanic or workshop through MechanIQ backend services." })] }) }));
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
    secondaryButton: {
        minWidth: 170,
        minHeight: 44,
        marginTop: 18,
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
    summaryCard: {
        marginTop: 20,
        minHeight: 86,
        padding: 13,
        borderWidth: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIcon: {
        width: 46,
        height: 46,
        borderWidth: 1,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryContent: {
        flex: 1,
        marginLeft: 12,
    },
    summaryLabel: {
        fontSize: 9,
    },
    summaryTitle: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: '700',
    },
    summaryVehicle: {
        marginTop: 4,
        fontSize: 9.5,
    },
    sectionTitle: {
        marginTop: 24,
        fontSize: 16,
        fontWeight: '800',
    },
    sectionDescription: {
        marginTop: 4,
        fontSize: 9.5,
        lineHeight: 14,
    },
    dateList: {
        marginTop: 12,
        gap: 8,
        paddingRight: 4,
    },
    dateCard: {
        width: 86,
        minHeight: 72,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateDay: {
        fontSize: 11,
        fontWeight: '700',
    },
    dateValue: {
        marginTop: 5,
        fontSize: 9,
    },
    timeList: {
        marginTop: 12,
        gap: 9,
    },
    timeCard: {
        minHeight: 66,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIcon: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeContent: {
        flex: 1,
        marginLeft: 11,
    },
    timeTitle: {
        fontSize: 11.5,
        fontWeight: '700',
    },
    timeDescription: {
        marginTop: 3,
        fontSize: 9,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    locationList: {
        marginTop: 12,
        gap: 9,
    },
    locationCard: {
        minHeight: 76,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 42,
        height: 42,
        borderWidth: 1,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationContent: {
        flex: 1,
        marginHorizontal: 11,
    },
    locationTitle: {
        fontSize: 11.5,
        fontWeight: '700',
    },
    locationDescription: {
        marginTop: 3,
        fontSize: 9,
        lineHeight: 13,
    },
    preferenceSummary: {
        marginTop: 18,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    preferenceSummaryTitle: {
        fontSize: 10,
        fontWeight: '700',
    },
    preferenceSummaryText: {
        marginTop: 5,
        fontSize: 9,
        lineHeight: 14,
    },
    continueButton: {
        minHeight: 50,
        marginTop: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },
    continueButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '800',
    },
    backendNotice: {
        marginTop: 15,
        paddingHorizontal: 12,
        fontSize: 8.5,
        lineHeight: 13,
        textAlign: 'center',
    },
});
