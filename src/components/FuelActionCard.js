import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function FuelActionCard({ title, description, icon, onPress, }) {
    const { colors } = useTheme();
    return (_jsxs(TouchableOpacity, { activeOpacity: 0.75, onPress: onPress, style: [
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
                ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 24, color: colors.accent }) }), _jsx(Text, { style: [
                    styles.title,
                    {
                        color: colors.text,
                    },
                ], children: title }), _jsx(Text, { style: [
                    styles.description,
                    {
                        color: colors.secondaryText,
                    },
                ], children: description })] }));
}
const styles = StyleSheet.create({
    card: {
        width: '48%',
        minHeight: 112,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '700',
    },
    description: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 13,
    },
});
