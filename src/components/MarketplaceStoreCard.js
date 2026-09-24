import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function MarketplaceStoreCard({ store, onPress, }) {
    const { colors } = useTheme();
    const statusColor = store.isOpen === true
        ? colors.success
        : store.isOpen === false
            ? colors.danger
            : colors.secondaryText;
    const statusLabel = store.isOpen === true
        ? store.closingTime
            ? store.closingTime
            : 'Open'
        : store.isOpen === false
            ? 'Closed'
            : 'Status unavailable';
    return (_jsxs(View, { style: [
            styles.card,
            {
                backgroundColor: colors.card,
                borderColor: colors.border,
            },
        ], children: [_jsx(View, { style: [
                    styles.iconContainer,
                    {
                        borderColor: colors.accent,
                    },
                ], children: _jsx(Ionicons, { name: "storefront-outline", size: 23, color: colors.accent }) }), _jsxs(View, { style: styles.content, children: [_jsx(Text, { style: [
                            styles.name,
                            {
                                color: colors.text,
                            },
                        ], children: store.name }), _jsxs(View, { style: styles.locationRow, children: [_jsx(MaterialCommunityIcons, { name: "map-marker-outline", size: 13, color: colors.secondaryText }), _jsxs(Text, { style: [
                                    styles.locationText,
                                    {
                                        color: colors.secondaryText,
                                    },
                                ], numberOfLines: 1, children: [store.distanceKm !== null
                                        ? `${store.distanceKm} km`
                                        : 'Distance unavailable', store.address
                                        ? ` • ${store.address}`
                                        : ''] })] }), _jsx(Text, { style: [
                            styles.status,
                            {
                                color: statusColor,
                            },
                        ], children: statusLabel }), store.rating ? (_jsxs(View, { style: styles.ratingRow, children: [_jsx(MaterialCommunityIcons, { name: "star", size: 12, color: "#F5A623" }), _jsxs(Text, { style: [
                                    styles.ratingText,
                                    { color: colors.secondaryText },
                                ], children: [store.rating, store.reviewCount ? ` (${store.reviewCount} reviews)` : ''] })] })) : null] }), _jsx(TouchableOpacity, { activeOpacity: 0.75, onPress: () => onPress(store), style: [
                    styles.button,
                    {
                        borderColor: colors.accent,
                    },
                ], children: _jsx(Text, { style: [
                        styles.buttonText,
                        {
                            color: colors.accent,
                        },
                    ], children: "View Store" }) })] }));
}
const styles = StyleSheet.create({
    card: {
        minHeight: 92,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
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
    content: {
        flex: 1,
        minWidth: 0,
    },
    name: {
        fontSize: 12,
        fontWeight: '700',
    },
    locationRow: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    locationText: {
        flex: 1,
        fontSize: 8,
    },
    status: {
        marginTop: 6,
        fontSize: 9,
        fontWeight: '700',
    },
    ratingRow: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        fontSize: 8,
    },
    button: {
        minHeight: 34,
        paddingHorizontal: 9,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 8,
        fontWeight: '700',
    },
});
