import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useMarketplaceStore } from '../../src/customer/useMarketplaceStore';
import { useTheme } from '../../src/theme/ThemeContext';
export default function MarketplaceStoreScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { storeId, } = useLocalSearchParams();
    const { store, isLoadingStore, storeError, refreshStore, } = useMarketplaceStore(storeId);
    const statusColor = store?.isOpen === true
        ? colors.success
        : store?.isOpen === false
            ? colors.danger
            : colors.secondaryText;
    const statusLabel = store?.isOpen === true
        ? store.closingTime
            ? `Open • Closing ${store.closingTime}`
            : 'Open'
        : store?.isOpen === false
            ? 'Closed'
            : 'Status unavailable';
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/marketplace-stores'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Store Details" }), _jsx(View, { style: styles.headerPlaceholder })] }), isLoadingStore ? (_jsxs(View, { style: styles.centeredState, children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading store..." })] })) : storeError ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "alert-circle-outline", size: 34, color: colors.danger }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Unable to Load Store" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: storeError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshStore, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.retryButtonText,
                                    {
                                        color: colors.accent,
                                    },
                                ], children: "Try Again" }) })] })) : store ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                styles.heroCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(View, { style: [
                                        styles.storeIcon,
                                        {
                                            borderColor: colors.accent,
                                        },
                                    ], children: _jsx(Ionicons, { name: "storefront-outline", size: 42, color: colors.accent }) }), _jsx(Text, { style: [
                                        styles.storeName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: store.name }), _jsx(Text, { style: [
                                        styles.status,
                                        {
                                            color: statusColor,
                                        },
                                    ], children: statusLabel })] }), _jsxs(View, { style: [
                                styles.infoCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.infoHeader, children: [_jsx(MaterialCommunityIcons, { name: "map-marker-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                                styles.infoTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Location" })] }), _jsx(Text, { style: [
                                        styles.infoText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: store.address ??
                                        'Store address unavailable.' }), _jsxs(View, { style: styles.metaRow, children: [_jsx(Text, { style: [
                                                styles.metaLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Distance" }), _jsx(Text, { style: [
                                                styles.metaValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: store.distanceKm !==
                                                null
                                                ? `${store.distanceKm} km`
                                                : 'Unavailable' })] }), _jsxs(View, { style: styles.metaRow, children: [_jsx(Text, { style: [
                                                styles.metaLabel,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: "Map coordinates" }), _jsx(Text, { style: [
                                                styles.metaValue,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: store.latitude !==
                                                null &&
                                                store.longitude !==
                                                    null
                                                ? 'Available'
                                                : 'Unavailable' })] })] }), _jsxs(View, { style: [
                                styles.infoCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.infoHeader, children: [_jsx(MaterialCommunityIcons, { name: "clock-outline", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                                styles.infoTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Store Status" })] }), _jsx(Text, { style: [
                                        styles.statusDetail,
                                        {
                                            color: statusColor,
                                        },
                                    ], children: statusLabel }), _jsx(Text, { style: [
                                        styles.infoText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Full trading hours will be provided by validated Marketplace store data when the backend is connected." })] }), _jsxs(View, { style: [
                                styles.infoCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.infoHeader, children: [_jsx(MaterialCommunityIcons, { name: "package-variant-closed", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                                styles.infoTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Products & Stock" })] }), _jsx(Text, { style: [
                                        styles.infoText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Store inventory, live stock and current pricing are not available from the development data. Production values must come from the validated Marketplace backend or provider." })] }), _jsxs(View, { style: [
                                styles.noticeCard,
                                {
                                    borderColor: colors.warning,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 21, color: colors.warning }), _jsx(Text, { style: [
                                        styles.noticeText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Store location, opening status, product availability and pricing should be confirmed from authoritative provider data before being used for purchasing or navigation." })] })] })) : null] }) }));
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
    centeredState: {
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateCard: {
        minHeight: 230,
        marginTop: 30,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateTitle: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '700',
    },
    stateText: {
        marginTop: 8,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 9,
    },
    retryButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    heroCard: {
        marginTop: 12,
        padding: 22,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
    },
    storeIcon: {
        width: 82,
        height: 82,
        borderWidth: 1,
        borderRadius: 41,
        alignItems: 'center',
        justifyContent: 'center',
    },
    storeName: {
        marginTop: 16,
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
    },
    status: {
        marginTop: 8,
        fontSize: 11,
        fontWeight: '700',
    },
    infoCard: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    infoText: {
        marginTop: 10,
        fontSize: 10,
        lineHeight: 16,
    },
    statusDetail: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: '700',
    },
    metaRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    metaLabel: {
        flex: 1,
        fontSize: 9,
    },
    metaValue: {
        fontSize: 10,
        fontWeight: '700',
    },
    noticeCard: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 9,
    },
    noticeText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 15,
    },
});
