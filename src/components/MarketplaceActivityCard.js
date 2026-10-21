import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { StyleSheet, Text, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function MarketplaceActivityCard({ activity, }) {
    const { colors } = useTheme();
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
                ], children: getActivityIcon(activity.type, colors.accent) }), _jsxs(View, { style: styles.content, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: activity.title }), _jsx(Text, { style: [
                            styles.time,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: activity.occurredAt })] }), activity.price !== null ? (_jsxs(Text, { style: [
                    styles.price,
                    {
                        color: colors.text,
                    },
                ], children: ["R ", activity.price.toLocaleString()] })) : null] }));
}
function getActivityIcon(type, color) {
    switch (type) {
        case 'cart':
            return (_jsx(Ionicons, { name: "cart-outline", size: 21, color: color }));
        case 'saved':
            return (_jsx(Ionicons, { name: "bookmark-outline", size: 21, color: color }));
        case 'viewed':
            return (_jsx(Ionicons, { name: "eye-outline", size: 21, color: color }));
        case 'purchased':
            return (_jsx(MaterialCommunityIcons, { name: "check-circle-outline", size: 21, color: color }));
        default:
            return (_jsx(MaterialCommunityIcons, { name: "history", size: 21, color: color }));
    }
}
const styles = StyleSheet.create({
    card: {
        minHeight: 68,
        padding: 11,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontSize: 11,
        fontWeight: '700',
    },
    time: {
        marginTop: 4,
        fontSize: 8,
    },
    price: {
        fontSize: 11,
        fontWeight: '800',
    },
});
