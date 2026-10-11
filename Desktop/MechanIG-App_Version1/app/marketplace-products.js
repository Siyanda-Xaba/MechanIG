import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StableScrollView from '../src/components/StableScrollView';
import MarketplaceProductCard from '../src/components/MarketplaceProductCard';
import { useMarketplaceProducts } from '../src/customer/useMarketplaceProducts';
import { useTheme } from '../src/theme/ThemeContext';
import { useVehicle } from '../src/vehicles/VehicleContext';
export default function MarketplaceProductsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { selectedVehicle, isLoadingVehicles, } = useVehicle();
    const { products, isLoadingProducts, productsError, refreshProducts, } = useMarketplaceProducts(selectedVehicle?.id);
    const [searchQuery, setSearchQuery,] = useState('');
    const [selectedCategory, setSelectedCategory,] = useState(null);
    const categories = Array.from(new Set(products.map((product) => product.category)));
    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === null ||
            product.category ===
                selectedCategory;
        const normalizedQuery = searchQuery
            .trim()
            .toLowerCase();
        const matchesSearch = normalizedQuery.length === 0 ||
            product.name
                .toLowerCase()
                .includes(normalizedQuery) ||
            product.subtitle
                .toLowerCase()
                .includes(normalizedQuery) ||
            product.category
                .toLowerCase()
                .includes(normalizedQuery);
        return (matchesCategory &&
            matchesSearch);
    });
    function handleProductPress(product) {
        router.push({
            pathname: '/marketplace-product/[productId]',
            params: {
                productId: product.id,
            },
        });
    }
    const isLoading = isLoadingVehicles ||
        isLoadingProducts;
    return (_jsx(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], children: _jsxs(StableScrollView, { showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", contentContainerStyle: styles.content, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.dismissTo('/marketplace'), style: [
                                styles.headerButton,
                                {
                                    borderColor: colors.border,
                                },
                            ], children: _jsx(Ionicons, { name: "chevron-back", size: 22, color: colors.text }) }), _jsx(Text, { style: [
                                styles.headerTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "Products" }), _jsx(View, { style: styles.headerPlaceholder })] }), _jsx(Text, { style: [
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ], children: "Recommended Products" }), _jsx(Text, { style: [
                        styles.subtitle,
                        {
                            color: colors.secondaryText,
                        },
                    ], children: "Browse Marketplace products for your selected vehicle." }), selectedVehicle ? (_jsxs(View, { style: [
                        styles.vehicleCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "car-outline", size: 21, color: colors.accent }), _jsxs(View, { style: styles.vehicleContent, children: [_jsx(Text, { style: [
                                        styles.vehicleLabel,
                                        {
                                            color: colors.secondaryText,
                                        },
                                    ], children: "Selected Vehicle" }), _jsxs(Text, { style: [
                                        styles.vehicleName,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: [selectedVehicle.make, ' ', selectedVehicle.model] })] })] })) : null, !isLoading &&
                    !productsError &&
                    products.length > 0 ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                styles.searchContainer,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsx(Ionicons, { name: "search-outline", size: 20, color: colors.secondaryText }), _jsx(TextInput, { value: searchQuery, onChangeText: setSearchQuery, placeholder: "Search products...", placeholderTextColor: colors.secondaryText, returnKeyType: "search", style: [
                                        styles.searchInput,
                                        {
                                            color: colors.text,
                                        },
                                    ] }), searchQuery.length >
                                    0 ? (_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => setSearchQuery(''), children: _jsx(Ionicons, { name: "close-circle", size: 18, color: colors.secondaryText }) })) : null] }), _jsxs(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.categoriesRow, children: [_jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setSelectedCategory(null), style: [
                                        styles.categoryChip,
                                        {
                                            backgroundColor: selectedCategory ===
                                                null
                                                ? colors.accent
                                                : colors.card,
                                            borderColor: selectedCategory ===
                                                null
                                                ? colors.accent
                                                : colors.border,
                                        },
                                    ], children: _jsx(Text, { style: [
                                            styles.categoryText,
                                            {
                                                color: selectedCategory ===
                                                    null
                                                    ? '#000000'
                                                    : colors.text,
                                            },
                                        ], children: "All" }) }), categories.map((category) => {
                                    const isSelected = selectedCategory ===
                                        category;
                                    return (_jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setSelectedCategory(isSelected
                                            ? null
                                            : category), style: [
                                            styles.categoryChip,
                                            {
                                                backgroundColor: isSelected
                                                    ? colors.accent
                                                    : colors.card,
                                                borderColor: isSelected
                                                    ? colors.accent
                                                    : colors.border,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                styles.categoryText,
                                                {
                                                    color: isSelected
                                                        ? '#000000'
                                                        : colors.text,
                                                },
                                            ], children: category }) }, category));
                                })] })] })) : null, isLoading ? (_jsxs(View, { style: styles.centeredState, children: [_jsx(ActivityIndicator, { size: "large", color: colors.accent }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Loading products..." })] })) : productsError ? (_jsxs(View, { style: [
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
                            ], children: "Unable to Load Products" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: productsError }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: refreshProducts, style: [
                                styles.retryButton,
                                {
                                    borderColor: colors.accent,
                                },
                            ], children: _jsx(Text, { style: [
                                    styles.retryButtonText,
                                    {
                                        color: colors.accent,
                                    },
                                ], children: "Try Again" }) })] })) : products.length ===
                    0 ? (_jsxs(View, { style: [
                        styles.stateCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "package-variant-closed", size: 38, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateTitle,
                                {
                                    color: colors.text,
                                },
                            ], children: "No Products Available" }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "No Marketplace products are currently available for the selected vehicle." })] })) : filteredProducts.length ===
                    0 ? (_jsxs(View, { style: [
                        styles.noResultsCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ], children: [_jsx(Ionicons, { name: "search-outline", size: 34, color: colors.secondaryText }), _jsx(Text, { style: [
                                styles.stateText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "No products match your current search or category." })] })) : (_jsx(View, { style: styles.productsGrid, children: filteredProducts.map((product) => (_jsx(MarketplaceProductCard, { product: product, onPress: handleProductPress }, product.id))) })), _jsxs(View, { style: [
                        styles.noticeCard,
                        {
                            borderColor: colors.warning,
                        },
                    ], children: [_jsx(MaterialCommunityIcons, { name: "information-outline", size: 21, color: colors.warning }), _jsx(Text, { style: [
                                styles.noticeText,
                                {
                                    color: colors.secondaryText,
                                },
                            ], children: "Production prices, stock, seller information and vehicle compatibility must come from validated Marketplace or provider data." })] })] }) }));
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
    vehicleCard: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    vehicleContent: {
        flex: 1,
    },
    vehicleLabel: {
        fontSize: 8,
    },
    vehicleName: {
        marginTop: 3,
        fontSize: 11,
        fontWeight: '700',
    },
    searchContainer: {
        minHeight: 48,
        marginTop: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        minHeight: 46,
        paddingVertical: 0,
        fontSize: 11,
    },
    categoriesRow: {
        marginTop: 12,
        gap: 8,
        paddingRight: 4,
    },
    categoryChip: {
        minHeight: 34,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryText: {
        fontSize: 9,
        fontWeight: '700',
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
    noResultsCard: {
        minHeight: 150,
        marginTop: 20,
        padding: 20,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productsGrid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
