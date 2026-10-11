import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import MarketplaceStoreCard from '../src/components/MarketplaceStoreCard';
import { useMarketplaceStores } from '../src/customer/useMarketplaceStores';
import { useTheme } from '../src/theme/ThemeContext';
export default function MarketplaceStoresScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { stores, isLoadingStores, storesError, refreshStores, } = useMarketplaceStores();
    function handleStorePress(store) {
        if (store.mapUrl) {
            Linking.openURL(store.mapUrl).catch(() => { });
            return;
        }
        router.push({
            pathname: '/marketplace-store/[storeId]',
            params: {
                storeId: store.id,
            },
        });
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/marketplace'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Nearby Stores" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Marketplace Stores" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Browse nearby parts stores available through the Marketplace." }), isLoadingStores ? (_jsxs(View, { style: styles.centeredState, children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading nearby stores..." })] })) : storesError ? (_jsxs(View, { style: [
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
                            ], children: "Unable to Load Stores" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: storesError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshStores, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.retryButtonText,
                                    {
                                        color: colors.accent,
                                    },
                                ], children: "Try Again" }) })] })) : stores.length === 0 ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "storefront-outline", size: 38, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No Stores Available" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "No nearby Marketplace stores are currently available." })] })) : (_jsx(View, { style: styles.storesList, children: stores.map((store) => (_jsx(MarketplaceStoreCard, { store: store, onPress: handleStorePress }, store.id))) })), _jsxs(View, { style: [
                        styles.noticeCard,
                        {
                            borderColor: colors.warning,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 21, color: colors.warning }), _jsx(Text, { style: [
                                styles.noticeText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Stores, distances, ratings and opening details are based on your current location." })] })] }) }));
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
    centeredState: {
        minHeight: 260,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateCard: {
        minHeight: 210,
        marginTop: 24,
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
        textAlign: 'center',
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
    storesList: {
        marginTop: 20,
        gap: 10,
    },
    noticeCard: {
        marginTop: 18,
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
