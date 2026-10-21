import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useMechanicSearch } from '../../src/customer/useMechanicSearch';
import { useTheme } from '../../src/theme/ThemeContext';
export default function FindMechanicScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const params = useLocalSearchParams();
    const resultId = Array.isArray(params.resultId)
        ? params.resultId[0]
        : params.resultId;
    const { mechanicSearchResult, isLoadingMechanics, mechanicSearchError, refreshMechanics, } = useMechanicSearch(resultId);
    if (isLoadingMechanics) {
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
                    ], children: "Finding suitable mechanics..." })] }));
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
                    ], children: mechanicSearchError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshMechanics, style: [
                        styles.retryButton,
                        {
                            backgroundColor: colors.accent,
                        },
                    ], children: _jsx(Text, { style: styles.retryButtonText, children: "Try Again" }) }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => router.dismissTo('/find-mechanic'), style: [
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
    const mechanics = mechanicSearchResult?.mechanics ?? [];
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/find-mechanic'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Find a Mechanic" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Recommended Mechanics" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Mechanics matched to your diagnostic result and service requirements." }), mechanics.length === 0 ? (_jsxs(View, { style: [
                        styles.emptyCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "account-search-outline", size: 42, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.emptyTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No mechanics found" }), _jsx(Text, { style: [
                                styles.emptyDescription,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "No matching mechanic recommendations are available right now." })] })) : (mechanics.map((mechanic) => {
                    const availabilityColor = mechanic.availability === 'available'
                        ? colors.success
                        : mechanic.availability === 'busy'
                            ? colors.warning
                            : colors.secondaryText;
                    const availabilityLabel = mechanic.availability === 'available'
                        ? 'Available'
                        : mechanic.availability === 'busy'
                            ? 'Busy'
                            : 'Unavailable';
                    return (_jsxs(View, { style: [
                            styles.mechanicCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsxs(View, { style: styles.mechanicHeader, children: [_jsx(View, { style: [
                                            styles.avatar,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], children: _jsx(Ionicons, { name: "person-outline", size: 28, color: colors.accent }) }), _jsxs(View, { style: styles.mechanicInfo, children: [_jsxs(View, { style: styles.nameRow, children: [_jsx(Text, { style: [
                                                            styles.mechanicName,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ], children: mechanic.name }), mechanic.verified ? (_jsx(MaterialCommunityIcons, { name: "check-decagram", size: 17, color: colors.accent })) : null] }), mechanic.businessName ? (_jsx(Text, { style: [
                                                    styles.businessName,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: mechanic.businessName })) : null, _jsxs(View, { style: styles.ratingRow, children: [_jsx(Ionicons, { name: "star", size: 13, color: colors.warning }), _jsx(Text, { style: [
                                                            styles.ratingText,
                                                            {
                                                                color: colors.text,
                                                            },
                                                        ], children: mechanic.rating ?? '—' }), _jsxs(Text, { style: [
                                                            styles.reviewText,
                                                            {
                                                                color: colors.secondaryText,
                                                            },
                                                        ], children: ["(", mechanic.reviewCount, " reviews)"] })] })] }), _jsx(View, { style: [
                                            styles.availabilityPill,
                                            {
                                                borderColor: availabilityColor,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.availabilityText,
                                                {
                                                    color: availabilityColor,
                                                },
                                            ], children: availabilityLabel }) })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(MaterialCommunityIcons, { name: "map-marker-outline", size: 18, color: colors.accent }), _jsxs(View, { style: styles.detailContent, children: [_jsx(Text, { style: [
                                                    styles.detailLabel,
                                                    {
                                                        color: colors.secondaryText,
                                                    },
                                                ], children: "Location" }), _jsx(Text, { style: [
                                                    styles.detailValue,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: mechanic.location.address })] }), mechanic.location.distanceKm !== null ? (_jsxs(Text, { style: [
                                            styles.distanceText,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: [mechanic.location.distanceKm, " km"] })) : null] }), _jsx(Text, { style: [
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
                                                ], children: "Workshop Booking" })] })) : null] }), _jsxs(View, { style: styles.actions, children: [mechanic.supportsMobileService ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, style: [
                                            styles.outlineAction,
                                            {
                                                borderColor: colors.accent,
                                            },
                                        ], onPress: () => {
                                            router.push({
                                                pathname: '/mechanic-request/[mechanicId]',
                                                params: {
                                                    mechanicId: mechanic.id,
                                                    ...(resultId
                                                        ? {
                                                            resultId,
                                                        }
                                                        : {}),
                                                },
                                            });
                                        }, children: [_jsx(MaterialCommunityIcons, { name: "car-wrench", size: 18, color: colors.accent }), _jsx(Text, { style: [
                                                    styles.outlineActionText,
                                                    {
                                                        color: colors.accent,
                                                    },
                                                ], children: "Request Mechanic" })] })) : null, mechanic.supportsWorkshopBooking ? (_jsxs(TouchableOpacity, { activeOpacity: 0.75, style: [
                                            styles.primaryAction,
                                            {
                                                backgroundColor: colors.accent,
                                            },
                                        ], onPress: () => {
                                            router.push({
                                                pathname: '/workshop-booking/[mechanicId]',
                                                params: {
                                                    mechanicId: mechanic.id,
                                                    ...(resultId
                                                        ? {
                                                            resultId,
                                                        }
                                                        : {}),
                                                },
                                            });
                                        }, children: [_jsx(MaterialCommunityIcons, { name: "calendar-check-outline", size: 18, color: "#000000" }), _jsx(Text, { style: styles.primaryActionText, children: "Book Service" })] })) : null] })] }, mechanic.id));
                }))] }) }));
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
    loadingText: {
        marginTop: 12,
        fontSize: 12,
    },
    errorTitle: {
        marginTop: 14,
        fontSize: 18,
        fontWeight: '700',
    },
    errorMessage: {
        marginTop: 8,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    retryButton: {
        minHeight: 42,
        marginTop: 20,
        paddingHorizontal: 24,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '700',
    },
    secondaryButton: {
        minHeight: 42,
        marginTop: 10,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 12,
        fontWeight: '700',
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
    emptyCard: {
        marginTop: 20,
        minHeight: 180,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '700',
    },
    emptyDescription: {
        marginTop: 6,
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
    },
    mechanicCard: {
        marginTop: 18,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    mechanicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 52,
        height: 52,
        borderWidth: 1.5,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mechanicInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    mechanicName: {
        fontSize: 15,
        fontWeight: '700',
    },
    businessName: {
        marginTop: 3,
        fontSize: 10,
    },
    ratingRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '700',
    },
    reviewText: {
        fontSize: 9,
    },
    availabilityPill: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 7,
    },
    availabilityText: {
        fontSize: 8,
        fontWeight: '700',
    },
    detailRow: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 8,
    },
    detailValue: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '600',
    },
    distanceText: {
        fontSize: 9,
    },
    sectionLabel: {
        marginTop: 18,
        fontSize: 9,
        fontWeight: '600',
    },
    specialties: {
        marginTop: 8,
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
        marginTop: 16,
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
        minHeight: 42,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    outlineActionText: {
        fontSize: 9,
        fontWeight: '700',
    },
    primaryAction: {
        flex: 1,
        minHeight: 42,
        paddingHorizontal: 8,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    primaryActionText: {
        color: '#000000',
        fontSize: 9,
        fontWeight: '700',
    },
});
