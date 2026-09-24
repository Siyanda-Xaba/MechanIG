import { jsx as _jsx } from "react/jsx-runtime";
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
export default function ProfileAvatar({ imageUrl, size = 44, }) {
    const { colors } = useTheme();
    if (imageUrl) {
        return (_jsx(Image, { source: { uri: imageUrl }, style: [
                styles.image,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor: colors.accent,
                },
            ] }));
    }
    return (_jsx(View, { style: [
            styles.fallback,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: colors.accent,
                backgroundColor: colors.card,
            },
        ], children: _jsx(Ionicons, { name: "person-outline", size: size * 0.5, color: colors.secondaryText }) }));
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
