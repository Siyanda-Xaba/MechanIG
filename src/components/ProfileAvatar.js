import { jsx as _jsx } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function ProfileAvatar({ backgroundColor, borderColor, iconColor, imageUrl, size = 44, }) {
    const { colors } = useTheme();
    const resolvedBackground = backgroundColor ?? colors.card;
    const resolvedBorder = borderColor ?? colors.accent;
    const resolvedIcon = iconColor ?? colors.secondaryText;
    if (imageUrl) {
        return (_jsx(Image, { source: { uri: imageUrl }, style: [
                styles.image,
                {
                    borderColor: resolvedBorder,
                    borderRadius: size / 2,
                    height: size,
                    width: size,
                },
            ] }));
    }
    return (_jsx(View, { style: [
            styles.fallback,
            {
                backgroundColor: resolvedBackground,
                borderColor: resolvedBorder,
                borderRadius: size / 2,
                height: size,
                width: size,
            },
        ], children: _jsx(Ionicons, { name: "person-outline", size: size * 0.5, color: resolvedIcon }) }));
}
const styles = StyleSheet.create({
    image: {
        borderWidth: 1.5,
    },
    fallback: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
});
