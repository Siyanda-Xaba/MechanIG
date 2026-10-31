import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function MarketplaceProductCard({ product, onPress, }) {
    const { colors } = useTheme();
    return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: () => onPress(product), style: [
            styles.card,
            {
                backgroundColor: colors.card,
                borderColor: colors.border,
            },
        ], children: [_jsx(View, { style: [
                    styles.imagePlaceholder,
                    {
                        borderColor: colors.border,
                    },
                ], children: _jsx(MaterialCommunityIcons, { name: getProductIcon(product.category), size: 40, color: colors.accent }) }), product.compatibleWithSelectedVehicle === true ? (_jsxs(View, { style: [
                    styles.compatibilityPill,
                    {
                        borderColor: colors.success,
                    },
                ], children: [_jsx(MaterialCommunityIcons, { name: "check", size: 10, color: colors.success }), _jsx(Text, { style: [
                            styles.compatibilityText,
                            {
                                color: colors.success,
                            },
                        ], children: "Compatible" })] })) : null, _jsx(Text, { style: [
                    styles.name,
                    {
                        color: colors.text,
                    },
                ], numberOfLines: 1, children: product.name }), _jsx(Text, { style: [
                    styles.subtitle,
                    {
                        color: colors.secondaryText,
                    },
                ], numberOfLines: 1, children: product.subtitle }), _jsxs(View, { style: styles.bottomRow, children: [_jsx(Text, { style: [
                            styles.price,
                            {
                                color: colors.text,
                            },
                        ], children: product.price !== null
                            ? `R ${product.price.toLocaleString()}`
                            : 'Price unavailable' }), product.rating !== null ? (_jsxs(View, { style: styles.ratingRow, children: [_jsx(Ionicons, { name: "star", size: 12, color: colors.warning }), _jsx(Text, { style: [
                                    styles.rating,
                                    {
                                        color: colors.text,
                                    },
                                ], children: product.rating }), _jsxs(Text, { style: [
                                    styles.reviewCount,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], children: ["(", product.reviewCount, ")"] })] })) : null] })] }));
}
function getProductIcon(category) {
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
    card: {
        width: 164,
        padding: 10,
        borderWidth: 1,
        borderRadius: 12,
    },
    imagePlaceholder: {
        height: 92,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compatibilityPill: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    compatibilityText: {
        fontSize: 7,
        fontWeight: '700',
    },
    name: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 3,
        fontSize: 9,
    },
    bottomRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
    },
    price: {
        fontSize: 11,
        fontWeight: '800',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    rating: {
        fontSize: 8,
        fontWeight: '700',
    },
    reviewCount: {
        fontSize: 7,
    },
});
