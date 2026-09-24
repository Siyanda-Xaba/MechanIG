import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function QuickActionCard({ title, description, icon, onPress, }) {
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
                ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 24, color: colors.accent }) }), _jsxs(View, { style: styles.textContainer, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: title }), _jsx(Text, { style: [
                            styles.description,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: description })] })] }));
}
const styles = StyleSheet.create({
    card: {
        width: '48%',
        minHeight: 92,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 9,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
    },
    description: {
        marginTop: 3,
        fontSize: 9,
        lineHeight: 13,
    },
});
