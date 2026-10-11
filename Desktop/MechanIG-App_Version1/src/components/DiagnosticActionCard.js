import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function DiagnosticActionCard({ title, description, icon, onPress, }) {
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
                ], children: _jsx(MaterialCommunityIcons, { name: icon, size: 25, color: colors.accent }) }), _jsxs(View, { style: styles.textContainer, children: [_jsx(Text, { style: [
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ], children: title }), _jsx(Text, { style: [
                            styles.description,
                            {
                                color: colors.secondaryText,
                            },
                        ], children: description })] }), _jsx(MaterialCommunityIcons, { name: "chevron-right", size: 22, color: colors.accent })] }));
}
const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: 96,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    textContainer: {
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },
    description: {
        marginTop: 4,
        fontSize: 9,
        lineHeight: 13,
        textAlign: 'center',
    },
});
