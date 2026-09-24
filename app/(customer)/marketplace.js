import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceActivityCard from '../../src/components/MarketplaceActivityCard';
import MarketplaceProductCard from '../../src/components/MarketplaceProductCard';
import MarketplaceStoreCard from '../../src/components/MarketplaceStoreCard';
import StableScrollView from '../../src/components/StableScrollView';
import { useCustomerMarketplace } from '../../src/customer/CustomerMarketplaceContext';
import { useTheme } from '../../src/theme/ThemeContext';
const defaultProductFilters = {
    compatibleOnly: false,
    sortBy: 'recommended',
};
const sortOptions = [
    {
        value: 'recommended',
        label: 'Recommended',
    },
    {
        value: 'price-low-to-high',
        label: 'Price: Low to High',
    },
    {
        value: 'price-high-to-low',
        label: 'Price: High to Low',
    },
    {
        value: 'rating-high-to-low',
        label: 'Rating: High to Low',
    },
];
export default function CustomerMarketplace() {
    const router = useRouter();
    const { colors } = useTheme();
    const { marketplaceData, isLoadingMarketplace, marketplaceError, } = useCustomerMarketplace();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory,] = useState(null);
    const [productFilters, setProductFilters,] = useState(defaultProductFilters);
    const [draftProductFilters, setDraftProductFilters,] = useState(defaultProductFilters);
    const [isFilterVisible, setIsFilterVisible,] = useState(false);
    const categories = marketplaceData?.categories ?? [];
    const products = marketplaceData?.recommendedProducts ?? [];
    const nearbyStores = marketplaceData?.nearbyStores ?? [];
    const recentActivity = marketplaceData?.recentActivity ?? [];
    const filteredProducts = products
        .filter((product) => {
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
        const matchesCompatibility = !productFilters.compatibleOnly ||
            product.compatibleWithSelectedVehicle ===
                true;
        return (matchesCategory &&
            matchesSearch &&
            matchesCompatibility);
    })
        .sort((first, second) => compareProducts(first, second, productFilters.sortBy));
    const hasActiveFilters = productFilters.compatibleOnly ||
        productFilters.sortBy !==
            'recommended';
    function openFilters() {
        setDraftProductFilters(productFilters);
        setIsFilterVisible(true);
    }
    function closeFilters() {
        setIsFilterVisible(false);
    }
    function applyFilters() {
        setProductFilters(draftProductFilters);
        setIsFilterVisible(false);
    }
    function resetFilters() {
        setDraftProductFilters(defaultProductFilters);
        setProductFilters(defaultProductFilters);
    }
    const handleProductPress = (product) => {
        router.push({
            pathname: '/marketplace-product/[productId]',
            params: {
                productId: product.id,
            },
        });
    };
    const handleStorePress = (store) => {
        if (store.mapUrl) {
            Linking.openURL(store.mapUrl).catch(() => { });
            return;
        }
        router.push({ pathname: '/marketplace-store/[storeId]', params: { storeId: store.id } });
    };
    return (_jsxs(SafeAreaView, { style: [
            styles.safeArea,
            {
                backgroundColor: colors.background,
            },
        ], edges: ['top'], children: [_jsxs(StableScrollView, { style: styles.scrollView, contentContainerStyle: styles.content, showsVerticalScrollIndicator: false, keyboardShouldPersistTaps: "handled", children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: "Marketplace" }), _jsx(Text, { style: [
                            styles.subtitle,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Find compatible parts, compare prices, and discover nearby stores." }), _jsxs(View, { style: styles.searchRow, children: [_jsxs(View, { style: [
                                    styles.searchContainer,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    },
                                ], children: [_jsx(Ionicons, { name: "search-outline", size: 20, color: colors.secondaryText }), _jsx(TextInput, { value: searchQuery, onChangeText: setSearchQuery, placeholder: "Search for parts, brands, or stores...", placeholderTextColor: colors.secondaryText, returnKeyType: "search", style: [
                                            styles.searchInput,
                                            {
                                                color: colors.text,
                                            },
                                        ] }), searchQuery.length >
                                        0 ? (_jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => setSearchQuery(''), children: _jsx(Ionicons, { name: "close-circle", size: 18, color: colors.secondaryText }) })) : null] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, style: [
                                    styles.filterButton,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: hasActiveFilters
                                            ? colors.accent
                                            : colors.border,
                                    },
                                ], onPress: openFilters, children: [_jsx(MaterialCommunityIcons, { name: "tune-variant", size: 21, color: colors.accent }), hasActiveFilters ? (_jsx(View, { style: [
                                            styles.filterIndicator,
                                            {
                                                backgroundColor: colors.accent,
                                                borderColor: colors.card,
                                            },
                                        ] })) : null] })] }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, style: [
                            styles.imageSearchCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], onPress: () => router.push('/marketplace-picture-search'), children: [_jsx(View, { style: [
                                    styles.imageSearchIcon,
                                    {
                                        borderColor: colors.accent,
                                    },
                                ], children: _jsx(MaterialCommunityIcons, { name: "camera-outline", size: 24, color: colors.accent }) }), _jsxs(View, { style: styles.imageSearchContent, children: [_jsx(Text, { style: [
                                            styles.imageSearchTitle,
                                            {
                                                color: colors.text,
                                            },
                                        ], children: "Search by Picture" }), _jsx(Text, { style: [
                                            styles.imageSearchDescription,
                                            {
                                                color: colors.secondaryText,
                                            },
                                        ], children: "Take or upload a photo to identify a vehicle part." })] }), _jsx(Ionicons, { name: "chevron-forward", size: 19, color: colors.secondaryText })] }), _jsx(Text, { style: [
                            styles.sectionTitle,
                            {
                                color: colors.text,
                            },
                        ], children: "Categories" }), isLoadingMarketplace ? (_jsx(Text, { style: [
                            styles.message,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: "Loading marketplace..." })) : (_jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.categoriesRow, children: categories.map((category) => {
                            const isSelected = selectedCategory ===
                                category;
                            return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => {
                                    setSelectedCategory(isSelected
                                        ? null
                                        : category);
                                }, style: [
                                    styles.categoryCard,
                                    {
                                        backgroundColor: isSelected
                                            ? colors.accent
                                            : colors.card,
                                        borderColor: isSelected
                                            ? colors.accent
                                            : colors.border,
                                    },
                                ], children: [_jsx(MaterialCommunityIcons, { name: getCategoryIcon(category), size: 22, color: isSelected
                                            ? '#000000'
                                            : colors.accent }), _jsx(Text, { style: [
                                            styles.categoryLabel,
                                            {
                                                color: isSelected
                                                    ? '#000000'
                                                    : colors.text,
                                            },
                                        ], children: category })] }, category));
                        }) })), _jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                                    styles.sectionTitleInline,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Recommended for Your Vehicle" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.push('/marketplace-products'), children: _jsx(Text, { style: [
                                        styles.viewAll,
                                        {
                                            color: colors.accent,
                                        },
                                    ], children: "View All" }) })] }), filteredProducts.length ===
                        0 ? (_jsxs(View, { style: [
                            styles.emptyProducts,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "package-variant-closed", size: 34, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.emptyProductsText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "No matching products found." })] })) : (_jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: styles.productsRow, children: filteredProducts.map((product) => (_jsx(MarketplaceProductCard, { product: product, onPress: handleProductPress }, product.id))) })), _jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                                    styles.sectionTitleInline,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Nearby Stores" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.push('/marketplace-stores'), children: _jsx(Text, { style: [
                                        styles.viewAll,
                                        {
                                            color: colors.accent,
                                        },
                                    ], children: "View All" }) })] }), nearbyStores.length ===
                        0 ? (_jsxs(View, { style: [
                            styles.emptyProducts,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(Ionicons, { name: "storefront-outline", size: 34, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.emptyProductsText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "No nearby stores available." })] })) : (_jsx(View, { style: styles.storesList, children: nearbyStores.map((store) => (_jsx(MarketplaceStoreCard, { store: store, onPress: handleStorePress }, store.id))) })), _jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: [
                                    styles.sectionTitleInline,
                                    {
                                        color: colors.text,
                                    },
                                ], children: "Recent Activity" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: () => router.push('/marketplace-activity'), children: _jsx(Text, { style: [
                                        styles.viewAll,
                                        {
                                            color: colors.accent,
                                        },
                                    ], children: "View All" }) })] }), recentActivity.length ===
                        0 ? (_jsxs(View, { style: [
                            styles.emptyProducts,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ], children: [_jsx(MaterialCommunityIcons, { name: "history", size: 34, color: colors.secondaryText }), _jsx(Text, { style: [
                                    styles.emptyProductsText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: "No marketplace activity yet." })] })) : (_jsx(View, { style: styles.activityList, children: recentActivity.map((activity) => (_jsx(MarketplaceActivityCard, { activity: activity }, activity.id))) })), marketplaceError ? (_jsx(Text, { style: [
                            styles.errorText,
                            {
                                color: colors.danger,
                            },
                        ], children: marketplaceError })) : null] }), _jsx(Modal, { visible: isFilterVisible, transparent: true, animationType: "slide", onRequestClose: closeFilters, children: _jsxs(View, { style: styles.modalBackdrop, children: [_jsx(TouchableOpacity, { activeOpacity: 1, style: styles.modalDismissArea, onPress: closeFilters }), _jsxs(View, { style: [
                                styles.filterSheet,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                },
                            ], children: [_jsxs(View, { style: styles.filterHeader, children: [_jsx(Text, { style: [
                                                styles.filterTitle,
                                                {
                                                    color: colors.text,
                                                },
                                            ], children: "Filter Products" }), _jsx(TouchableOpacity, { activeOpacity: 0.7, onPress: closeFilters, style: [
                                                styles.closeButton,
                                                {
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(Ionicons, { name: "close", size: 20, color: colors.text }) })] }), _jsx(Text, { style: [
                                        styles.filterSectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Compatibility" }), _jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setDraftProductFilters((current) => ({
                                        ...current,
                                        compatibleOnly: !current.compatibleOnly,
                                    })), style: [
                                        styles.filterOption,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: draftProductFilters.compatibleOnly
                                                ? colors.accent
                                                : colors.border,
                                        },
                                    ], children: [_jsxs(View, { style: styles.filterOptionContent, children: [_jsx(MaterialCommunityIcons, { name: "check-circle-outline", size: 21, color: draftProductFilters.compatibleOnly
                                                        ? colors.accent
                                                        : colors.secondaryText }), _jsxs(View, { style: styles.filterOptionText, children: [_jsx(Text, { style: [
                                                                styles.filterOptionTitle,
                                                                {
                                                                    color: colors.text,
                                                                },
                                                            ], children: "Compatible only" }), _jsx(Text, { style: [
                                                                styles.filterOptionDescription,
                                                                {
                                                                    color: colors.secondaryText,
                                                                },
                                                            ], children: "Show only products currently marked as compatible with the selected vehicle." })] })] }), _jsx(View, { style: [
                                                styles.checkbox,
                                                {
                                                    borderColor: draftProductFilters.compatibleOnly
                                                        ? colors.accent
                                                        : colors.border,
                                                    backgroundColor: draftProductFilters.compatibleOnly
                                                        ? colors.accent
                                                        : 'transparent',
                                                },
                                            ], children: draftProductFilters.compatibleOnly ? (_jsx(Ionicons, { name: "checkmark", size: 15, color: "#000000" })) : null })] }), _jsx(Text, { style: [
                                        styles.filterSectionTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ], children: "Sort By" }), _jsx(View, { style: styles.sortOptions, children: sortOptions.map((option) => {
                                        const isSelected = draftProductFilters.sortBy ===
                                            option.value;
                                        return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => setDraftProductFilters((current) => ({
                                                ...current,
                                                sortBy: option.value,
                                            })), style: [
                                                styles.sortOption,
                                                {
                                                    backgroundColor: colors.card,
                                                    borderColor: isSelected
                                                        ? colors.accent
                                                        : colors.border,
                                                },
                                            ], children: [_jsx(Text, { style: [
                                                        styles.sortOptionText,
                                                        {
                                                            color: isSelected
                                                                ? colors.accent
                                                                : colors.text,
                                                        },
                                                    ], children: option.label }), _jsx(View, { style: [
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
                                    }) }), _jsxs(View, { style: styles.filterActions, children: [_jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: resetFilters, style: [
                                                styles.resetButton,
                                                {
                                                    borderColor: colors.border,
                                                },
                                            ], children: _jsx(Text, { style: [
                                                    styles.resetButtonText,
                                                    {
                                                        color: colors.text,
                                                    },
                                                ], children: "Reset" }) }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: applyFilters, style: [
                                                styles.applyButton,
                                                {
                                                    backgroundColor: colors.accent,
                                                },
                                            ], children: _jsx(Text, { style: styles.applyButtonText, children: "Apply Filters" }) })] })] })] }) })] }));
}
function compareProducts(first, second, sortBy) {
    switch (sortBy) {
        case 'price-low-to-high':
            return compareNullableNumbers(first.price, second.price, 'ascending');
        case 'price-high-to-low':
            return compareNullableNumbers(first.price, second.price, 'descending');
        case 'rating-high-to-low':
            return compareNullableNumbers(first.rating, second.rating, 'descending');
        case 'recommended':
        default:
            return 0;
    }
}
function compareNullableNumbers(first, second, direction) {
    if (first === null &&
        second === null) {
        return 0;
    }
    if (first === null) {
        return 1;
    }
    if (second === null) {
        return -1;
    }
    return direction === 'ascending'
        ? first - second
        : second - first;
}
function getCategoryIcon(category) {
    switch (category) {
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
    searchRow: {
        marginTop: 18,
        flexDirection: 'row',
        gap: 8,
    },
    searchContainer: {
        flex: 1,
        minHeight: 48,
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
    filterButton: {
        position: 'relative',
        width: 48,
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIndicator: {
        position: 'absolute',
        top: 7,
        right: 7,
        width: 8,
        height: 8,
        borderWidth: 1,
        borderRadius: 4,
    },
    imageSearchCard: {
        minHeight: 78,
        marginTop: 12,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    imageSearchIcon: {
        width: 44,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSearchContent: {
        flex: 1,
    },
    imageSearchTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    imageSearchDescription: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 14,
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 17,
        fontWeight: '700',
    },
    categoriesRow: {
        gap: 9,
        paddingRight: 4,
    },
    categoryCard: {
        width: 82,
        minHeight: 74,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryLabel: {
        marginTop: 7,
        fontSize: 9,
        fontWeight: '700',
    },
    sectionHeader: {
        marginTop: 22,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    sectionTitleInline: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 11,
        fontWeight: '600',
    },
    productsRow: {
        gap: 10,
        paddingRight: 4,
    },
    storesList: {
        gap: 10,
    },
    activityList: {
        gap: 10,
    },
    emptyProducts: {
        minHeight: 110,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emptyProductsText: {
        fontSize: 10,
    },
    message: {
        paddingVertical: 20,
        fontSize: 11,
        textAlign: 'center',
    },
    errorText: {
        marginTop: 12,
        fontSize: 11,
        textAlign: 'center',
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    modalDismissArea: {
        flex: 1,
    },
    filterSheet: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 28,
        borderTopWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterTitle: {
        fontSize: 19,
        fontWeight: '800',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterSectionTitle: {
        marginTop: 20,
        marginBottom: 9,
        fontSize: 12,
        fontWeight: '700',
    },
    filterOption: {
        minHeight: 74,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    filterOptionContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterOptionText: {
        flex: 1,
    },
    filterOptionTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    filterOptionDescription: {
        marginTop: 4,
        fontSize: 8,
        lineHeight: 13,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortOptions: {
        gap: 8,
    },
    sortOption: {
        minHeight: 46,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sortOptionText: {
        fontSize: 10,
        fontWeight: '600',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    filterActions: {
        marginTop: 22,
        flexDirection: 'row',
        gap: 10,
    },
    resetButton: {
        minHeight: 48,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetButtonText: {
        fontSize: 11,
        fontWeight: '700',
    },
    applyButton: {
        flex: 1,
        minHeight: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '800',
    },
});
