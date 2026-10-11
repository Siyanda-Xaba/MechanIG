import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../../src/components/StableScrollView';
import { useMarketplaceProduct } from '../../src/customer/useMarketplaceProduct';
import { recordMarketplaceActivity } from '../../src/customer/marketplaceService';
import { useTheme } from '../../src/theme/ThemeContext';
import { useVehicle } from '../../src/vehicles/VehicleContext';
export default function MarketplaceProductScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { productId, } = useLocalSearchParams();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { product, isLoadingProduct, productError, refreshProduct, } = useMarketplaceProduct(productId, selectedVehicle?.id);
    const isLoading = isLoadingVehicles ||
        isLoadingProduct;
    async function openLiveDeals() {
        if (!product)
            return;
        const searchTerms = [selectedVehicle?.make, selectedVehicle?.model, product.name].filter(Boolean).join(' ');
        try {
            await recordMarketplaceActivity({ title: `Checked live deals for ${product.name}`, type: 'viewed' });
        }
        catch { }
        Linking.openURL(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(searchTerms)}`).catch(() => { });
    }
    async function saveProduct() {
        if (!product)
            return;
        try {
            await recordMarketplaceActivity({ title: `Saved ${product.name}`, type: 'saved', price: product.price });
            Alert.alert('Product saved', `${product.name} was added to your Marketplace activity.`);
        }
        catch {
            Alert.alert('Could not save product', 'Please try again.');
        }
    }
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/marketplace-products'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Product Details" }), _jsx(View, { style: styles.headerPlaceholder })] }), isLoading ? (_jsxs(View, { style: styles.centeredState, children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading product..." })] })) : productError ? (_jsxs(View, { style: [
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
                            ], children: "Unable to Load Product" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: productError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshProduct, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.retryButtonText,
                                    {
                                        color: colors.accent,
                                    },
                                ], children: "Try Again" }) })] })) : product ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                styles.imageCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: getProductIcon(product), size: 72, color: colors.accent }), _jsx(Text, { style: [
                                        styles.imageFallbackText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Product image unavailable" })] }), _jsxs(View, { style: styles.titleSection, children: [_jsxs(View, { style: styles.categoryRow, children: [_jsx(Text, { style: [
                                                styles.category,
                                                {
                                                    color: colors.accent,
                                                },
                                            ], children: product.category }), product.compatibleWithSelectedVehicle ===
                                            true ? (_jsxs(View, { style: [
                                                styles.compatibilityPill,
                                                {
                                                    borderColor: colors.success,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "check", size: 12, color: colors.success }), _jsx(Text, { style: [
                                                        styles.compatibilityPillText,
                                                        {
                                                            color: colors.success,
                                                        },
                                                    ], children: "Compatible" })] })) : product.compatibleWithSelectedVehicle ===
                                            false ? (_jsxs(View, { style: [
                                                styles.compatibilityPill,
                                                {
                                                    borderColor: colors.danger,
                                                },
                                            ], children: [_jsx(MaterialCommunityIcons, { name: "close", size: 12, color: colors.danger }), _jsx(Text, { style: [
                                                        styles.compatibilityPillText,
                                                        {
                                                            color: colors.danger,
                                                        },
                                                    ], children: "Not Compatible" })] })) : null] }), _jsx(Text, { style: [
                                        styles.productName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: product.name }), _jsx(Text, { style: [
                                        styles.productSubtitle,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: product.subtitle }), _jsxs(View, { style: styles.priceRatingRow, children: [_jsx(Text, { style: [
                                                styles.price,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: product.price !== null
                                                ? `R ${product.price.toLocaleString()}`
                                                : 'Price unavailable' }), product.rating !==
                                            null ? (_jsxs(View, { style: styles.ratingRow, children: [_jsx(Ionicons, { name: "star", size: 16, color: colors.warning }), _jsx(Text, { style: [
                                                        styles.rating,
                                                        {
                                                            color: colors.text,
                                                        },
                                                    ], children: product.rating }), _jsxs(Text, { style: [
                                                        styles.reviewCount,
                                                        {
                                                            color: colors.secondaryText,
                                                        },
                                                    ], children: ["(", product.reviewCount, ' ', "reviews)"] })] })) : null] })] }), _jsxs(View, { style: [
                                styles.infoCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.infoHeader, children: [_jsx(MaterialCommunityIcons, { name: "car-cog", size: 22, color: colors.accent }), _jsx(Text, { style: [
                                                styles.infoTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Vehicle Compatibility" })] }), selectedVehicle ? (_jsxs(_Fragment, { children: [_jsxs(Text, { style: [
                                                styles.vehicleName,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: [selectedVehicle.make, ' ', selectedVehicle.model] }), _jsx(Text, { style: [
                                                styles.infoText,
                                                {
                                                    color: colors.secondaryText,
                                                },
                                            ], children: selectedVehicle.registration }), _jsx(CompatibilityMessage, { product: product })] })) : (_jsx(Text, { style: [
                                        styles.infoText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Select a vehicle to verify product compatibility." }))] }), _jsxs(View, { style: [
                                styles.infoCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.infoHeader, children: [_jsx(Ionicons, { name: "storefront-outline", size: 21, color: colors.accent }), _jsx(Text, { style: [
                                                styles.infoTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Seller & Availability" })] }), _jsx(Text, { style: [
                                        styles.infoText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Use live shopping results to compare current retailers, prices and stock for this part." }), _jsxs(View, { style: styles.actionsRow, children: [_jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: saveProduct, style: [styles.actionButton, { borderColor: colors.border }], children: _jsx(Text, { style: [styles.actionButtonText, { color: colors.text }], children: "Save" }) }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: openLiveDeals, style: [styles.actionButton, { borderColor: colors.accent }], children: _jsx(Text, { style: [styles.actionButtonText, { color: colors.accent }], children: "Find Live Deals" }) })] })] }), _jsxs(View, { style: [
                                styles.noticeCard,
                                {
                                    borderColor: colors.warning,
                                },
                            ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 21, color: colors.warning }), _jsx(Text, { style: [
                                        styles.noticeText,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Marketplace prices, availability and fitment must be confirmed by validated backend or provider data before a purchase is completed." })] })] })) : null] }) }));
}
function CompatibilityMessage({ product, }) {
    const { colors } = useTheme();
    if (product.compatibleWithSelectedVehicle ===
        true) {
        return (_jsxs(View, { style: [
                styles.compatibilityMessage,
                {
                    borderColor: colors.success,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "check-circle-outline", size: 19, color: colors.success }), _jsx(Text, { style: [
                        styles.compatibilityMessageText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Current Marketplace data marks this product as compatible with the selected vehicle." })] }));
    }
    if (product.compatibleWithSelectedVehicle ===
        false) {
        return (_jsxs(View, { style: [
                styles.compatibilityMessage,
                {
                    borderColor: colors.danger,
                },
            ], children: [_jsx(MaterialCommunityIcons, { name: "close-circle-outline", size: 19, color: colors.danger }), _jsx(Text, { style: [
                        styles.compatibilityMessageText,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Current Marketplace data marks this product as incompatible with the selected vehicle." })] }));
    }
    return (_jsxs(View, { style: [
            styles.compatibilityMessage,
            {
                borderColor: colors.warning,
            },
        ], children: [_jsx(MaterialCommunityIcons, { name: "help-circle-outline", size: 19, color: colors.warning }), _jsx(Text, { style: [
                    styles.compatibilityMessageText,
                    {
                        color: colors.secondaryText,
                    },
                ], children: "Compatibility has not yet been confirmed for the selected vehicle." })] }));
}
function getProductIcon(product) {
    switch (product.category) {
        case 'Brakes':
            return 'disc';
        case 'Engine':
            return 'engine-outline';
        case 'Battery':
            return 'car-battery';
        case 'Tyres':
            return 'tire';
        case 'Fluids':
            return 'oil';
        default:
            return 'car-cog';
    }
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
    imageCard: {
        height: 230,
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageFallbackText: {
        marginTop: 12,
        fontSize: 10,
    },
    titleSection: {
        marginTop: 18,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    category: {
        fontSize: 11,
        fontWeight: '700',
    },
    compatibilityPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    compatibilityPillText: {
        fontSize: 8,
        fontWeight: '700',
    },
    productName: {
        marginTop: 8,
        fontSize: 24,
        fontWeight: '800',
    },
    productSubtitle: {
        marginTop: 5,
        fontSize: 12,
    },
    priceRatingRow: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 11,
        fontWeight: '700',
    },
    reviewCount: {
        fontSize: 9,
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
    vehicleName: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: '700',
    },
    infoText: {
        marginTop: 7,
        fontSize: 10,
        lineHeight: 16,
    },
    actionsRow: {
        marginTop: 14,
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        minHeight: 38,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontSize: 10,
        fontWeight: '700',
    },
    compatibilityMessage: {
        marginTop: 12,
        padding: 11,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    compatibilityMessageText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 14,
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
